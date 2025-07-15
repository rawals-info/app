# DiabetesBuddy

DiabetesBuddy is a comprehensive mobile application designed to help diabetic patients effectively manage their condition through blood sugar tracking, diet monitoring, exercise tracking, and personalized AI recommendations.

<p align="center">
  <img src="docs/logo_placeholder.png" alt="DiabetesBuddy Logo" width="200"/>
</p>

## Overview

DiabetesBuddy empowers diabetic patients to take control of their health by:

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
