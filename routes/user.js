var express = require("express");
var router = express.Router();
var connection = require("../config/database.js");
const ModelUser = require("../model/model_user.js");

router.get("/getall", async (req, res) => {
  try {
    let rows = await ModelUser.getAll();
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gagal mengambil data role" });
  }
});

router.get("/get/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let row = await ModelUser.getById(id);
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


module.exports = router;
