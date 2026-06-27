const test = require('node:test');
const assert = require('node:assert/strict');
const { translateText } = require('../server');

test('translateText parses Google-style translation responses', async () => {
  const fakeFetch = async () => ({
    ok: true,
    json: async () => [[['Bonjour', 'hello', null, null, 10]], null, 'en']
  });

  const result = await translateText('hello', 'fr', fakeFetch);
  assert.equal(result, 'Bonjour');
});
