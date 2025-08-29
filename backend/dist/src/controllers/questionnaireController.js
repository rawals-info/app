"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitAnswers = exports.getQuestions = void 0;
const models_1 = require("../models");
const database_1 = require("../config/database");
/**
 * GET /api/questionnaire/questions?category=slug
 */
const getQuestions = async (req, res) => {
    var _a;
    try {
        const { category } = req.query;
        if (!category) {
            return res.status(400).json({ success: false, message: 'Category query param is required' });
        }
        const categoryRecord = await models_1.QuestionCategory.findOne({
            where: { slug: category },
            include: [{ model: models_1.Question, as: 'questions' }],
            order: [[{ model: models_1.Question, as: 'questions' }, 'order', 'ASC']]
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
                questions: ((_a = categoryRecord.questions) === null || _a === void 0 ? void 0 : _a.map((q) => ({
                    id: q.id,
                    questionText: q.questionText,
                    responseType: q.responseType,
                    options: q.options,
                    order: q.order,
                    updatedAt: q.updatedAt
                }))) || []
            }
        });
    }
    catch (error) {
        console.error('Get questions error:', error);
        return res.status(500).json({ success: false, message: 'Failed to get questions', error: error.message });
    }
};
exports.getQuestions = getQuestions;
/**
 * POST /api/questionnaire/answers
 * Body: { answers: [{ questionId, answerValue }] }
 */
const submitAnswers = async (req, res) => {
    var _a;
    const transaction = await database_1.sequelize.transaction();
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { answers } = req.body;
        if (!userId) {
            await transaction.rollback();
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: 'Answers array is required' });
        }
        const userProfile = await models_1.UserProfile.findOne({ where: { authId: userId } });
        if (!userProfile) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: 'User profile not found' });
        }
        for (const ans of answers) {
            await models_1.QuestionAnswer.upsert({
                userId: userProfile.id,
                questionId: ans.questionId,
                answerValue: ans.answerValue
            }, { transaction });
        }
        await transaction.commit();
        return res.json({ success: true, message: 'Answers submitted successfully' });
    }
    catch (error) {
        await transaction.rollback();
        console.error('Submit answers error:', error);
        return res.status(500).json({ success: false, message: 'Failed to submit answers', error: error.message });
    }
};
exports.submitAnswers = submitAnswers;
exports.default = { getQuestions: exports.getQuestions, submitAnswers: exports.submitAnswers };
