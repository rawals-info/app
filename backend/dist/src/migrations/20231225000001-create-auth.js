"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('auths', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: sequelize_1.DataTypes.ENUM('user', 'admin', 'healthcare_provider'),
            defaultValue: 'user',
            allowNull: false
        },
        is_email_verified: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false
        },
        verification_token: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        reset_password_token: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        reset_token_expires_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true
        },
        last_login: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true
        },
        login_attempts: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0
        },
        is_locked: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false
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
    await queryInterface.dropTable('auths');
}
