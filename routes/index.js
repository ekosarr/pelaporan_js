var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const multer = require("multer");
const ModelRole = require("../model/model_role.js");
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

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/register", async function (req, res, next) {
  let rows = await ModelRole.getAll();
  res.render("auth/register", {
    data: rows,
  });
});

router.get("/login", function (req, res, next) {
  res.render("auth/login");
});

router.post("/saveusers", upload.single("foto"), async (req, res) => {
  try {
    let { nama_users, email, password, id_role } = req.body;
    let enkripsi = await bcrypt.hash(password, 10);
    let Data = {
      nama_users,
      email,
      password: enkripsi,
      id_role,
      foto: req.file.filename,
    };
    await ModelUsers.store(Data);
    req.flash("success", "Berhasil membuat pengguna");
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    req.flash("error", "Gagal menyimpan pengguna");
    res.redirect("/register");
  }
});


router.post("/tambahAnggota", upload.single("foto"), async (req, res) => {
  try {
    let { nama_users, email, password, id_role } = req.body;
    let enkripsi = await bcrypt.hash(password, 10);
    let Data = {
      nama_users,
      email,
      password: enkripsi,
      id_role,
      foto: req.file.filename,
    };
    await ModelUsers.store(Data);
    req.flash("success", "Berhasil menambah anggota");
    res.redirect("/anggota");
  } catch (error) {
    console.log(error);
    req.flash("error", "Gagal menambah pengguna");
    res.redirect("/anggota");
  }
});

router.post("/log", async (req, res) => {
  let { email, password } = req.body;
  try {
    let Data = await ModelUsers.login(email);
    console.log("Data raka:", Data);
    if (Data.length > 0) {
      let enkripsi = Data[0].password;
      let cek = await bcrypt.compare(password, enkripsi);
      if (cek) {
        req.session.userId = Data[0].id_users;
        if (Data[0].id_role === 1) {
          req.flash("success", "Berhasil login");
          return res.redirect("/admin");
        } else if (Data[0].id_role === 3) {
          req.flash("success", "Berhasil login");
          return res.redirect("/damkar");
        } else if (Data[0].id_role === 4) {
          req.flash("success", "Berhasil login");
          return res.redirect("/satpol_pp");
        } else {
          req.flash("error", "Terjadi kesalahan");
          return res.redirect("/login");
        }
      } else {
        req.flash("error", "Email atau password salah");
        return res.redirect("/login");
      }
    } else {
      req.flash("error", "Akun tidak ditemukan");
      return res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
    req.flash("error", "Terjadi kesalahan");
    return res.redirect("/login");
  }
});

router.get("/api/users", async (req, res) => {
  try {
    let users = await ModelUsers.getAll();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

router.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
    } else {
      res.redirect("/login");
    }
  });
});

module.exports = router;
