; Script generated by the Inno Setup Script Wizard.
; SEE THE DOCUMENTATION FOR DETAILS ON CREATING INNO SETUP SCRIPT FILES!

#define MyAppName "Gravity-Geometry"
#define MyAppVersion "0.1"
#define MyAppPublisher "nstrikos@yahoo.gr"
#define MyAppExeName "launch.vbs"

[Setup]
; NOTE: The value of AppId uniquely identifies this application.
; Do not use the same AppId value in installers for other applications.
; (To generate a new GUID, click Tools | Generate GUID inside the IDE.)
AppId={{3690B5F6-5DA5-4315-859E-683C88D74797}}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={pf}\{#MyAppName}
DisableDirPage=yes
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
LicenseFile=C:\Users\Nikos\Desktop\Gravity-Geometry\src\gravity-geometry\gpl-3.0.txt
OutputDir=C:\Users\Nikos\Desktop\Gravity-Geometry\output-build
SetupIconFile=C:\Users\Nikos\Desktop\Gravity-Geometry\src\gravity-geometry\icon.ico
OutputBaseFilename=gravity-geometry
Compression=lzma
SolidCompression=yes


[Files]
Source: "C:\Users\Nikos\Desktop\Gravity-Geometry\src\gravity-geometry\inno-setup\build\gravity-geometry.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\Nikos\Desktop\Gravity-Geometry\src\gravity-geometry\inno-setup\build\Gravity-Geometry.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\Nikos\Desktop\Gravity-Geometry\src\gravity-geometry\inno-setup\build\launch.vbs"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\Nikos\Desktop\Gravity-Geometry\src\gravity-geometry\inno-setup\build\qml\*"; DestDir: "{app}\qml\"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "C:\Users\Nikos\Desktop\Gravity-Geometry\src\gravity-geometry\icon.ico"; DestDir: "{app}\resources"; Flags: ignoreversion

; NOTE: Don't use "Flags: ignoreversion" on any shared system files

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}";  WorkingDir: "{app}"; IconFilename: "{app}\resources\icon.ico"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"

