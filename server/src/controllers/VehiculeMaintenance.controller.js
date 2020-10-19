const {
  Maintenance,
  Vehicule,
  VehiculeMaintenance,
  sequelize,
} = require("../models");
const _ = require("lodash");

const Joi = require("joi");

const VehiculeMaintenanceController = {};

const addDays = (days) => {
  var someDate = new Date();
  return someDate.setDate(someDate.getDate() + days);
};

const getDays = (unit, interval) => {
  if (unit === "jour") return interval * 1;
  else if (unit === "semaine") return interval * 7;
  else if (unit === "mois") return interval * 30;
  else if (unit === "annee") return interval * 365;
};

const schema = {
  matricule: Joi.string().required(),
  maintenance_id: Joi.number().required(),
  frequence_km: Joi.number().required(),
  unit: Joi.any().allow("jour", "semaine", "mois", "ans"),
  interval: Joi.number().required(),
};

// ajouter vehiculemaintenance
VehiculeMaintenanceController.ajouterMaintenance = async (req, res) => {
  const { body } = req;

  /*********** validation **********/
  const result = Joi.validate(body, schema);
  if (result.error)
    return res.status(404).send(result.error.details[0].message);

  /*****************cheking id the vehicule exits *****************/
  const vehicule = await Vehicule.findOne({
    where: {
      user_id: req.user.id,
      matricule: body.matricule,
    },
  });
  if (!vehicule) return res.status(404).send("Vehicule not registred");

  /***************************cheking if the maintenance exist *************************************/
  const maintenance = await Maintenance.findByPk(body.maintenance_id);
  if (!maintenance) return res.status(404).send("maintenance  not registred");

  /************************* inserting maintenance *************************/
  try {
    /************* calcule date de planification*************/

    const datePlanification = addDays(getDays(body.unit, body.interval));

    /************* get curent km *************/

    const vehicule = await Vehicule.findByPk(body.matricule);
    const km =
      parseInt(vehicule.dataValues.kilometrage) + parseInt(body.frequence_km);
    const vehicule_maintenance = await VehiculeMaintenance.create({
      vehicule_id: body.matricule,
      maintenance_id: body.maintenance_id,
      frequence_km: body.frequence_km,
      planification_km: km,
      unit: body.unit,
      interval: body.interval,
      date_planification: datePlanification,
    });

    res.send(vehicule_maintenance);
  } catch (error) {
    console.log(error);
    res.send(error.errors[0].message);
  }
};

// get all maintenanceVehicule

VehiculeMaintenanceController.getVehiculeMainteannce = async (req, res) => {
  try {
    const VehiculeMaintenances = await sequelize.query(
      `select c.nom as categorie,vm.date_planification,vm.id,mt.nom,mt.cout,m.nom as marque_nom,md.nom as nom_model,v.matricule,v.status,vm.date_planification,vm.frequence_km,vm.unit,vm.interval
from utilisateur u
join vehicule v
              on u.id = v.user_id               
join vehiculemaintenance vm
              on v.matricule = vm.vehicule_id 
join maintenance mt 
              on vm.maintenance_id = mt.id
join model md
              on v.model_id =md.id 
join marque m 
              on m.id = md.marque_id 
join categorie c
              on c.id = v.categorie_id
where u.id = ${req.user.id} 
`
    );
    res.send(VehiculeMaintenances[0]);
  } catch (error) {
    console.log(error);
  }
};

// get one  maintenanceVehicule

VehiculeMaintenanceController.getOneMaintenanceVehicule = async (req, res) => {
  try {
    const vehiculeMaintenance = await VehiculeMaintenance.findOne({
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
    if (!vehiculeMaintenance)
      return res.status(404).send("this  maintenance not registred ");
    const response = _.omit(vehiculeMaintenance.dataValues, [
      "Vehicule",
      "date_planification",
    ]);
    res.send(response);
  } catch (e) {
    console.log(e);
  }
};

// update Maintenance Vehicule

VehiculeMaintenanceController.updateMaintenanceVehicule = async (req, res) => {
  const { body } = req;

  const vehiculeMaintenance = await VehiculeMaintenance.findOne({
    where: {
      id: req.params.id,
    },
    include: [{ model: Vehicule, where: { user_id: req.user.id } }],
  });

  if (!vehiculeMaintenance)
    return res.status(404).send("this  maintenance not registred ");

  /*********** validation **********/
  const result = Joi.validate(body, schema);
  if (result.error)
    return res.status(404).send(result.error.details[0].message);

  /******************* cheking if the vehicule exists *********************/

  let vehicule = await Vehicule.findOne({
    where: {
      user_id: req.user.id,
      matricule: req.body.matricule,
    },
  });
  if (!vehicule) return res.status(404).send("this  vehicule not registred ");

  try {
    /************ updating the vehicule******************/
    vehiculeMaintenance.frequence_km = body.frequence_km;
    vehiculeMaintenance.unit = body.unit;
    vehiculeMaintenance.interval = body.interval;
    vehiculeMaintenance.maintenance_id = body.maintenance_id;
    vehiculeMaintenance.vehicule_id = body.matricule;

    await vehiculeMaintenance.save();
    res.send(vehiculeMaintenance);
  } catch (e) {
    console.log(e);
  }
};

// delete VehiculeMaintenance
VehiculeMaintenanceController.deleteVehiculeMaintenance = async (req, res) => {
  try {
    const vehiculeMaintenance = await VehiculeMaintenance.findOne({
      where: {
        id: req.params.id,
      },
      include: [{ model: Vehicule, where: { user_id: req.user.id } }],
    });

    if (!vehiculeMaintenance)
      return res.status(404).send("this  maintenance not registred ");
    await vehiculeMaintenance.destroy();
    res.send(vehiculeMaintenance);
  } catch (e) {
    console.log(e);
  }
};

module.exports = VehiculeMaintenanceController;
