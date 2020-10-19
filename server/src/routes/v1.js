const express = require("express");
const router = express.Router();
const auth = require("../midellwares/auth");

/******* Controllers *******/
const VehiculeController = require("../controllers/vehicules.controller");
const UserController = require("../controllers/user.controller");
const MarqueController = require("../controllers/marque.controller");
const ModelController = require("../controllers/model.controller");
const RegionController = require("../controlgitlers/region.controller");
const CaserneController = require("../controllers/caserne.controller");
const MaintenanceController = require("../controllers/mainteance.controller");
const ProblemController = require("../controllers/problem.contrroller");
const CategorieController = require("../controllers/categorie.controller");
const CarburantController = require("../controllers/carburant.controller");
const MissionController = require("../controllers/mission.controller");
const VehiculeMaintenanceController = require("../controllers/VehiculeMaintenance.controller");
const { DashbordController } = require("../controllers/dashbord.controller");

/************ Utilisateur *************/
router.post("/login", UserController.AuthController);
router.post("/users", UserController.CreateNewUser);
router.get("/marques", MarqueController.getAllMarques);

router.use(auth);
router.get("/users", UserController.getAllUsers);
router.get("/users/:id", UserController.oneUser);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);

/******** Vehicule *********/

router.get("/vehicules", VehiculeController.getAllvehicules);
router.get("/vehicules/:id", VehiculeController.getVehicules);
router.get("/vehicules/fiche/:id", VehiculeController.suiviVehicule);
router.post("/vehicules", VehiculeController.ajouterVehicule);
router.put("/vehicules/:id", VehiculeController.updateVehicule);
router.delete("/vehicules/:id", VehiculeController.deleteVehicule);

/******** marque *********/

/******** model *********/

router.get("/models", ModelController.getAllModels);
router.get("/models/:id", ModelController.getMarqueModels);

/************* region ***************/
router.get("/regions", RegionController.getAllRegions);

/************* caserne ***************/
router.get("/casernes", CaserneController.getAllCasernes);
router.get("/casernes/:id", CaserneController.getRegionCasernes);

/*************** categorie ************************/
router.get("/categories", CategorieController.getAllCategories);

/**************** maintenance **************/
router.get("/listmaintenances", MaintenanceController.getListMaintenance);

/********************* vehiculemaintenance*************************/
router.post("/maintenances", VehiculeMaintenanceController.ajouterMaintenance);
router.get(
  "/maintenances",
  VehiculeMaintenanceController.getVehiculeMainteannce
);
router.get(
  "/maintenances/:id",
  VehiculeMaintenanceController.getOneMaintenanceVehicule
);
router.put(
  "/maintenances/:id",
  VehiculeMaintenanceController.updateMaintenanceVehicule
);
router.delete(
  "/maintenances/:id",
  VehiculeMaintenanceController.deleteVehiculeMaintenance
);

/********************problems*********************/
router.post("/problems", ProblemController.ajouterProblem);
router.get("/problems", ProblemController.getProblems);
router.get("/problems/:id", ProblemController.getOneProblem);
router.put("/problems/:id", ProblemController.updateProblem);
router.delete("/problems/:id", ProblemController.deleteProblem);

/********************Carburant*********************/
router.post("/carburant", CarburantController.ajouterCarburant);
router.put("/carburant/:id", CarburantController.updateCaburant);
router.delete("/carburant/:id", CarburantController.deleteCaburant);
router.get("/carburant", CarburantController.getCarburant);
router.get("/carburant/:id", CarburantController.getOneCarburant);

/********************misson*********************/
router.post("/missions", MissionController.ajouterMission);
router.get("/missions", MissionController.getMission);
router.get("/missions/:id", MissionController.getOneMission);
router.put("/missions/:id", MissionController.updateMission);
router.delete("/missions/:id", MissionController.deleteMission);

/********************** dashboard ***************************/

router.get("/dashboard", DashbordController.getDashboardDate);

module.exports = router;
