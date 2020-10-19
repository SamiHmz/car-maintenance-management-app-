const {
  Vehicule,
  User,
  Categorie,
  Model,
  Marque,
  Caserne,
  Region,
  sequelize,
} = require("../models");
const Joi = require("joi");
const { mapMonth, addTwoTable } = require("./dashbord.controller");

const vehiculeController = {};
const schema = {
  matricule: Joi.string().required(),
  kilometrage: Joi.number().required(),
  status: Joi.string().valid("Active", "En panne", "Pas active").required(),
  model_id: Joi.number().required(),
  categorie_id: Joi.number().required(),
  year: Joi.string().required(),
};

// add vehicule
vehiculeController.ajouterVehicule = async (req, res) => {
  const { body } = req;
  /*********** validation **********/
  const result = Joi.validate(body, schema);
  console.log(result.error);
  if (result.error) {
    return res.status(404).send(result.error.details[0]);
  }

  /************************** check if the vehicules already exists *********************************/

  const check_vehicule = await Vehicule.findByPk(body.matricule);
  if (check_vehicule)
    return res.status(404).send("this vehicule already registred");
  /*************** Inserting the new vehicule *****************/

  try {
    const vehicule = await Vehicule.create({
      matricule: body.matricule,
      user_id: req.user.id,
      kilometrage: body.kilometrage,
      status: body.status,
      model_id: body.model_id,
      categorie_id: body.categorie_id,
      year: body.year,
    });

    res.send(vehicule);
  } catch (error) {
    console.log(error);
    res.send(error.errors[0].message);
  }
};

/*************** get all the  vehicules *****************/
vehiculeController.getAllvehicules = async (req, res) => {
  try {
    const listVehicules = await Vehicule.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Model,
          include: { model: Marque, attributes: ["nom"] },
          attributes: ["nom"],
        },
        { model: Categorie, attributes: ["nom"] },
        {
          model: User,
          include: { model: Caserne, include: { model: Region } },
        },
      ],
      attributes: [
        "matricule",
        "kilometrage",
        "status",
        "year",
        "vehicule_pic",
      ],
    });

    res.send(listVehicules);
  } catch (e) {
    console.log(e);
  }
};

/*************** get vehicule *****************/

vehiculeController.getVehicules = async (req, res) => {
  try {
    const vehicule = await Vehicule.findOne({
      where: {
        user_id: req.user.id,
        matricule: req.params.id,
      },
      include: [
        { model: Model, include: { model: Marque } },
        { model: Categorie },
      ],
    });
    if (!vehicule) return res.status(404).send("this  vehicule not registred ");
    res.send(vehicule);
  } catch (e) {
    console.log(e);
  }
};

/*************************** Update Vehicule *************************************/

vehiculeController.updateVehicule = async (req, res) => {
  let vehicule = await Vehicule.findOne({
    where: {
      user_id: req.user.id,
      matricule: req.params.id,
    },
  });
  if (!vehicule) return res.status(404).send("this  vehicule not registred ");

  const { body } = req;

  /*********** validation **********/
  const result = Joi.validate(body, schema);
  if (result.error)
    return res.status(404).send(result.error.details[0].message);

  try {
    /************ updating the vehicule******************/
    vehicule.year = body.year;
    vehicule.matricule = body.matricule;
    vehicule.kilometrage = body.kilometrage;
    vehicule.status = body.status;
    vehicule.categorie_id = body.categorie_id;
    vehicule.model_id = body.model_id;

    await vehicule.save();
    res.send(vehicule);
  } catch (e) {
    console.log(e);
  }
};
/*************************** delete Vehicule *************************************/
vehiculeController.deleteVehicule = async (req, res) => {
  try {
    let vehicule = await Vehicule.findOne({
      where: {
        user_id: req.user.id,
        matricule: req.params.id,
      },
    });
    if (!vehicule) return res.status(404).send("this  vehicule not registred ");
    await vehicule.destroy();
    res.send(vehicule);
  } catch (e) {
    console.log(e);
  }
};

/*************************suivi vehicule *********************************/

vehiculeController.suiviVehicule = async (req, res) => {
  const ficheTeqnique = {};
  try {
    /************************** info general ****************************/

    const vehicule = await Vehicule.findOne({
      where: { user_id: req.user.id, matricule: req.params.id },
      include: [
        {
          model: Model,
          include: { model: Marque, attributes: ["nom"] },
          attributes: ["nom"],
        },
        { model: Categorie, attributes: ["nom"] },
        {
          model: User,
          include: { model: Caserne, include: { model: Region } },
        },
      ],
      attributes: [
        "matricule",
        "kilometrage",
        "status",
        "year",
        "vehicule_pic",
      ],
    });
    ficheTeqnique.infoGeneral = vehicule;

    // nb panne
    const nb_panne = await sequelize.query(`select count(v.matricule) from vehicule v  
    join problem  p 
        on p.vehicule_id = v.matricule
    where p.vehicule_id = '${req.params.id}'`);

    ficheTeqnique.nb_panne = parseInt(nb_panne[0][0].count);

    // cout carburant par mois

    const cout_carburant_mois = await sequelize.query(`
        select 
        date_part('month',c.date) as month,sum(c.cout) as cout from carburant c 
        join vehicule  v 
        on v.matricule = c.vehicule_id 
        where  date_part('year', (SELECT current_timestamp)) =  date_part('year', c.date) and v.matricule = '${req.params.id}'
        group by date_part('month',c.date) `);

    ficheTeqnique.cout_carburant_mois = mapMonth(cout_carburant_mois[0]);

    // count maintenance par mois

    const cout_maintenance_mois = await sequelize.query(`
    select date_part('month',vm.date_planification) as month ,sum(m.cout) as cout from vehiculemaintenance vm 
    join vehicule v 
    on v.matricule = vm.vehicule_id 
    join maintenance m 
    on m.id = vm.maintenance_id 
    where  date_part('year', (SELECT current_timestamp)) =  date_part('year', vm.date_planification) and v.user_id = ${req.user.id} and v.matricule = '${req.params.id}' 
    group by date_part('month',vm.date_planification) `);

    ficheTeqnique.cout_maintenance_mois = mapMonth(cout_maintenance_mois[0]);

    // count total  par mois
    ficheTeqnique.cout_total_mois = addTwoTable(
      ficheTeqnique.cout_maintenance_mois,
      ficheTeqnique.cout_carburant_mois
    );

    // cout total
    ficheTeqnique.cout_total = ficheTeqnique.cout_total_mois.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );

    // cout carbuant
    ficheTeqnique.cout_carburant = ficheTeqnique.cout_carburant_mois.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );

    // cout maintenance =
    ficheTeqnique.cout_maintenance = ficheTeqnique.cout_maintenance_mois.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );

    res.send(ficheTeqnique);
  } catch (error) {
    console.log(error);
  }
};

module.exports = vehiculeController;
