var express = require("express");
var router = express.Router();
var connection = require("../config/database.js");
const ModelGroup = require("../model/model_group.js");
const ModelUsers = require("../model/model_users.js");
const ModelRole = require("../model/model_role.js");


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
          // Mendapatkan semua data grup dari database
          const groups = await ModelGroup.getAll();
  
          // Menambahkan logika untuk memeriksa penggunaan grup
          const groupsWithUsage = await Promise.all(groups.map(async (group) => {
            const userCount = await ModelGroup.countByGroup(group.id_group);
            return {
              ...group,
              isUsed: userCount > 0
            };
          }));
  
          // Render halaman grup dengan data yang diperlukan
          return res.render("group/index", {
            title: "Group Management",
            nama_users: userData[0].nama_users,
            id_users: userData[0].id_users,
            foto: userData[0].foto,
            groups: groupsWithUsage
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
    let groups = await ModelGroup.getAll();
    res.json(groups);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gagal mengambil data group" });
  }
});


router.get("/create", async function (req, res, next) {
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
        // Mendapatkan semua peran
        let rows = await ModelRole.getAll();
        // Filter peran untuk menghilangkan peran admin
        const rolesWithoutAdmin = rows.filter(role => role.id_role !== 1);

        // Render halaman tambah grup
        res.render("group/create", {
          title: "Tambah Group",
          nama_users: userData[0].nama_users,
          id_users: userData[0].id_users,
          data: rolesWithoutAdmin, // Kirim data yang sudah difilter
          nama_group: "",
          id_role: ""
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


  router.post("/store", async function (req, res, next) {
    try {
      let { nama_group, id_role } = req.body;
      let data = {
        nama_group,
        id_role,
      };
      await ModelGroup.Store(data);
      req.flash("success", "Berhasil menyimpan data");
      res.redirect("/group");
    } catch (error) {
      console.error("Error saving data:", error); // Logging the error
      req.flash("error", "Gagal menyimpan data: " + error.message); // Include error message
      res.redirect("/group");
    }
  });
  

router.get("/edit/:id", async function (req, res, next) {
  let id = req.params.id;
  let rows = await ModelGroup.getId(id);
  let data = await ModelRole.getAll();
  const rolesWithoutAdmin = data.filter(role => role.id_role !== 1);
  res.render("group/edit", {
    id: rows[0].id_group,
    nama_group: rows[0].nama_group,
    id_role: rows[0].id_role,
    data: rolesWithoutAdmin,
  });
});

router.post("/update/:id", async function (req, res, next) {
    try {
      let id = req.params.id;
      let nama_group = req.body.nama_group;
      let id_role = req.body.id_role; // pastikan ini sesuai dengan data yang ingin diupdate
      let data = { nama_group, id_role }; // sesuaikan dengan kolom yang ada di tabel group
      let updateSuccess = await ModelGroup.Update(id, data);
      if (updateSuccess) {
        req.flash("success", "Berhasil mengubah data");
      } else {
        req.flash("error", "Gagal mengubah data");
      }
      res.redirect("/group");
    } catch (err) {
      req.flash("error", "Terjadi kesalahan saat mengubah data");
      res.redirect("/group");
    }
  });


router.get("/delete/:id", async function (req, res, next) {
  let id = req.params.id;
  await ModelGroup.Delete(id);
  req.flash("success", "Berhasil menghapus group");
  res.redirect("/group");
});

module.exports = router;

