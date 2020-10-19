const { User, Caserne, Region } = require("../models");
const _ = require("lodash");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const passwordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserController = {};

const schema = {
  email: Joi.string().email(),
  pass: Joi.string().required(),
  caserne_id: Joi.number().required(),
  role: Joi.string().valid("user", "admin").required(),
};

// Create new user

UserController.CreateNewUser = async (req, res) => {
  const { body } = req;

  /*********** validation **********/

  const result = Joi.validate(body, schema);
  if (result.error) {
    res.status(404).send(result.error.details[0].message);
    return;
  }
  /*************** Password complexity check ************/
  const password = passwordComplexity(undefined, "Password").validate(
    body.pass
  );
  if (password.error)
    return res.status(400).send(password.error.details[0].message);

  /****************** cheking if the user already exists *******************/

  let user = await User.findOne({
    where: {
      email: body.email,
    },
  });
  if (user) return res.status(400).send("user already exist");

  /********************** hashing the password ***************************** */
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(body.pass, salt);

  /*************** Inserting the new user *****************/

  try {
    user = await User.create({
      email: body.email,
      pass: hashed,
      caserne_id: body.caserne_id,
      role: body.role,
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.get("jwtKey")
    );
    res.header("x-auth-token", token).send(_.omit(user.dataValues, ["pass"]));
  } catch (err) {
    console.log(err);
  }
};

// AuthController

UserController.AuthController = async (req, res) => {
  const authSchema = _.pick(schema, ["email", "pass"]);
  const { body } = req;

  /*********** validation **********/

  const result = Joi.validate(body, authSchema);
  if (result.error) {
    res.status(404).send(result.error.details[0].message);
    return;
  }

  /****************checking if the user registred *******************/

  let user = await User.findOne({
    where: {
      email: body.email,
    },
  });
  if (!user) return res.status(400).send("Invalid email or password");

  /****************************check the password **************************/
  const validatePassword = await bcrypt.compare(body.pass, user.pass);

  if (!validatePassword)
    return res.status(400).send("Invalid email or password");

  /****************************** generating the token ****************************************/
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_KEY);
  res.send(token);
};

// get all user

UserController.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).send("You are not allowed to do this operation");
    const user = await User.findAll({
      include: { model: Caserne, include: { model: Region } },
    });
    res.send(user);
  } catch (error) {
    console.log(error);
  }
};

// get one user

UserController.oneUser = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).send("You are not allowed to do this operation");
    const user = await User.findOne({
      where: { id: req.params.id },
      include: { model: Caserne, include: { model: Region } },
    });
    res.send(user);
  } catch (error) {
    console.log(error);
  }
};

// update user

UserController.updateUser = async (req, res) => {
  // check if it is an admin
  if (req.user.role !== "admin")
    return res.status(403).send("You are not allowed to do this operation");

  // check if the user exists

  let user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).send("this  vehicule not registred ");

  const { body } = req;

  /*********** validation **********/

  const result = Joi.validate(body, schema);
  if (result.error)
    return res.status(404).send(result.error.details[0].message);
  if (body.pass !== "default") {
    const password = passwordComplexity(undefined, "Password").validate(
      body.pass
    );
    if (password.error)
      return res.status(400).send(password.error.details[0].message);
    const salt = await bcrypt.genSalt(10);
    var hashed = await bcrypt.hash(body.pass, salt);
  }

  try {
    /************ updating the user******************/
    user.email = body.email;
    if (body.pass !== "default") user.pass = hashed;
    user.caserne_id = body.caserne_id;
    user.role = body.role;
    await user.save();
    res.send(_.omit(user.dataValues, ["pass"]));
  } catch (error) {
    console.log(error);
  }
};

// delete user
UserController.deleteUser = async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).send("You are not allowed to do this operation");

  let user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).send("this  user is not registred ");
  console.log(user.dataValues.id);
  if (user.dataValues.id == req.user.id)
    return res.status(404).send("you can't delete your self");

  try {
    await user.destroy();
    res.send(user);
  } catch (error) {
    console.log(error);
  }
};

module.exports = UserController;
