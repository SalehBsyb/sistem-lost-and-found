const db = require("../config/db");
module.exports = {
  create: (d) =>
    db.execute(
      "INSERT INTO laporan_kehilangan(id_pengguna,id_kategori,nama_barang,tanggal_kejadian,lokasi_terakhir,deskripsi,foto_referensi) VALUES(?,?,?,?,?,?,?)",
      d,
    ),
  byUser: async (id) => {
    const [r] = await db.execute(
      "SELECT l.*,k.nama_kategori FROM laporan_kehilangan l JOIN kategori_barang k ON k.id_kategori=l.id_kategori WHERE l.id_pengguna=? ORDER BY l.created_at DESC",
      [id],
    );
    return r;
  },
  all: async () => {
    const [r] = await db.execute(
      "SELECT l.*,k.nama_kategori,p.nama_lengkap,p.email_kampus,p.nomor_telepon FROM laporan_kehilangan l JOIN kategori_barang k ON k.id_kategori=l.id_kategori JOIN pengguna p ON p.id_pengguna=l.id_pengguna ORDER BY l.created_at DESC",
    );
    return r;
  },
  countActive: async () => {
    const [[r]] = await db.execute(
      "SELECT COUNT(*) total FROM laporan_kehilangan WHERE status_laporan='aktif'",
    );
    return r.total;
  },
};
