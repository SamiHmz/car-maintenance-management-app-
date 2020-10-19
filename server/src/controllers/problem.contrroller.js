const { Problem, Vehicule, sequelize } = require("../models");
const Joi = require("joi");
const _ = require("lodash");

const ProblemController = {};

const schema = {
  matricule: Joi.string().required(),
  nom: Joi.string().required(),
  description: Joi.string().required(),
  etat: Joi.string()
    .valid("En panne", "Reparè", "En cours de reparation")
    .required(),
  date: Joi.string().required(),
};

//Ajouter problem

ProblemController.ajouterProblem = async (req, res) => {
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
  const transaction = await sequelize.transaction();

  try {
    const problem = await Problem.create({
      vehicule_id: body.matricule,
      nom: body.nom,
      description: body.description,
      etat: body.etat,
      date: body.date,
    });
    vehicule.status = "En panne";
    await vehicule.save();
    await transaction.commit;
    res.send(problem);
  } catch (error) {
    console.log(error);
    res.send(error.errors[0].message);
    await transaction.rollback;
  }
};

// get problems

ProblemController.getProblems = async (req, res) => {
  try {
    const test = await sequelize.query(
      `select c.nom as categorie, m.nom as marque_nom,md.nom as nom_model,v.matricule,p.id as problem_id ,p.nom,p.date,p.description,p.etat
      from utilisateur u
      join vehicule v
          on u.id = v.user_id 
      join problem p
          on v.matricule = p.vehicule_id 
      join model md
          on v.model_id =md.id 
      join marque m 
          on m.id = md.marque_id 
      join categorie c
          on c.id = v.categorie_id
      where u.id = ${req.user.id}`
    );
    res.send(test[0]);
  } catch (error) {
    console.log(error);
  }
};

// get one problem

ProblemController.getOneProblem = async (req, res) => {
  try {
    const problem = await Problem.findOne({
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
    if (!problem) return res.status(404).send("this problem not registred ");
    res.send(_.omit(problem.dataValues, ["Vehicule"]));
  } catch (error) {
    console.log(error);
  }
};
// update problem

ProblemController.updateProblem = async (req, res) => {
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

  /******************* check if the problem exist ****************/
  let problem = await Problem.findByPk(req.params.id);
  if (!problem) return res.status(404).send("this problem not registred ");

  try {
    /************ updating the problem******************/
    problem.nom = body.nom;
    problem.description = body.description;
    problem.etat = body.etat;
    problem.vehicule_id = body.matricule;

    await problem.save();
    if (body.etat === "Reparè") vehicule.status = "Active";
    await vehicule.save();
    é;
    res.send(problem);
  } catch (e) {
    console.log(e);
  }
};

ProblemController.deleteProblem = async (req, res) => {
  let problem = await Problem.findOne({
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
  if (!problem) return res.status(404).send("this  problem does not exist ");

  try {
    await problem.destroy();
    res.send(problem);
  } catch (e) {
    console.log(e);
  }
};

module.exports = ProblemController;
