/**
 * agus.js - Contoh function dengan signature (sock, jid)
 * Dipanggil: /api/function?type=anu&jid=628xxx
 */
async function agus(sock, jid) {
    await sock.sendMessage(jid, { text: "Halo dari agus.js! 👋" })
}
module.exports = agus
