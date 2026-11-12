(async () => {
  const ua = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };
  // 1) openverse original
  const r = await fetch('https://api.openverse.org/v1/images/?q=pencil%20case&page_size=3&license_type=commercial&size=large');
  const d = await r.json();
  for (const x of d.results.slice(0, 2)) {
    console.log('OV', x.url);
    try {
      const ir = await fetch(x.url, { headers: ua });
      console.log('  ->', ir.status, ir.headers.get('content-type'), (await ir.arrayBuffer()).byteLength);
    } catch (e) { console.log('  ERR', e.message); }
  }
  // 2) dummyjson
  const dj = await (await fetch('https://dummyjson.com/products?limit=3')).json();
  console.log('DJ sample', dj.products.map(p => p.title + ' :: ' + p.thumbnail).slice(0, 3));
  // 3) wikimedia thumb
  const wm = await (await fetch('https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=filetype:bitmap%20wireless%20earbuds&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json', { headers: ua })).json();
  const p = Object.values(wm.query.pages)[0];
  console.log('WM', p.imageinfo[0].thumburl);
  const wr = await fetch(p.imageinfo[0].thumburl, { headers: ua });
  console.log('  ->', wr.status, wr.headers.get('content-type'), (await wr.arrayBuffer()).byteLength);
})();
