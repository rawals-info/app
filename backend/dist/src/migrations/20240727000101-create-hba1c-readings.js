"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('hba1c_readings', {
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
        value: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
            validate: { min: 3, max: 20 }
        },
        unit: {
            type: sequelize_1.DataTypes.ENUM('percent'),
            allowNull: false,
            defaultValue: 'percent'
        },
        taken_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW
        },
        source: {
            type: sequelize_1.DataTypes.ENUM('manual', 'lab_report'),
            allowNull: false,
            defaultValue: 'manual'
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
    await queryInterface.sequelize.query(`CREATE INDEX IF NOT EXISTS hba1c_readings_user_id_taken_at ON hba1c_readings (user_id, taken_at);`);
}
async function down(queryInterface) {
    await queryInterface.dropTable('hba1c_readings');
}
