$filePath = "c:\Users\sreec\Documents\CareBridgeAI\CareBridge_AI_Presentation.pptx"
$tempPath = "c:\Users\sreec\Documents\CareBridgeAI\CareBridge_AI_Presentation_anim.pptx"

# Ensure no existing PPT processes
Get-Process -Name POWERPNT -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Milliseconds 500

Write-Host "Opening PowerPoint Application via COM..."
$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = [Microsoft.Office.Core.MsoTriState]::msoTrue

$pres = $ppt.Presentations.Open($filePath, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoTrue)
Write-Host "Opened presentation: $($pres.Name) with $($pres.Slides.Count) slides."

# 7 Transitions:
# ppEffectFadeSmoothly = 3849, ppEffectPushLeft = 3853, ppEffectPushUp = 3855, ppEffectWipeRight = 2819
$transitions = @(
    3849, # Slide 1: Fade Smoothly (Executive Cover)
    3853, # Slide 2: Push Left (1. Problem Statement)
    3855, # Slide 3: Push Up (2. Proposed Solution)
    2819, # Slide 4: Wipe Right (3. Key Features - Part 1)
    3853, # Slide 5: Push Left (3. Key Features - Part 2)
    3855, # Slide 6: Push Up (4. Implementation Approach)
    3849  # Slide 7: Fade Smoothly (Conclusion & Thank You)
)

for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $slide = $pres.Slides.Item($i)
    
    # 1. Apply Slide Transition
    $transId = $transitions[$i - 1]
    try {
        $slide.SlideShowTransition.EntryEffect = $transId
        $slide.SlideShowTransition.Duration = 0.8
    } catch {
        Write-Warning "Could not set transition $transId on slide $i"
    }

    # 2. Configure Shape Animations
    $seq = $slide.TimeLine.MainSequence
    
    # Clear any pre-existing animations
    while ($seq.Count -gt 0) {
        $seq.Item(1).Delete()
    }

    $shapeCount = $slide.Shapes.Count
    Write-Host "Slide $i has $shapeCount shapes. Applying animations..."

    # Shape 1 is dark background (skip)
    $delayAccumulator = 0.1

    if ($i -eq 1) {
        # Slide 1: Cover
        for ($s = 2; $s -le $shapeCount; $s++) {
            $shape = $slide.Shapes.Item($s)
            if ($s -eq 2) {
                # Hero container
                $effect = $seq.AddEffect($shape, 10, 0, 3) # msoAnimEffectFade, AfterPrevious
                $effect.Timing.Duration = 0.6
            } elseif ($s -eq 3) {
                # Top tag badge
                $effect = $seq.AddEffect($shape, 23, 0, 3) # msoAnimEffectZoom, AfterPrevious
                $effect.Timing.Duration = 0.4
            } elseif ($s -eq 4) {
                # Main hero text block
                $effect = $seq.AddEffect($shape, 30, 0, 3) # msoAnimEffectFloat, AfterPrevious
                $effect.Timing.Duration = 0.7
            } else {
                # Agenda cards
                $effect = $seq.AddEffect($shape, 2, 0, 2) # msoAnimEffectFly, WithPrevious
                $effect.Timing.Duration = 0.6
                $effect.Timing.TriggerDelayTime = $delayAccumulator
                $delayAccumulator += 0.15
            }
        }
    } elseif ($i -eq 7) {
        # Slide 7: Thank You Card
        for ($s = 2; $s -le $shapeCount; $s++) {
            $shape = $slide.Shapes.Item($s)
            if ($s -eq 2) {
                # Big Thank You Card
                $effect = $seq.AddEffect($shape, 10, 0, 3) # Fade
                $effect.Timing.Duration = 0.6
            } elseif ($s -eq 3) {
                # Thank you heading text
                $effect = $seq.AddEffect($shape, 23, 0, 3) # Zoom
                $effect.Timing.Duration = 0.6
            } elseif ($s -eq $shapeCount) {
                # "Open for Questions" closing text
                $effect = $seq.AddEffect($shape, 34, 0, 3) # Rise Up
                $effect.Timing.Duration = 0.5
            } else {
                # 3 takeaway pillar cards
                $effect = $seq.AddEffect($shape, 2, 0, 2) # Fly in
                $effect.Timing.Duration = 0.55
                $effect.Timing.TriggerDelayTime = $delayAccumulator
                $delayAccumulator += 0.2
            }
        }
    } else {
        # Standard Slides (2 to 6)
        for ($s = 2; $s -le $shapeCount; $s++) {
            $shape = $slide.Shapes.Item($s)
            if ($s -le 3) {
                # Header tag and title
                $effect = $seq.AddEffect($shape, 10, 0, 3) # Fade
                $effect.Timing.Duration = 0.4
            } elseif ($i -eq 3 -and $s -le 5) {
                # Slide 3 Top Banner
                $effect = $seq.AddEffect($shape, 30, 0, 3) # Float
                $effect.Timing.Duration = 0.5
            } elseif ($i -eq 2 -and $s -ge ($shapeCount - 1)) {
                # Slide 2 Bottom Critical Gap Banner
                $effect = $seq.AddEffect($shape, 23, 0, 3) # Zoom in
                $effect.Timing.Duration = 0.6
            } else {
                # Content cards / badges / text boxes
                $effect = $seq.AddEffect($shape, 2, 0, 2) # Fly in
                $effect.Timing.Duration = 0.55
                $effect.Timing.TriggerDelayTime = $delayAccumulator
                $delayAccumulator += 0.12
            }
        }
    }
}

# Save with SaveAs to avoid file lock
$pres.SaveAs($tempPath)
$pres.Close()
$ppt.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null
Start-Sleep -Milliseconds 600

# Overwrite target file
Move-Item -Path $tempPath -Destination $filePath -Force
Write-Host "All animations and transitions applied successfully to 7-slide CareBridge_AI_Presentation.pptx!"
