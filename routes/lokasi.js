var express = require("express");
var router = express.Router();
var connection = require("../config/database.js");
const ModelLokasi = require("../model/model_lokasi.js");
const ModelUser = require("../model/model_user.js");

// Mendapatkan semua lokasi
router.get("/getall", async (req, res) => {
  try {
    let rows = await ModelLokasi.getAll();
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gagal mengambil data lokasi" });
  }
});

// Mendapatkan lokasi berdasarkan ID
router.get("/get/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let row = await ModelLokasi.getById(id);
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

router.get("/byUser/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    // Ambil kejadian dari pengguna
    const userKejadian = await ModelUser.getKejadianByUserId(userId);

    console.log('User Kejadian:', userKejadian); // Log data kejadian

    if (userKejadian.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const kejadianArray = userKejadian[0].kejadian.split(',');

    if (kejadianArray.length === 0) {
      return res.json([]);
    }

    // Buat query SQL dengan parameter placeholder yang benar
    const placeholders = kejadianArray.map(() => '?').join(',');
    const lokasiQuery = `SELECT * FROM lokasi WHERE kejadian IN (${placeholders})`;
    console.log('Lokasi Query:', lokasiQuery); // Log query SQL
    console.log('Kejadian Array:', kejadianArray); // Log data kejadian

    const [lokasiRows] = await connection.query(lokasiQuery, kejadianArray);

    res.json(lokasiRows);
  } catch (err) {
    console.error('Error:', err);  // Tampilkan error di console
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});




module.exports = router;
