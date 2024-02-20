const express = require("express");
const router = express.Router();

const gsmarena = require("gsmarena-api");
router.get("/", async (req, res) => {
  try {
    const brands = await gsmarena.catalog.getDevice("realme_12_pro+-12804");
    // const devices = await gsmarena.search.search("realme_12_pro");
    console.log(brands);
    res.send({
      message: brands,
    });
  } catch (error) {}
});

module.exports = router;
