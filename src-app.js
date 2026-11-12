<script>
// ===== CONFIGURA AQUÍ =====
// FOTOS: crea una carpeta "imagenes" junto a este archivo y guarda ahí las fotos de cada producto:
// producto 1 = imagenes/1.jpg (extras: 1-2.jpg, 1-3.jpg), producto 2 = imagenes/2.jpg ... (el orden es el de la lista de abajo).
// Si falta una foto, se muestra una ilustración automática.
const WHATSAPP="51999999999",YAPE="999999999",PLIN="999999999",TITULAR="Freisy",GRATIS=99;
// QR: guarda tus QR como imagenes/qr-yape.png e imagenes/qr-plin.png
// TARJETA_URL: link de pago de Culqi / Izipay / Mercado Pago (si lo dejas vacío, "Tarjeta" aparece como "Próximamente")
const TARJETA_URL="";
// SUPABASE: tu base de datos (ver README). Con estos 2 datos los pedidos y comprobantes llegan a tu panel /admin.
// Vacío = el pedido solo queda guardado en el dispositivo del cliente (modo prueba).
const SUPABASE_URL="",SUPABASE_KEY="";   // URL del proyecto y clave "anon public"
const rpc=(fn,args)=>fetch(SUPABASE_URL+"/rest/v1/rpc/"+fn,{method:"POST",headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:"Bearer "+SUPABASE_KEY},body:JSON.stringify(args)}).then(async r=>{const d=await r.json().catch(()=>null);if(!r.ok)throw new Error(d?.message||"Error de conexión");return d});
const ICON={Útiles:"✏️",Hogar:"🏠",Belleza:"💄",Tecnología:"🎧",Moda:"👕",Juguetes:"🧸"};
const P=[ // nombre, categoría, precio, palabras clave, descripción
["Cartuchera de tela con cierre","Útiles",9.90,"lapiz lapicero estuche colores","Cartuchera resistente con cierre, ideal para colegio y oficina."],
["Set de 24 lápices de colores","Útiles",8.90,"lapiz crayones dibujo cartuchera","Colores intensos y suaves al trazo."],
["Cuaderno universitario x3","Útiles",14.90,"libreta apuntes","Pack de 3 cuadernos de 100 hojas."],
["Kit de resaltadores pastel x6","Útiles",7.90,"plumon marcador lapicero","Tonos pastel que no manchan la hoja."],
["Organizador de cocina 3 niveles","Hogar",24.90,"estante repisa ordenar","Gana espacio en tu cocina con 3 niveles."],
["Set de 6 tápers herméticos","Hogar",19.90,"tuper lonchera comida","Aptos para microondas y refrigeradora."],
["Lámpara LED de escritorio","Hogar",29.90,"luz velador estudio","Luz regulable, cuida tu vista."],
["Cesta organizadora plegable","Hogar",12.90,"ropa canasta","Se pliega y no ocupa espacio."],
["Sérum de vitamina C 30 ml","Belleza",22.00,"cara piel facial","Ilumina y unifica el tono de tu piel."],
["Set de 12 brochas de maquillaje","Belleza",27.90,"makeup rostro","Cerdas suaves para un acabado perfecto."],
["Crema hidratante corporal","Belleza",14.90,"locion piel","Hidratación por 24 horas."],
["Esmaltes de uñas pack x10","Belleza",18.90,"manicure pintaunas","10 colores de moda, secado rápido."],
["Audífonos bluetooth TWS","Tecnología",59.90,"auriculares inalambricos","Sonido nítido y estuche de carga."],
["Cargador rápido 20W USB-C","Tecnología",24.90,"cable celular carga","Carga rápida y segura."],
["Parlante portátil mini","Tecnología",39.90,"bocina altavoz musica","Pequeño, potente y recargable."],
["Mouse inalámbrico silencioso","Tecnología",19.90,"computadora laptop","Clics silenciosos y batería duradera."],
["Mochila urbana impermeable","Moda",54.90,"bolso maleta colegio","Resistente al agua, con puerto USB."],
["Pack de 5 pares de medias","Moda",16.90,"calcetines","Algodón suave y transpirable."],
["Bloques de construcción 500 pzs","Juguetes",34.90,"lego ninos armar","Creatividad sin límites para los peques."],
["Rompecabezas 1000 piezas","Juguetes",21.90,"puzzle familia","Un plan perfecto en familia."]
].map((a,i)=>{const d=[20,35,15,40,25,30,50,10][i%8];return{id:i,n:a[0],c:a[1],p:a[2],k:a[3],d:a[4],pct:d,old:Math.ceil(a[2]/(1-d/100)),sold:(i*137)%900+100,r:(4+(i*7)%10/10).toFixed(1),imgs:[0,1,2].map(k=>`imagenes/${i+1}${k?"-"+(k+1):""}.jpg`)}});
const SL=[["¡Vuelta a clases!","Útiles desde S/ 7.90","✏️","linear-gradient(120deg,#7b2cbf,#e8267a)","Útiles"],["Tecnología a tu alcance","Audífonos, cargadores y más","🎧","linear-gradient(120deg,#1e88e5,#7b2cbf)","Tecnología"],["Mil cositas para tu hogar","Orden y estilo desde S/ 12.90","🏠","linear-gradient(120deg,#fc6701,#e8267a)","Hogar"]];
// ==========================
const $=s=>document.querySelector(s),norm=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const EMO=["👝","✏️","📓","🖍️","🗄️","🍱","💡","🧺","🧴","🖌️","🫙","💅","🎧","🔌","🔊","🖱️","🎒","🧦","🧱","🧩"];
const PAL=[["#ffd21f","#fc6701"],["#e8267a","#7b2cbf"],["#1e88e5","#7b2cbf"],["#2eb85c","#1e88e5"],["#fc6701","#e8267a"],["#7b2cbf","#e8267a"]];
function tile(id,k){const c=PAL[(id+k)%PAL.length],e=EMO[id%EMO.length],sm=k==2?[[90,110],[500,100],[80,500],[510,490]].map(([x,y])=>`<text x="${x}" y="${y}" font-size="70" opacity=".55">${e}</text>`).join(""):"";
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs><rect width="600" height="600" fill="url(#g)"/><circle cx="${k==1?480:120}" cy="${k==1?120:480}" r="190" fill="#fff" opacity=".18"/><circle cx="${k==1?90:500}" cy="${k==1?500:110}" r="90" fill="#fff" opacity=".15"/>${sm}<g transform="rotate(${[0,-12,10][k]} 300 300)"><circle cx="300" cy="300" r="190" fill="#fff" opacity=".3"/><text x="300" y="300" font-size="${k==1?230:260}" text-anchor="middle" dominant-baseline="central">${e}</text></g></svg>`;
  return "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg)}
function fb(el,id,k){if(!el.src.startsWith("data:"))el.src=tile(+id,+k)}
function setBig(id,k){const b=$("#big");b.dataset.k=k;b.src=P[id].imgs[k];document.querySelectorAll(".th img").forEach((e,j)=>e.classList.toggle("on",j==k))}
const TILES=`<div class="tiles">${[["Útiles","#7b2cbf,#e8267a","✏️"],["Belleza","#e8267a,#fc6701","💄"],["Tecnología","#1e88e5,#2eb85c","🎧"]].map(t=>`<button class="tl" style="background:linear-gradient(135deg,${t[1]})" onclick="cat='${t[0]}';render();scrollTo(0,0)"><b>${t[0]}</b>Ver todo<em>${t[2]}</em></button>`).join("")}</div>`;
const WHY=`<div class="sec"><h2>¿Por qué comprar aquí?</h2></div><div class="why"><div><b>💜</b>Paga fácil con Yape o Plin</div><div><b>📦</b>Envíos a todo el Perú</div><div><b>💸</b>Precios bajos cada día</div><div><b>💬</b>Atención por WhatsApp</div></div>`;
const money=n=>"S/ "+n.toFixed(2),cats=["Todas",...new Set(P.map(p=>p.c))];
let cart=JSON.parse(localStorage.getItem("mk_cart")||"{}"),cat="Todas",q="";
const total=()=>Object.entries(cart).reduce((s,[i,n])=>s+P[i].p*n,0);
const save=()=>{localStorage.setItem("mk_cart",JSON.stringify(cart));$("#cnt").textContent=Object.values(cart).reduce((a,b)=>a+b,0)};
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("on");clearTimeout(e.t);e.t=setTimeout(()=>e.classList.remove("on"),1600)}
const card=p=>`<div class="card" onclick="openP(${p.id})"><span class="bd">-${p.pct}%</span><img loading="lazy" src="${p.imgs[0]}" alt="${p.n}" onerror="fb(this,${p.id},0)"><div class="i"><p>${p.n}</p><span class="st"><b>★</b> ${p.r} · ${p.sold} vendidos</span><span class="pr">${money(p.p)}<span class="old">${money(p.old)}</span></span></div><button class="plus" aria-label="Agregar" onclick="event.stopPropagation();add(${p.id})">+</button></div>`;
const sec=(t,l)=>l.length?`<div class="sec"><h2>${t}</h2></div><div class="grid">${l.map(card).join("")}</div>`:"";
function render(){
  $("#cats").innerHTML=cats.map(c=>`<button class="cat ${c==cat?"on":""}" onclick="cat='${c}';q='';$('#q').value='';render()"><i>${ICON[c]||"🛍️"}</i>${c}</button>`).join("");
  const s=norm(q.trim()),by=[...P].sort((a,b)=>a.p-b.p);
  $("#hero").style.display=$(".ben").style.display=(s||cat!="Todas")?"none":"";
  if(s||cat!="Todas"){const l=P.filter(p=>(cat=="Todas"||p.c==cat)&&(!s||norm(p.n+" "+p.c+" "+p.k).includes(s)));
    $("#list").innerHTML=l.length?sec(s?`Resultados para “${q}”`:cat,l):'<p style="text-align:center;padding:40px 0">😕 No encontramos eso. Prueba con otra palabra.</p>';return}
  const fl=[...P].sort((a,b)=>b.pct-a.pct).slice(0,8);
  $("#list").innerHTML=`<div class="flash"><div class="h">⚡ Ofertas relámpago <span id="cd">--:--:--</span></div><div class="hs">${fl.map(card).join("")}</div></div>`+
  TILES+sec("Más vendidos",[...P].sort((a,b)=>b.sold-a.sold).slice(0,4))+sec("Los más baratos",by.slice(0,4))+cats.slice(1).map(c=>sec(`${ICON[c]} ${c}`,P.filter(p=>p.c==c))).join("")+WHY;tick()}
function tick(){const e=$("#cd");if(!e)return;const n=new Date,m=new Date(n);m.setHours(24,0,0,0);const s=Math.floor((m-n)/1e3);e.textContent=[s/3600,s/60%60,s%60].map(v=>String(Math.floor(v)).padStart(2,0)).join(":")}
setInterval(tick,1e3);
let si=0;$("#hero").innerHTML=SL.map((s,i)=>`<div class="sl ${i?"":"on"}" style="background:${s[3]}"><b>${s[0]}</b><span>${s[1]}</span><div class="stk">HASTA<br><b>-${[50,40,35][i]}%</b></div><button onclick="cat='${s[4]}';render();scrollTo(0,0)">Ver ofertas</button><em>${s[2]}</em></div>`).join("")+`<div class="dots">${SL.map((_,i)=>`<s class="${i?"":"on"}"></s>`).join("")}</div>`;
setInterval(()=>{si=(si+1)%SL.length;document.querySelectorAll(".sl").forEach((e,i)=>e.classList.toggle("on",i==si));document.querySelectorAll(".dots s").forEach((e,i)=>e.classList.toggle("on",i==si))},4000);
function add(id,n=1){cart[id]=(cart[id]||0)+n;save();toast("✅ Agregado al carrito")}
function openP(id){const p=P[id];$("#mo").classList.add("open");$("#modal").innerHTML=`<img class="big" id="big" src="${p.imgs[0]}" alt="" data-k="0" onerror="fb(this,${id},this.dataset.k)"><div class="th">${p.imgs.map((u,k)=>`<img class="${k?"":"on"}" src="${u}" onerror="fb(this,${id},${k})" onclick="setBig(${id},${k})">`).join("")}</div>
  <h3 style="margin:6px 0">${p.n}</h3><span class="st"><b>★</b> ${p.r} · ${p.sold} vendidos</span><div class="pr" style="font-size:28px">${money(p.p)}<span class="old">${money(p.old)}</span> <span class="bd" style="position:static">-${p.pct}%</span></div>
  <p style="font-size:14px">${p.d}</p><button class="btn" onclick="add(${id});$('#mo').classList.remove('open');openCart()">Agregar al carrito</button><button class="btn g" style="margin-top:8px" onclick="$('#mo').classList.remove('open')">Seguir viendo</button>`}
function openCart(){$("#drawer").classList.add("open");panel()}
function panel(){$("#drawer").classList.remove("pg");const ids=Object.keys(cart),t=total();
  if(!ids.length){$("#panel").innerHTML='<h2>Tu carrito</h2><p>Está vacío 🛒</p><button class="btn" onclick="closeAll()">Seguir comprando</button>';return}
  const f=Math.max(GRATIS-t,0);
  $("#panel").innerHTML=`<h2 style="margin-top:0">Tu carrito</h2><div class="bar"><i style="width:${Math.min(t/GRATIS*100,100)}%"></i></div><p style="font-size:13px;margin:0 0 8px">${f?`Te faltan <b>${money(f)}</b> para envío GRATIS 🚚`:"🎉 ¡Tienes envío GRATIS!"}</p>`+
  ids.map(i=>`<div class="row"><img src="${P[i].imgs[0]}" alt="" onerror="fb(this,${i},0)"><span>${P[i].n}<br><b>${money(P[i].p*cart[i])}</b></span><span class="q"><button onclick="qty(${i},-1)">−</button> ${cart[i]} <button onclick="qty(${i},1)">+</button></span></div>`).join("")+
  `<p style="font-size:20px"><b>Total: ${money(t)}</b></p><button class="btn" onclick="checkout()">Ir a pagar</button><button class="btn g" style="margin-top:8px" onclick="closeAll()">Seguir comprando</button>`}
function qty(i,d){cart[i]+=d;if(cart[i]<1)delete cart[i];save();panel()}
const closeAll=()=>document.querySelectorAll(".ov").forEach(e=>e.classList.remove("open","pg"));
let draft={};
const hd=n=>{$("#drawer").classList.add("pg");$("#drawer").scrollTop=0;return `<div class="ckh"><div class="t"><button class="bk" onclick="${n==1?"panel()":"closeAll()"}" aria-label="Volver">←</button><img src="${$("header img").src}" alt=""><span style="margin-left:auto;font-size:13px">🔒 Pago seguro</span></div><div class="sp3">${["Datos","Pago","Listo"].map((x,i)=>`<div class="${i<n?"on":""}"><i>${i<n-1?"✓":i+1}</i>${x}</div>`).join("<hr>")}</div></div>`};
const cp=t=>{navigator.clipboard?.writeText(t);toast("📋 Copiado")};
const pv=i=>{const f=i.files[0],p=$("#pvw");if(f){p.src=URL.createObjectURL(f);p.style.display="block"}};
function confetti(){for(let i=0;i<36;i++){const e=document.createElement("i");e.className="cf";e.textContent=["🎉","✨","🧡","💜","⭐"][i%5];e.style.cssText=`left:${Math.random()*100}vw;animation-delay:${Math.random()*.8}s;font-size:${16+Math.random()*16}px`;document.body.appendChild(e);setTimeout(()=>e.remove(),3600)}}
function checkout(){const t=total(),d=draft,ids=Object.keys(cart),
  fi=(n,ic,l,x="")=>`<label class="fl"><span>${ic} ${l}</span><input class="f" name="${n}" value="${d[n]||""}" ${x}></label>`,
  pmo=(v,ic,t2,off)=>`<label class="pmo ${off?"off":""}"><input type="radio" name="m" value="${v}" ${v==(d.m||"Yape")&&!off?"checked":""} ${off?"disabled":""}><b>${ic} ${v}</b><small>${t2}</small></label>`;
  $("#panel").innerHTML=hd(1)+`<form id="cf" novalidate onsubmit="pedido(event)" class="cw">
  <div class="cd"><h3>📍 ¿Dónde te lo enviamos?</h3>${fi("nombre","👤","Nombre completo",'autocomplete="name"')}
  <div class="two">${fi("dni","🪪","DNI",'pattern="\\d{8}" maxlength="8" inputmode="numeric" placeholder="8 dígitos" title="8 dígitos"')}${fi("cel","📱","Celular",'pattern="9\\d{8}" maxlength="9" inputmode="numeric" placeholder="9 dígitos" title="9 dígitos, empieza con 9"')}</div>
  ${fi("dir","🏠","Dirección y referencia")}${fi("dis","📌","Distrito")}</div>
  <div class="cd"><h3>💳 Elige cómo pagar</h3><div class="pm2">${pmo("Yape","💜","Pago inmediato con QR")}${pmo("Plin","💙","Pago inmediato con QR")}${pmo("Tarjeta","💳",TARJETA_URL?"Crédito o débito":"Próximamente",!TARJETA_URL)}</div><p class="hint">🔒 Pagas ahora, antes del envío. No es contraentrega.</p></div>
  <div class="cd"><h3>🛍️ Tu pedido (${ids.length})</h3>${ids.map(i=>`<div class="row"><img src="${P[i].imgs[0]}" alt="" onerror="fb(this,${i},0)"><span>${P[i].n}<br><small>${cart[i]} × ${money(P[i].p)}</small></span><b>${money(P[i].p*cart[i])}</b></div>`).join("")}
  <div class="tt"><span>Envío</span><b>${t>=GRATIS?"GRATIS 🎉":"Se coordina contigo"}</b></div><div class="tt big"><span>Total</span><b>${money(t)}</b></div></div></form>
  <div class="pbar"><div><small>Total</small><b>${money(t)}</b></div><button class="btn" form="cf">Pagar ahora</button></div>`}
const ORD=()=>JSON.parse(localStorage.getItem("mk_orders")||"{}");
function sv(o){const a=ORD();a[o.code]=o;localStorage.setItem("mk_orders",JSON.stringify(a))}
function vld(f){const E={};
  if(f.nombre.trim().length<3)E.nombre="Escribe tu nombre completo";
  if(!/^\d{8}$/.test(f.dni))E.dni="El DNI tiene 8 números";
  if(!/^9\d{8}$/.test(f.cel))E.cel="El celular tiene 9 números y empieza con 9";
  if(f.dir.trim().length<5)E.dir="Escribe tu dirección";
  if(!f.dis.trim())E.dis="Escribe tu distrito";
  document.querySelectorAll(".er").forEach(e=>e.remove());document.querySelectorAll(".bad").forEach(e=>e.classList.remove("bad"));
  for(const k in E){const i=document.querySelector(`[name=${k}]`);i.classList.add("bad");i.insertAdjacentHTML("afterend",`<small class="er">${E[k]}</small>`)}
  const k=Object.keys(E)[0];if(k){const i=document.querySelector(`[name=${k}]`);i.scrollIntoView({block:"center",behavior:"smooth"});i.focus({preventScroll:true});toast("⚠️ Revisa los datos marcados")}
  return !k}
async function pedido(e){e.preventDefault();const f=Object.fromEntries(new FormData(e.target)),btn=document.querySelector(".pbar .btn");draft=f;if(!vld(f))return;btn.disabled=true;
  const items=Object.entries(cart).map(([i,n])=>({n:P[i].n,q:n,p:P[i].p}));
  const o={code:"MK-"+Math.random().toString(36).slice(2,8).toUpperCase(),...f,metodo:f.m,total:Math.round(total()*100)/100,estado:"pendiente_pago",fecha:new Date().toISOString(),items};
  if(SUPABASE_URL&&f.m!="Tarjeta"){try{const r=await rpc("crear_pedido",{p:{nombre:f.nombre,dni:f.dni,cel:f.cel,dir:f.dir,dis:f.dis,metodo:f.m,items:items.map(x=>({n:x.n,q:x.q}))}});o.code=r.codigo;o.total=r.total}catch(x){alert("No se pudo crear el pedido: "+x.message);btn.disabled=false;return}}
  sv(o);cart={};save();if(f.m=="Tarjeta"){location.href=TARJETA_URL+(TARJETA_URL.includes("?")?"&":"?")+"ref="+o.code;return}payView(o.code)}
const qrfb=()=>"data:image/svg+xml;charset=utf-8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#eee"/><text x="100" y="95" text-anchor="middle" font-size="13">Tu QR va en</text><text x="100" y="115" text-anchor="middle" font-size="13">imagenes/qr-yape.png</text></svg>');
function payView(c){const o=ORD()[c],n=o.metodo=="Plin"?PLIN:YAPE,col=o.metodo=="Plin"?"#1e88e5":"#7b2cbf";
  $("#panel").innerHTML=hd(2)+`<div class="cw"><div class="amt" style="background:linear-gradient(135deg,${col},#e8267a)"><small>Paga exactamente</small><b>${money(o.total)}</b><span>con ${o.metodo} · Pedido <u onclick="cp('${o.code}')">${o.code} 📋</u></span></div>
  <div class="cd" style="text-align:center"><img src="imagenes/qr-${o.metodo.toLowerCase()}.png" alt="QR ${o.metodo}" style="width:210px;border-radius:14px" onerror="this.onerror=null;this.src=qrfb()"><p style="margin:6px 0 0">o ${o.metodo} al número</p><p class="num" onclick="cp('${n}')">${n} 📋</p><small>${TITULAR}</small>
  <ol class="how"><li>Abre ${o.metodo} y escanea el QR</li><li>Escribe <b>${o.code}</b> en el mensaje</li><li>Sube aquí tu captura</li></ol></div>
  <form class="cd" novalidate onsubmit="proof(event,'${c}')"><h3>📸 Ya pagué</h3><label class="fl"><span>N.º de operación</span><input class="f" name="op" maxlength="20"></label><label class="fl"><span>Captura del pago</span><input class="f" type="file" name="img" accept="image/*" onchange="pv(this)"></label><img id="pvw" alt="" style="display:none;width:100%;border-radius:12px;margin-top:8px"><button class="btn" style="margin-top:12px">Enviar comprobante</button></form></div>`}
function shrink(file,cb){const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const k=Math.min(1,800/i.width),c=document.createElement("canvas");c.width=i.width*k;c.height=i.height*k;c.getContext("2d").drawImage(i,0,0,c.width,c.height);cb(c.toDataURL("image/jpeg",.7))};i.src=r.result};r.readAsDataURL(file)}
function proof(e,c){e.preventDefault();const fd=new FormData(e.target),btn=e.target.querySelector(".btn"),fl=fd.get("img");if(!fl||!fl.size||!/^[A-Za-z0-9-]{4,20}$/.test(String(fd.get("op")).trim())){toast("⚠️ Escribe el n.º de operación y sube la captura");return}btn.disabled=true;btn.textContent="Enviando…";
  shrink(fd.get("img"),async u=>{try{if(SUPABASE_URL)await rpc("enviar_comprobante",{p_codigo:c,p_op:fd.get("op"),p_img:u})}catch(x){alert("No se pudo enviar: "+x.message);btn.disabled=false;btn.textContent="Enviar comprobante";return}
    const o=ORD()[c];o.op=fd.get("op");o.comp=u;o.estado="por_verificar";sv(o);doneView(c)})}
function track(){$("#drawer").classList.remove("pg");$("#drawer").classList.add("open");$("#panel").innerHTML=`<h2 style="margin-top:0">Seguir mi pedido</h2><form onsubmit="event.preventDefault();doneView(this.c.value)"><label>Código de pedido<input class="f" name="c" required placeholder="MK-ABC123"></label><button class="btn" style="margin-top:12px">Buscar</button></form>`}
async function doneView(c){c=c.trim().toUpperCase();let o=ORD()[c];
  if(SUPABASE_URL){try{const r=await rpc("ver_pedido",{p_codigo:c});if(r){o={...(o||{}),code:c,estado:r.estado,metodo:r.metodo,total:r.total,items:r.items.map(x=>({n:x.nombre,q:x.cantidad}))};sv(o)}}catch{}}
  if(!o){track();$("#panel").insertAdjacentHTML("beforeend",'<p style="color:#c00">No encontramos ese pedido en este dispositivo.</p>');return}
  const S=[["pendiente_pago","Pendiente de pago"],["por_verificar","Verificando tu pago"],["pagado","Pago confirmado"],["enviado","Enviado"],["entregado","Entregado"]],i=S.findIndex(x=>x[0]==o.estado),pend=o.estado=="pendiente_pago"||o.estado=="rechazado";
  $("#panel").innerHTML=hd(3)+`<div class="cw"><div class="cd"><div class="ok">${o.estado=="por_verificar"?"✅":"📦"}</div><h2 style="margin:0 0 6px;text-align:center">${o.estado=="por_verificar"?"¡Pedido recibido!":"Pedido "+o.code}</h2><p>Código: <b>${o.code}</b> · ${o.metodo} · <b>${money(o.total)}</b></p>`+
  (o.estado=="rechazado"?'<p style="color:#c00">No pudimos verificar tu pago. Envía otro comprobante.</p>':S.map((x,k)=>`<div class="stp ${k<=i?"on":""}">${k<=i?"●":"○"} ${x[1]}</div>`).join(""))+
  `<div style="font-size:13px;margin:10px 0">${o.items.map(x=>`${x.q} × ${x.n}`).join("<br>")}</div>`+
  (pend?`<button class="btn" onclick="payView('${o.code}')">Pagar ahora</button>`:"")+`<button class="btn g" style="margin-top:8px" onclick="closeAll()">Seguir comprando</button></div></div>`;if(o.estado=="por_verificar")confetti()}
$("#q").oninput=e=>{q=e.target.value;cat="Todas";render()};$("#cartbtn").onclick=openCart;
["drawer","mo"].forEach(id=>$("#"+id).onclick=e=>{if(e.target.id==id&&!e.target.classList.contains("pg"))closeAll()});
$("#wa").href="https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent("Hola Mil Kositas, tengo una consulta");$("#fy").textContent=YAPE;$("#fw").textContent="+"+WHATSAPP;
render();save();
</script></body></html>