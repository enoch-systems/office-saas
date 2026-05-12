# Create Desktop Shortcut for Student Offline Database
# Right-click this file and select "Run with PowerShell"

$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$ProjectPath = "C:\Users\PC\Downloads\offline-saas"
$ShortcutPath = "$DesktopPath\Student Offline Database.lnk"

$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "$ProjectPath\launch-app.vbs"
$Shortcut.WorkingDirectory = $ProjectPath
$Shortcut.Description = "Student Offline Database - Desktop Application"
$Shortcut.IconLocation = "$ProjectPath\assets\icon.ico"
$Shortcut.WindowStyle = 1  # Normal window

$Shortcut.Save()

Write-Host "============================================" -ForegroundColor Green
Write-Host "  Desktop Shortcut Created Successfully!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "A shortcut named 'Student Offline Database'" -ForegroundColor Cyan
Write-Host "has been placed on your desktop." -ForegroundColor Cyan
Write-Host ""
Write-Host "Just double-click the desktop icon to open the app!" -ForegroundColor Yellow
Write-Host ""
Write-Host "If icon doesn't show immediately, right-click the" -ForegroundColor Gray
Write-Host "shortcut on desktop -> Properties -> Change Icon" -ForegroundColor Gray
Write-Host "-> Browse to assets\icon.ico -> OK" -ForegroundColor Gray
Write-Host ""

# Pause so user can see the message
Read-Host "Press Enter to exit"