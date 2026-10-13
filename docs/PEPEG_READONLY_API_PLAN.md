# Rancangan read-only untuk fase masa depan — belum diimplementasikan

Aplikasi saat ini sepenuhnya mock/localStorage. Tidak ada endpoint aktif atau koneksi produksi. Implementasi rencana ini memerlukan instruksi baru dan review akses tersendiri.

## Kebutuhan data

Endpoint GET konseptual (nama/path belum dikonfirmasi): master gudang/lokasi, snapshot stok per SKU-lot-slot, reservasi, tanggal expiry/indikator FEFO, penerimaan/TM/PO, pengiriman/SO, status kendaraan, serta snapshot klaim dan riwayat pemenuhan. Tidak mengasumsikan endpoint ini tersedia di PEPEG.

## Authentication dan boundary

Gateway/projection read-only tersendiri dengan principal least-privilege dan izin hanya membaca lokasi yang disetujui. Browser tidak menyimpan connection string database atau credential layanan di localStorage. Tidak mengakses MongoDB langsung. Credential tidak dimasukkan ke source; metode auth dan secure binding ditentukan saat fase integrasi disetujui.

Tidak ada POST/PUT/PATCH/DELETE, transaksi stok, migrasi, perubahan collection, atau write-back simulasi. State simulasi tetap terpisah dari snapshot read-only dan diberi label sumber/timestamp. Registry produksi, Railway, Vercel, dan repo inventory tetap di luar ruang lingkup aplikasi ini.

## Mapping

Identitas lokasi → `warehouse/zone/slot/id`; SKU/product/packaging/weight → metadata stack; stok/reservasi → physical/reserved/available; lot/expiry → lot/expiry/FEFO; receipt/order → vehicle document/flow; claim/fulfillment → claim history. Mapping lokasi dan satuan harus divalidasi; tidak menyamakan jumlah dus dengan pack atau kg. Kapasitas dan occupancy operasional memerlukan definisi yang disepakati, bukan mengambil persentase slot mock.

## Cache dan fallback

Gunakan snapshot bertimestamp dan TTL terbatas, conditional GET/ETag, rate limit dan backoff. Tampilkan stale indicator ketika refresh gagal; sediakan fallback mock yang jelas berbeda dari data live. Validasi schema serta whitelist lokasi sebelum rendering. Jangan diam-diam mengganti snapshot produksi dengan mock atau menulis perubahan simulasi kembali ke sumber.

## Validasi sebelum integrasi

Contract tests memakai fixture lokal dan mock gateway; cek bahwa mutasi simulasi tidak menghasilkan request, token tidak masuk bundle/log, dan adapter hanya mengizinkan operasi GET ke destination yang disetujui. Uji autentikasi/live endpoint hanya setelah otorisasi eksplisit terpisah.
