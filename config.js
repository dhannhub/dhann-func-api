/**
 * config.js
 * ---------
 * Konfigurasi API server untuk Pterodactyl.
 * Semua bisa di-override via environment variable di panel.
 */

module.exports = {
    // Port expose di Pterodactyl (sesuaikan dengan port allocation)
    PORT: parseInt(process.env.PORT) || 2578,

    // API Key untuk auth request (set di Pterodactyl env var)
    // Kosongkan ("") untuk nonaktifkan auth
    API_KEY: process.env.API_KEY || "",

    // Session folder Baileys
    SESSION_FOLDER: process.env.SESSION_FOLDER || "./sessions",

    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || "info"
}
