const { Region } = require("../models");
const RegionController = {};

RegionController.getAllRegions = async (req, res) => {
  try {
    const regions = await Region.findAll();
    res.send(regions);
  } catch (e) {
    console.log(e);
  }
};

module.exports = RegionController;
