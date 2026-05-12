' Student Offline Database - Silent Launcher
' This script launches the app without showing a terminal window

Dim shell, fso, currentDir, nodeModulesPath, nextBuildPath

Set fso = CreateObject("Scripting.FileSystemObject")
currentDir = fso.GetAbsolutePathName(".")

nodeModulesPath = currentDir & "\node_modules"
nextBuildPath = currentDir & "\.next"

Set shell = CreateObject("WScript.Shell")

' Check if node_modules exists, if not install dependencies
If Not fso.FolderExists(nodeModulesPath) Then
    shell.Run "cmd /c cd /d """ & currentDir & """ && npm install", 0, True
End If

' Check if .next build exists, if not build
If Not fso.FolderExists(nextBuildPath) Then
    shell.Run "cmd /c cd /d """ & currentDir & """ && npm run build", 0, True
End If

' Launch Electron app (hidden terminal)
shell.Run "cmd /c cd /d """ & currentDir & """ && npx electron .", 0, False