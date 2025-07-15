import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Auth, UserProfile, OnboardingProgress } from '../models';
import { AuthRequest, RegisterRequestBody, LoginRequestBody, JwtPayload } from '../types';
import { sequelize } from '../config/database';

/**
 * Register a new user
 */
export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<Response> => {
  const transaction = await sequelize.transaction();

  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await Auth.findOne({ where: { email } });
    if (existingUser) {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new auth entry
    const auth = await Auth.create({
      email,
      password,
      role: 'user',
      verificationToken: uuidv4()
    }, { transaction });

    // Create user profile
    const userProfile = await UserProfile.create({
      authId: auth.id,
      firstName,
      lastName,
      phoneNumber
    }, { transaction });

    // Create onboarding progress
    await OnboardingProgress.create({
      userId: userProfile.id,
      currentStep: 'profile_setup',
      completedSteps: []
    }, { transaction });

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';
    const payload: JwtPayload = { id: auth.id, email: auth.email, role: auth.role };
    const options = { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions;
    const token = jwt.sign(payload, jwtSecret, options);

    await transaction.commit();

    // TODO: Send verification email

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: userProfile.id,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          email: auth.email
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: (error as Error).message
    });
  }
};

/**
 * Login user
 */
export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const auth = await Auth.findOne({ 
      where: { email },
      include: [{
        model: UserProfile,
        as: 'userProfile'
      }]
    });

    if (!auth) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if password is correct
    const isPasswordValid = await auth.checkPassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      await auth.update({ 
        loginAttempts: auth.loginAttempts + 1,
        isLocked: auth.loginAttempts >= 4 // Lock after 5 failed attempts
      });
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (auth.isLocked) {
      return res.status(403).json({
        success: false,
        message: 'Account is locked. Please reset your password or contact support.'
      });
    }

    // Update last login time and reset login attempts
    await auth.update({
      lastLogin: new Date(),
      loginAttempts: 0
    });

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';
    const payload: JwtPayload = { id: auth.id, email: auth.email, role: auth.role };
    const options = { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions;
    const token = jwt.sign(payload, jwtSecret, options);

    const userProfile = auth.userProfile;
    
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: userProfile.id,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          email: auth.email
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: (error as Error).message
    });
  }
};

/**
 * Get user profile
 */
export const getProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Find user profile
    const auth = await Auth.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { 
          model: UserProfile, 
          as: 'userProfile',
          include: [
            { model: OnboardingProgress, as: 'onboardingProgress' }
          ]
        }
      ]
    });

    if (!auth || !auth.userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    return res.json({
      success: true,
      data: {
        id: auth.userProfile.id,
        email: auth.email,
        firstName: auth.userProfile.firstName,
        lastName: auth.userProfile.lastName,
        phoneNumber: auth.userProfile.phoneNumber,
        dateOfBirth: auth.userProfile.dateOfBirth,
        gender: auth.userProfile.gender,
        profileImage: auth.userProfile.profileImage,
        isEmailVerified: auth.isEmailVerified,
        role: auth.role,
        onboarding: auth.userProfile.onboardingProgress
          ? {
              currentStep: auth.userProfile.onboardingProgress.currentStep,
              isComplete: auth.userProfile.onboardingProgress.isComplete,
              completedSteps: auth.userProfile.onboardingProgress.completedSteps
            }
          : null
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: (error as Error).message
    });
  }
};

export default {
  register,
  login,
  getProfile
}; 