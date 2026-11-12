(async () => {
  const d = await (await fetch('https://dummyjson.com/products?limit=200&select=id,title,category,thumbnail,price')).json();
  console.log('total', d.products.length);
  const words = ['pencil', 'pen', 'notebook', 'highlighter', 'marker', 'kitchen', 'container', 'lamp', 'basket', 'serum', 'brush', 'lotion', 'nail', 'earbud', 'headphone', 'airpod', 'charger', 'speaker', 'mouse', 'backpack', 'bag', 'sock', 'block', 'puzzle', 'toy', 'organizer', 'storage'];
  for (const w of words) {
    const hits = d.products.filter(p => (p.title + ' ' + p.category).toLowerCase().includes(w));
    if (hits.length) console.log('\n[' + w + '] ' + hits.map(p => `${p.id}:${p.title} (${p.category})`).join(' | '));
  }
})();
