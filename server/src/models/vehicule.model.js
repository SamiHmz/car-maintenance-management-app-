module.exports = (sequelize, DataTypes) => {
  var Vehicule = sequelize.define(
    "Vehicule",
    {
      matricule: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
          notEmpty: true,
        },
      },
      kilometrage: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          min: 1,
          notEmpty: true,
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: {
            args: [["Active", "En panne", "Pas active"]],
            msg: 'etat must be in : ["Active", "En panne", "Pas active"]s',
          },
        },
      },
      year: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 1900,
          max: 2020,
        },
      },
      vehicule_pic: DataTypes.STRING,
    },
    { tableName: "vehicule", timestamps: false }
  );
  Vehicule.associate = function (models) {
    models.Vehicule.hasMany(models.Carburant, { foreignKey: "vehicule_id" });
    models.Vehicule.hasMany(models.Mission, { foreignKey: "vehicule_id" });
    models.Vehicule.hasMany(models.Problem, { foreignKey: "vehicule_id" });
    models.Model.hasMany(models.VehiculeMaintenance, {
      foreignKey: "vehicule_id",
    });
    models.Vehicule.belongsTo(models.User, { foreignKey: "user_id" });
    models.Vehicule.hasOne(models.Conducteur, { foreignKey: "vehicule_id" });
    models.Vehicule.belongsTo(models.Model, { foreignKey: "model_id" });
    models.Vehicule.belongsTo(models.Categorie, { foreignKey: "categorie_id" });
  };
  return Vehicule;
};
