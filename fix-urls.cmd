@echo off
echo Running URL case sensitivity fix script...
node fix-urls.js

if %ERRORLEVEL% EQU 0 (
  echo URL fix script completed successfully!
) else (
  echo Error: URL fix script failed to complete.
  exit /b 1
)

echo Done! You can now commit and push your changes. 