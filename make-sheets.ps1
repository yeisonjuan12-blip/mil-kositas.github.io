param(
    [string]$candDir = "imagenes\cand2",
    [string]$prefix = "sheet"
)
Add-Type -AssemblyName System.Drawing

$root = "C:\Users\yeto\mil-kositas"
$cand = Join-Path $root $candDir
$meta = Get-Content (Join-Path $cand "meta.json") -Raw | ConvertFrom-Json
$outDir = Join-Path $root "_dev"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$cell = 170
$labelW = 240
$rowsPerSheet = 5
$maxCols = 6
$fontName = "Segoe UI"

$groups = $meta | Group-Object product | Sort-Object { [int]$_.Name }

for ($s = 0; $s -lt [math]::Ceiling($groups.Count / $rowsPerSheet); $s++) {
    $chunk = $groups | Select-Object -Skip ($s * $rowsPerSheet) -First $rowsPerSheet
    $h = $chunk.Count * ($cell + 34) + 30
    $w = $labelW + $maxCols * $cell + 20
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::FromArgb(255, 246, 238))
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
    $titleFont = New-Object System.Drawing.Font($fontName, 13, [System.Drawing.FontStyle]::Bold)
    $smallFont = New-Object System.Drawing.Font($fontName, 9, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("Hoja $($s+1)", $titleFont, [System.Drawing.Brushes]::Black, 10, 6)

    $r = 0
    foreach ($grp in $chunk) {
        $y = 30 + $r * ($cell + 34)
        $name = $grp.Group[0].name
        $g.DrawString("$($grp.Name). $name", $titleFont, [System.Drawing.Brushes]::Black, 10, $y + 60, (New-Object System.Drawing.StringFormat))
        $c = 0
        foreach ($item in ($grp.Group | Sort-Object idx)) {
            if ($c -ge $maxCols) { break }
            $x = $labelW + $c * $cell
            try {
                $img = [System.Drawing.Image]::FromFile((Join-Path $root $item.file))
                $scale = [math]::Max($cell / $img.Width, $cell / $img.Height)
                $dw = [int]($img.Width * $scale); $dh = [int]($img.Height * $scale)
                $dx = $x + [int](($cell - $dw) / 2); $dy = $y + [int](($cell - $dh) / 2)
                $g.SetClip((New-Object System.Drawing.Rectangle($x, $y, $cell, $cell)))
                $g.DrawImage($img, $dx, $dy, $dw, $dh)
                $g.ResetClip()
                $img.Dispose()
            } catch {
                $g.FillRectangle([System.Drawing.Brushes]::LightGray, $x, $y, $cell, $cell)
            }
            $g.DrawRectangle([System.Drawing.Pens]::White, $x, $y, $cell - 1, $cell - 1)
            $tag = "$($grp.Name)-$($item.idx)"
            $g.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 0, 0, 0))), $x + 3, $y + 3, 46, 20)
            $g.DrawString($tag, $smallFont, [System.Drawing.Brushes]::White, $x + 6, $y + 5)
            $c++
        }
        $r++
    }
    $g.Dispose()
    $path = Join-Path $outDir "$prefix$($s+1).png"
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Output $path
}
