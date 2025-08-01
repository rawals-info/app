"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('cgm_samples', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: sequelize_1.DataTypes.BIGINT
        },
        device_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'cgm_devices',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
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
        value: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false
        },
        unit: {
            type: sequelize_1.DataTypes.ENUM('mg/dL', 'mmol/L'),
            allowNull: false,
            defaultValue: 'mg/dL'
        },
        sampled_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW
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
    await queryInterface.sequelize.query(`CREATE INDEX IF NOT EXISTS cgm_samples_user_id_sampled_at ON cgm_samples (user_id, sampled_at);`);
}
async function down(queryInterface) {
    await queryInterface.dropTable('cgm_samples');
}
