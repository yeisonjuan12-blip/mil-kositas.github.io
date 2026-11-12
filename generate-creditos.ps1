Add-Type -AssemblyName System.Drawing

$root = "C:\Users\yeto\mil-kositas"
$names = @(
  "Cartuchera de tela con cierre",
  "Set de 24 lápices de colores",
  "Cuaderno universitario x3",
  "Kit de resaltadores pastel x6",
  "Organizador de cocina 3 niveles",
  "Set de 6 tápers herméticos",
  "Lámpara LED de escritorio",
  "Cesta organizadora plegable",
  "Sérum de vitamina C 30 ml",
  "Set de 12 brochas de maquillaje",
  "Crema hidratante corporal",
  "Esmaltes de uñas pack x10",
  "Audífonos bluetooth TWS",
  "Cargador rápido 20W USB-C",
  "Parlante portátil mini",
  "Mouse inalámbrico silencioso",
  "Mochila urbana impermeable",
  "Pack de 5 pares de medias",
  "Bloques de construcción 500 pzs",
  "Rompecabezas 1000 piezas"
)
$sel = @{
  1  = "imagenes\cand2\1-4.jpg"
  2  = "imagenes\cand2\2-0.jpg"
  3  = "imagenes\cand2\3-3.jpg"
  4  = "imagenes\cand2\4-2.jpg"
  5  = "imagenes\cand3\5-3.jpg"
  6  = "imagenes\cand4\6-0.jpg"
  7  = "imagenes\cand3\7-0.jpg"
  8  = "imagenes\cand2\8-5.jpg"
  9  = "imagenes\cand5\9-1.jpg"
  10 = "imagenes\cand2\10-1.jpg"
  11 = "imagenes\cand3\11-0.jpg"
  12 = "imagenes\cand2\12-0.jpg"
  13 = "imagenes\cand2\13-3.jpg"
  14 = "imagenes\cand2\14-2.jpg"
  15 = "imagenes\cand2\15-2.jpg"
  16 = "imagenes\cand2\16-5.jpg"
  17 = "imagenes\cand2\17-5.jpg"
  18 = "imagenes\cand2\18-2.jpg"
  19 = "imagenes\cand2\19-1.jpg"
  20 = "imagenes\cand2\20-3.jpg"
}

$meta = @()
foreach ($f in @("cand2", "cand3", "cand4", "cand5")) {
  $meta += Get-Content (Join-Path $root "imagenes\$f\meta.json") -Raw | ConvertFrom-Json
}

function HtmlEnc([string]$s) {
  if ($null -eq $s) { return "" }
  return $s.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace('"', "&quot;")
}

$cards = ""
for ($i = 1; $i -le 20; $i++) {
  $key = ($sel[$i] -replace '/', '\')
  $m = $meta | Where-Object { ($_.file -replace '/', '\') -eq $key } | Select-Object -First 1
  if (-not $m) { Write-Warning "Sin metadatos para $($sel[$i])"; continue }
  $title = $m.title -replace '^File:', ''
  $cards += @"
      <article class="credit">
        <img src="imagenes/$i.jpg" alt="$(HtmlEnc($names[$i - 1]))" loading="lazy" width="240" height="240">
        <div class="credit-body">
          <span class="credit-num">Producto $i</span>
          <h2>$(HtmlEnc($names[$i - 1]))</h2>
          <p class="credit-file">$(HtmlEnc($title))</p>
          <p>Foto: <b>$(HtmlEnc($m.artist))</b></p>
          <p>Licencia: <b>$(HtmlEnc($m.license))</b></p>
          <a href="$(HtmlEnc($m.page))" target="_blank" rel="noopener">Ver la ficha original en Wikimedia Commons →</a>
        </div>
      </article>
"@
}

$html = @"
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#fc6701">
<title>Créditos de las fotos — Mil Kositas</title>
<meta name="robots" content="noindex">
<link rel="icon" href="imagenes/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/styles.css">
<style>
  .credits-head{padding:34px 0 8px;text-align:center}
  .credits-head h1{font-family:"Fredoka",sans-serif;font-size:clamp(28px,5vw,44px);margin:14px 0 8px;color:var(--ink)}
  .credits-head p{max-width:720px;margin:0 auto;color:var(--muted);line-height:1.6}
  .credits-head .back{display:inline-block;margin:18px 0 0;font-weight:800;color:var(--od)}
  .credits-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;margin:26px 0 50px}
  .credit{background:#fff;border:1px solid var(--line);border-radius:20px;overflow:hidden;box-shadow:0 10px 26px rgba(60,20,80,.06);display:flex;flex-direction:column}
  .credit img{width:100%;height:auto;aspect-ratio:1;object-fit:cover;display:block}
  .credit-body{padding:14px 16px 18px;font-size:14px;line-height:1.5}
  .credit-num{display:inline-block;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--p)}
  .credit-body h2{font-family:"Fredoka",sans-serif;font-size:17px;margin:4px 0 8px;color:var(--ink)}
  .credit-file{color:var(--muted);font-size:12.5px;margin:0 0 8px}
  .credit-body p{margin:2px 0}
  .credit-body a{display:inline-block;margin-top:8px;font-weight:800;font-size:13px;color:var(--od)}
  .note{background:#fff6e9;border:1px solid #ffdfb5;border-radius:16px;padding:14px 18px;font-size:14px;color:#6b4b2a;margin-bottom:8px}
</style>
</head>
<body>

<header class="site-header">
  <a class="brand" href="index.html" aria-label="Mil Kositas, volver a la tienda"><img src="imagenes/logo.png" alt="Mil Kositas by Freisy"></a>
</header>

<main class="wrap">
  <div class="credits-head">
    <h1>Créditos de las fotos</h1>
    <p>Todas las imágenes de producto se obtuvieron de <b>Wikimedia Commons</b> y se usan con licencias libres. Cada foto conserva su autoría y licencia; si eres autor y quieres que retiremos una imagen, escríbenos y la cambiamos.</p>
    <a class="back" href="index.html">← Volver a la tienda</a>
  </div>

  <div class="note">Las fotos son <b>ilustrativas</b>: muestran el tipo de producto y pueden variar en color, empaque o presentación respecto al artículo real.</div>

  <div class="credits-grid">
$cards
  </div>
</main>

<footer>
  <div class="fbot" style="border:0">
    <span>© <span id="year"></span> Mil Kositas by Freisy</span>
    <span><a href="index.html">Tienda</a></span>
  </div>
</footer>

<script>document.getElementById("year").textContent = new Date().getFullYear();</script>
</body>
</html>
"@

$out = Join-Path $root "creditos.html"
[System.IO.File]::WriteAllText($out, $html, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "OK -> $out ($([math]::Round((Get-Item $out).Length/1KB,1)) KB)"
