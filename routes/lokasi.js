var express = require("express");
var router = express.Router();
var connection = require("../config/database.js");
const ModelLokasi = require("../model/model_lokasi.js");

router.get("/getall", async (req, res) => {
  try {
    let rows = await ModelLokasi.getAll();
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gagal mengambil data role" });
  }
});


module.exports = router;
