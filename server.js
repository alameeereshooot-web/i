const express = require('express');
const axios = require('axios');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('Missing ?url=');

  try {
    const isM3u8 = targetUrl.includes('.m3u8');
    
    const response = await axios({
      method: 'get',
      url: targetUrl,
      headers: {
        'User-Agent': 'VLC/3.0.18 LibVLC/3.0.18',
        'Referer': new URL(targetUrl).origin
      },
      responseType: isM3u8 ? 'text' : 'stream'
    });

    if (response.headers['content-type']) {
      res.setHeader('content-type', response.headers['content-type']);
    }

    if (isM3u8) {
      let manifest = response.data;
      const base = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);
      const host = `${req.protocol}://${req.get('host')}`;

      manifest = manifest.replace(/^(?!#)(.+)$/gm, (line) => {
        const trimmed = line.trim();
        if (!trimmed) return line;
        const fullUrl = trimmed.startsWith('http') ? trimmed : base + trimmed;
        return `${host}/?url=${encodeURIComponent(fullUrl)}`;
      });

      return res.send(manifest);
    }

    response.data.pipe(res);
  } catch (err) {
    res.status(502).send('Error: ' + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
