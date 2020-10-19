const { Caserne } = require("../models");
const CaserneController = {};

CaserneController.getAllCasernes = async (req, res) => {
  try {
    const casernes = await Caserne.findAll({ attributes: ["id", "nom"] });
    res.send(casernes);
  } catch (e) {
    console.log(e);
  }
};

CaserneController.getRegionCasernes = async (req, res) => {
  try {
    const caserne = await Caserne.findAll({
      attributes: ["id", "nom"],
      where: { region_id: req.params.id },
    });
    res.send(caserne);
  } catch (e) {
    console.log(e);
  }
};

module.exports = CaserneController;
