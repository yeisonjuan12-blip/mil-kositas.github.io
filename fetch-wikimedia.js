const fs = require('fs');
const path = require('path');

const PRODUCTS = [
  ['Cartuchera', 'pencil case', 'pencil case zipper'],
  ['Lápices de colores', 'colored pencils', 'coloured pencils box'],
  ['Cuadernos', 'notebook stationery', 'notebooks stack'],
  ['Resaltadores', 'highlighter pen', 'marker pens'],
  ['Organizador cocina', 'spice rack', 'kitchen shelf'],
  ['Tápers', 'tupperware', 'food storage container'],
  ['Lámpara LED', 'desk lamp', 'table lamp'],
  ['Cesta', 'storage basket', 'wicker basket'],
  ['Sérum', 'cosmetic serum bottle', 'serum dropper bottle'],
  ['Brochas', 'makeup brushes', 'cosmetic brush set'],
  ['Crema corporal', 'body lotion', 'lotion bottle'],
  ['Esmaltes', 'nail polish', 'nail varnish bottles'],
  ['Audífonos', 'wireless earbuds', 'bluetooth earphones'],
  ['Cargador', 'usb charger', 'power adapter usb'],
  ['Parlante', 'portable bluetooth speaker', 'loudspeaker bluetooth'],
  ['Mouse', 'computer mouse', 'wireless mouse'],
  ['Mochila', 'backpack', 'rucksack'],
  ['Medias', 'socks', 'colourful socks'],
  ['Bloques', 'lego bricks', 'toy building blocks'],
  ['Rompecabezas', 'jigsaw puzzle', 'puzzle pieces']
];

const OUT = path.join(__dirname, 'imagenes', 'cand2');
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const UA = { 'User-Agent': 'MilKositasDemo/1.0 (contact: demo@example.com)' };

async function jget(url, tries = 4) {
  for (let t = 1; t <= tries; t++) {
    try {
      const r = await fetch(url, { headers: UA });
      if (r.status === 429 || r.status >= 500) throw new Error('HTTP ' + r.status);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r;
    } catch (e) {
      if (t === tries) throw e;
      await sleep(1800 * t);
    }
  }
}

async function search(q, limit = 8) {
  const u = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent('filetype:bitmap ' + q)}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&iiurlwidth=800&format=json`;
  const d = await (await jget(u)).json();
  return d.query ? Object.values(d.query.pages).sort((a, b) => a.index - b.index) : [];
}

(async () => {
  const meta = [];
  for (let i = 0; i < PRODUCTS.length; i++) {
    const [name, q1, q2] = PRODUCTS[i];
    let pages = [];
    try { pages = await search(q1); } catch (e) { console.log('search fail', name, e.message); }
    if (pages.length < 4 && q2) {
      await sleep(600);
      try { pages = pages.concat(await search(q2)); } catch (e) { }
    }
    const seen = new Set();
    const good = pages.filter(p => p.imageinfo?.[0]?.width >= 700 && p.imageinfo?.[0]?.height >= 700 && !seen.has(p.title) && seen.add(p.title));
    console.log(`#${i + 1} ${name}: ${good.length}`);
    let k = 0;
    for (const p of good) {
      if (k >= 8) break;
      const info = p.imageinfo[0];
      const src = info.thumburl;
      const file = path.join(OUT, `${i + 1}-${k}.jpg`);
      try {
        const r = await jget(src);
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length < 8000) throw new Error('tiny');
        fs.writeFileSync(file, buf);
        const md = info.extmetadata || {};
        meta.push({
          product: i + 1, idx: k, name, title: p.title,
          file: path.relative(__dirname, file),
          thumb: src,
          page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`,
          license: md.LicenseShortName?.value || '',
          artist: (md.Artist?.value || '').replace(/<[^>]*>/g, '').trim()
        });
        k++;
      } catch (e) { console.log('  dl fail', e.message); }
      await sleep(450);
    }
    await sleep(700);
  }
  fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify(meta, null, 2));
  console.log('TOTAL', meta.length);
})();
