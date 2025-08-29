"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    const tableExists = await queryInterface.sequelize.query(`SELECT to_regclass('public.meals') as exists;`, { type: queryInterface.sequelize.QueryTypes.SELECT });
    if (!tableExists[0].exists) {
        await queryInterface.createTable('meals', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
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
            meal_type: {
                type: sequelize_1.DataTypes.ENUM('breakfast', 'brunch', 'lunch', 'dinner', 'snack'),
                allowNull: false,
            },
            logged_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            input_method: {
                type: sequelize_1.DataTypes.ENUM('photo', 'voice', 'quick_add', 'same_as_last'),
                allowNull: false,
            },
            location: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: true,
            },
            photo_path: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            voice_path: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            mood_before: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            hunger_level: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            notes: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            ai_status: {
                type: sequelize_1.DataTypes.ENUM('pending', 'processed', 'error'),
                defaultValue: 'pending',
            },
            created_at: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
            },
            updated_at: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
            },
        });
    }
    // add logged_at column if missing (old schema)
    const col = await queryInterface.sequelize.query(`SELECT column_name FROM information_schema.columns WHERE table_name='meals' AND column_name='logged_at';`, { type: queryInterface.sequelize.QueryTypes.SELECT });
    if (col.length === 0) {
        await queryInterface.addColumn('meals', 'logged_at', { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW });
    }
    try {
        await queryInterface.addIndex('meals', ['user_id', 'logged_at']);
    }
    catch (e) { /* ignore */ }
}
async function down(queryInterface) {
    await queryInterface.dropTable('meals');
}
