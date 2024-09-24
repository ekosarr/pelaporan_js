var express = require("express");
var router = express.Router();
var connection = require("../config/database.js");
const ModelUsers = require("../model/model_users.js");
const ModelAnggotaGrup = require("../model/model_anggotaGrup.js");
const ModelGroup = require("../model/model_group.js");
const ModelPosisi = require("../model/model_posisi.js");

router.get("/", async function (req, res, next) {
  try {
    // Mendapatkan ID pengguna dari sesi
    const id = req.session.userId;
    // Mendapatkan data pengguna berdasarkan ID
    const userData = await ModelUsers.getById(id);
    if (userData.length > 0) {
      // Pastikan pengguna memiliki peran 'admin'
      if (userData[0].id_role !== 1) {
        // Misalnya, '1' adalah ID peran untuk admin
        return res.redirect("/logout");
      } else {
        // Mendapatkan semua pengguna kecuali admin
        const grup = await ModelAnggotaGrup.getAll();
        const group = await ModelGroup.getAll();
        // Render halaman dengan data yang diperlukan
        return res.render("anggotagrup/index", {
          title: "User Management",
          nama_users: userData[0].nama_users,
          id_users: userData[0].id_users,
          foto: userData[0].foto,
          group: group,
          grup: grup, // Mengirim data semua pengguna kecuali admin
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
    let grup = await ModelAnggotaGrup.getAll();
    res.json(grup);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gagal mengambil data group" });
  }
});

// routes/anggotagrup.js
router.get("/create", async function (req, res, next) {
  try {
    const id = req.session.userId;
    const userData = await ModelUsers.getById(id);
    if (userData.length > 0) {
      if (userData[0].id_role !== 1) {
        return res.redirect("/logout");
      } else {
        let group = await ModelGroup.getAll();
        let posisi = await ModelPosisi.getAll();
        // Mendapatkan pengguna yang belum bergabung dalam grup manapun
        let users = await ModelAnggotaGrup.getUsersBelumGroup();

        res.render("anggotagrup/create", {
          title: "Tambah Anggota",
          id_users: userData[0].id_users,
          email: userData[0].email,
          password: userData[0].password,
          nama_users: userData[0].nama_users,
          group: group,
          users: users,
          posisi: posisi,
        });
      }
    } else {
      return res.status(401).json({ error: "User tidak ditemukan" });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/store", async function (req, res, next) {
  try {
    let { id_group, id_users, id_posisi } = req.body;
    console.log("Received data:", { id_group, id_users, id_posisi })
    let data = { id_group, id_users, id_posisi };
    // Simpan data baru ke tabel groupmembers
    await ModelAnggotaGrup.Store(data); // Menggunakan ModelAnggotaGrup
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/anggotagrup");
  } catch (error) {
    console.error("Error saving data:", error); // Logging the error
    req.flash("error", "Gagal menyimpan data: " + error.message); // Include error message
    res.redirect("/anggotagrup");
  }
});

router.get("/edit/:id", async function (req, res, next) {
  let id = req.params.id;
  let rows = await ModelUsers.getById(id);
  let data = await ModelAnggotaGrup.getAll();
  res.render("anggotagrup/edit", {
    id: rows[0].id_users,
    nama_users: rows[0].nama_users,
    email: rows[0].email,
    password: rows[0].password,
    foto: rows[0].foto,
    id_role: rows[0].id_role,
    data: data,
  });
});

router.post("/update/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let id_users = req.body.id_users;
    let id_posisi = req.body.id_posisi; // pastikan ini sesuai dengan data yang ingin diupdate
    let data = { id_users, id_posisi }; // sesuaikan dengan kolom yang ada di tabel group
    let updateSuccess = await ModelAnggotaGrup.Update(id, data);
    if (updateSuccess) {
      req.flash("success", "Berhasil mengubah data");
    } else {
      req.flash("error", "Gagal mengubah data");
    }
    res.redirect("/anggotagrup");
  } catch (err) {
    req.flash("error", "Terjadi kesalahan saat mengubah data");
    res.redirect("/anggotagrup");
  }
});

router.get("/delete/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    await ModelAnggotaGrup.Delete(id);
    req.flash("success", "Berhasil menghapus Anggota");
  } catch (err) {
    console.error("Error during delete operation:", err); // Menampilkan detail kesalahan di console
    req.flash("error", "Terjadi kesalahan saat menghapus Anggota");
  }
  res.redirect("/anggotagrup");
});

// Route to get role ID based on group ID
router.get('/getRole/:id_group', async (req, res) => {
  const groupId = req.params.id_group;
  try {
    // Query to get role ID based on group ID
    const result = await ModelGroup.getRoleByGroupId(groupId);
    const roleId = result[0]?.id_role;
    if (roleId) {
      res.json({ success: true, roleId: roleId });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to get users based on role ID
router.get('/getUsers/:id_role', async (req, res) => {
  const roleId = req.params.id_role;
  try {
    // Query to get users based on role ID
    const users = await ModelUsers.getByRoleBelumGroup(roleId);
    res.json({ users: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/filter/:id_group', async (req, res) => {
  const id_group = req.params.id_group;

  try {
    if (id_group === "semua") {
      // Jika id_group adalah "semua", ambil semua anggota
      const grup = await ModelAnggotaGrup.getAll();
      res.json({ success: true, grup });
    } else {
      // Jika id_group bukan "semua", ambil anggota berdasarkan grup
      const members = await ModelAnggotaGrup.getMembersByGroup(id_group);
      res.json({ success: true, members });
    }
  } catch (error) {
    console.error("Error in filtering members:", error);
    res.json({ success: false, message: "Gagal mengambil data anggota" });
  }
});


module.exports = router;
