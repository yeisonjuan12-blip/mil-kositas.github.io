Add-Type -AssemblyName System.Drawing
$root = "C:\Users\yeto\mil-kositas"
$sel = @{
  1  = "imagenes\cand2\1-4.jpg"
  2  = "imagenes\cand2\2-0.jpg"
  3  = "imagenes\cand2\3-3.jpg"
  4  = "imagenes\cand2\4-2.jpg"
  5  = "imagenes\cand3\5-3.jpg"
  6  = "imagenes\cand3\6-1.jpg"
  7  = "imagenes\cand3\7-0.jpg"
  8  = "imagenes\cand2\8-5.jpg"
  9  = "imagenes\cand3\9-0.jpg"
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
  20 = "imagenes\cand2\20-0.jpg"
}
$cell = 230; $cols = 4; $rows = 5
$bmp = New-Object System.Drawing.Bitmap(($cols*$cell+20), ($rows*($cell+30)+10))
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(255,246,238))
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
for ($i = 1; $i -le 20; $i++) {
  $col = ($i - 1) % $cols; $row = [math]::Floor(($i - 1) / $cols)
  $x = 10 + $col * $cell; $y = 10 + $row * ($cell + 30)
  $img = [System.Drawing.Image]::FromFile((Join-Path $root $sel[$i]))
  $s = [math]::Min($cell / $img.Width, $cell / $img.Height)
  $dw = [int]($img.Width * $s); $dh = [int]($img.Height * $s)
  $g.DrawImage($img, ($x + ($cell - $dw) / 2), ($y + ($cell - $dh) / 2), $dw, $dh)
  $g.DrawRectangle([System.Drawing.Pens]::White, $x, $y, $cell, $cell)
  $g.DrawString("$i  ($($sel[$i].Split('\')[-1]))", $font, [System.Drawing.Brushes]::Black, $x, $y + $cell + 6)
  $img.Dispose()
}
$g.Dispose()
$path = Join-Path $root "_dev\seleccion.png"
$bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output $path
