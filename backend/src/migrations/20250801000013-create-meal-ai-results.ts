import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('meal_ai_results', {
    id: { allowNull: false, primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    meal_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'meals', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
    provider: { type: DataTypes.STRING, allowNull: false },
    payload: { type: DataTypes.JSONB, allowNull: false },
    created_at: { allowNull: false, type: DataTypes.DATE },
    updated_at: { allowNull: false, type: DataTypes.DATE },
  });
  await queryInterface.addIndex('meal_ai_results',['meal_id']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('meal_ai_results');
} 