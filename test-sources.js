(async () => {
  const urls = [
    'https://www.pexels.com/search/earbuds/',
    'https://pixabay.com/images/search/earbuds/',
    'https://www.pexels.com/api/v3/search/photos?query=earbuds&per_page=3',
  ];
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36';
  for (const u of urls) {
    try {
      const r = await fetch(u, { headers: { 'User-Agent': ua } });
      const t = await r.text();
      console.log('\n' + u, r.status, t.length);
      console.log(t.slice(0, 300).replace(/\s+/g, ' '));
      const m = [...t.matchAll(/https:\/\/images\.pexels\.com\/photos\/\d+\/[^"'\\ ]+/g)].slice(0, 5);
      console.log('pexels urls:', m.map(x => x[0].slice(0, 130)));
    } catch (e) { console.log(u, 'ERR', e.message); }
  }
})();
