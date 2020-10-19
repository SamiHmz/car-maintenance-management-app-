module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define(
    "Model",
    {
      nom: {
        type: DataTypes.STRING,
        validate: {
          allowNull: false,
          notEmpty: true,
        },
      },
    },
    { tableName: "model", timestamps: false }
  );

  Model.associate = function (models) {
    models.Model.belongsTo(models.Marque, { foreignKey: "marque_id" });
    models.Model.hasMany(models.Vehicule, { foreignKey: "model_id" });
  };

  return Model;
};
