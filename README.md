# PEPEG DIGITAL TWIN — GST I & II

Simulasi browser lokal dengan **React, Vite, Three.js, React Three Fiber, Drei, dan Zustand**. Tidak memerlukan backend, akun, atau environment variable. Seluruh model dibuat secara procedural dan tidak mengunduh asset saat runtime.

## Menjalankan

Node 22 atau 24 dan npm. Di direktori repo:

```bash
npm install --cache /workspace/.npm-cache
npm run dev
```

Vite memakai port **5173**. `npm run preview` menyajikan hasil build di port **4173**. Di luar cloud, opsi cache dapat dihilangkan atau diganti direktori yang writable.

## Windows / PowerShell

Jika PowerShell menolak `npm.ps1` dengan pesan execution policy, gunakan launcher CMD tanpa mengubah kebijakan Windows:

```powershell
npm.cmd install
npm.cmd run dev
```

Jalankan dari folder yang berisi `package.json`. Alternatif: double-click **RUN_SIMULATION_WINDOWS.bat**. Helper ini memeriksa Node/npm, menginstal dependency dari lockfile bila belum ada `node_modules`, lalu menjalankan Vite lokal. Biarkan terminal terbuka dan buka alamat Local yang ditampilkan Vite. Helper Windows belum diuji di mesin Windows; runtime aplikasi dan perintah npm sudah diuji di lingkungan Linux.

## Validasi

```bash
npm ci --cache /workspace/.npm-cache
npm run lint
npm test
npm run build
npm run test:browser
npm run test:browser:build
```

Playwright menggunakan Chromium sistem di `/usr/bin/chromium` bila tersedia. Alternatif: atur `CHROMIUM_PATH` ke Chromium lokal; pada mesin lain yang belum memiliki browser, instal Chromium dengan `npx playwright install chromium` dan gunakan browser bawaan Playwright. Tes build menggunakan shell POSIX untuk `SMOKE_PRODUCTION`; di Windows, set environment variable tersebut sebelum `npx playwright test`.

## Interaksi

- Klik GBB/MP1 atau pilih preset kamera; animasi fokus kemudian melepas kamera untuk rotate, zoom, dan pan.
- **OPEN ROOF / CLOSE ROOF** mengubah cutaway seluruh kompleks, sehingga isi gudang bisa dibandingkan. Panel gudang menyediakan tombol kembali ke overview dan daftar slot sebagai alternatif klik mesh.
- Klik floor stack untuk SKU, lot, tanggal kedaluwarsa, kemasan, berat, stok fisik, reservasi, tersedia, FEFO, dan status. Reservasi serta penandaan FEFO hanya mengubah mock state.
- Klik kendaraan pada scene atau daftar panel, lalu lanjutkan status. Truck berpindah dari antrean ke area proses dan keluar ketika selesai; waktu mulai/selesai dicatat.
- Klaim CLM-001: 500 × 50 kg − 24.994 kg = 6 kg. CLM-002: total 35 kg, pemenuhan awal 10 kg, sisa 25 kg. Masukkan jumlah pemenuhan bertahap; status OPEN/PARTIAL/SETTLED dan riwayat diperbarui.
- KPI dan event timeline bereaksi pada perubahan simulasi. FEFO diurutkan berdasarkan tanggal expiry; penandaan prioritas dibuat secara eksplisit pada fase mock.
- State domain tersimpan di localStorage **pepeg-digital-twin-sim-v2**. Kamera dan pilihan detail tidak disimpan. **RESET SIMULATION** mengembalikan seed mock dan tidak mengubah data di luar storage simulasi.

Stok fisik dashboard merupakan penjumlahan unit mock berbeda (pack/dus/karung), **bukan tonase atau nilai operasional**. Occupancy dihitung dari jumlah slot berisi, bukan kapasitas tonase gudang; seed saat ini mengisi seluruh 112 slot.

## Layout dan batasan

Sumber koordinat tunggal: `src/data/layout.js`. GBB 17–20 di sisi selatan, GBB 21–24 di utara, semua sisi belakang menyatu ke MP1 tanpa jalan pemisah. Jalan hanya di sisi depan. Kantor GST I di antara GBB 18/19 dan GST II di antara GBB 22/23. MP1 depan di kanan (+x), belakang di kiri (−x).

Model schematic berskala meter, bukan survei/as-built. Foto JPG Drive tidak tersedia di lampiran dan tidak diakses; bentuk mengikuti deskripsi yang diberikan (steel span, atap pelana, aksen biru, pallet dan floor stacking). Tidak mengklaim kecocokan terhadap foto yang belum diperiksa.

Tidak ada API client, MongoDB driver, credential, integrasi Railway/Vercel, deployment, maupun write-back. Repo `Management-Inventory-V1.0` dan `Emergent-Inventory` tidak diakses. [Audit](docs/PROTOTYPE_AUDIT.md), [hasil tes](docs/TEST_RESULTS.md), dan [rancangan integrasi masa depan](docs/PEPEG_READONLY_API_PLAN.md) tersedia untuk review; rancangan tersebut belum diimplementasikan.
