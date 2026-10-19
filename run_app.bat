@echo off
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1
cd /d "%~dp0CareBridgeAI"
echo ========================================================
echo  Starting CareBridge AI Recovery Companion...
echo ========================================================
"%APPDATA%\uv\python\cpython-3.12-windows-x86_64-none\python.exe" -m streamlit run app.py
pause
