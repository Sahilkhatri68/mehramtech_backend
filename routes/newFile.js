const devices_request_schema = require("../models/devices_request");
const { router } = require("./requestissueDevice");

// code to post request
router.post("/", async (req, res) => {
  console.log(req.body);

  const newProductForService = new devices_request_schema({
    brand: req.body.brand,
    model: req.body.model,
    problem: req.body.problem,
    imei: req.body.imei,
  });
});
