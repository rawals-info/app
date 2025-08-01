"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('admin_profiles', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4
        },
        auth_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'admin_auths',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        first_name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        department: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        position: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        phone_number: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        profile_image: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        permissions: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true
        },
        created_at: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW
        },
        updated_at: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW
        }
    });
}
async function down(queryInterface) {
    await queryInterface.dropTable('admin_profiles');
}
