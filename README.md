# DiabetesBuddy

A comprehensive diabetes management app built with React Native and Expo.

## Features

### 🩸 Blood Sugar Tracking
- Log blood sugar readings with different types (fasting, post-meal, random, HbA1c)
- Multiple input methods (manual, voice, device, file upload)
- Smart recommendations based on target ranges
- Visual feedback and success screens

### 🍽️ Food Logging (NEW!)
- **Multiple Input Methods**: Photo capture, voice recording, quick manual entry, and "same as last" meal
- **Smart Meal Type Detection**: Automatically suggests meal type based on time of day
- **Food Search & Database**: Search from extensive food database with nutritional information
- **Portion Control**: Multiple unit options (grams, pieces, cups, etc.) with quick portion buttons
- **Nutritional Analysis**: Automatic calorie and glycemic index calculations
- **AI Processing Pipeline**: Backend ready for photo analysis and voice transcription
- **Recent Meals**: Quick access to previously logged meals

### 🏠 Dashboard
- Latest blood sugar reading with smart time formatting
- Latest meal information with calorie and item count
- Health insights and recommendations
- Quick access to logging features

### 🎯 Onboarding & Goals
- Personalized questionnaire based on diabetes status
- Goal setting and progress tracking
- Motivational affirmations

## Technical Architecture

### Backend
- **Node.js/Express** with TypeScript
- **PostgreSQL** database with Sequelize ORM
- **JWT Authentication** with refresh tokens
- **Comprehensive API** for blood sugar and meal management
- **Food Database**: Structured food items with nutritional profiles
- **AI-Ready Pipeline**: Meal photo analysis and voice transcription endpoints
- **Relational Design**: Normalized database schema for optimal performance

### Frontend
- **React Native** with Expo SDK 53
- **TypeScript** for type safety
- **React Navigation** for seamless navigation
- **Beautiful UI** with consistent design system
- **Camera Integration** for meal photo capture
- **Voice Recording** capabilities
- **File Upload** support for various input methods

### Database Schema
```sql
-- Core user tables
auths, user_profiles, health_profiles

-- Health tracking
blood_sugar_readings, hba1c_readings

-- Food logging system
food_items          -- Nutritional database
meals              -- User meal records
meal_items         -- Foods consumed in each meal
- **Tracking blood sugar levels** manually or through connected devices
- **Logging meals** with AI analysis of nutritional content
- **Recording exercise activities** and their impact on blood sugar
- **Receiving personalized recommendations** based on data patterns
- **Setting alerts and reminders** for testing, medication, and activities

## Tech Stack

### Mobile App (React Native)
- **Framework**: React Native with Ignite boilerplate
- **State Management**: Redux/MobX
- **UI Components**: React Native Paper
- **Navigation**: React Navigation

### Backend (Node.js)
- **API**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT

### AI Features
- Food analysis with nutritional recommendations
- Exercise impact assessment and suggestions
- Blood sugar pattern detection
- Personalized health insights

## Features

### Blood Sugar Management
- Log readings with context (before/after meals, fasting, etc.)
- Visualize trends with interactive charts
- Set custom target ranges
- Receive alerts for out-of-range values

### Food Tracking
- Log meals with photos
- AI-powered nutritional analysis
- Carbohydrate counting assistance
- Meal impact on blood sugar

### Exercise Monitoring
- Track various physical activities
- Record duration, intensity, and effort
- Observe exercise impact on blood glucose
- Receive activity recommendations

### Smart Recommendations
- Personalized diet suggestions
- Exercise recommendations based on blood sugar patterns
- Lifestyle adjustment tips
- Progress reports and insights

## Project Structure

```
DiabetesBuddy/
├── backend/             # Node.js Express backend
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # API controllers
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Custom middleware
│   │   └── utils/       # Utility functions
│   └── README.md        # Backend documentation
│
└── mobile/              # React Native mobile app
    ├── app/
    │   ├── components/  # Reusable UI components
    │   ├── screens/     # App screens
    │   ├── navigation/  # Navigation configuration
    │   ├── services/    # API services
    │   └── theme/       # Styling and theme
    └── README.md        # Mobile app documentation
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- React Native development environment

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables (copy .env.sample to .env)

4. Start the development server:
   ```
   npm run dev
   ```

### Mobile App Setup

1. Navigate to the mobile directory:
   ```
   cd mobile
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the Metro bundler:
   ```
   npm start
   ```

4. Run on Android or iOS:
   ```
   npm run android
   # or
   npm run ios
   ```

## License

This project is licensed under the MIT License.

## Contributors

- [Your Name](https://github.com/yourusername)
- [Friend's Name](https://github.com/friendusername)
