require("dotenv").config();
const express = require("express"),
  session = require("express-session"),
  path = require("path"),
  multer = require("multer"),
  fs = require("fs");
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.msg = req.session.msg;
  delete req.session.msg;
  next();
});
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (r, f, cb) =>
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(f.originalname).toLowerCase(),
    ),
});
app.locals.upload = multer({
  storage,
  fileFilter: (r, f, cb) => cb(null, /\.(jpg|jpeg|png)$/i.test(f.originalname)),
  limits: { fileSize: 5 * 1024 * 1024 },
});
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/dashboard"));
app.use("/katalog", require("./routes/katalog"));
app.use("/lapor", require("./routes/laporan"));
app.use("/klaim", require("./routes/klaim"));
app.use("/verifikasi", require("./routes/verifikasi"));
app.use("/kategori", require("./routes/kategori"));
app.use("/laporan", require("./routes/laporanRekap"));
app.use("/aktivitas", require("./routes/aktivitas"));
app.use("/log", require("./routes/log"));
app.use((e, req, res, next) => {
  console.error(e);
  res.status(500).send("Terjadi kesalahan server");
});
app.listen(process.env.PORT || 3000, () =>
  console.log("Server berjalan di port " + (process.env.PORT || 3000)),
);
