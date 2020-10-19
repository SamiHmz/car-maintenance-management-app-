module.exports = (sequelize, DataTypes) => {
  var Categorie = sequelize.define(
    "Categorie",
    {
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { tableName: "categorie", timestamps: false }
  );
  Categorie.associate = function (models) {
    models.Categorie.hasMany(models.Vehicule, { foreignKey: "categorie_id" });
  };

  return Categorie;
};
