var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const ModelRole = require("../model/model_role.js");
const ModelUsers = require("../model/model_users.js");

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

router.post("/saveusers", async (req, res) => {
  try {
    let { nama_users, email, password, id_role } = req.body;
    let enkripsi = await bcrypt.hash(password, 10);
    let Data = {
      nama_users,
      email,
      password: enkripsi,
      id_role,
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

router.post("/log", async (req, res) => {
  let { email, password } = req.body;
  try {
    let Data = await ModelUsers.login(email);
    if (Data.length > 0) {
      let enkripsi = Data[0].password;
              let cek = await bcrypt.compare(password, enkripsi);
      if (cek) {
res.json({
          success: true,
          role: Data[0].id_role,
        });
      } else {
        res.json({ success: false, message: "Invalid email or password" });
      }
    } else {
      res.json({ success: false, message: "Account not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
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
