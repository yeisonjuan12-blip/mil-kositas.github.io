const fs = require('fs');
const path = require('path');

const PRODUCTS = [
  ['Cartuchera de tela con cierre', 'pencil case'],
  ['Set de 24 lápices de colores', 'colored pencils'],
  ['Cuaderno universitario x3', 'notebooks'],
  ['Kit de resaltadores pastel x6', 'highlighters'],
  ['Organizador de cocina 3 niveles', 'kitchen shelf'],
  ['Set de 6 tápers herméticos', 'food containers'],
  ['Lámpara LED de escritorio', 'desk lamp'],
  ['Cesta organizadora plegable', 'storage basket'],
  ['Sérum de vitamina C 30 ml', 'serum bottle'],
  ['Set de 12 brochas de maquillaje', 'makeup brushes'],
  ['Crema hidratante corporal', 'lotion bottle'],
  ['Esmaltes de uñas pack x10', 'nail polish'],
  ['Audífonos bluetooth TWS', 'earbuds'],
  ['Cargador rápido 20W USB-C', 'usb charger'],
  ['Parlante portátil mini', 'bluetooth speaker'],
  ['Mouse inalámbrico silencioso', 'computer mouse'],
  ['Mochila urbana impermeable', 'backpack'],
  ['Pack de 5 pares de medias', 'socks'],
  ['Bloques de construcción 500 pzs', 'building blocks'],
  ['Rompecabezas 1000 piezas', 'jigsaw puzzle'],
];

const OUT = path.join(__dirname, 'imagenes', 'cand');
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function get(url, tries = 3) {
  for (let t = 1; t <= tries; t++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'MilKositasSite/1.0 (demo)' } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r;
    } catch (e) {
      if (t === tries) throw e;
      await sleep(1200 * t);
    }
  }
}

(async () => {
  const meta = [];
  for (let i = 0; i < PRODUCTS.length; i++) {
    const [name, q] = PRODUCTS[i];
    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&page_size=12&license_type=commercial&size=large&mature=false`;
    let res;
    try { res = await (await get(url, 4)).json(); } catch (e) { console.log('QUERY FAIL', name, e.message); continue; }
    const results = (res.results || []).filter(x => x.width >= 640 && x.height >= 640);
    console.log(`#${i + 1} ${name}: ${results.length}`);
    let k = 0;
    for (const item of results) {
      if (k >= 6) break;
      const file = path.join(OUT, `${i + 1}-${k}.img`);
      try {
        const r = await get(item.url);
        const ext = (r.headers.get('content-type') || '').includes('png') ? 'png' : 'jpg';
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length < 5000) throw new Error('tiny');
        fs.renameSync(file, file + '.' + ext);
        fs.writeFileSync(file + '.' + ext, buf);
        meta.push({
          product: i + 1, idx: k, name, query: q, file: path.relative(__dirname, file + '.' + ext),
          title: item.title, creator: item.creator, license: item.license,
          license_url: item.license_url, source: item.foreign_landing_url,
        });
        k++;
      } catch (e) { console.log('  dl fail', e.message); }
      await sleep(350);
    }
    await sleep(500);
  }
  fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify(meta, null, 2));
  console.log('TOTAL', meta.length);
})();
