const db = require("../config/db");
module.exports = {
  create: (d) =>
    db.execute(
      "INSERT INTO klaim_kepemilikan(id_barang_temuan,id_pengguna_penglaim,ciri_rahasia) VALUES(?,?,?)",
      d,
    ),
  hasActive: async (id) => {
    const [[r]] = await db.execute(
      "SELECT COUNT(*) total FROM klaim_kepemilikan WHERE id_barang_temuan=? AND status_klaim='Menunggu Verifikasi'",
      [id],
    );
    return r.total > 0;
  },
  pending: async () => {
    const [r] = await db.execute(
      "SELECT c.*,b.nama_barang,b.foto_barang,p.nama_lengkap,p.email_kampus FROM klaim_kepemilikan c JOIN barang_temuan b ON b.id_barang_temuan=c.id_barang_temuan JOIN pengguna p ON p.id_pengguna=c.id_pengguna_penglaim WHERE c.status_klaim='Menunggu Verifikasi' ORDER BY c.waktu_pengajuan",
    );
    return r;
  },
  byUser: async (id) => {
    const [r] = await db.execute(
      "SELECT c.*,b.nama_barang FROM klaim_kepemilikan c JOIN barang_temuan b ON b.id_barang_temuan=c.id_barang_temuan WHERE c.id_pengguna_penglaim=? ORDER BY c.waktu_pengajuan DESC",
      [id],
    );
    return r;
  },
  byVerifier: async (id) => {
    const [r] = await db.execute(
      "SELECT c.*,b.nama_barang,p.nama_lengkap AS nama_pengklaim FROM klaim_kepemilikan c JOIN barang_temuan b ON b.id_barang_temuan=c.id_barang_temuan JOIN pengguna p ON p.id_pengguna=c.id_pengguna_penglaim WHERE c.id_petugas_verifikator=? OR EXISTS (SELECT 1 FROM log_sistem l WHERE l.id_pengguna=? AND l.tabel_referensi='klaim_kepemilikan' AND l.id_referensi=c.id_klaim AND l.aktivitas IN ('Setujui Klaim','Tolak Klaim')) ORDER BY c.waktu_verifikasi DESC,c.waktu_pengajuan DESC",
      [id, id],
    );
    return r;
  },
  find: async (id) => {
    const [r] = await db.execute(
      "SELECT * FROM klaim_kepemilikan WHERE id_klaim=?",
      [id],
    );
    return r[0];
  },
  verify: (s, reason, officer, id) =>
    db.execute(
      'UPDATE klaim_kepemilikan SET status_klaim=?,alasan_penolakan=?,id_petugas_verifikator=?,waktu_verifikasi=NOW() WHERE id_klaim=? AND status_klaim="Menunggu Verifikasi"',
      [s, reason, officer, id],
    ),
  countPending: async () => {
    const [[r]] = await db.execute(
      "SELECT COUNT(*) total FROM klaim_kepemilikan WHERE status_klaim='Menunggu Verifikasi'",
    );
    return r.total;
  },
  all: async () => {
    const [r] = await db.execute(
      "SELECT c.*,b.nama_barang,k.nama_kategori,p.nama_lengkap FROM klaim_kepemilikan c JOIN barang_temuan b ON b.id_barang_temuan=c.id_barang_temuan JOIN kategori_barang k ON k.id_kategori=b.id_kategori JOIN pengguna p ON p.id_pengguna=c.id_pengguna_penglaim ORDER BY c.waktu_pengajuan DESC",
    );
    return r;
  },
};
