import { QueryInterface, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('question_categories', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    slug: {
      type: DataTypes.ENUM('non_patient', 'at_risk', 'patient'),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    affirmation_text: {
      type: DataTypes.TEXT,
      allowNull: false
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

  // Seed default categories
  await queryInterface.bulkInsert('question_categories', [
    {
      id: uuidv4(),
      slug: 'non_patient',
      name: 'Non-Patient (Prevention)',
      affirmation_text: 'Taking action now puts you ahead of 80% of people—great first step!',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      slug: 'at_risk',
      name: 'At-Risk (Early Signs)',
      affirmation_text: 'Noticing patterns is powerful—you’re already on the path to control!',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      slug: 'patient',
      name: 'Patient (Diagnosed)',
      affirmation_text: 'You’re not alone—small daily wins add up to big results!',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('question_categories');
} 