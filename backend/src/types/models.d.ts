import { Sequelize, ModelDefined } from 'sequelize';
import { 
  AuthAttributes, 
  AuthCreationAttributes, 
  UserProfileAttributes, 
  UserProfileCreationAttributes,
  OnboardingProgressAttributes,
  OnboardingProgressCreationAttributes,
  HealthProfileAttributes,
  HealthProfileCreationAttributes
} from './index';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      DATABASE_URL: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      PORT: string;
    }
  }
}

declare module 'sequelize' {
  interface Sequelize {
    Auth: ModelDefined<AuthAttributes, AuthCreationAttributes>;
    User: ModelDefined<UserProfileAttributes, UserProfileCreationAttributes>;
    OnboardingProgress: ModelDefined<OnboardingProgressAttributes, OnboardingProgressCreationAttributes>;
    HealthProfile: ModelDefined<HealthProfileAttributes, HealthProfileCreationAttributes>;
    BloodSugarReading: any;
    Exercise: any;
    FoodLog: any;
    Recommendation: any;
    // Add other models here
  }
}

export {}; 