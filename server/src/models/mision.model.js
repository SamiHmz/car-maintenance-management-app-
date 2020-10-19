module.exports = (sequelize, DataTypes) => {
  var Mission = sequelize.define(
    "Mission",
    {
      date_entrer: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      date_sortie: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      distance: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: true,
        },
      },
      vitesse: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: true,
        },
      },
    },
    { tableName: "mission", timestamps: false }
  );
  Mission.associate = function (models) {
    models.Mission.belongsTo(models.Vehicule, { foreignKey: "vehicule_id" });
  };
  return Mission;
};
