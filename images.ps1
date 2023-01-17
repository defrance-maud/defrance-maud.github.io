$path = '.\content\recettes\'

Clear-Host

$maxWidth = 680
$knownExt = @('.jpg', '.jpeg', '.png')

Add-Type -AssemblyName 'System.Drawing'

$unknown = [System.Collections.ArrayList]::new()
$big = [System.Collections.ArrayList]::new()
$incorrect = [System.Collections.ArrayList]::new()

$items = Get-ChildItem -Path $path -Exclude '*.md' -File -Recurse
$items | %{
    $item = $_
    $ext = $item.Extension.ToLowerInvariant()
    if(-not $knownExt.Contains($ext)) {
        $unknown.Add($item) | Out-Null
    } else {
        $image = [System.Drawing.Image]::FromFile($item.FullName)
        $data = New-Object PSObject -Property @{
	        height = $image.Height
		    width = $image.Width
		    megapixels = ($image.Height * $image.Width)/1000/1000
		    megabytes = [Math]::Round((($_.Length)/1024)/1024, 2)
		    name = $_.Name
		    fullname = $_.Fullname
		    date = $_.LastWriteTime
        }

        if($data.width -gt $maxWidth) {
            $newHeight = $data.height * ($maxWidth / $data.width)
            $bmp = [System.Drawing.Bitmap]::new($maxWidth, $newHeight)
            $g = [System.Drawing.Graphics]::FromImage($bmp)
            $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.DrawImage($image, 0, 0, $maxWidth, $newHeight)
            $g.Dispose()

            $copy = $bmp.Clone()
            $bmp.Dispose()
            $image.Dispose()
            $copy.Save($data.fullname, [System.Drawing.Imaging.ImageFormat]::Jpeg)
            $copy.Dispose()
            
            $big.Add($data) | Out-Null
        } elseif($data.width -lt $data.height) {
            $incorrect.Add($data) | Out-Null
        }
    }
}

if($big.Count -gt 0) {
    Write-Host 'Big images:'
    $big | Format-Table -Property height,width,megabytes,fullname
}

if($incorrect.Count -gt 0) {
    Write-Host 'Incorrect images:'
    $incorrect | Format-Table -Property height,width,megabytes,fullname
}

if($unknown.Count -gt 0) {
    Write-Host 'Unkown extensions:'
    $unknown | Format-Table -Property Name,Directory
}
