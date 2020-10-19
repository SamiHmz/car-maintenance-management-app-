module.exports = (sequelize, DataTypes) => {
  var VehiculeMaintenance = sequelize.define(
    "VehiculeMaintenance",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date_planification: {
        type: DataTypes.DATEONLY,
      },
      frequence_km: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          min: 1,
          notEmpty: true,
        },
      },
      planification_km: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          min: 1,
          notEmpty: true,
        },
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: [["jour", "semaine", "mois", "annee"]],
        },
      },
      interval: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          min: 0,
          notEmpty: true,
        },
      },
    },
    { tableName: "vehiculemaintenance", timestamps: false }
  );

  VehiculeMaintenance.associate = function (models) {
    models.VehiculeMaintenance.belongsTo(models.Maintenance, {
      foreignKey: { name: "maintenance_id" },
    });
    models.VehiculeMaintenance.belongsTo(models.Vehicule, {
      foreignKey: { name: "vehicule_id" },
    });
  };

  return VehiculeMaintenance;
};
