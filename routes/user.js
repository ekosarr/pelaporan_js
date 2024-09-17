var express = require("express");
var router = express.Router();
var connection = require("../config/database.js");
const ModelUser = require("../model/model_user.js");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/upload"); 
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/getall", async (req, res) => {
  try {
    let rows = await ModelUser.getAll();
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gagal mengambil data role" });
  }
});

router.get("/get/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let row = await ModelUser.getById(id);
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: "Data tidak ditemukan" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gagal mengambil data berdasarkan ID" });
  }
});

// Mendapatkan lokasi berdasarkan kejadian pengguna
router.get('/lokasi/byUser/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    // Ambil data kejadian pengguna berdasarkan userId
    const userRows = await ModelUser.getKejadianById(userId);
    
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const kejadian = userRows[0].kejadian.split(',');

    // Ambil data lokasi berdasarkan kejadian
    const lokasiQuery = 'SELECT * FROM lokasi WHERE kejadian IN (?)';
    const [lokasiRows] = await connection.query(lokasiQuery, [kejadian]);
    
    res.json(lokasiRows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body;
  try {
    // Ambil data user berdasarkan username
    let Data = await ModelUser.login(username);

    if (Data.length > 0) {
      let enkripsi = Data[0].password; // Password terenkripsi (MD5) dari database
      
      // Buat hash MD5 dari password yang diinputkan
      let hashedPassword = crypto.createHash('md5').update(password).digest('hex');
      
      // Bandingkan password yang di-hash dengan yang ada di database
      if (hashedPassword === enkripsi) {
        req.session.userId = Data[0].id_users; // Set session userId
        
        // Kirim data user ke Flutter bersama dengan pesan sukses
        return res.status(200).json({
          success: true, 
          message: "Login berhasil", 
          user: {
            id: Data[0].id_users,
            username: Data[0].username,
            nama: Data[0].nama,
            nama_tim: Data[0].nama_tim,
            jabatan: Data[0].jabatan,
            status: Data[0].status,
            opd: Data[0].opd,
            kejadian: Data[0].kejadian,
            qr: Data[0].qr,
            foto_user: Data[0].foto_user,
            // Tambahkan data user lainnya yang diperlukan
          }
        });
      } else {
        return res.status(400).json({ success: false, message: "Username atau password salah" });
      }
    } else {
      return res.status(404).json({ success: false, message: "Akun tidak ditemukan" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan" });
  }
});


module.exports = router;
