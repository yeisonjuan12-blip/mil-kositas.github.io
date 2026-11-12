const fs = require('fs');
const path = require('path');
const WANT = [
  [9, 'Sérum', ['serum cosmetic bottle', 'essential oil dropper bottle', 'skincare serum bottle', 'cosmetic bottle']],
  [6, 'Tápers', ['food containers lids', 'plastic containers kitchen', 'storage containers food']],
  [5, 'Organizador cocina', ['kitchen organizer', 'spice jars rack', 'kitchen rack']],
];
const OUT = path.join(__dirname, 'imagenes', 'cand4');
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const UA = { 'User-Agent': 'MilKositasDemo/1.0' };
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
  const meta = [];
  for (const [pid, name, queries] of WANT) {
    let pages = [];
    for (const q of queries) {
      try { pages = pages.concat(await search(q)); } catch (e) { console.log('q fail', q, e.message); }
      await sleep(600);
      if (pages.length >= 16) break;
    }
    const seen = new Set();
    const good = pages.filter(p => {
      const inf = p.imageinfo?.[0];
      if (!inf || inf.width < 700 || inf.height < 700 || seen.has(p.title)) return false;
      seen.add(p.title); return true;
    });
    console.log(`#${pid}: ${good.length}`);
    let k = 0;
    for (const p of good) {
      if (k >= 8) break;
      const info = p.imageinfo[0];
      try {
        const r = await jget(info.thumburl);
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length < 8000) throw new Error('tiny');
        fs.writeFileSync(path.join(OUT, `${pid}-${k}.jpg`), buf);
        const md = info.extmetadata || {};
        meta.push({ product: pid, idx: k, name, title: p.title, file: path.relative(__dirname, path.join(OUT, `${pid}-${k}.jpg`)), page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`, license: md.LicenseShortName?.value || '', artist: (md.Artist?.value || '').replace(/<[^>]*>/g, '').trim() });
        k++;
      } catch (e) { console.log('dl fail', e.message); }
      await sleep(350);
    }
    await sleep(500);
  }
  fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify(meta, null, 2));
  console.log('TOTAL', meta.length);
})();
