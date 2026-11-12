const fs = require('fs');
const path = require('path');

const PRODUCTS = [
  ['Cartuchera de tela con cierre', 'pencil case zipper'],
  ['Set de 24 lápices de colores', 'colored pencils set'],
  ['Cuaderno universitario x3', 'notebooks stationery'],
  ['Kit de resaltadores pastel x6', 'highlighters markers'],
  ['Organizador de cocina 3 niveles', 'kitchen shelf organizer'],
  ['Set de 6 tápers herméticos', 'food storage containers'],
  ['Lámpara LED de escritorio', 'led desk lamp'],
  ['Cesta organizadora plegable', 'woven storage basket'],
  ['Sérum de vitamina C 30 ml', 'vitamin c serum bottle'],
  ['Set de 12 brochas de maquillaje', 'makeup brushes set'],
  ['Crema hidratante corporal', 'body lotion bottle'],
  ['Esmaltes de uñas pack x10', 'nail polish bottles'],
  ['Audífonos bluetooth TWS', 'wireless earbuds'],
  ['Cargador rápido 20W USB-C', 'usb c charger adapter'],
  ['Parlante portátil mini', 'portable bluetooth speaker'],
  ['Mouse inalámbrico silencioso', 'wireless computer mouse'],
  ['Mochila urbana impermeable', 'urban backpack'],
  ['Pack de 5 pares de medias', 'colorful socks'],
  ['Bloques de construcción 500 pzs', 'building blocks toy'],
  ['Rompecabezas 1000 piezas', 'jigsaw puzzle pieces'],
];

const OUT = path.join(__dirname, 'imagenes', 'cand');
fs.mkdirSync(OUT, { recursive: true });

async function j(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'MilKositasSite/1.0 (demo store)' } });
  if (!r.ok) throw new Error(r.status + ' ' + url);
  return r.json();
}

(async () => {
  const meta = [];
  for (let i = 0; i < PRODUCTS.length; i++) {
    const [name, q] = PRODUCTS[i];
    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&page_size=8&license_type=commercial&size=large&aspect_ratio=square&mature=false`;
    let res;
    try { res = await j(url); } catch (e) { console.log('ERR query', name, e.message); continue; }
    const results = (res.results || []).filter(x => x.width >= 700 && x.height >= 700);
    console.log(`#${i + 1} ${name} -> ${results.length} candidates`);
    let k = 0;
    for (const item of results.slice(0, 8)) {
      const ext = (item.url.match(/\.(jpe?g|png|webp)/i) || [, 'jpg'])[1].toLowerCase();
      const file = path.join(OUT, `${i + 1}-${k}.${ext === 'jpeg' ? 'jpg' : ext}`);
      try {
        const r = await fetch(item.url, { headers: { 'User-Agent': 'MilKositasSite/1.0' } });
        if (!r.ok) throw new Error(r.status);
        fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
        meta.push({
          product: i + 1, idx: k, name, query: q, file: path.relative(__dirname, file),
          title: item.title, creator: item.creator, license: item.license,
          license_url: item.license_url, source: item.foreign_landing_url, width: item.width, height: item.height
        });
        k++;
      } catch (e) { console.log('  dl fail', e.message); }
    }
  }
  fs.writeFileSync(path.join(__dirname, 'imagenes', 'cand', 'meta.json'), JSON.stringify(meta, null, 2));
  console.log('TOTAL downloaded:', meta.length);
})();
