import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('questions', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'question_categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    response_type: {
      type: DataTypes.ENUM('mcq', 'numeric', 'yes_no'),
      allowNull: false
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
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
  await queryInterface.dropTable('questions');
} 