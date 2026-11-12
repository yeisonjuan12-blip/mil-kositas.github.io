const QUERIES = [
  ['pencil case', 'pencil case'],
  ['colored pencils', 'colored pencils'],
  ['notebook stationery', 'notebooks'],
  ['highlighters', 'highlighter pens'],
  ['kitchen organizer rack', 'kitchen shelf'],
  ['food storage containers', 'plastic food containers'],
  ['desk lamp', 'desk lamp'],
  ['storage basket', 'wicker basket'],
  ['vitamin c serum', 'serum bottle cosmetics'],
  ['makeup brushes', 'makeup brushes'],
  ['body lotion', 'lotion bottle'],
  ['nail polish', 'nail polish'],
  ['wireless earbuds', 'wireless earbuds'],
  ['usb charger', 'usb power adapter'],
  ['bluetooth speaker', 'portable bluetooth speaker'],
  ['wireless mouse', 'wireless mouse'],
  ['backpack', 'backpack'],
  ['socks', 'socks'],
  ['building blocks', 'toy building blocks'],
  ['jigsaw puzzle', 'jigsaw puzzle'],
];

(async () => {
  for (const [label, q] of QUERIES) {
    const u = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent('filetype:bitmap ' + q)}&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url%7Csize&iiurlwidth=800&format=json`;
    try {
      const r = await fetch(u);
      const d = await r.json();
      const pages = d.query ? Object.values(d.query.pages).sort((a, b) => a.index - b.index) : [];
      console.log('\n## ' + label + ' (' + pages.length + ')');
      pages.forEach(p => console.log('   ' + p.title + ' [' + p.imageinfo[0].width + 'x' + p.imageinfo[0].height + ']'));
    } catch (e) { console.log(label, 'ERR', e.message); }
    await new Promise(r => setTimeout(r, 200));
  }
})();
