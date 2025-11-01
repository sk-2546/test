# my-youtube-search

A small Vercel-ready Node.js backend that scrapes YouTube (no API key) using `youtube-search-without-api-key` and exposes a Serverless Function.

Project structure

```
my-youtube-search/
├─ api/
│  └─ search.js          ← Vercel serverless function
├─ package.json
└─ vercel.json
```

Usage (after deploying to Vercel)

- Endpoint: `GET https://<your-deployment>/api/search?q=your+query`

Example frontend call (any website):

```js
// Simple fetch from browser
async function fetchYt(q) {
  const url = `https://your-deployment.vercel.app/api/search?q=${encodeURIComponent(q)}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
}

// Example usage
fetchYt('lofi hip hop')
  .then(results => console.log(results))
  .catch(err => console.error(err));
```

Deploy to Vercel (recommended)

1. Install Vercel CLI (optional): `npm i -g vercel`
2. From this folder run `vercel` and follow prompts, or use the Vercel web UI and import this repository.

Notes

- The function allows cross-origin requests (CORS) so your frontend can call it from anywhere.
- Keep in mind scraping may be subject to rate limits; don't hammer the endpoint.
