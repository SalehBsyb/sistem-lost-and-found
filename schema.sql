-- ============================================================
--  Sistem Informasi Lost and Found Kampus
--  Database Schema (MySQL 8)
-- ============================================================

CREATE DATABASE IF NOT EXISTS sistem_lost_and_found
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sistem_lost_and_found;

-- ------------------------------------------------------------------
-- Tabel pengguna
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pengguna (
  id_pengguna      INT AUTO_INCREMENT PRIMARY KEY,
  nama_lengkap    VARCHAR(150) NOT NULL,
  email_kampus    VARCHAR(150) UNIQUE NOT NULL,
  kata_sandi      VARCHAR(255) NOT NULL,
  nomor_telepon   VARCHAR(20),
  peran_pengguna  ENUM('mahasiswa','satpam','administrator') DEFAULT 'mahasiswa',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- Tabel kategori_barang
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS kategori_barang (
  id_kategori     INT AUTO_INCREMENT PRIMARY KEY,
  nama_kategori   VARCHAR(100) UNIQUE NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- Tabel laporan_kehilangan
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS laporan_kehilangan (
  id_laporan_hilang   INT AUTO_INCREMENT PRIMARY KEY,
  id_pengguna         INT NOT NULL,
  id_kategori         INT NOT NULL,
  nama_barang         VARCHAR(200) NOT NULL,
  tanggal_kejadian    DATE NOT NULL,
  lokasi_terakhir     VARCHAR(255) NOT NULL,
  deskripsi           TEXT,
  foto_referensi      VARCHAR(255),
  status_laporan      ENUM('aktif','selesai') DEFAULT 'aktif',
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_laporan_pengguna FOREIGN KEY (id_pengguna) REFERENCES pengguna(id_pengguna) ON DELETE CASCADE,
  CONSTRAINT fk_laporan_kategori FOREIGN KEY (id_kategori) REFERENCES kategori_barang(id_kategori)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- Tabel barang_temuan
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS barang_temuan (
  id_barang_temuan        INT AUTO_INCREMENT PRIMARY KEY,
  id_pengguna              INT NOT NULL,
  id_kategori              INT NOT NULL,
  nama_barang              VARCHAR(200) NOT NULL,
  foto_barang              VARCHAR(255) NOT NULL,
  lokasi_ditemukan         VARCHAR(255) NOT NULL,
  tanggal_ditemukan        DATE NOT NULL,
  lokasi_pos_penyimpanan   VARCHAR(255) NOT NULL,
  deskripsi_umum           TEXT,
  status_barang            ENUM('Tersedia','Sedang Proses Klaim','Dikembalikan') DEFAULT 'Tersedia',
  created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_barang_pengguna FOREIGN KEY (id_pengguna) REFERENCES pengguna(id_pengguna) ON DELETE CASCADE,
  CONSTRAINT fk_barang_kategori FOREIGN KEY (id_kategori) REFERENCES kategori_barang(id_kategori)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- Tabel klaim_kepemilikan
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS klaim_kepemilikan (
  id_klaim                  INT AUTO_INCREMENT PRIMARY KEY,
  id_barang_temuan          INT NOT NULL,
  id_pengguna_penglaim       INT NOT NULL,
  id_petugas_verifikator     INT,
  ciri_rahasia              TEXT NOT NULL,
  alasan_penolakan          TEXT,
  waktu_pengajuan           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  waktu_verifikasi          TIMESTAMP NULL,
  status_klaim              ENUM('Menunggu Verifikasi','Disetujui','Ditolak') DEFAULT 'Menunggu Verifikasi',
  CONSTRAINT fk_klaim_barang FOREIGN KEY (id_barang_temuan) REFERENCES barang_temuan(id_barang_temuan) ON DELETE CASCADE,
  CONSTRAINT fk_klaim_penglaim FOREIGN KEY (id_pengguna_penglaim) REFERENCES pengguna(id_pengguna) ON DELETE CASCADE,
  CONSTRAINT fk_klaim_petugas FOREIGN KEY (id_petugas_verifikator) REFERENCES pengguna(id_pengguna) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- Tabel log_sistem
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS log_sistem (
  id_log          INT AUTO_INCREMENT PRIMARY KEY,
  id_pengguna     INT,
  aktivitas       VARCHAR(200) NOT NULL,
  tabel_referensi VARCHAR(100),
  id_referensi    INT,
  deskripsi       TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_log_pengguna FOREIGN KEY (id_pengguna) REFERENCES pengguna(id_pengguna) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Helpful indexes
CREATE INDEX idx_barang_status ON barang_temuan(status_barang);
CREATE INDEX idx_barang_kategori ON barang_temuan(id_kategori);
CREATE INDEX idx_klaim_barang ON klaim_kepemilikan(id_barang_temuan);
CREATE INDEX idx_klaim_status ON klaim_kepemilikan(status_klaim);
CREATE INDEX idx_laporan_pengguna ON laporan_kehilangan(id_pengguna);
