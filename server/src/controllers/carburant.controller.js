const { Carburant, Vehicule, sequelize } = require("../models");
const Joi = require("joi");
const _ = require("lodash");

const CarburantController = {};

const schema = {
  matricule: Joi.string().required(),
  volume: Joi.number().required(),
  cout: Joi.number().required(),
  date: Joi.string().required(),
};

// Ajouter Carburant
CarburantController.ajouterCarburant = async (req, res) => {
  const { body } = req;

  /*********** validation **********/
  const result = Joi.validate(body, schema);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  /*****************cheking if the vehicule exits *****************/
  let vehicule = await Vehicule.findOne({
    where: {
      user_id: req.user.id,
      matricule: body.matricule,
    },
  });
  if (!vehicule) return res.status(404).send("this  vehicule not registred ");
  /*********************** inserting carburant ***********************/

  try {
    const carburant = await Carburant.create({
      vehicule_id: body.matricule,
      volume: body.volume,
      cout: body.cout,
      date: body.date,
    });
    res.send(carburant);
  } catch (error) {
    console.log(error);
    res.send(error.errors[0].message);
  }
};
// get all Carburant

CarburantController.getCarburant = async (req, res) => {
  try {
    const carburant = await sequelize.query(
      `select ca.nom as categorie,c.id,m.nom as marque_nom,md.nom as nom_model,v.matricule,v.status,c.volume ,c.date,c.cout
        from utilisateur u
        join vehicule v
            on u.id = v.user_id 
        join carburant c
            on v.matricule = c.vehicule_id 
        join model md
            on v.model_id =md.id 
        join marque m 
            on m.id = md.marque_id 
        join categorie ca
            on ca.id = v.categorie_id
        where u.id = ${req.user.id} `
    );
    res.send(carburant[0]);
  } catch (error) {
    console.log(error);
  }
};
// get one carburant
CarburantController.getOneCarburant = async (req, res) => {
  try {
    const carburant = await Carburant.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Vehicule,
          where: { user_id: req.user.id },
        },
      ],
    });
    if (!carburant)
      return res.status(404).send("consommation de carburant  not registred ");
    res.send(_.omit(carburant.dataValues, ["Vehicule"]));
  } catch (error) {
    console.log(error);
  }
};

// Update Carburant

CarburantController.updateCaburant = async (req, res) => {
  const { body } = req;

  /*********** validation **********/
  const result = Joi.validate(body, schema);
  if (result.error)
    return res.status(404).send(result.error.details[0].message);

  /******************* check if the vehicule exist ****************/
  let vehicule = await Vehicule.findOne({
    where: {
      user_id: req.user.id,
      matricule: body.matricule,
    },
  });

  if (!vehicule) return res.status(404).send("this  vehicule not registred ");

  /******************* check if the carburant exist ****************/
  let carburant = await Carburant.findByPk(req.params.id);
  if (!carburant) return res.status(404).send("this carburant not registred ");
  try {
    /************ updating the problem******************/
    carburant.vehicule_id = body.matricule;
    carburant.volume = body.volume;
    carburant.cout = body.cout;

    await carburant.save();
    res.send(carburant);
  } catch (e) {
    console.log(e);
  }
};

// delete carburant

CarburantController.deleteCaburant = async (req, res) => {
  let carburant = await Carburant.findOne({
    where: {
      id: req.params.id,
    },
    include: {
      model: Vehicule,
      where: {
        user_id: req.user.id,
      },
    },
  });
  if (!carburant)
    return res.status(404).send("this  carburant does not exist ");
  try {
    await carburant.destroy();
    res.send(carburant);
  } catch (e) {
    console.log(e);
  }
};

module.exports = CarburantController;
