// api/search.js
const { search } = require('youtube-search-without-api-key');

/**
 * Vercel Serverless Function
 * GET /api/search?q=your+query
 */
module.exports = async (req, res) => {
  // CORS - allow any origin so any frontend can call this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Only allow GET
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const query = (req.query.q || '').trim();

  if (!query) {
    res.status(400).json({ error: 'Missing query parameter ?q=' });
    return;
  }

  try {
    // Fetch up to 15 results (adjust limit as needed)
    const videos = await search(query, { limit: 15 });

    // Return a cleaned list of fields useful to the frontend
    const cleaned = videos.map(v => ({
      id: v.id,
      title: v.title,
      duration: v.duration?.raw || null,
      thumbnail: v.thumbnails?.[0]?.url || null,
      url: v.id ? `https://www.youtube.com/watch?v=${v.id}` : v.url || null
    }));

    res.status(200).json(cleaned);
  } catch (err) {
    console.error('Search error:', err && err.message ? err.message : err);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
};
