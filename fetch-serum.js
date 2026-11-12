const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'imagenes', 'cand5');
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const UA = { 'User-Agent': 'MilKositasDemo/1.0' };
const QS = ['amber dropper bottle', 'essential oil bottle', 'cosmetic serum', 'glass dropper bottle', 'skincare product bottle'];
async function jget(url, tries = 3) {
  for (let t = 1; t <= tries; t++) {
    try { const r = await fetch(url, { headers: UA }); if (!r.ok) throw new Error('HTTP ' + r.status); return r; }
    catch (e) { if (t === tries) throw e; await sleep(1500 * t); }
  }
}
async function search(q) {
  const u = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent('filetype:bitmap ' + q)}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&iiurlwidth=800&format=json`;
  const d = await (await jget(u)).json();
  return d.query ? Object.values(d.query.pages).sort((a, b) => a.index - b.index) : [];
}
(async () => {
  let pages = [];
  for (const q of QS) { try { pages = pages.concat(await search(q)); } catch (e) { } await sleep(700); }
  const seen = new Set();
  const good = pages.filter(p => {
    const inf = p.imageinfo?.[0];
    if (!inf || inf.width < 700 || inf.height < 700 || seen.has(p.title)) return false;
    seen.add(p.title); return true;
  });
  console.log('good', good.length);
  const meta = [];
  let k = 0;
  for (const p of good) {
    if (k >= 10) break;
    try {
      const r = await jget(p.imageinfo[0].thumburl);
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 8000) throw new Error('tiny');
      fs.writeFileSync(path.join(OUT, `9-${k}.jpg`), buf);
      const md = p.imageinfo[0].extmetadata || {};
      meta.push({ product: 9, idx: k, name: 'Sérum', title: p.title, file: `imagenes/cand5/9-${k}.jpg`, page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`, license: md.LicenseShortName?.value || '', artist: (md.Artist?.value || '').replace(/<[^>]*>/g, '').trim() });
      k++;
    } catch (e) { console.log('dl', e.message); }
    await sleep(350);
  }
  fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify(meta, null, 2));
  console.log('TOTAL', meta.length);
})();
