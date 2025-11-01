// test_search.js - quick local test to verify dependency works
const { search } = require('youtube-search-without-api-key');

(async () => {
  try {
    console.log('Running a quick test search for "lofi" (2 results) ...');
    const results = await search('lofi', { limit: 2 });
    console.log('Results:', JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Test failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
