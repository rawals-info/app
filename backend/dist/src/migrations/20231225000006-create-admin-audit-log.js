"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('admin_audit_logs', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4
        },
        admin_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'auths',
                key: 'id'
            }
        },
        action: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        resource: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        resource_id: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        previous_state: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true
        },
        new_state: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true
        },
        details: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true
        },
        ip_address: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        user_agent: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE
        }
    });
}
async function down(queryInterface) {
    await queryInterface.dropTable('admin_audit_logs');
}
