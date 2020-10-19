module.exports = (sequelize, DataTypes) => {
  var Maintenance = sequelize.define(
    "Maintenance",
    {
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      cout: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { tableName: "maintenance", timestamps: false }
  );

  Maintenance.associate = function (models) {
    models.Vehicule.hasMany(models.VehiculeMaintenance, {
      foreignKey: "maintenance_id",
    });
  };

  return Maintenance;
};
