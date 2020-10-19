const { Maintenance, Vehicule, VehiculeMaintenance } = require("../models");

const Joi = require("joi");

const MaintenanceController = {};

// List maintenance
MaintenanceController.getListMaintenance = async (req, res) => {
  try {
    const listMaintenance = await Maintenance.findAll();
    res.send(listMaintenance);
  } catch (error) {
    console.log(error);
  }
};

module.exports = MaintenanceController;
