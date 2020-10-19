module.exports = (sequelize, DataTypes) => {
  var Caserne = sequelize.define(
    "Caserne",
    {
      nom: {
        type: DataTypes.STRING,
        validate: {
          allowNull: false,
          notEmpty: true,
        },
      },
      // region_id: {
      //   type: DataTypes.INTEGER,
      //   references: {
      //     model: "region", // 'persons' refers to table name
      //     key: "id", // 'id' refers to column name in persons table
      //   },
      // },
    },

    { tableName: "caserne", timestamps: false }
  );
  Caserne.associate = function (models) {
    models.Caserne.belongsTo(models.Region, { foreignKey: "region_id" });
    models.Caserne.hasMany(models.User, { foreignKey: "caserne_id" });
  };
  return Caserne;
};
