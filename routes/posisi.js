var express = require("express");
var router = express.Router();
var connection = require("../config/database.js");
const ModelPosisi = require("../model/model_posisi.js");
const ModelUsers = require("../model/model_users.js");


router.get("/", async function (req, res, next) {
  try {
    // Mendapatkan ID pengguna dari sesi
    const id = req.session.userId;

    // Mendapatkan data pengguna berdasarkan ID
    const userData = await ModelUsers.getById(id);
    if (userData.length > 0) {
      // Pastikan pengguna memiliki peran 'admin'
      if (userData[0].id_role !== 1) { // Misalnya, '1' adalah ID peran untuk admin
        return res.redirect("/logout");
      } else {
        // Mendapatkan semua data posisi dari database
        const rows = await ModelPosisi.getAll();

        // Menambahkan logika untuk memeriksa penggunaan posisi
        const posisiWithUsage = await Promise.all(rows.map(async (posisi) => {
          const userCount = await ModelPosisi.countByPosisi(posisi.id_posisi);
          return {
            ...posisi,
            isUsed: userCount > 0
          };
        }));

        // Render halaman posisi dengan data yang diperlukan
        return res.render("posisi/index", {
          title: "Posisi Management",
          nama_users: userData[0].nama_users,
          id_users: userData[0].id_users,
          posisi: posisiWithUsage
        });
      }
    } else {
      return res.status(401).json({ error: "User tidak ditemukan" });
    }
  } catch (error) {
    console.error(error); // Menggunakan console.error untuk log error
    next(error); // Mengoper error ke middleware error handling Express
  }
});





router.get("/getall", async (req, res) => {
  try {
    let rows = await ModelPosisi.getAll();
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gagal mengambil data role" });
  }
});


router.get("/create", function (req, res, next) {
  res.render("posisi/create", {
    nama_posisi: "",
  });
});

router.post("/store", async function (req, res, next) {
  try {
    let { nama_posisi } = req.body;
    let data = {
      nama_posisi,
    };
    await ModelPosisi.Store(data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/posisi");
  } catch (error) {
    req.flash("error", "gagal menyimpan data");
    res.redirect("/posisi");
  }
});

router.get("/edit/:id", async function (req, res, next) {
  let id = req.params.id;
  let rows = await ModelPosisi.getId(id);
  res.render("posisi/edit", {
    id: rows[0].id_posisi,
    nama_posisi: rows[0].nama_posisi,
  });
});

router.post("/update/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let nama_posisi = req.body.nama_posisi;
    let data = { nama_posisi };
    let updateSuccess = await ModelPosisi.Update(id, data);
    if (updateSuccess) {
      req.flash("success", "Berhasil mengubah data");
    } else {
      req.flash("error", "Gagal mengubah data");
    }
    res.redirect("/posisi");
  } catch (err) {
    req.flash("error", "Terjadi kesalahan saat mengubah data");
    res.redirect("/posisi");
  }
});


router.get("/delete/:id", async function (req, res, next) {
  let id = req.params.id;
  await ModelPosisi.Delete(id);
  req.flash("success", "Berhasil menghapus data");
  res.redirect("/posisi");
});

module.exports = router;
