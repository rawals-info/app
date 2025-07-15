import { Response } from 'express';
import { AuthRequest } from '../types';
import { OnboardingProgress, UserProfile, HealthProfile } from '../models';
import { sequelize } from '../config/database';

/**
 * Get onboarding status
 */
export const getOnboardingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Find user profile
    const userProfile = await UserProfile.findOne({ 
      where: { authId: userId },
      include: [{ model: OnboardingProgress, as: 'onboardingProgress' }]
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
  } catch (error) {
    console.error('Get onboarding status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get onboarding status',
      error: (error as Error).message
    });
  }
};

/**
 * Update onboarding progress
 */
export const updateOnboardingProgress = async (req: AuthRequest, res: Response) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user?.id;
    const { step, data, isComplete } = req.body;

    if (!userId) {
      await transaction.rollback();
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Find user profile
    const userProfile = await UserProfile.findOne({ 
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
    const onboardingProgress = await OnboardingProgress.findOne({
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
          await HealthProfile.upsert({
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
      isComplete: isComplete ?? onboardingProgress.isComplete,
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
  } catch (error) {
    await transaction.rollback();
    console.error('Update onboarding progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update onboarding progress',
      error: (error as Error).message
    });
  }
};

/**
 * Complete onboarding
 */
export const completeOnboarding = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Find user profile
    const userProfile = await UserProfile.findOne({ 
      where: { authId: userId }
    });

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    // Find onboarding progress
    const onboardingProgress = await OnboardingProgress.findOne({
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
  } catch (error) {
    console.error('Complete onboarding error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete onboarding',
      error: (error as Error).message
    });
  }
};

export default {
  getOnboardingStatus,
  updateOnboardingProgress,
  completeOnboarding
}; 