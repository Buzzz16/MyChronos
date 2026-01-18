Add-Type -AssemblyName System.Drawing

$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)
$outputDir = "public"

foreach ($size in $sizes) {
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Create gradient brush
    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $colorBlue = [System.Drawing.Color]::FromArgb(59, 130, 246)
    $colorPurple = [System.Drawing.Color]::FromArgb(139, 92, 246)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $colorBlue, $colorPurple, 45)
    
    # Fill background with gradient
    $graphics.FillRectangle($brush, $rect)
    
    # Draw clock circle
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, ($size / 20))
    $clockSize = $size * 0.7
    $clockX = ($size - $clockSize) / 2
    $clockY = ($size - $clockSize) / 2
    $graphics.DrawEllipse($pen, $clockX, $clockY, $clockSize, $clockSize)
    
    # Draw clock hands
    $centerX = $size / 2
    $centerY = $size / 2
    $handPen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, ($size / 25))
    $handPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $handPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    
    # Hour hand (pointing up)
    $graphics.DrawLine($handPen, $centerX, $centerY, $centerX, $centerY - $clockSize/4)
    
    # Minute hand (pointing right)
    $graphics.DrawLine($handPen, $centerX, $centerY, $centerX + $clockSize/3, $centerY)
    
    # Center dot
    $dotSize = $size / 15
    $graphics.FillEllipse([System.Drawing.Brushes]::White, $centerX - $dotSize/2, $centerY - $dotSize/2, $dotSize, $dotSize)
    
    # Save PNG
    $outputPath = Join-Path $outputDir "icon-$size.png"
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    Write-Host "Created: $outputPath"
    
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
    $pen.Dispose()
    $handPen.Dispose()
}

Write-Host "`nAll icons generated successfully!" -ForegroundColor Green
