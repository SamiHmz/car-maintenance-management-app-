const { Marque } = require("../models");
const MarqueController = {};

MarqueController.getAllMarques = async (req, res) => {
  try {
    const marques = await Marque.findAll();
    res.send(marques);
  } catch (e) {
    console.log(e);
  }
};

module.exports = MarqueController;
