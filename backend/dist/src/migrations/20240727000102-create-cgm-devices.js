"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('cgm_devices', {
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
        manufacturer: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        model: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        serial_number: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        paired_at: {
            type: sequelize_1.DataTypes.DATE,
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
    await queryInterface.dropTable('cgm_devices');
}
