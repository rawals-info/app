"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('health_profiles', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4
        },
        user_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'user_profiles',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        diabetes_type: {
            type: sequelize_1.DataTypes.ENUM('type1', 'type2', 'gestational', 'prediabetes', 'other'),
            allowNull: true
        },
        diagnosis_date: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true
        },
        weight: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true
        },
        weight_unit: {
            type: sequelize_1.DataTypes.ENUM('kg', 'lb'),
            defaultValue: 'kg'
        },
        height: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true
        },
        height_unit: {
            type: sequelize_1.DataTypes.ENUM('cm', 'ft'),
            defaultValue: 'cm'
        },
        target_blood_sugar_min: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 70
        },
        target_blood_sugar_max: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 180
        },
        blood_sugar_unit: {
            type: sequelize_1.DataTypes.ENUM('mg/dL', 'mmol/L'),
            defaultValue: 'mg/dL'
        },
        medications: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true
        },
        allergies: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true
        },
        medical_conditions: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true
        },
        family_history: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true
        },
        lifestyle: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true
        },
        created_at: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE
        },
        updated_at: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE
        }
    });
}
async function down(queryInterface) {
    await queryInterface.dropTable('health_profiles');
}
