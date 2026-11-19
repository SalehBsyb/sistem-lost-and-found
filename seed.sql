-- ============================================================
--  Seed Data - Sistem Informasi Lost and Found Kampus
--  Jalankan setelah schema.sql
-- ============================================================

USE sistem_lost_and_found;

-- ------------------------------------------------------------------
-- Pengguna (password sudah di-hash dengan bcrypt, salt rounds 10)
--   admin123       -> administrator
--   satpam123      -> satpam
--   mahasiswa123   -> mahasiswa
-- ------------------------------------------------------------------
INSERT INTO pengguna (nama_lengkap, email_kampus, kata_sandi, nomor_telepon, peran_pengguna) VALUES
('Budi Santoso',   'admin@uin-malang.ac.id',  '$2b$10$Vx6l70fIOrBBXU22kybGyuz2o/dyxQE5GCL7nIoN2.M8s2Wr4mIdm', '081234567001', 'administrator'),
('Siti Aminah',    'satpam@uin-malang.ac.id', '$2b$10$LU8WB2bVUXyruALj/vJC9eNp9DJWP2KE00XdwM9NmFxn3SD8Un0d.', '081234567002', 'satpam'),
('Ahmad Fauzi',    'mhs1@uin-malang.ac.id',   '$2b$10$1TOXSTTsLAbqaA7qHl5vyO1sX3bshYuEy0MFwuqUq2cx2fOKBPTqu', '081234567003', 'mahasiswa'),
('Dewi Lestari',   'mhs2@uin-malang.ac.id',   '$2b$10$1TOXSTTsLAbqaA7qHl5vyO1sX3bshYuEy0MFwuqUq2cx2fOKBPTqu', '081234567004', 'mahasiswa'),
('Rizky Pratama',  'mhs3@uin-malang.ac.id',   '$2b$10$1TOXSTTsLAbqaA7qHl5vyO1sX3bshYuEy0MFwuqUq2cx2fOKBPTqu', '081234567005', 'mahasiswa')
ON DUPLICATE KEY UPDATE nama_lengkap = VALUES(nama_lengkap);

-- ------------------------------------------------------------------
-- Kategori barang
-- ------------------------------------------------------------------
INSERT INTO kategori_barang (nama_kategori) VALUES
('Elektronik'),
('Pakaian'),
('Dokumen/Identitas'),
('Kendaraan'),
('Tas/Ransel'),
('Perhiasan/Aksesoris'),
('Lainnya')
ON DUPLICATE KEY UPDATE nama_kategori = VALUES(nama_kategori);

-- ------------------------------------------------------------------
-- Contoh laporan kehilangan
-- ------------------------------------------------------------------
INSERT INTO laporan_kehilangan (id_pengguna, id_kategori, nama_barang, tanggal_kejadian, lokasi_terakhir, deskripsi, status_laporan) VALUES
(3, 1, 'Handphone Xiaomi Redmi Note 11', CURDATE() - INTERVAL 2 DAY, 'Ruang Perpustakaan Lt. 2', 'Handphone dengan case hitam dan latch silver. Found in the courtyard area.', 'aktif'),
(4, 5, 'Ransel Kata-Kata', CURDATE() - INTERVAL 5 DAY, 'Kantin Fakultas Ekonomi', 'Ransel warna navy bertuliskan "Kata-Kata" dan Several pin.', 'aktif'),
(5, 2, 'Jaket Hitam Zipper', CURDATE() - INTERVAL 1 DAY, 'LapanganBasket', 'Jaket bomber hitam ukuran L dengan label putih di lengan kanan.', 'aktif');

-- ------------------------------------------------------------------
-- Contoh barang temuan (foto_barang merujuk ke file pada public/uploads)
-- ------------------------------------------------------------------
INSERT INTO barang_temuan (id_pengguna, id_kategori, nama_barang, foto_barang, lokasi_ditemukan, tanggal_ditemukan, lokasi_pos_penyimpanan, deskripsi_umum, status_barang) VALUES
(2, 1, 'Dompet Kulit Cokelat', 'contoh-dompet.jpg', 'Ruang tunggu_security', CURDATE() - INTERVAL 1 DAY, 'Pos SatpamGd. A Lt. 1', 'Dompet kulit cokelat dengan kartu KTP dan kartu ATM', 'Tersedia'),
(2, 3, 'Kartu Identitas Campus', 'contoh-kartu.jpg', 'Meja securityfoodcourt', CURDATE() - INTERVAL 2 DAY, 'Pos SatpamGd. B Lt. 1', 'Kartu identitas campus dengan foto dan nomor induk', 'Tersedia'),
(4, 5, 'Tas Ransel Hitam Adidas', 'contoh-ransel.jpg', 'Ruang Athletic', CURDATE() - INTERVAL 3 DAY, 'Pos SatpamGd. A Lt. 1', 'Ransel hitam dengan logo putih dan compartment tambahan', 'Tersedia'),
(3, 2, 'Kemeja Flanel Merah', 'contoh-kemeja.jpg', 'PerpustakaanGd. B', CURDATE() - INTERVAL 6 DAY, 'Pos SatpamGd. B Lt. 1', 'Kemeja flanel merah ukuran M dengan kancing putih', 'Dikembalikan');
