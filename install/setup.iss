[Setup]
AppName=Student Offline Database
AppVersion=1.0.0
DefaultDirName={pf}\Student Offline Database
DefaultGroupName=Student Offline Database
OutputDir=installer
OutputBaseFilename=StudentOfflineDatabaseSetup
Compression=lzma
SolidCompression=yes
SetupIconFile=..\assets\icon.png
ChangesAssociations=yes
CreateUninstallRegKey=yes

[Files]
Source: "..\dist\portable\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\Student Offline Database"; Filename: "{app}\npx.exe"; Parameters: "electron ."; WorkingDir: "{app}"; IconFilename: "{app}\assets\icon.png"
Name: "{commondesktop}\Student Offline Database"; Filename: "{app}\npx.exe"; Parameters: "electron ."; WorkingDir: "{app}"; IconFilename: "{app}\assets\icon.png"

[Run]
Filename: "{app}\npx.exe"; Parameters: "electron ."; WorkingDir: "{app}"; Description: "Launch Student Offline Database"; Flags: nowait postinstall

[UninstallDelete]
Type: filesandordirs; Name: "{app}"
