@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js tidak ditemukan. Instal Node.js LTS lalu buka kembali file ini.
  pause
  exit /b 1
)
where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo npm.cmd tidak ditemukan. Periksa instalasi Node.js.
  pause
  exit /b 1
)
if not exist "package.json" (
  echo Jalankan helper dari folder aplikasi yang berisi package.json.
  pause
  exit /b 1
)
if not exist "node_modules\.bin\vite.cmd" (
  call npm.cmd ci --no-audit --no-fund
  if errorlevel 1 (
    echo Instalasi gagal. Periksa pesan di atas dan koneksi internet.
    pause
    exit /b 1
  )
)
echo Buka alamat Local yang ditampilkan Vite di browser.
echo Biarkan jendela ini terbuka selama menggunakan simulasi.
call npm.cmd run dev -- --host 127.0.0.1
pause
