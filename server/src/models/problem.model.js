module.exports = (sequelize, DataTypes) => {
  var Problem = sequelize.define(
    "Problem",
    {
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
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
      etat: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: {
            args: [["En panne", "Reparè", "En cours de reparation"]],
            msg: "etat must be (En panne or Reparè or En cours de reparation)",
          },
        },
      },
    },

    { tableName: "problem", timestamps: false }
  );

  Problem.associate = function (models) {
    models.Problem.belongsTo(models.Vehicule, { foreignKey: "vehicule_id" });
  };
  return Problem;
};
