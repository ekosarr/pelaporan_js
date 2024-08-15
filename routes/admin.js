var express = require("express");
const ModelUsers = require("../model/model_users");
var router = express.Router();

router.get("/", async function (req, res, next) {
  try {
    // Mendapatkan ID pengguna dari sesi
    let id = req.session.userId;

    // Mendapatkan data pengguna berdasarkan ID
    let userData = await ModelUsers.getById(id);
    if (userData.length > 0) {
      // Pastikan pengguna memiliki peran 'admin'
      if (userData[0].id_role != 1) {
        return res.redirect("/logout");
      } else {
        // Mendapatkan semua data peminjaman dari database
        // Menghitung jumlah peminjaman yang ditolak, yang masih menunggu persetujuan, dan yang disetujui
        // Hitung total peminjaman

        // Render halaman utama dengan data yang diperlukan
        return res.render("users/admin", {
          title: "Users Home",
          nama_users: userData[0].nama_users,
          id_users: userData[0].id_users,
          foto: userData[0].foto,
        });
      }
    } else {
      return res.status(401).json({ error: "User tidak ditemukan" });
    }
  } catch (error) {
    console.log(err);
  }
});

router.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Gagal logout" });
    } else {
      return res.redirect("/login");
    }
  });
});


module.exports = router;
