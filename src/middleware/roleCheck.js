module.exports =
  (...roles) =>
  (req, res, next) =>
    roles.includes(req.session.user?.peran_pengguna)
      ? next()
      : res.status(403).send("Akses ditolak");
