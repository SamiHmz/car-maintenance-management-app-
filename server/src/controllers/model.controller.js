const { Model } = require("../models");
const ModelController = {};

ModelController.getAllModels = async (req, res) => {
  try {
    const models = await Model.findAll({ attributes: ["id", "nom"] });
    res.send(models);
  } catch (e) {
    console.log(e);
  }
};

ModelController.getMarqueModels = async (req, res) => {
  try {
    const model = await Model.findAll({
      attributes: ["id", "nom"],
      where: { marque_id: req.params.id },
    });
    res.send(model);
  } catch (e) {
    console.log(e);
  }
};

module.exports = ModelController;
