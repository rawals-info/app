import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Add unique constraint for health_profiles.user_id
  try {
    await queryInterface.addConstraint('health_profiles', {
      fields: ['user_id'],
      type: 'unique',
      name: 'health_profiles_user_id_unique'
    });
  } catch (err:any) {/* duplicate constraint, skip */}

  // Add unique constraint for user_profiles.auth_id
  try {
    await queryInterface.addConstraint('user_profiles', {
      fields: ['auth_id'],
      type: 'unique',
      name: 'user_profiles_auth_id_unique'
    });
  } catch(err:any) {/* ignore */}
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeConstraint('health_profiles', 'health_profiles_user_id_unique');
  await queryInterface.removeConstraint('user_profiles', 'user_profiles_auth_id_unique');
} 