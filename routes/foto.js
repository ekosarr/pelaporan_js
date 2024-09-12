var express = require("express");
var router = express.Router();
var connection = require("../config/database.js");
const ModelFoto = require("../model/model_foto.js");
const ModelUsers = require("../model/model_users.js");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images/upload");
    },
    filename: (req, file, cb) => {
      console.log(file);
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage: storage });

router.get("/getall", async (req, res) => {
  try {
    let rows = await ModelFoto.getAll();
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gagal mengambil data role" });
  }
});

router.get("/get/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let row = await ModelFoto.getId(id);
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: "Data tidak ditemukan" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gagal mengambil data berdasarkan ID" });
  }
});


router.post("/store" ,upload.single("nama_foto"), async function (req, res, next) {
    try {
      let { id_lokasi } = req.body;
      let data = {
        id_lokasi,
        nama_foto: req.file.filename
      };
  
      // Simpan data menggunakan ModelPosisi.Store
      await ModelFoto.Store(data);
  
      // Kirim respons sukses dalam format JSON
      res.status(200).json({
        success: true,
        message: "Berhasil menambah foto"
      });
    } catch (error) {
      // Log kesalahan ke konsol
      console.error("Gagal menambah foto:", error);
  
      // Kirim respons gagal dalam format JSON
      res.status(500).json({
        success: false,
        message: "Gagal menambah foto"
      });
    }
  });

module.exports = router;
