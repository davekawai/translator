const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '.')));

function parseTranslationResponse(data) {
  // Returns object { text: string, transliteration: string }
  if (!Array.isArray(data?.[0])) {
    return { text: '', transliteration: '' };
  }

  const text = data[0]
    .map((item) => item?.[0])
    .filter(Boolean)
    .join('');

  // Some responses include transliteration in item[2] or item[3]
  const transliteration = data[0]
    .map((item) => item?.[2] || item?.[3])
    .filter(Boolean)
    .join('');

  return { text, transliteration };
}

async function translateText(text, targetLang, fetchImpl = fetch) {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Text is required');
  }

  if (typeof targetLang !== 'string' || !targetLang.trim()) {
    throw new Error('targetLang is required');
  }

  const encodedText = encodeURIComponent(text.trim());
  const encodedTargetLang = encodeURIComponent(targetLang.trim());
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodedTargetLang}&dt=t&dt=rm&q=${encodedText}`;

  const response = await fetchImpl(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Translation request failed with status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const parsed = parseTranslationResponse(data);

  if (!parsed.text) {
    throw new Error('Translation returned no text');
  }

  return parsed.text;
}

async function translateTextWithDetails(text, targetLang, fetchImpl = fetch) {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Text is required');
  }

  if (typeof targetLang !== 'string' || !targetLang.trim()) {
    throw new Error('targetLang is required');
  }

  const encodedText = encodeURIComponent(text.trim());
  const encodedTargetLang = encodeURIComponent(targetLang.trim());
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodedTargetLang}&dt=t&dt=rm&q=${encodedText}`;

  const response = await fetchImpl(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Translation request failed with status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const parsed = parseTranslationResponse(data);

  if (!parsed.text) {
    throw new Error('Translation returned no text');
  }

  return parsed;
}

app.post('/api/translate', async (req, res) => {
  const { text, targetLang } = req.body;

  try {
    const translatedText = await translateTextWithDetails(text, targetLang);
    res.json({ text: translatedText.text, transliteration: translatedText.transliteration });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (require.main === module) {
  const portFromEnv = Number(process.env.PORT || 3000);
  const startServer = (port) => {
    const server = app.listen(port, () => {
      console.log(`✅ Translator running on port ${port}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.warn(`Port ${port} is busy. Trying ${port + 1}...`);
        startServer(port + 1);
      } else {
        throw error;
      }
    });
  };

  startServer(portFromEnv);
}

module.exports = { app, translateText, translateTextWithDetails };
