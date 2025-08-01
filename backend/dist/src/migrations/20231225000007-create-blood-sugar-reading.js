"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('blood_sugar_readings', {
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
            validate: {
                min: 0
            }
        },
        unit: {
            type: sequelize_1.DataTypes.ENUM('mg/dL', 'mmol/L'),
            allowNull: false,
            defaultValue: 'mg/dL'
        },
        reading_datetime: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW
        },
        reading_type: {
            type: sequelize_1.DataTypes.ENUM('fasting', 'before_meal', 'after_meal', 'before_exercise', 'after_exercise', 'bedtime', 'random', 'continuous_monitor'),
            allowNull: false,
            defaultValue: 'random'
        },
        entry_method: {
            type: sequelize_1.DataTypes.ENUM('manual', 'device', 'api'),
            allowNull: false,
            defaultValue: 'manual'
        },
        device_info: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true
        },
        meal_relation: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Information about related meal, if applicable'
        },
        medication_relation: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Information about related medication, if applicable'
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        tags: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            defaultValue: []
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
    // Add index for efficient querying by date range (idempotent)
    await queryInterface.sequelize.query(`CREATE INDEX IF NOT EXISTS blood_sugar_readings_user_id_reading_datetime ON blood_sugar_readings (user_id, reading_datetime);`);
}
async function down(queryInterface) {
    await queryInterface.dropTable('blood_sugar_readings');
}
