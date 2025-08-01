"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGoal = exports.completeOnboarding = exports.updateOnboardingProgress = exports.getOnboardingStatus = void 0;
const models_1 = require("../models");
const database_1 = require("../config/database");
/**
 * Get onboarding status
 */
const getOnboardingStatus = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        // Find user profile
        const userProfile = await models_1.UserProfile.findOne({
            where: { authId: userId },
            include: [{ model: models_1.OnboardingProgress, as: 'onboardingProgress' }]
        });
        if (!userProfile || !userProfile.onboardingProgress) {
            return res.status(404).json({
                success: false,
                message: 'Onboarding progress not found'
            });
        }
        return res.json({
            success: true,
            data: {
                currentStep: userProfile.onboardingProgress.currentStep,
                completedSteps: userProfile.onboardingProgress.completedSteps,
                isComplete: userProfile.onboardingProgress.isComplete,
                stepData: userProfile.onboardingProgress.stepData
            }
        });
    }
    catch (error) {
        console.error('Get onboarding status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get onboarding status',
            error: error.message
        });
    }
};
exports.getOnboardingStatus = getOnboardingStatus;
/**
 * Update onboarding progress
 */
const updateOnboardingProgress = async (req, res) => {
    var _a;
    const transaction = await database_1.sequelize.transaction();
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { step, data, isComplete } = req.body;
        if (!userId) {
            await transaction.rollback();
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        // Find user profile
        const userProfile = await models_1.UserProfile.findOne({
            where: { authId: userId }
        });
        if (!userProfile) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'User profile not found'
            });
        }
        // Find onboarding progress
        const onboardingProgress = await models_1.OnboardingProgress.findOne({
            where: { userId: userProfile.id }
        });
        if (!onboardingProgress) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Onboarding progress not found'
            });
        }
        // Process the step data based on step name
        switch (step) {
            case 'health_profile':
                // Create or update health profile with submitted data
                if (data) {
                    await models_1.HealthProfile.upsert({
                        userId: userProfile.id,
                        ...data
                    }, { transaction });
                }
                break;
            // Add other step cases as needed
            default:
                // Just store the data in stepData
                break;
        }
        // Update completed steps if not already included
        let completedSteps = [...onboardingProgress.completedSteps];
        if (step && !completedSteps.includes(step)) {
            completedSteps.push(step);
        }
        // Update onboarding progress
        await onboardingProgress.update({
            currentStep: step || onboardingProgress.currentStep,
            completedSteps,
            isComplete: isComplete !== null && isComplete !== void 0 ? isComplete : onboardingProgress.isComplete,
            stepData: {
                ...onboardingProgress.stepData,
                [step]: data
            }
        }, { transaction });
        await transaction.commit();
        return res.json({
            success: true,
            message: 'Onboarding progress updated',
            data: {
                currentStep: onboardingProgress.currentStep,
                completedSteps: onboardingProgress.completedSteps,
                isComplete: onboardingProgress.isComplete
            }
        });
    }
    catch (error) {
        await transaction.rollback();
        console.error('Update onboarding progress error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update onboarding progress',
            error: error.message
        });
    }
};
exports.updateOnboardingProgress = updateOnboardingProgress;
/**
 * Complete onboarding
 */
const completeOnboarding = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        // Find user profile
        const userProfile = await models_1.UserProfile.findOne({
            where: { authId: userId }
        });
        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: 'User profile not found'
            });
        }
        // Find onboarding progress
        const onboardingProgress = await models_1.OnboardingProgress.findOne({
            where: { userId: userProfile.id }
        });
        if (!onboardingProgress) {
            return res.status(404).json({
                success: false,
                message: 'Onboarding progress not found'
            });
        }
        // Update onboarding progress
        await onboardingProgress.update({
            isComplete: true
        });
        return res.json({
            success: true,
            message: 'Onboarding completed successfully'
        });
    }
    catch (error) {
        console.error('Complete onboarding error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to complete onboarding',
            error: error.message
        });
    }
};
exports.completeOnboarding = completeOnboarding;
/**
 * Set user's main goal (prevent / monitor / diagnosed)
 */
const setGoal = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { goal } = req.body;
        if (!userId || !goal) {
            return res.status(400).json({ success: false, message: 'goal required' });
        }
        // find profile
        const userProfile = await models_1.UserProfile.findOne({ where: { authId: userId } });
        if (!userProfile)
            return res.status(404).json({ success: false, message: 'User not found' });
        await models_1.UserGoal.upsert({ userId: userProfile.id, goal });
        return res.json({ success: true });
    }
    catch (e) {
        console.error('Set goal error', e);
        return res.status(500).json({ success: false, message: 'Failed to set goal' });
    }
};
exports.setGoal = setGoal;
exports.default = {
    getOnboardingStatus: exports.getOnboardingStatus,
    updateOnboardingProgress: exports.updateOnboardingProgress,
    completeOnboarding: exports.completeOnboarding
};
