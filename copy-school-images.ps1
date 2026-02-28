# Copy school images from Downloads to public/images

$sourceDir = ".."
$destDir = "public\images"

# Create destination directory if it doesn't exist
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force
}

# Copy images with proper naming
Copy-Item "$sourceDir\bagalkot-school-img.jpg.jpeg" "$destDir\bagalkot.jpg" -Force
Copy-Item "$sourceDir\bellari-school-img.jpg.jpeg" "$destDir\ballari.jpg" -Force
Copy-Item "$sourceDir\bhadravati-school-img.jpg.jpeg" "$destDir\bhadravati.jpg" -Force
Copy-Item "$sourceDir\hubballi-school-img.jpg.jpeg" "$destDir\hubballi.jpg" -Force
Copy-Item "$sourceDir\kalaburgi-school-img.jpg.jpeg" "$destDir\kalburgi.jpg" -Force
Copy-Item "$sourceDir\mangalore-school-img.jpg.jpeg" "$destDir\mangalore.jpg" -Force

Write-Host "✅ All school images copied successfully!"
Write-Host "Images are now in: $destDir"
