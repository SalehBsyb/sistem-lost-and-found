const r = require("express").Router(),
  multer = require("multer"),
  path = require("path"),
  auth = require("../middleware/auth"),
  L = require("../models/LaporanKehilangan"),
  B = require("../models/BarangTemuan"),
  K = require("../models/Kategori"),
  Log = require("../models/Log");
const upload = multer({
  storage: multer.diskStorage({
    destination: "public/uploads/",
    filename: (req, file, cb) =>
      cb(
        null,
        Date.now() +
          "-" +
          Math.round(Math.random() * 1e9) +
          path.extname(file.originalname).toLowerCase(),
      ),
  }),
  fileFilter: (req, file, cb) =>
    cb(null, /\.(jpg|jpeg|png)$/i.test(file.originalname)),
  limits: { fileSize: 5 * 1024 * 1024 },
});

r.get("/hilang/daftar", auth, async (q, s) => {
  try {
    const isStaff = ["satpam", "administrator"].includes(
      q.session.user.peran_pengguna,
    );
    const laporan = isStaff
      ? await L.all()
      : await L.byUser(q.session.user.id_pengguna);
    s.render("laporan/daftar_hilang", { laporan, isStaff });
  } catch (e) {
    console.error(e);
    s.status(500).send("Terjadi kesalahan server");
  }
});

r.get("/hilang", auth, async (q, s) => {
  try {
    const kategori = await K.all();
    s.render("laporan/hilang", { kategori, error: null });
  } catch (e) {
    console.error(e);
    s.status(500).send("Terjadi kesalahan server");
  }
});

r.post("/hilang", auth, async (q, s) => {
  try {
    const {
      nama_barang,
      id_kategori,
      tanggal_kejadian,
      lokasi_terakhir,
      deskripsi,
    } = q.body;
    if (!nama_barang || !id_kategori || !tanggal_kejadian || !lokasi_terakhir) {
      return s.render("laporan/hilang", {
        kategori: await K.all(),
        error: "Semua kolom wajib diisi kecuali foto",
      });
    }
    const [r] = await L.create([
      q.session.user.id_pengguna,
      id_kategori,
      nama_barang,
      tanggal_kejadian,
      lokasi_terakhir,
      deskripsi || null,
      null,
    ]);
    await Log.add(
      q.session.user.id_pengguna,
      "Lapor Kehilangan",
      "laporan_kehilangan",
      r.insertId,
      "Laporan kehilangan baru",
    );
    q.session.msg = {
      type: "success",
      text: "Laporan kehilangan berhasil dikirim",
    };
    s.redirect("/aktivitas");
  } catch (e) {
    console.error(e);
    s.render("laporan/hilang", {
      kategori: await K.all(),
      error: "Terjadi kesalahan saat menyimpan",
    });
  }
});

r.get("/temuan", auth, async (q, s) => {
  try {
    const kategori = await K.all();
    s.render("laporan/temuan", { kategori, error: null });
  } catch (e) {
    console.error(e);
    s.status(500).send("Terjadi kesalahan server");
  }
});

r.post("/temuan", auth, upload.single("foto_barang"), async (q, s) => {
  try {
    const {
      nama_barang,
      id_kategori,
      lokasi_ditemukan,
      tanggal_ditemukan,
      lokasi_pos_penyimpanan,
      deskripsi_umum,
    } = q.body;
    if (
      !nama_barang ||
      !id_kategori ||
      !lokasi_ditemukan ||
      !tanggal_ditemukan ||
      !lokasi_pos_penyimpanan
    ) {
      return s.render("laporan/temuan", {
        kategori: await K.all(),
        error: "Semua kolom wajib diisi",
      });
    }
    if (!q.file)
      return s.render("laporan/temuan", {
        kategori: await K.all(),
        error: "Foto barang wajib diunggah",
      });
    const [r] = await B.create([
      q.session.user.id_pengguna,
      id_kategori,
      nama_barang,
      q.file.filename,
      lokasi_ditemukan,
      tanggal_ditemukan,
      lokasi_pos_penyimpanan,
      deskripsi_umum || null,
    ]);
    await Log.add(
      q.session.user.id_pengguna,
      "Lapor Temuan",
      "barang_temuan",
      r.insertId,
      "Barang temuan baru",
    );
    q.session.msg = {
      type: "success",
      text: "Laporan barang temuan berhasil dikirim",
    };
    s.redirect("/katalog");
  } catch (e) {
    console.error(e);
    s.render("laporan/temuan", {
      kategori: await K.all(),
      error: "Terjadi kesalahan saat menyimpan",
    });
  }
});

module.exports = r;
