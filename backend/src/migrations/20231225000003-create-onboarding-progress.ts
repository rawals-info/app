


import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('onboarding_progress', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user_profiles',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    current_step: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'profile_setup'
    },
    is_complete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    completed_steps: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    step_data: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('onboarding_progress');
} 