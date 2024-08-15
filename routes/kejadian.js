var express = require("express");
var router = express.Router();
var connection = require("../config/database.js");
const ModelKejadian = require("../model/model_kejadian.js");


router.get("/getall", async (req, res) => {
  try {
    let data = await ModelKejadian.getAll();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gagal mengambil data role" });
  }
});

module.exports = router;
