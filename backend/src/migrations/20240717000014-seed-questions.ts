import { QueryInterface, QueryTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// Helper function to get category IDs
async function getCategoryIds(queryInterface: QueryInterface) {
  const categories = await queryInterface.sequelize.query(
    'SELECT id, slug FROM question_categories',
    { type: QueryTypes.SELECT }
  );
  
  return categories.reduce((acc: Record<string, string>, cat: any) => {
    acc[cat.slug] = cat.id;
    return acc;
  }, {});
}

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Get category IDs
  const categoryIds = await getCategoryIds(queryInterface);
  
  // Non-patient questions (Prevention)
  const nonPatientQuestions = [
    {
      id: uuidv4(),
      category_id: categoryIds['non_patient'],
      question_text: 'How many sugary drinks (soda, sweet tea, juice) do you consume daily?',
      response_type: 'mcq',
      options: JSON.stringify(['0', '1-2', '3+']),
      order: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      category_id: categoryIds['non_patient'],
      question_text: 'On average, how many minutes do you walk daily?',
      response_type: 'numeric',
      options: null,
      order: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      category_id: categoryIds['non_patient'],
      question_text: 'Has anyone in your family had diabetes?',
      response_type: 'yes_no',
      options: null,
      order: 3,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];
  
  // At-risk questions (Early Signs)
  const atRiskQuestions = [
    {
      id: uuidv4(),
      category_id: categoryIds['at_risk'],
      question_text: 'How often do you check your blood sugar?',
      response_type: 'mcq',
      options: JSON.stringify(['Never', 'Occasionally', 'Weekly', 'Daily']),
      order: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      category_id: categoryIds['at_risk'],
      question_text: 'Do you feel tired after eating meals?',
      response_type: 'yes_no',
      options: null,
      order: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      category_id: categoryIds['at_risk'],
      question_text: 'What\'s your fasting glucose level (if known)?',
      response_type: 'numeric',
      options: null,
      order: 3,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];
  
  // Patient questions (Diagnosed)
  const patientQuestions = [
    {
      id: uuidv4(),
      category_id: categoryIds['patient'],
      question_text: 'When was your last HbA1c test?',
      response_type: 'mcq',
      options: JSON.stringify(['<3 months', '3-6 months', '>6 months', 'Never']),
      order: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      category_id: categoryIds['patient'],
      question_text: 'How many carb-heavy meals (rice, bread, pasta) do you eat daily?',
      response_type: 'numeric',
      options: null,
      order: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      category_id: categoryIds['patient'],
      question_text: 'Do you take diabetes medication?',
      response_type: 'yes_no',
      options: null,
      order: 3,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];
  
  // Insert all questions
  await queryInterface.bulkInsert('questions', [
    ...nonPatientQuestions,
    ...atRiskQuestions,
    ...patientQuestions
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  // Delete all seeded questions
  await queryInterface.bulkDelete('questions', {});
} 