const r = require('express').Router(),
  auth = require('../middleware/auth'),
  B = require('../models/BarangTemuan'),
  K = require('../models/Klaim'),
  L = require('../models/LaporanKehilangan');

r.get('/', auth, async (q, s) => {
  try {
    const recentItems = await B.recent();
    if (q.session.user.peran_pengguna === 'mahasiswa') {
      return s.render('dashboard/mahasiswa', { recentItems });
    }

    const [totalTemuan, tersedia, pendingClaims, activeLost, recentClaims] = await Promise.all([
      B.count(),
      B.count('Tersedia'),
      K.countPending(),
      L.countActive(),
      K.pending()
    ]);

    const stats = { totalTemuan, tersedia, pendingClaims, activeLost };
    s.render('dashboard/staff', { recentItems, recentClaims, stats });
  } catch (e) {
    console.error(e);
    s.status(500).send('Terjadi kesalahan server');
  }
});

module.exports = r;
