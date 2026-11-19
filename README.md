# Sistem Informasi Lost and Found Kampus

Aplikasi web **Sistem Informasi Lost and Found Kampus** berbasis Node.js, Express.js, EJS, dan MySQL 8 untuk pengelolaan barang hilang dan temuan di lingkungan kampus (studi kasus UIN Maulana Malik Ibrahim Malang).

## Fitur Utama
1. **Autentikasi & Otorisasi Berbasis Peran**:
   - **Mahasiswa**: Login, lapor barang hilang, lapor barang temuan, jelajahi katalog & filter, ajukan klaim kepemilikan, lihat aktivitas pribadi.
   - **Satpam**: Semua fitur Mahasiswa + verifikasi klaim (setujui/tolak dengan alasan), ubah status barang, lihat rekap laporan, akses kontak pelapor.
   - **Administrator**: Semua fitur Satpam + CRUD kategori barang, manajemen pengguna, akses log sistem penuh.

2. **Katalog & Pencarian**:
   - Filter lengkap berdasarkan kategori, rentang tanggal, lokasi, dan status barang (*Tersedia*, *Sedang Proses Klaim*, *Dikembalikan*).
   - Detail barang dengan informasi lengkap dan unggahan foto.

3. **Alur Klaim Kepemilikan**:
   - Validasi ketat: barang harus berstatus 'Tersedia' dan belum ada klaim aktif.
   - Pengisian ciri rahasia minimal 30 karakter.
   - Persetujuan/penolakan oleh petugas dengan pencatatan waktu dan verifikator.

## Prasyarat
- Node.js versi 18 atau lebih baru
- MySQL Server versi 8.0 atau lebih baru

## Langkah Instalasi & Konfigurasi
1. Ekstrak atau Clone repositori ini ke direktori proyek.
2. Buat database MySQL baru dengan nama `sistem_lost_and_found`:
   ```sql
   CREATE DATABASE sistem_lost_and_found CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Impor skema dan seed data:
   ```bash
   mysql -u root -p sistem_lost_and_found < schema.sql
   mysql -u root -p sistem_lost_and_found < seed.sql
   ```
4. Salin file `.env.example` menjadi `.env` dan sesuaikan konfigurasi database:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=sistem_lost_and_found
   SESSION_SECRET=kampus_lost_and_found_secret_key_2026
   ```
5. Install dependensi Node.js:
   ```bash
   npm install
   ```

## Cara Menjalankan Aplikasi
- Mode produksi:
  ```bash
  npm start
  ```
- Mode pengembangan (development dengan nodemon):
  ```bash
  npm run dev
  ```
Buka browser dan akses `http://localhost:3000`.

## Akun Uji Coba (Demo Accounts)
- **Administrator**: `admin@uin-malang.ac.id` / `admin123`
- **Satpam**: `satpam@uin-malang.ac.id` / `satpam123`
- **Mahasiswa**: `mhs1@uin-malang.ac.id` / `mahasiswa123` (atau `mhs2`, `mhs3` dengan password `mahasiswa123`)

## Tech Stack
- **Backend**: Node.js, Express.js
- **View Engine**: EJS (Embedded JavaScript Templates)
- **Database**: MySQL 8 (`mysql2/promise`)
- **Autentikasi & Keamanan**: `express-session`, `bcrypt` (hash password, salt rounds 10)
- **Unggah Berkas**: `multer` (validasi format JPG/JPEG/PNG, maks 5MB)
- **Frontend**: Bootstrap 5, Bootstrap Icons, HTML5, CSS3, JavaScript
- **Konfigurasi**: `dotenv`
