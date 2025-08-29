import { Response, Request } from 'express';
import { AuthRequest } from '../types';
import { QuestionCategory, Question, QuestionAnswer, UserProfile } from '../models';
import { sequelize } from '../config/database';
import { QuestionInstance } from '../types';

/**
 * GET /api/questionnaire/questions?category=slug
 */
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { category } = req.query as { category?: string };

    if (!category) {
      return res.status(400).json({ success: false, message: 'Category query param is required' });
    }

    const categoryRecord = await QuestionCategory.findOne({
      where: { slug: category },
      include: [{ model: Question, as: 'questions' }],
      order: [[{ model: Question, as: 'questions' }, 'order', 'ASC']]
    });

    if (!categoryRecord) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    return res.json({
      success: true,
      data: {
        slug: categoryRecord.slug,
        affirmationText: categoryRecord.affirmationText,
        updatedAt: categoryRecord.updatedAt,
        questions: ((categoryRecord as any).questions as QuestionInstance[] | undefined)?.map((q) => ({
          id: q.id,
          questionText: q.questionText,
          responseType: q.responseType,
          options: q.options,
          order: q.order,
          updatedAt: q.updatedAt
        })) || []
      }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    return res.status(500).json({ success: false, message: 'Failed to get questions', error: (error as Error).message });
  }
};

/**
 * POST /api/questionnaire/answers
 * Body: { answers: [{ questionId, answerValue }] }
 */
export const submitAnswers = async (req: AuthRequest, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user?.id;
    const { answers } = req.body as { answers: Array<{ questionId: string; answerValue: string }> };

    if (!userId) {
      await transaction.rollback();
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Answers array is required' });
    }

    const userProfile = await UserProfile.findOne({ where: { authId: userId } });
    if (!userProfile) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    for (const ans of answers) {
      await QuestionAnswer.upsert({
        userId: userProfile.id,
        questionId: ans.questionId,
        answerValue: ans.answerValue
      }, { transaction });
    }

    await transaction.commit();

    return res.json({ success: true, message: 'Answers submitted successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Submit answers error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit answers', error: (error as Error).message });
  }
};

export default { getQuestions, submitAnswers }; 