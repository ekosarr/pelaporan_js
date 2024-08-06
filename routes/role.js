var express = require("express");
var router = express.Router();
var connection = require("../config/database.js");
const ModelRole = require("../model/model_role.js");
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
        // Mendapatkan semua data peran dari database
        const roles = await ModelRole.getAll();

        // Menambahkan logika untuk memeriksa penggunaan role
        const rolesWithUsage = await Promise.all(roles.map(async (role) => {
          const userCount = await ModelRole.countByRole(role.id_role);
          return {
            ...role,
            isUsed: userCount > 0
          };
        }));

        // Render halaman role dengan data yang diperlukan
        return res.render("role/index", {
          title: "Role Management",
          nama_users: userData[0].nama_users,
          id_users: userData[0].id_users,
          roles: rolesWithUsage
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
    let roles = await ModelRole.getAll();
    res.json(roles);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gagal mengambil data role" });
  }
});


router.get("/create", function (req, res, next) {
  res.render("role/create", {
    nama_role: "",
  });
});

router.post("/store", async function (req, res, next) {
  try {
    let { nama_role } = req.body;
    let data = {
      nama_role,
    };
    await ModelRole.Store(data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/role");
  } catch (error) {
    req.flash("error", "gagal menyimpan data");
    res.redirect("/role");
  }
});

router.get("/edit/:id", async function (req, res, next) {
  let id = req.params.id;
  let rows = await ModelRole.getId(id);
  res.render("role/edit", {
    id: rows[0].id_role,
    nama_role: rows[0].nama_role,
  });
});

router.post("/update/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let nama_role = req.body.nama_role;
    let data = { nama_role };
    let updateSuccess = await ModelRole.Update(id, data);
    if (updateSuccess) {
      req.flash("success", "Berhasil mengubah data");
    } else {
      req.flash("error", "Gagal mengubah data");
    }
    res.redirect("/role");
  } catch (err) {
    req.flash("error", "Terjadi kesalahan saat mengubah data");
    res.redirect("/role");
  }
});


router.get("/delete/:id", async function (req, res, next) {
  let id = req.params.id;
  await ModelRole.Delete(id);
  req.flash("success", "Berhasil menghapus data");
  res.redirect("/role");
});

module.exports = router;
