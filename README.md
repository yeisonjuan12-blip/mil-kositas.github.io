# Mil Kositas 🧡

Tienda online de "mil cositas a buen precio": útiles, hogar, belleza, tecnología, moda y juguetes.
Hecha con HTML, CSS y JavaScript sin dependencias de servidor. Lista para publicar en GitHub Pages.

## ✨ Qué incluye

- Catálogo de 20 productos con fotos, búsqueda y filtros por categoría.
- Carrito con cantidades, subtotal, envío y envío gratis desde S/ 99.
- Checkout en 3 pasos: datos → pago → listo.
- Pago con **Yape**, **Plin** y link de **tarjeta** (opcional).
- Código QR generado automáticamente con el número de cobro.
- Subida de comprobante (se comprime en el navegador).
- Seguimiento de pedido por código.
- Envío del pedido por WhatsApp con todo el detalle.
- Diseño responsive (celular, tablet y desktop).
- Datos guardados en `localStorage`; integración opcional con Supabase.

## 🚀 Publicar en GitHub Pages

1. Crea un repositorio llamado `mil-kositas`.
2. Sube el contenido de esta carpeta a la rama `main`.
3. En GitHub ve a **Settings → Pages**.
4. En *Source* elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
5. Guarda y espera un minuto. La web queda en:
   `https://TU-USUARIO.github.io/mil-kositas/`

No necesitas build ni instalar nada.

## ⚙️ Configurar la tienda

Abre `assets/app.js` y edita el objeto `CONFIG` (está al inicio del archivo):

```js
const CONFIG = {
  whatsapp: "51999999999",   // WhatsApp con código de país (51 para Perú)
  holder: "Freisy",          // titular de Yape / Plin
  yape: "999999999",         // número de Yape
  plin: "999999999",         // número de Plin
  freeShippingFrom: 99,      // envío gratis desde S/ 99
  shippingCost: 8,           // costo de envío
  deliveryTime: "24 a 48 horas",
  cardUrl: "",               // link de pago (Culqi, Izipay, Mercado Pago)
  qrYape: "imagenes/qr-yape.png",
  qrPlin: "imagenes/qr-plin.png",
  supabaseUrl: "",
  supabaseKey: ""
};
```

### QR de Yape y Plin

El sitio genera un QR de respaldo con el número de cobro. Para usar tu **QR oficial**:

1. Guarda tu QR de Yape como `imagenes/qr-yape.png`.
2. Guarda tu QR de Plin como `imagenes/qr-plin.png`.
3. Listo: se muestran automáticamente en el paso de pago.

### Pago con tarjeta

Crea un link de pago en Culqi, Izipay o Mercado Pago y pégalo en `cardUrl`.
Si lo dejas vacío, la opción aparece como "Próximamente".

### Supabase (opcional)

Si quieres que los pedidos y comprobantes lleguen a una base de datos:

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Crea las funciones `crear_pedido`, `enviar_comprobante` y `ver_pedido`.
3. Pega la URL del proyecto y la clave `anon public` en `supabaseUrl` y `supabaseKey`.

Sin Supabase, los pedidos se guardan en el dispositivo del cliente y se pueden enviar
por WhatsApp con el botón **"Enviar mi pedido por WhatsApp"**.

## 📁 Estructura

```
index.html              Página principal
creditos.html           Créditos de las fotos
assets/styles.css       Estilos
assets/app.js           Lógica de la tienda (configuración aquí)
assets/qrcode.min.js    Generador de QR local
imagenes/1.jpg … 20.jpg Fotos de los productos
imagenes/logo.png       Logo
imagenes/qr-yape.png    (opcional) QR oficial de Yape
imagenes/qr-plin.png    (opcional) QR oficial de Plin
```

## 🖼️ Fotos

Las fotos son de Wikimedia Commons, con licencias libres, y se usan como referencia.
Los autores y licencias están listados en `creditos.html`.
Si tienes fotos propias, reemplaza `imagenes/1.jpg` … `imagenes/20.jpg` manteniendo los nombres.

## 🧪 Probar en local

Abre `index.html` en el navegador o levanta un servidor:

```bash
npx serve .
```

## 📄 Licencia

Código libre para uso personal de Mil Kositas. Las fotos conservan la licencia de sus autores
(ver `creditos.html`).
