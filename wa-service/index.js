/**
 * SimpleWA CRM — WhatsApp Microservice (Baileys Edition)
 * Uses @whiskeysockets/baileys (fast, no browser)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const qrcode = require('qrcode');
const axios = require('axios');
const {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  proto
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const { Boom } = require('@hapi/boom');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DJANGO_URL = process.env.DJANGO_BASE_URL || 'http://localhost:8000';
const INTERNAL_SECRET = process.env.INTERNAL_WEBHOOK_SECRET || 'change-this-secret-123';

const logger = pino({ level: 'info' });

let waStatus = 'disconnected';
let qrCodeBase64 = null;
let sock = null;

// Helper to interact with Django for session sync
async function syncWithDjango(action, data = null) {
  try {
    const resp = await axios.post(`${DJANGO_URL}/wa-baileys/sync/`, {
      action,
      data,
      session_id: 'default'
    }, {
      headers: { 'X-Internal-Secret': INTERNAL_SECRET }
    });
    return resp.data.data;
  } catch (e) {
    logger.error(`Django sync failed (${action}): ${e.message}`);
    return null;
  }
}

async function connectToWhatsApp() {
  waStatus = 'initializing';
  qrCodeBase64 = null;

  const { state, saveCreds } = await useMultiFileAuthState('./.baileys_auth');
  const { version, isLatest } = await fetchLatestBaileysVersion();

  logger.info(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

  sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    printQRInTerminal: true,
    logger,
    defaultQueryTimeoutMs: undefined, // Fix for some timeout issues
    retryRequestDelayMs: 2000,
    maxMsgRetryCount: 5,
    // Add marking messages as read or other options if needed
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      waStatus = 'qr_pending';
      qrcode.toDataURL(qr).then(url => {
        qrCodeBase64 = url;
      });
    }

    if (connection === 'close') {
      const statusCode = (lastDisconnect.error instanceof Boom)
        ? lastDisconnect.error.output.statusCode
        : null;

      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      logger.info(`Connection closed: ${lastDisconnect.error}. Reconnecting: ${shouldReconnect}`);

      waStatus = 'disconnected';
      qrCodeBase64 = null;

      if (shouldReconnect) {
        setTimeout(connectToWhatsApp, 3000);
      } else {
        logger.warn('Logged out. Please scan QR again.');
        // Cleanup auth folder on logout
        const fs = require('fs');
        try { fs.rmSync('./.baileys_auth', { recursive: true, force: true }); } catch (e) { }
      }
    } else if (connection === 'open') {
      logger.info('WhatsApp connection opened successfully');
      waStatus = 'connected';
      qrCodeBase64 = null;
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // Buffered message handling is safer for high volume
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (!msg.key.fromMe && !msg.key.remoteJid.endsWith('@g.us')) {
        const phone = msg.key.remoteJid.replace('@s.whatsapp.net', '');
        const content = msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          msg.message?.buttonsResponseMessage?.selectedButtonId;

        if (content) {
          logger.info(`New message from ${phone}: ${content}`);
          try {
            await axios.post(`${DJANGO_URL}/internal/webhook/message/`, {
              phone,
              message: content,
              wa_message_id: msg.key.id
            }, {
              headers: { 'X-Internal-Secret': INTERNAL_SECRET },
              timeout: 5000
            });
          } catch (e) {
            logger.error(`Django webhook failed: ${e.message}`);
          }
        }
      }
    }
  });

  return sock;
}

// Routes
app.get('/status', (req, res) => {
  res.json({ status: waStatus, connected: waStatus === 'connected' });
});

app.get('/qr', (req, res) => {
  if (!qrCodeBase64) return res.status(404).json({ error: 'QR not ready' });
  res.json({ qr: qrCodeBase64 });
});

app.post('/send', async (req, res) => {
  const { phone, message } = req.body;
  if (!sock || waStatus !== 'connected') return res.status(503).json({ error: 'WhatsApp not connected' });

  try {
    const jid = phone.replace(/\D/g, '') + '@s.whatsapp.net';
    await sock.sendMessage(jid, { text: message });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/request-code', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number required' });

  try {
    if (!sock) await connectToWhatsApp();

    // Wait a bit for sock to initialize if just started
    if (waStatus === 'connected') return res.status(400).json({ error: 'Already connected' });

    const code = await sock.requestPairingCode(phone.replace(/\D/g, ''));
    res.json({ code });
  } catch (e) {
    logger.error(`Pairing code failed: ${e.message}`);
    res.status(500).json({ error: e.message });
  }
});

app.post('/disconnect', async (req, res) => {
  try {
    if (sock) {
      await sock.logout();
      sock = null;
    }
    waStatus = 'disconnected';
    qrCodeBase64 = null;
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/reset', async (req, res) => {
  try {
    if (sock) {
      try { await sock.logout(); } catch (e) { }
      sock = null;
    }
    waStatus = 'initializing';
    qrCodeBase64 = null;

    // Physically clear folder to be sure
    const fs = require('fs');
    const authPath = './.baileys_auth';
    if (fs.existsSync(authPath)) {
      fs.readdirSync(authPath).forEach(f => {
        try { fs.unlinkSync(`${authPath}/${f}`); } catch (e) { }
      });
    }

    setTimeout(() => {
      connectToWhatsApp();
    }, 2000);

    res.json({ success: true, message: 'Resetting session...' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  logger.info(`Baileys service running on port ${PORT}`);
  connectToWhatsApp();
});
