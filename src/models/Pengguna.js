const db = require("../config/db");
module.exports = {
  async findByEmail(e) {
    const [r] = await db.execute(
      "SELECT * FROM pengguna WHERE email_kampus=?",
      [e],
    );
    return r[0];
  },
  async findById(id) {
    const [r] = await db.execute("SELECT * FROM pengguna WHERE id_pengguna=?", [
      id,
    ]);
    return r[0];
  },
  async all() {
    const [r] = await db.execute(
      "SELECT id_pengguna,nama_lengkap,email_kampus,nomor_telepon,peran_pengguna,created_at FROM pengguna ORDER BY created_at DESC",
    );
    return r;
  },
  async create(data) {
    const [r] = await db.execute(
      "INSERT INTO pengguna (nama_lengkap,email_kampus,kata_sandi,nomor_telepon,peran_pengguna) VALUES (?,?,?,?,?)",
      [
        data.nama_lengkap,
        data.email_kampus,
        data.kata_sandi,
        data.nomor_telepon || null,
        data.peran_pengguna || "mahasiswa",
      ],
    );
    return r.insertId;
  },
};
