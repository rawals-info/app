import { Request } from 'express';
import { Model, Optional } from 'sequelize';

// Auth Types
export interface AuthAttributes {
  id: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'healthcare_provider';
  isEmailVerified: boolean;
  verificationToken?: string | null;
  resetPasswordToken?: string | null;
  resetTokenExpiresAt?: Date | null;
  lastLogin?: Date | null;
  loginAttempts: number;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthCreationAttributes extends Optional<AuthAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isEmailVerified' | 'loginAttempts' | 'isLocked'> {}

export interface AuthInstance extends Model<AuthAttributes, AuthCreationAttributes>, AuthAttributes {
  checkPassword(password: string): Promise<boolean>;
  userProfile?: UserProfileInstance;
}

// UserProfile Types
export interface UserProfileAttributes {
  id: string;
  authId: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  dateOfBirth?: Date | null;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
  profileImage?: string | null;
  address?: any | null;
  timezone: string;
  language: string;
  notificationPreferences: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileCreationAttributes extends Optional<UserProfileAttributes, 'id' | 'createdAt' | 'updatedAt' | 'timezone' | 'language' | 'notificationPreferences'> {}

export interface UserProfileInstance extends Model<UserProfileAttributes, UserProfileCreationAttributes>, UserProfileAttributes {
  onboardingProgress?: OnboardingProgressInstance;
}

// OnboardingProgress Types
export interface OnboardingProgressAttributes {
  id: string;
  userId: string;
  currentStep: string;
  isComplete: boolean;
  completedSteps: string[];
  stepData: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface OnboardingProgressCreationAttributes extends Optional<OnboardingProgressAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isComplete' | 'completedSteps' | 'stepData'> {}

export interface OnboardingProgressInstance extends Model<OnboardingProgressAttributes, OnboardingProgressCreationAttributes>, OnboardingProgressAttributes {}

// HealthProfile Types
export interface HealthProfileAttributes {
  id: string;
  userId: string;
  diabetesType?: 'type1' | 'type2' | 'gestational' | 'prediabetes' | 'other' | null;
  diagnosisDate?: Date | null;
  weight?: number | null;
  weightUnit: 'kg' | 'lb';
  height?: number | null;
  heightUnit: 'cm' | 'ft';
  targetBloodSugarMin?: number | null;
  targetBloodSugarMax?: number | null;
  bloodSugarUnit: 'mg/dL' | 'mmol/L';
  medications?: any | null;
  allergies?: any | null;
  medicalConditions?: any | null;
  familyHistory?: any | null;
  lifestyle?: any | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthProfileCreationAttributes extends Optional<HealthProfileAttributes, 'id' | 'createdAt' | 'updatedAt' | 'weightUnit' | 'heightUnit' | 'bloodSugarUnit'> {}

export interface HealthProfileInstance extends Model<HealthProfileAttributes, HealthProfileCreationAttributes>, HealthProfileAttributes {}

// Auth-related request types
export interface RegisterRequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

// Extend Express Request to include authenticated user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// JWT Payload
export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
} 