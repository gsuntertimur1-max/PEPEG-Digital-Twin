# Hasil validasi — 13 Oktober 2026 (Asia/Jakarta)

Runtime yang diuji adalah source **React Three Fiber/WebGL 2**, bukan Canvas 2D pada ZIP lama.

| Pemeriksaan | Hasil |
|---|---|
| `npm install --cache /workspace/.npm-cache --no-audit --no-fund` | Lulus |
| `npm ci --cache /workspace/.npm-cache --no-audit --no-fund` | Lulus; instalasi ulang frozen lockfile |
| `npm run lint` | Lulus, 0 error |
| `npm test` | 7 test lulus, 0 gagal, 0 skipped |
| `npm run build` | Lulus, Vite 6.4.4 |
| `npm run test:browser` | 1 smoke scenario lulus pada dev runtime |
| `npm run test:browser:build` | 1 smoke scenario lulus pada hasil build/preview |
| HTTP request ke dev server | 200 |
| Browser page/console errors | 0 pada kedua smoke run final |
| Browser requests ke host eksternal | 0 pada kedua smoke run final |

Node v24.19.0, npm 11.9.0. Browser: Chromium sistem; rendering ANGLE/SwiftShader untuk lingkungan headless. Browser smoke bukan benchmark GPU desktop.

## Cakupan unit test

1. Tepat 112 identitas slot unik: 8 GBB × 12, MP1 × 16.
2. Dimensi dan adjacency memakai sumber koordinat yang sama dengan scene; kantor berada di gap GBB yang benar.
3. Blok interior berada dalam bangunan, tidak bertabrakan; B = 4/3 panjang A/C; zona A dicerminkan terhadap orientasi pintu depan.
4. Kekurangan timbang 25.000 − 24.994 = 6 kg; kelebihan timbang tidak membuat klaim negatif.
5. Klaim OPEN → PARTIAL → SETTLED, riwayat tetap utuh, nilai negatif/nonfinite/kelebihan ditolak.
6. Alur inbound/outbound monotonic, timestamp mulai/selesai, kendaraan selesai tidak maju lagi dan KPI aktif berubah.
7. Aksi Zustand: reservasi, FEFO, vehicle, klaim, event, serialization localStorage, dan reset.

## Cakupan browser smoke

- WebGL 2 context aktif dan canvas Three.js dirender; screenshot hasil build ditinjau secara visual.
- Zoom mengubah posisi label scene; preset kamera fokus ke GBB 18.
- Buka atap, proyeksikan posisi mesh 18/A02 ke koordinat layar dan klik melalui mouse/R3F raycast, bukan hanya shortcut panel.
- Detail FEFO, simpan reservasi 400, lalu lihat nilai terbaru.
- Kendaraan inbound mulai proses lalu selesai, kontrol selesai disabled.
- Pemenuhan CLM-002 10 kg mengurangi sisa 25 → 15 kg dan KPI klaim 31 → 21 kg.
- CLM-001 default input memenuhi tepat 6 kg lalu SETTLED.
- Tandai slot baru sebagai FEFO; KPI 3 → 4. MP1 memiliki 16 tombol slot.
- Reload mempertahankan klaim dan FEFO; reset mengembalikan 112 slot dan seed klaim.
- Request browser tetap localhost; tidak ada console error/page error.

## Koreksi lingkungan dan keterbatasan

Cache npm default tidak writable/tersedia. Diganti lokasi `/workspace/.npm-cache`, tanpa menonaktifkan TLS/signature/checksum validation. Unduhan browser Playwright ditolak network policy; Chromium sistem yang sudah tersedia digunakan, sehingga tidak perlu memperluas network policy.

Pemeriksaan piksel awal dilakukan setelah WebGL drawing buffer dikosongkan secara normal, sehingga tes tersebut salah menunggu alpha. Tes diperbaiki menjadi pemeriksaan context aktif, interaksi nyata melalui mesh picking, serta inspeksi screenshot; tidak mengubah renderer untuk mempertahankan drawing buffer hanya demi tes.

Build menghasilkan JS sekitar 1.034 kB (gzip 287 kB) dan CSS sekitar 11 kB. Vite memberi warning chunk >500 kB; build tetap lulus. Instalasi memberi warning dependency transitive three-mesh-bvh lama dan dukungan ESLint 9; tidak ada error runtime atau lint. Optimasi bundle lebih lanjut dapat dilakukan terpisah bila target perangkat ditentukan.

Foto fisik JPG tidak tersedia/diperiksa; visual mengikuti deskripsi pengguna. Tidak ada deploy atau validasi terhadap produksi. Belum dilakukan publikasi konfigurasi cloud atau pengujian restorasi pada tugas baru.

Screenshot final:
- `screenshot-overview.png`
- `screenshot-interior.png`
