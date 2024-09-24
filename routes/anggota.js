var express = require("express");
var router = express.Router();
var connection = require("../config/database.js");
const ModelUsers = require("../model/model_users.js");
const ModelRole = require("../model/model_role.js")

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
          // Mendapatkan semua pengguna kecuali admin
          const anggota = await ModelUsers.getAnggota();
  
          // Render halaman dengan data yang diperlukan
          return res.render("anggota/index", {
            title: "User Management",
            nama_users: userData[0].nama_users,
            id_users: userData[0].id_users,
            foto: userData[0].foto,
            users: anggota // Mengirim data semua pengguna kecuali admin
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

  router.get("/filter", async function (req, res, next) {
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
          // Mendapatkan parameter role dari query string
          const role = req.query.role;
  
          let users;
          if (role) {
            // Jika ada role yang dipilih, filter berdasarkan id_role
            users = await ModelUsers.getByRole(role);
          } else {
            // Jika tidak ada role yang dipilih, ambil semua anggota
            users = await ModelUsers.getAnggota();
          }
  
          // Kirim data dalam format JSON
          res.json(users);
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



    router.get('/search', async (req, res) => {
        const query = req.query.query;
        try {
          const [users] = await db.query("SELECT * FROM users WHERE nama_users LIKE ?", [`%${query}%`]);
          res.json(users);
        } catch (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
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
            res.render("anggota/create", {
              title: "Tambah Anggota",
              id_users: userData[0].id_users,
              email: userData[0].email,
              password: userData[0].password,
              nama_users: userData[0].nama_users,
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
  

router.get("/edit/:id", async function (req, res, next) {
  let id = req.params.id;
  let rows = await ModelUsers.getById(id);
  let data = await ModelRole.getAll();
  const rolesWithoutAdmin = data.filter(role => role.id_role !== 1);
  res.render("anggota/edit", {
    id: rows[0].id_users,
    nama_users: rows[0].nama_users,
    email: rows[0].email,
    password: rows[0].password,
    foto: rows[0].foto,
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
    try {
      let id = req.params.id;
      await ModelUsers.delete(id);
      req.flash("success", "Berhasil menghapus Anggota");
    } catch (err) {
      console.error(err);
      req.flash("error", "Terjadi kesalahan saat menghapus Anggota");
    }
    res.redirect("/anggota");
  });

module.exports = router;

