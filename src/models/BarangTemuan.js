const db = require("../config/db");
module.exports = {
  create: (d) =>
    db.execute(
      "INSERT INTO barang_temuan(id_pengguna,id_kategori,nama_barang,foto_barang,lokasi_ditemukan,tanggal_ditemukan,lokasi_pos_penyimpanan,deskripsi_umum) VALUES(?,?,?,?,?,?,?,?)",
      d,
    ),
  all: async (f) => {
    let sql =
        "SELECT b.*,k.nama_kategori FROM barang_temuan b JOIN kategori_barang k ON k.id_kategori=b.id_kategori WHERE 1=1",
      p = [];
    if (f.q) {
      sql += " AND (b.nama_barang LIKE ? OR b.lokasi_ditemukan LIKE ?)";
      p.push("%" + f.q + "%", "%" + f.q + "%");
    }
    if (f.id_kategori) {
      sql += " AND b.id_kategori=?";
      p.push(f.id_kategori);
    }
    if (f.status) {
      sql += " AND b.status_barang=?";
      p.push(f.status);
    }
    if (f.lokasi) {
      sql += " AND b.lokasi_ditemukan LIKE ?";
      p.push("%" + f.lokasi + "%");
    }
    if (f.dari) {
      sql += " AND b.tanggal_ditemukan>=?";
      p.push(f.dari);
    }
    if (f.sampai) {
      sql += " AND b.tanggal_ditemukan<=?";
      p.push(f.sampai);
    }
    sql += " ORDER BY b.created_at DESC";
    const [r] = await db.execute(sql, p);
    return r;
  },
  find: async (id) => {
    const [r] = await db.execute(
      "SELECT b.*,k.nama_kategori,p.nama_lengkap,p.nomor_telepon,p.email_kampus FROM barang_temuan b JOIN kategori_barang k ON k.id_kategori=b.id_kategori JOIN pengguna p ON p.id_pengguna=b.id_pengguna WHERE b.id_barang_temuan=?",
      [id],
    );
    return r[0];
  },
  count: async (status) => {
    let sql = "SELECT COUNT(*) total FROM barang_temuan";
    let p = [];
    if (status) {
      sql += " WHERE status_barang=?";
      p = [status];
    }
    const [[r]] = await db.execute(sql, p);
    return r.total;
  },
  updateStatus: (s, id) =>
    db.execute(
      "UPDATE barang_temuan SET status_barang=? WHERE id_barang_temuan=?",
      [s, id],
    ),
  recent: async () => {
    const [r] = await db.execute(
      "SELECT b.*,k.nama_kategori FROM barang_temuan b JOIN kategori_barang k ON k.id_kategori=b.id_kategori ORDER BY b.created_at DESC LIMIT 5",
    );
    return r;
  },
};
