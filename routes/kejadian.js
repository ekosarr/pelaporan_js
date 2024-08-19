var express = require("express");
var router = express.Router();
var connection = require("../config/database.js");
const ModelKejadian = require("../model/model_kejadian.js");
const model_users = require("../model/model_users.js");

router.get("/", async function (req, res, next) {
  try {
    // Mendapatkan ID pengguna dari sesi
    const id = req.session.userId;

    // Mendapatkan data pengguna berdasarkan ID
    const userData = await model_users.getById(id);
    if (userData.length > 0) {
      // Pastikan pengguna memiliki peran 'admin'
      if (userData[0].id_role !== 1) { // Misalnya, '1' adalah ID peran untuk admin
        return res.redirect("/logout");
      } else {
        // Mendapatkan semua data kejadian dari database
        const rowskejadian = await ModelKejadian.getAll();

        // Render halaman kejadian dengan data yang diperlukan
        return res.render("kejadian/index", {
          title: "kejadian Management",
          id_kejadian: userData[0].id_kejadian,
          id_users: userData[0].id_users,
          nama_users: userData[0].nama_users,
          foto: userData[0].foto,
          kejadian: userData[0].kejadian,
          kecamatan: userData[0].kecamatan,
          nama_pelapor: userData[0].nama_pelapor,
          nomor_pelapor: userData[0].nomor_pelapor,
          tanggal_kejadian: userData[0].tanggal_kejadian,
          alamat_kejadian: userData[0].alamat_kejadian,
          keterangan: userData[0].keterangan,
          data: rowskejadian,
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
    let data = await ModelKejadian.getAll();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gagal mengambil data kejadian" });
  }
});

router.get("/get/:id", async (req, res) => {
  try {
    const id = req.params.id; // Get the ID from the request parameters
    let data = await ModelKejadian.getId(id); // Fetch data by ID using the model's method
    if (data.length > 0) {
      res.json(data); // Return the data if found
    } else {
      res.status(404).json({ error: "Data tidak ditemukan" }); // Return a 404 if no data is found
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gagal mengambil data kejadian" }); // Return a 500 if there's an error
  }
});



router.get("/create", function (req, res, next) {
  res.render("kejadian/create", {
    kejadian: "",
    kecamatan: "",
    nama_pelapor: "",
    nomor_pelapor: "",
    tanggal_kejadian: "",
    alamat_kejadian: "",
    keterangan: ""
  });
});

router.post("/store", async function (req, res, next) {
  try {
    let { kejadian, kecamatan, nama_pelapor, nomor_pelapor, tanggal_kejadian, alamat_kejadian, keterangan } = req.body;

    // Log data yang diterima
    console.log('Data yang diterima:', req.body);

    let data = {
      kejadian,
      kecamatan,
      nama_pelapor,
      nomor_pelapor,
      tanggal_kejadian,
      alamat_kejadian,
      keterangan,
    };

    // Simpan data
    await ModelKejadian.Store(data);

    // Log sukses
    console.log('Data berhasil disimpan');

    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/kejadian");
  } catch (error) {
    // Log error
    console.error('Error saat menyimpan data:', error);

    req.flash("error", "Gagal menyimpan data");
    res.redirect("/kejadian");
  }
});

router.get("/edit/:id", async function (req, res, next) {
  let id = req.params.id;
  let rows = await ModelKejadian.getId(id);
  res.render("kejadian/edit", {
    id: rows[0].id_kejadian,
    kejadian: rows[0].kejadian,
    kecamatan: rows[0].kecamatan,
    nama_pelapor: rows[0].nama_pelapor,
    nomor_pelapor: rows[0].nomor_pelapor,
    tanggal_kejadian: rows[0].tanggal_kejadian,
    alamat_kejadian: rows[0].alamat_kejadian,
    keterangan: rows[0].keterangan,
  });
});

router.post("/update/:id", async function (req, res) {
  try {
    const id = req.params.id;
    
    // Extract the required fields from req.body
    const { kejadian, kecamatan, nama_pelapor, nomor_pelapor, tanggal_kejadian, alamat_kejadian, keterangan } = req.body;

    // Validate that all necessary fields are present
    if (!kejadian || !kecamatan || !nama_pelapor || !nomor_pelapor || !tanggal_kejadian || !alamat_kejadian || !keterangan) {
      req.flash("error", "Semua kolom harus diisi");
      return res.redirect("/kejadian");
    }

    // Construct the data object for the update
    const data = { kejadian, kecamatan, nama_pelapor, nomor_pelapor, tanggal_kejadian, alamat_kejadian, keterangan };
    
    // Attempt to update the record in the database
    const updateSuccess = await ModelKejadian.Update(id, data);

    if (updateSuccess) {
      req.flash("success", "Berhasil mengubah data");
    } else {
      req.flash("error", "Gagal mengubah data");
    }
    
    // Redirect back to the kejadian page
    res.redirect("/kejadian");

  } catch (err) {
    console.error(err);
    req.flash("error", "Terjadi kesalahan saat mengubah data");
    res.redirect("/kejadian");
  }
});



router.get("/delete/:id", async function (req, res, next) {
  let id = req.params.id;
  await ModelKejadian.Delete(id);
  req.flash("success", "Berhasil menghapus data");
  res.redirect("/kejadian");
});



module.exports = router;
