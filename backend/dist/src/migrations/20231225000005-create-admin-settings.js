"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('admin_settings', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4
        },
        setting_key: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        setting_value: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        data_type: {
            type: sequelize_1.DataTypes.ENUM('string', 'number', 'boolean', 'json', 'array'),
            defaultValue: 'string'
        },
        category: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        is_public: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false
        },
        created_by: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'auths',
                key: 'id'
            }
        },
        updated_by: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'auths',
                key: 'id'
            }
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
    await queryInterface.dropTable('admin_settings');
}
