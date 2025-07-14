const { DataTypes } = require("sequelize")

const { sequelize } = require("../config/database")

const BloodSugarReading = sequelize.define(
  "BloodSugarReading",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0, // Non-negative values only
      },
    },
    unit: {
      type: DataTypes.ENUM("mg/dL", "mmol/L"),
      allowNull: false,
      defaultValue: "mg/dL",
    },
    readingDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    readingType: {
      type: DataTypes.ENUM(
        "fasting",
        "before_meal",
        "after_meal",
        "before_exercise",
        "after_exercise",
        "bedtime",
        "random",
        "continuous_monitor",
      ),
      allowNull: false,
      defaultValue: "random",
    },
    entryMethod: {
      type: DataTypes.ENUM("manual", "device", "api"),
      allowNull: false,
      defaultValue: "manual",
    },
    deviceInfo: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["userId", "readingDateTime"],
      },
    ],
  },
)

module.exports = BloodSugarReading
