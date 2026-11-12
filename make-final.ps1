Add-Type -AssemblyName System.Drawing

$root = "C:\Users\yeto\mil-kositas"
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

$size = 800
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]88)

for ($i = 1; $i -le 20; $i++) {
  $src = Join-Path $root $sel[$i]
  $img = [System.Drawing.Image]::FromFile($src)
  $side = [math]::Min($img.Width, $img.Height)
  # recorte centrado con leve sesgo hacia arriba en retratos (mejor encuadre de producto)
  $sx = [int](($img.Width - $side) / 2)
  $sy = [int](($img.Height - $side) * 0.45)
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $size, $size)), $sx, $sy, $side, $side, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $img.Dispose()
  $out = Join-Path $root "imagenes\$i.jpg"
  $bmp.Save($out, $codec, $params)
  $bmp.Dispose()
  Write-Output "$i.jpg  <-  $($sel[$i])"
}
$params.Dispose()
