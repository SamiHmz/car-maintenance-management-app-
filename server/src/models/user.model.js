const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: {
            args: [["user", "admin"]],
            msg: 'role must be in : ["user", "admin"]',
          },
        },
      },
      pass: DataTypes.STRING,
    },
    { tableName: "utilisateur", timestamps: false }
  );
  User.associate = function (models) {
    models.User.belongsTo(models.Caserne, { foreignKey: "caserne_id" });
    models.User.hasMany(models.Vehicule, { foreignKey: "user_id" });
  };

  return User;
};
