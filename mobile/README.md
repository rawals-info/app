# DiabetesBuddy Mobile App

This is the React Native mobile application for DiabetesBuddy, built with Ignite boilerplate.

## Features

- **Blood Sugar Tracking**: Log and monitor blood glucose levels
- **Food Diary**: Track meals and get AI-powered nutritional analysis
- **Exercise Log**: Record physical activities and see their impact on blood sugar
- **Recommendations**: Receive personalized health insights and suggestions
- **Reports & Analytics**: Visualize health data with interactive charts
- **Reminders**: Set alerts for testing, medication, and activities

## App Structure

```
app/
├── components/   # Reusable UI components
├── screens/      # App screens
├── navigation/   # Navigation configuration
├── services/     # API services and data fetching
├── theme/        # Styling and theme configuration
└── utils/        # Helper functions and utilities
```

## Screens

### Authentication
- Login
- Registration
- Forgot Password

### Main App
- Dashboard/Home
- Blood Sugar Log
  - Add Reading
  - History
  - Statistics
- Food Tracker
  - Add Food Entry
  - Meal History
  - Nutrition Analysis
- Exercise Tracker
  - Add Exercise
  - Exercise History
  - Activity Impact
- Recommendations
  - Alerts
  - Suggestions
  - Action Tracking
- Profile
  - User Information
  - Health Goals
  - Settings

## Development Setup

### Prerequisites

- Node.js v14+
- React Native development environment
- Expo CLI

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on iOS:
   ```bash
   npm run ios
   ```

4. Run on Android:
   ```bash
   npm run android
   ```

## API Integration

The app connects to the DiabetesBuddy backend API for data storage and retrieval. API services are organized in the `services` directory:

- `api.js`: Base API configuration
- `authApi.js`: Authentication services
- `bloodSugarApi.js`: Blood sugar reading services
- `foodLogApi.js`: Food tracking services
- `exerciseApi.js`: Exercise tracking services
- `recommendationApi.js`: Recommendation services

## State Management

The app uses Redux for global state management:

- User authentication state
- Blood sugar readings
- Food logs
- Exercise records
- Recommendations

## UI Components

The app uses a combination of custom components and React Native Paper for a consistent and accessible interface:

- Typography
- Buttons
- Cards
- Inputs
- Charts
- Modals
- Lists
- Navigation

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License. 