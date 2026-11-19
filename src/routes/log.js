const r = require('express').Router(),
  auth = require('../middleware/auth'),
  role = require('../middleware/roleCheck'),
  Log = require('../models/Log');

r.get('/', auth, role('administrator'), async (q, s) => {
  try {
    const logs = await Log.all();
    s.render('log/index', { logs });
  } catch (e) {
    console.error(e);
    s.status(500).send('Terjadi kesalahan server');
  }
});

module.exports = r;
