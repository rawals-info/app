"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const FoodItem = database_1.sequelize.define('FoodItem', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    variant: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    baseGi: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        field: 'base_gi',
    },
    macroProfile: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        field: 'macro_profile',
    },
    culturalTags: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        field: 'cultural_tags',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        field: 'created_at',
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        field: 'updated_at',
    }
}, {
    tableName: 'food_items',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['name', 'variant'], unique: true }
    ]
});
exports.default = FoodItem;
