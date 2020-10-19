module.exports = (sequelize, DataTypes) => {
  var Marque = sequelize.define(
    "Marque",
    {
      nom: {
        type: DataTypes.STRING,
        validate: {
          allowNull: false,
          notEmpty: true,
        },
      },
    },
    { tableName: "marque", timestamps: false }
  );

  Marque.associate = function (models) {
    models.Marque.hasMany(models.Model, { foreignKey: "marque_id" });
  };

  return Marque;
};
