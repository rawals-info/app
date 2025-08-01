import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('meal_items', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    meal_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'meals', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    food_item_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'food_items', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    variant_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unit: {
      type: DataTypes.ENUM('g','ml','piece','cup','tbsp'),
      allowNull: false,
    },
    calories_est: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    gi_est: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    source: {
      type: DataTypes.ENUM('user_estimate','ai_estimate','device'),
      allowNull: false,
    },
    created_at: { allowNull: false, type: DataTypes.DATE },
    updated_at: { allowNull: false, type: DataTypes.DATE },
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('meal_items');
} 