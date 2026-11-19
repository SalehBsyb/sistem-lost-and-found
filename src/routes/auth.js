const r=require('express').Router(),bcrypt=require('bcrypt'),P=require('../models/Pengguna'),Log=require('../models/Log');

r.get('/login',(q,s)=>q.session.user?s.redirect('/'):s.render('auth/login',{error:null}));

r.post('/login',async(q,s)=>{
  try{
    const u=await P.findByEmail((q.body.email||'').trim().toLowerCase());
    if(!u)return s.render('auth/login',{error:'Email kampus tidak terdaftar'});
    if(!await bcrypt.compare(q.body.kata_sandi||'',u.kata_sandi))return s.render('auth/login',{error:'Kata sandi salah'});
    q.session.user={id_pengguna:u.id_pengguna,nama_lengkap:u.nama_lengkap,peran_pengguna:u.peran_pengguna,nomor_telepon:u.nomor_telepon,email_kampus:u.email_kampus};
    await Log.add(u.id_pengguna,'Login',null,null,'Pengguna login');
    s.redirect('/');
  }catch(e){console.error(e);s.render('auth/login',{error:'Terjadi kesalahan, silakan coba lagi'})}
});

r.get('/daftar',(q,s)=>q.session.user?s.redirect('/'):s.render('auth/daftar',{error:null,old:null}));

r.post('/daftar',async(q,s)=>{
  const nama=((q.body.nama_lengkap||'').trim());
  const email=((q.body.email||'').trim().toLowerCase());
  const sandi=(q.body.kata_sandi||'');
  const konfirmasi=(q.body.konfirmasi||'');
  const telepon=((q.body.nomor_telepon||'').trim());
  const old={nama_lengkap:nama,email_kampus:email,nomor_telepon:telepon};
  const fail=m=>s.render('auth/daftar',{error:m,old});
  try{
    if(nama.length<3)return fail('Nama lengkap minimal 3 karakter');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return fail('Format email tidak valid');
    if(!/^[^\s@]+@uin-malang\.ac\.id$/.test(email))return fail('Pendaftaran hanya untuk email kampus UIN Malang (@uin-malang.ac.id)');
    if(sandi.length<6)return fail('Kata sandi minimal 6 karakter');
    if(sandi!==konfirmasi)return fail('Konfirmasi kata sandi tidak sama');
    const exists=await P.findByEmail(email);
    if(exists)return fail('Email kampus sudah terdaftar, silakan masuk');
    const hash=await bcrypt.hash(sandi,10);
    const id=await P.create({nama_lengkap:nama,email_kampus:email,kata_sandi:hash,nomor_telepon:telepon});
    await Log.add(id,'Registrasi',null,null,'Akun mahasiswa baru mendaftar: '+email);
    q.session.msg={type:'success',text:'Pendaftaran berhasil! Silakan masuk dengan email dan kata sandi Anda.'};
    s.redirect('/login');
  }catch(e){
    console.error(e);
    if(e&&e.code==='ER_DUP_ENTRY')return fail('Email kampus sudah terdaftar, silakan masuk');
    fail('Terjadi kesalahan, silakan coba lagi');
  }
});

r.post('/logout',(q,s)=>q.session.destroy(()=>s.redirect('/login')));

module.exports=r;
