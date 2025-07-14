const bcrypt = require("bcrypt")
const { DataTypes } = require("sequelize")

const { sequelize } = require("../config/database")

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: true,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    diabetesType: {
      type: DataTypes.ENUM("type1", "type2", "gestational", "prediabetes", "other"),
      allowNull: true,
    },
    diagnosisDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    targetBloodSugarMin: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    targetBloodSugarMax: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10)
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10)
        }
      },
    },
  },
)

// Instance method to check password
User.prototype.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = User
