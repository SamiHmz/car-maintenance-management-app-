module.exports = (sequelize, DataTypes) => {
  var Region = sequelize.define(
    "Region",
    {
      nom: {
        type: DataTypes.STRING,
        validate: {
          allowNull: false,
          notEmpty: true,
        },
      },
    },
    { tableName: "region", timestamps: false }
  );

  Region.associate = function (models) {
    models.Region.hasMany(models.Caserne, { foreignKey: "region_id" });
  };
  return Region;
};
