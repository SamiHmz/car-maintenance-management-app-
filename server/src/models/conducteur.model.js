module.exports = (sequelize, DataTypes) => {
  var Conducteur = sequelize.define(
    "Conducteur",
    {
      nom: {
        type: DataTypes.STRING,
        validate: {
          allowNull: false,
          notEmpty: true,
        },
      },
      prenom: {
        type: DataTypes.STRING,
        validate: {
          allowNull: false,
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          allowNull: false,
          notEmpty: true,
          isEmail: true,
        },
      },
      phone_number: {
        type: DataTypes.STRING,
        validate: {
          allowNull: false,
          notEmpty: true,
          isEmail: true,
        },
      },
    },
    { tableName: "conducteur", timestamps: false }
  );
  Conducteur.associate = function (models) {
    models.Conducteur.belongsTo(models.Vehicule, { foreignKey: "vehicule_id" });
  };
  return Conducteur;
};
