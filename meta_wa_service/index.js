require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pino = require('pino');

const app = express();
app.use(cors());
app.use(express.json());

const logger = pino({ level: 'info' });
const PORT = process.env.PORT || 3001; // Using 3001 to avoid conflict with Baileys (3000)
const DJANGO_URL = process.env.DJANGO_BASE_URL || 'http://localhost:8000';
const INTERNAL_SECRET = process.env.INTERNAL_WEBHOOK_SECRET || 'change-this-secret-123';

// Health check
app.get('/status', (req, res) => {
  res.json({ status: 'running', service: 'meta-wa-api' });
});

// Proxy route for sending messages via Meta API
app.post('/send', async (req, res) => {
  const { phone, message } = req.body;
  const accessToken = process.env.META_ACCESS_TOKEN;
  const phoneId = process.env.META_PHONE_ID;

  if (!accessToken || !phoneId) {
    return res.status(500).json({ error: 'Meta API credentials not configured in .env' });
  }

  // Format phone (must be with country code, no +)
  const cleanPhone = phone.replace(/\D/g, '');

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${phoneId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    logger.info(`Message sent to ${cleanPhone} via Meta API`);
    res.json({ success: true, meta_response: response.data });
  } catch (error) {
    const errorData = error.response ? error.response.data : error.message;
    logger.error(`Meta API Send Error: ${JSON.stringify(errorData)}`);
    res.status(error.response ? error.response.status : 500).json({ error: errorData });
  }
});

app.listen(PORT, () => {
  logger.info(`Meta WA service running on port ${PORT}`);
});
