const express = require("express");
const router = express.Router();
const gsmarena = require("gsmarena-api");

router.get("/", async (req, res) => {
  try {
    // Get the list of brands
    const brands = await gsmarena.catalog.getBrands();
    console.log("Brands:", brands);

    // Iterate through each brand and fetch devices
    for (const brand of brands) {
      const devices = await gsmarena.catalog.getBrand(brand.id); // Assuming brand.id is the correct property to use
      console.log(`Devices for ${brand.title}:`, devices);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

module.exports = router;
