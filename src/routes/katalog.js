const r = require("express").Router(),
  auth = require("../middleware/auth"),
  B = require("../models/BarangTemuan"),
  K = require("../models/Kategori");
r.get("/", auth, async (q, s) => {
  try {
    const f = {
      q: (q.query.q || "").trim(),
      id_kategori: q.query.id_kategori || "",
      status: q.query.status || "",
      lokasi: (q.query.lokasi || "").trim(),
      dari: q.query.dari || "",
      sampai: q.query.sampai || "",
    };
    const [items, kategori] = await Promise.all([B.all(f), K.all()]);
    s.render("katalog/index", { items, f, kategori });
  } catch (e) {
    console.error(e);
    s.status(500).send("Terjadi kesalahan server");
  }
});
r.get("/:id", auth, async (q, s) => {
  try {
    const item = await B.find(q.params.id);
    if (!item) return s.status(404).send("Barang tidak ditemukan");
    s.render("katalog/detail", { item });
  } catch (e) {
    console.error(e);
    s.status(500).send("Terjadi kesalahan server");
  }
});
module.exports = r;
