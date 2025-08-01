"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
async function up(queryInterface) {
    await queryInterface.createTable('question_categories', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4
        },
        slug: {
            type: sequelize_1.DataTypes.ENUM('non_patient', 'at_risk', 'patient'),
            allowNull: false,
            unique: true
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        affirmation_text: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
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
    // Seed default categories
    await queryInterface.bulkInsert('question_categories', [
        {
            id: (0, uuid_1.v4)(),
            slug: 'non_patient',
            name: 'Non-Patient (Prevention)',
            affirmation_text: 'Taking action now puts you ahead of 80% of people—great first step!',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            id: (0, uuid_1.v4)(),
            slug: 'at_risk',
            name: 'At-Risk (Early Signs)',
            affirmation_text: 'Noticing patterns is powerful—you’re already on the path to control!',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            id: (0, uuid_1.v4)(),
            slug: 'patient',
            name: 'Patient (Diagnosed)',
            affirmation_text: 'You’re not alone—small daily wins add up to big results!',
            created_at: new Date(),
            updated_at: new Date()
        }
    ]);
}
async function down(queryInterface) {
    await queryInterface.dropTable('question_categories');
}
