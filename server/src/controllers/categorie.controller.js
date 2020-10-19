const { Categorie } = require("../models");
const CategorieController = {};

CategorieController.getAllCategories = async (req, res) => {
  try {
    const Categories = await Categorie.findAll();
    res.send(Categories);
  } catch (e) {
    console.log(e);
  }
};

module.exports = CategorieController;
