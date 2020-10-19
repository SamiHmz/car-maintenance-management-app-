module.exports = (sequelize, DataTypes) => {
  var Carburant = sequelize.define(
    "Carburant",
    {
      volume: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          min: 1,
          notEmpty: true,
        },
      },
      cout: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          min: 1,
          notEmpty: true,
        },
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { tableName: "carburant", timestamps: false }
  );
  Carburant.associate = function (models) {
    models.Carburant.belongsTo(models.Vehicule, { foreignKey: "vehicule_id" });
  };
  return Carburant;
};
