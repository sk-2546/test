// server.js - simple Node HTTP server to run the same API locally
const http = require('http');
const url = require('url');

let search;
try {
  search = require('youtube-search-without-api-key').search;
} catch (err) {
  console.error('\nThe module "youtube-search-without-api-key" is not installed.');
  console.error('Run `npm install` in this folder to install dependencies, then run `npm start`.\n');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

const sendJson = (res, status, data) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
};

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);

  // Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (parsed.pathname !== '/api/search') {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }

  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  const query = (parsed.query.q || '').trim();
  if (!query) {
    sendJson(res, 400, { error: 'Missing query parameter ?q=' });
    return;
  }

  try {
    const videos = await search(query, { limit: 15 });
    const cleaned = videos.map(v => ({
      id: v.id,
      title: v.title,
      duration: v.duration?.raw || null,
      thumbnail: v.thumbnails?.[0]?.url || null,
      url: v.id ? `https://www.youtube.com/watch?v=${v.id}` : v.url || null
    }));

    sendJson(res, 200, cleaned);
  } catch (err) {
    console.error('Search error:', err && err.message ? err.message : err);
    sendJson(res, 500, { error: 'Failed to fetch results' });
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log('Endpoint: GET /api/search?q=your+query');
});
