# Audit prototype ZIP

ZIP diekstrak untuk audit di `/workspace/scratch/prototype-audit`. Semua entry diperiksa agar tetap berada di direktori tujuan dan bukan symbolic link. Dokumen lampiran diperlakukan sebagai referensi kebutuhan; larangan akses produksi dalam permintaan langsung pengguna tetap menjadi batas pekerjaan.

## Temuan

- Source utama sudah memakai React Three Fiber/Drei/Zustand, namun runtime yang dilaporkan teruji di ZIP adalah `offline-preview` Canvas 2D isometric. Tidak mengadopsi screenshot atau laporan tes lama sebagai bukti tes aplikasi baru.
- Kamera awal melakukan lerp setiap frame tanpa selesai, sehingga OrbitControls ditarik kembali. Diperbaiki dengan transisi yang berhenti ketika selesai, batal saat input manual, dan dapat diminta lagi untuk preset yang sama.
- Blok B sepanjang 5,7 m dengan jarak center 5,3 m bertabrakan. Geometri baru memakai jarak 6 m, A/C 3,9 m dan B 5,2 m (4/3).
- MP1 awal memakai kedalaman 28 m dan GBB center ±29 m. Kini MP1 30 m dan GBB center ±30 m; keduanya menempel tepat pada ±15 m. Tes mengimpor data yang sama dengan scene.
- Shell GBB berupa kotak penuh dan MP1 berupa kotak tertutup menghalangi akses interior. GBB dibangun sebagai dinding dengan empat bukaan pintu; sisi MP1 memiliki bukaan yang berkorespondensi dengan seluruh pintu belakang GBB. Mode cutaway menonaktifkan raycast dinding transparan dan membuka pintu untuk pemilihan mesh interior.
- Ukuran kantor awal melebihi gap antara gudang. Kantor schematic kini lebar 5 m di gap 6 m.
- Label Html berskala distanceFactor sangat kecil di overview. Kini label tetap terbaca pada ukuran layar.
- Klaim awal hanya memperbarui total dengan increment tetap; kini menggunakan riwayat pemenuhan sebagai sumber utama dan menolak nilai negatif/nonfinite/lebih dari sisa.
- Kendaraan awal tidak bergerak atau mencatat mulai/selesai; kini memiliki animasi posisi yang sesuai status dan timestamp lokal.
- Source dipecah menjadi `scene/`, `components/`, `stores/`, `data/`, `utils/`, `hooks/`. Data dan state awal digunakan sebagai fondasi; offline-preview, vendor React UMD, gambar lama, serta klaim tes lama tidak dimasukkan ke aplikasi.

## Batas bukti

Foto fisik JPG yang disebut dalam teks tidak berada dalam ZIP. Tidak mengakses Google Drive atau sistem produksi untuk mendapatkannya. Model mengikuti layout/deskripsi pengguna dan tetap schematic. Screenshot baru berasal dari runtime R3F/WebGL yang diuji di lingkungan ini.
