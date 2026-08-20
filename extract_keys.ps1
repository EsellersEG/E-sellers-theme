$files = Get-ChildItem -Path "c:\Yahia\E-sellers\THEME BUILDER\sections\*.liquid"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $allMatches = [regex]::Matches($content, '"t:([^"]+)"')
    foreach ($m in $allMatches) {
        Write-Host "$($file.Name): $($m.Groups[1].Value)"
    }
}
