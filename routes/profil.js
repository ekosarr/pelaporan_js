var express = require("express");
var router = express.Router();
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const multer = require("multer");
var connection = require("../config/database.js");
const ModelUsers = require("../model/model_users.js");

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

router.get("/", async function (req, res, next) {
    try {
      // Mendapatkan ID pengguna dari sesi
      const id = req.session.userId;
  
      // Mendapatkan data pengguna berdasarkan ID
      const userData = await ModelUsers.getById(id);
      if (userData.length > 0) {

          // Render halaman dengan data yang diperlukan
          return res.render("profil/index", {
            title: "profil Management",
            nama_users: userData[0].nama_users,
            email: userData[0].email,
            id_users: userData[0].id_users,
            nama_role: userData[0].nama_role,
            foto: userData[0].foto,
          });    
      } else {
        return res.status(401).json({ error: "User tidak ditemukan" });
      }
    } catch (error) {
      console.error(error); // Menggunakan console.error untuk log error
      next(error); // Mengoper error ke middleware error handling Express
    }
  });

router.get("/edit/:id", async function (req, res, next) {
  let id = req.params.id;
  let rows = await ModelUsers.getById(id);
  res.render("profil/edit", {
    id: rows[0].id_users,
    nama_users: rows[0].nama_users,
    email: rows[0].email,
    foto: rows[0].foto,
  });
});

router.post("/update/(:id)", upload.single("foto"), async function (req, res, next) {
    try {
      let id = req.params.id;
      let filebaru = req.file ? req.file.filename : null;
      let rows = await ModelUsers.getById(id);
      const namaFileLama = rows[0].foto;
      if (filebaru && namaFileLama) {
        const pathFileLama = path.join(__dirname, "../public/images/upload", namaFileLama);
        fs.unlinkSync(pathFileLama);
      }
      let { nama_users, email } = req.body;
      let foto = filebaru || namaFileLama;
      let data = {
        nama_users,
        email,
        foto, // Perbaikan pada penamaan variabel di sini
      };
      ModelUsers.update(id, data);
      req.flash("success", "Berhasil mengubah data");
      res.redirect("/profil"); // Redirect ke halaman lab_komputer setelah update
    } catch (error) {
      req.flash("error", "Gagal menyimpan data");
      res.redirect("/profil");
    }
  });

module.exports = router;