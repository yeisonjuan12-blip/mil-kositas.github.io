const fs = require('fs');
const path = require('path');

const WANT = [
  [1, 'Cartuchera', ['pencil case', 'school pencil case']],
  [5, 'Organizador cocina', ['spice rack', 'kitchen storage rack', 'kitchen shelf organizer']],
  [6, 'Tápers', ['food storage containers', 'tupperware', 'lunch box']],
  [7, 'Lámpara LED', ['anglepoise lamp', 'led desk lamp', 'table lamp office']],
  [9, 'Sérum', ['serum bottle', 'dropper bottle cosmetics', 'face serum']],
  [11, 'Crema corporal', ['body lotion bottle', 'lotion pump bottle', 'moisturizer bottle']],
  [18, 'Medias', ['socks pair', 'cotton socks', 'socks']],
];

const OUT = path.join(__dirname, 'imagenes', 'cand3');
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const UA = { 'User-Agent': 'MilKositasDemo/1.0' };

async function jget(url, tries = 3) {
  for (let t = 1; t <= tries; t++) {
    try {
      const r = await fetch(url, { headers: UA });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r;
    } catch (e) { if (t === tries) throw e; await sleep(1500 * t); }
  }
}
async function search(q, limit = 8) {
  const u = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent('filetype:bitmap ' + q)}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&iiurlwidth=800&format=json`;
  const d = await (await jget(u)).json();
  return d.query ? Object.values(d.query.pages).sort((a, b) => a.index - b.index) : [];
}

(async () => {
  const meta = [];
  for (const [pid, name, queries] of WANT) {
    let pages = [];
    for (const q of queries) {
      try { pages = pages.concat(await search(q)); } catch (e) { console.log('q fail', q, e.message); }
      await sleep(700);
      if (pages.length >= 12) break;
    }
    const seen = new Set();
    const good = pages.filter(p => {
      const inf = p.imageinfo?.[0];
      if (!inf || inf.width < 700 || inf.height < 700 || seen.has(p.title)) return false;
      seen.add(p.title); return true;
    });
    console.log(`#${pid} ${name}: ${good.length}`);
    let k = 0;
    for (const p of good) {
      if (k >= 8) break;
      const info = p.imageinfo[0];
      const file = path.join(OUT, `${pid}-${k}.jpg`);
      try {
        const r = await jget(info.thumburl);
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length < 8000) throw new Error('tiny');
        fs.writeFileSync(file, buf);
        const md = info.extmetadata || {};
        meta.push({
          product: pid, idx: k, name, title: p.title, file: path.relative(__dirname, file),
          page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`,
          license: md.LicenseShortName?.value || '',
          artist: (md.Artist?.value || '').replace(/<[^>]*>/g, '').trim()
        });
        k++;
      } catch (e) { console.log('  dl fail', e.message); }
      await sleep(400);
    }
    await sleep(600);
  }
  fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify(meta, null, 2));
  console.log('TOTAL', meta.length);
})();
