const { Mission, Vehicule, sequelize } = require("../models");
const Joi = require("joi");
const _ = require("lodash");

const MissionController = {};

const schema = {
  matricule: Joi.string().required(),
  distance: Joi.number().required(),
  vitesse: Joi.number().required().min(20).max(200),
  date_entrer: Joi.string().required(),
  date_sortie: Joi.string().required(),
};

// Ajouter Une Mission
MissionController.ajouterMission = async (req, res) => {
  const { body } = req;

  /*********** validation **********/
  const result = Joi.validate(body, schema);
  if (result.error)
    return res.status(404).send(result.error.details[0].message);

  /*****************cheking if the vehicule exits *****************/
  let vehicule = await Vehicule.findOne({
    where: {
      user_id: req.user.id,
      matricule: body.matricule,
    },
  });
  if (!vehicule) return res.status(404).send("this  vehicule not registred ");
  /*********************** inserting Mission ***********************/

  try {
    const mission = await Mission.create({
      vehicule_id: body.matricule,
      distance: body.distance,
      vitesse: body.vitesse,
      date_entrer: body.date_entrer,
      date_sortie: body.date_sortie,
    });
    res.send(mission);
  } catch (error) {
    console.log(error);
    res.send(error.errors[0].message);
  }
};

MissionController.getMission = async (req, res) => {
  try {
    const missions = await sequelize.query(
      `select c.nom as categorie, ms.id,m.nom as marque_nom,md.nom as nom_model,v.matricule,v.status,ms.date_entrer,ms.date_sortie,ms.distance,ms.vitesse
        from utilisateur u
        join vehicule v
                      on u.id = v.user_id 
        join mission ms
                      on v.matricule = ms.vehicule_id 
        join model md
                      on v.model_id =md.id 
        join marque m 
                      on m.id = md.marque_id 
        join categorie c
                      on c.id = v.categorie_id
        where u.id = ${req.user.id}`
    );
    res.send(missions[0]);
  } catch (error) {
    console.log(error);
  }
};

// get one mission

MissionController.getOneMission = async (req, res) => {
  try {
    const mission = await Mission.findOne({
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
    if (!mission) return res.status(404).send("this mission not registred ");
    res.send(_.omit(mission.dataValues, ["Vehicule", "id"]));
  } catch (error) {
    console.log(error);
  }
};
// Update mission

MissionController.updateMission = async (req, res) => {
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
  let mission = await Mission.findByPk(req.params.id);
  if (!mission) return res.status(404).send("this mission not registred ");
  try {
    /************ updating the problem******************/
    mission.vehicule_id = body.matricule;
    mission.distance = body.distance;
    mission.vitesse = body.vitesse;
    mission.date_entrer = body.date_entrer;
    mission.date_sortie = body.date_sortie;

    await mission.save();
    res.send(mission);
  } catch (e) {
    console.log(e);
  }
};

// delete mission

MissionController.deleteMission = async (req, res) => {
  let mission = await Mission.findOne({
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
  if (!mission) return res.status(404).send("this  mission does not exist ");
  try {
    await mission.destroy();
    res.send(mission);
  } catch (e) {
    console.log(e);
  }
};
module.exports = MissionController;
