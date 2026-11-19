const r = require("express").Router(),
  auth = require("../middleware/auth"),
  role = require("../middleware/roleCheck"),
  K = require("../models/Kategori"),
  Log = require("../models/Log");
r.use(auth, role("administrator"));
r.get("/", async (q, s) => {
  try {
    const list = await K.all();
    s.render("kategori/index", { list, error: null });
  } catch (e) {
    console.error(e);
    s.status(500).send("Terjadi kesalahan server");
  }
});
r.post("/", async (q, s) => {
  try {
    const nama = (q.body.nama_kategori || "").trim();
    if (!nama) {
      q.session.msg = {
        type: "danger",
        text: "Nama kategori tidak boleh kosong",
      };
      return s.redirect("/kategori");
    }
    await K.create(nama);
    await Log.add(
      q.session.user.id_pengguna,
      "Tambah Kategori",
      "kategori_barang",
      null,
      `Kategori ${nama} ditambahkan`,
    );
    q.session.msg = { type: "success", text: "Kategori berhasil ditambahkan" };
    s.redirect("/kategori");
  } catch (e) {
    console.error(e);
    q.session.msg = {
      type: "danger",
      text: "Kategori sudah ada atau gagal disimpan",
    };
    s.redirect("/kategori");
  }
});
r.post("/:id/edit", async (q, s) => {
  try {
    const nama = (q.body.nama_kategori || "").trim();
    if (!nama) {
      q.session.msg = {
        type: "danger",
        text: "Nama kategori tidak boleh kosong",
      };
      return s.redirect("/kategori");
    }
    await K.update(q.params.id, nama);
    await Log.add(
      q.session.user.id_pengguna,
      "Edit Kategori",
      "kategori_barang",
      q.params.id,
      `Kategori diubah menjadi ${nama}`,
    );
    q.session.msg = { type: "success", text: "Kategori berhasil diubah" };
    s.redirect("/kategori");
  } catch (e) {
    console.error(e);
    q.session.msg = { type: "danger", text: "Gagal mengubah kategori" };
    s.redirect("/kategori");
  }
});
r.post("/:id/delete", async (q, s) => {
  try {
    if (await K.used(q.params.id)) {
      q.session.msg = {
        type: "danger",
        text: "Kategori tidak dapat dihapus karena masih digunakan pada laporan atau barang temuan",
      };
      return s.redirect("/kategori");
    }
    await K.remove(q.params.id);
    await Log.add(
      q.session.user.id_pengguna,
      "Hapus Kategori",
      "kategori_barang",
      q.params.id,
      "Kategori dihapus",
    );
    q.session.msg = { type: "success", text: "Kategori berhasil dihapus" };
    s.redirect("/kategori");
  } catch (e) {
    console.error(e);
    q.session.msg = { type: "danger", text: "Gagal menghapus kategori" };
    s.redirect("/kategori");
  }
});
module.exports = r;
