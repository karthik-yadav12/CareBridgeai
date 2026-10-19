$filePath = "c:\Users\sreec\Documents\CareBridgeAI\CareBridge_AI_Presentation.pptx"

Write-Host "Opening Microsoft PowerPoint application..."
$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = [Microsoft.Office.Core.MsoTriState]::msoTrue
$ppt.WindowState = 2 # ppWindowMaximized

$pres = $ppt.Presentations.Open($filePath)
Write-Host "Success: PowerPoint is now active and opened on screen with presentation:" $pres.Name
Write-Host "You can press F5 in PowerPoint to start the animated slideshow!"

