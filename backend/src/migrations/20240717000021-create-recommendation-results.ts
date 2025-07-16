import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('recommendation_results', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'user_profiles', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    rule_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'recommendation_rules', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    questionnaire_snapshot: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    created_at: { allowNull: false, type: DataTypes.DATE },
    updated_at: { allowNull: false, type: DataTypes.DATE }
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('recommendation_results');
} 