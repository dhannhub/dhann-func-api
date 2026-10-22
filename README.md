# wa-popup-api

API server untuk WhatsApp popup functions, compatible dengan Pterodactyl panel.

## Setup
```
npm install
npm start
```

## Environment Variables (Pterodactyl)
| Variable       | Default     | Keterangan                        |
|----------------|-------------|-----------------------------------|
| PORT           | 2578        | Port expose di Pterodactyl        |
| API_KEY        | (kosong)    | API key untuk auth (optional)     |
| SESSION_FOLDER | ./sessions  | Folder session Baileys            |

## Endpoint
```
GET  /api/function?type=richtext&jid=628xxx   -> jalankan slof.js
GET  /api/function?type=status                -> status WA + list functions
POST /api/function?type=pairing               -> request pairing code (body: { nomor })
GET  /api/list                                -> list semua function dari database.json
```

## Tambah Function Baru
1. Taruh file .js di folder ini
2. Tambah entry di database.json:
   ```json
   { "type": "namatype", "file": "namafile.js", "description": "..." }
   ```
3. Tidak perlu restart (hotreload otomatis)

## Format Function
Function boleh pakai signature apapun, server auto-detect:
- async function nama(sock, jid) { ... }
- async function nama(sock, target) { ... }
- async function nama(jid) { ... }
- async function nama(target) { ... }
