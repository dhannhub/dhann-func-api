/**
 * server.js — Function Library Server
 * ------------------------------------
 * API server TIDAK butuh WA sama sekali.
 * Hanya expose function sebagai source code yang bisa di-fetch caller.
 *
 * Endpoint:
 *   GET /api/list                     → list semua function dari database.json
 *   GET /api/source?type=richtext     → ambil source code function (untuk di-eval caller)
 *   GET /api/function?type=richtext&jid=628xxx  → jalankan function (sock di-inject dari luar via header/body tidak bisa, jadi endpoint ini hanya untuk function yang TIDAK butuh sock)
 *   GET /api/status                   → status server
 */

const http = require("http")
const path = require("path")
const fs   = require("fs")
const config = require("./config.js")

const FUNCTION_DIR = path.join(__dirname, "function")

// ── Database loader ───────────────────────────────────────────────────────────
function loadDatabase() {
    const dbPath = path.join(__dirname, "database.json")
    try { return JSON.parse(fs.readFileSync(dbPath, "utf8")) }
    catch (e) { console.error("[DB] Gagal baca database.json:", e.message); return [] }
}

// ── Signature parser ──────────────────────────────────────────────────────────
function getParamNames(fn) {
    const src = fn.toString()
    const patterns = [
        /(?:async\s+)?function\s*\w*\s*\(([^)]*)\)/,
        /(?:async\s*)?\(([^)]*)\)\s*=>/,
    ]
    let paramStr = ""
    for (const p of patterns) {
        const m = src.match(p)
        if (m?.[1] !== undefined) { paramStr = m[1]; break }
    }
    const single = src.match(/(?:async\s+)?(\w+)\s*=>/)
    if (!paramStr && single) paramStr = single[1]

    return paramStr.split(",").map(p => p.trim().split("=")[0].trim()).filter(Boolean)
}

// ── HTTP Helper ───────────────────────────────────────────────────────────────
function sendJSON(res, status, data) {
    res.writeHead(status, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    })
    res.end(JSON.stringify(data))
}

function sendText(res, status, text) {
    res.writeHead(status, {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
    })
    res.end(text)
}

// ── HTTP Server ───────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
    const apiKey = req.headers["x-api-key"]
    if (config.API_KEY && apiKey !== config.API_KEY) {
        return sendJSON(res, 401, { success: false, error: "Unauthorized" })
    }

    const url      = new URL(req.url, "http://localhost")
    const pathname = url.pathname
    const type     = url.searchParams.get("type")

    // GET /api/status
    if (pathname === "/api/status") {
        return sendJSON(res, 200, {
            success: true,
            uptime_sec: Math.floor(process.uptime()),
            memory_mb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            functions: loadDatabase().map(e => e.type)
        })
    }

    // GET /api/list — list semua function + params
    if (pathname === "/api/list") {
        const db = loadDatabase()
        return sendJSON(res, 200, {
            success: true,
            functions: db.map(e => {
                try {
                    const fp = path.join(FUNCTION_DIR, e.file)
                    delete require.cache[require.resolve(fp)]
                    const fn = require(fp)
                    return { type: e.type, file: e.file, description: e.description || "", params: getParamNames(fn) }
                } catch { return { type: e.type, file: e.file, description: e.description || "", params: [] } }
            })
        })
    }

    // GET /api/source?type=richtext — kirim source code function ke caller
    if (pathname === "/api/source") {
        if (!type) return sendJSON(res, 400, { success: false, error: "Parameter 'type' diperlukan" })
        const db    = loadDatabase()
        const entry = db.find(e => e.type === type)
        if (!entry) return sendJSON(res, 404, { success: false, error: `Type '${type}' tidak ditemukan` })

        const fp = path.join(FUNCTION_DIR, entry.file)
        if (!fs.existsSync(fp)) return sendJSON(res, 404, { success: false, error: `File 'function/${entry.file}' tidak ditemukan` })

        // Kirim source code — caller yang akan load + inject sock sendiri
        const source = fs.readFileSync(fp, "utf8")
        return sendJSON(res, 200, { success: true, type, file: entry.file, source })
    }

    return sendJSON(res, 404, { success: false, error: "Not found. Endpoints: /api/list /api/source /api/status" })
})

server.listen(config.PORT, "0.0.0.0", () => {
    console.log(`[API] ✅ Server jalan di port ${config.PORT}`)
    console.log(`[API] 📋 Functions: ${loadDatabase().map(e => e.type).join(", ")}`)
    console.log(`[API] ℹ️  Mode: Function Library (tidak butuh WA)`)
})
