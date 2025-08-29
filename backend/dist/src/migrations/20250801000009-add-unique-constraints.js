"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(queryInterface) {
    // Add unique constraint for health_profiles.user_id
    try {
        await queryInterface.addConstraint('health_profiles', {
            fields: ['user_id'],
            type: 'unique',
            name: 'health_profiles_user_id_unique'
        });
    }
    catch (err) { /* duplicate constraint, skip */ }
    // Add unique constraint for user_profiles.auth_id
    try {
        await queryInterface.addConstraint('user_profiles', {
            fields: ['auth_id'],
            type: 'unique',
            name: 'user_profiles_auth_id_unique'
        });
    }
    catch (err) { /* ignore */ }
}
async function down(queryInterface) {
    await queryInterface.removeConstraint('health_profiles', 'health_profiles_user_id_unique');
    await queryInterface.removeConstraint('user_profiles', 'user_profiles_auth_id_unique');
}
