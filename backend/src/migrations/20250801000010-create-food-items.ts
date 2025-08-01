import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('food_items', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    variant: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    base_gi: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    macro_profile: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    cultural_tags: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
  await queryInterface.addConstraint('food_items', {
    fields: ['name', 'variant'],
    type: 'unique',
    name: 'food_items_name_variant_unique'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('food_items');
} 