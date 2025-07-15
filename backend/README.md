# DiabetesBuddy Backend API

This is the backend API for DiabetesBuddy, a comprehensive diabetes management application that helps users track blood sugar levels, food intake, exercise, and provides personalized recommendations.

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **PostgreSQL**: Relational database
- **Sequelize**: ORM for database interactions
- **JSON Web Token (JWT)**: Authentication mechanism
- **bcrypt**: Password hashing

## Architecture

The backend follows a modular architecture with the following components:

### Models

- **User**: User account information and preferences
- **BloodSugarReading**: Blood glucose measurements
- **FoodLog**: Food diary with nutritional information
- **Exercise**: Physical activity tracking
- **Recommendation**: AI-generated health insights and suggestions

### Controllers

- **userController**: User registration, authentication, and profile management
- **bloodSugarController**: Blood sugar reading CRUD and statistics
- **foodLogController**: Food logging with AI analysis
- **exerciseController**: Exercise tracking and statistics
- **recommendationController**: Personalized recommendation management

### Routes

- **/api/users**: Authentication and user management
- **/api/blood-sugar**: Blood glucose monitoring
- **/api/food-logs**: Food tracking
- **/api/exercises**: Exercise logging
- **/api/recommendations**: Health recommendations

### Middleware

- **auth.js**: JWT authentication middleware

### Utils

- **aiService.js**: AI analysis services for food, exercise, and blood sugar patterns

## Database Schema

The database uses PostgreSQL with the following entity relationships:

### Authentication and User Models

1. **Auth**: Handles all authentication-related data
   - User credentials
   - Roles (user, admin, healthcare provider)
   - Email verification
   - Password reset

2. **UserProfile**: Basic user profile information
   - Name, contact info
   - Preferences
   - Linked to Auth

3. **OnboardingProgress**: Tracks user onboarding
   - Current step
   - Completed steps
   - Step-specific data

4. **HealthProfile**: Health-specific information
   - Diabetes type and diagnosis date
   - Weight, height
   - Target blood sugar range
   - Medications, allergies

### Health Tracking Models

5. **BloodSugarReading**: Blood glucose measurements
   - Value and unit
   - Reading context (fasting, after meal, etc.)
   - Device information
   - Tags and notes

6. **FoodLog, Exercise, etc.**: Core health tracking tables

### Admin Models

7. **AdminSettings**: System configuration settings
8. **AdminAuditLog**: Admin action tracking

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+) or a Neon PostgreSQL account

### Environment Setup

1. Clone the repository
   ```
   git clone https://github.com/yourusername/diabetes-buddy.git
   cd diabetes-buddy/backend
   ```

2. Copy the environment template
   ```
   cp env.example .env
   ```

3. Update the `.env` file with your database credentials
   ```
   # For Neon Postgres
   DATABASE_URL=postgres://user:password@hostname:port/database
   
   # Set a secure JWT secret
   JWT_SECRET=your_secure_random_string
   ```

4. Install dependencies
   ```
   npm install
   ```

### Database Setup

1. Run the database migrations
   ```
   npm run db:migrate
   ```

2. (Optional) Seed the database with initial data
   ```
   npm run db:seed
   ```

3. Other useful database commands
   ```
   # Undo the last migration
   npm run db:migrate:undo
   
   # Reset the database (USE WITH CAUTION - DROPS ALL TABLES)
   npm run db:reset
   ```

### Starting the Server

1. Start the development server
   ```
   npm run dev
   ```

2. Start the production server
   ```
   npm run start
   ```

## API Authentication

All protected endpoints require a valid JWT token sent in the Authorization header:

```
Authorization: Bearer <token>
```

## Error Handling

The API returns consistent error responses with the following format:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": "Optional technical error details"
}
```

## AI Integration

The backend includes simulated AI services for food analysis, exercise recommendations, and blood sugar pattern detection. In a production environment, these would be connected to real AI services like OpenAI's GPT models.

## License

This project is licensed under the MIT License. 