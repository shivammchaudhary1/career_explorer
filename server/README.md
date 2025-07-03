# Career Explorer Backend

## Overview

Career Explorer is a comprehensive career guidance and exploration platform designed to help students, job seekers, and professionals make informed decisions about their career paths. The backend serves as the API and data management system for the Career Explorer platform.

## Features

- 🔐 Authentication & Authorization
- 👤 User Profile Management
- 📊 DISC Assessment System
- 🎯 Interest Profile Analysis
- 📝 Career Planning Tools
- 🎥 Educational Video Content
- 📚 Career Resources Management
- 💰 Payment Integration
- 📋 Resume Builder
- 📈 User Progress Tracking
- 🤝 School Contact Management
- 📊 O\*NET Integration for Career Data

## Tech Stack

- Node.js
- Express.js
- MongoDB
- AWS S3 for file storage
- Redis for caching
- JWT for authentication
- Stripe for payments

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Redis Server
- AWS Account
- Stripe Account
- Gmail Account (for email notifications)

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd ce-phase2-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Fill in the required environment variables in the .env file:

   - Database configuration
   - AWS credentials
   - JWT secrets
   - Email settings
   - Stripe keys
   - Other API keys

4. **Database Setup**

   ```bash
   # Start MongoDB service
   mongod

   # The application will automatically create required collections on first run
   ```

5. **Start Redis Server**

   ```bash
   redis-server
   ```

6. **Run the Application**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm run start
   ```

## API Documentation

The API is organized around REST principles. All endpoints accept JSON-encoded request bodies, return JSON-encoded responses, and use standard HTTP response codes.

Base URL: `http://localhost:8000/api/v1`

### Key Endpoints:

- **Authentication**
  - POST /auth/register
  - POST /auth/login
  - POST /auth/google
- **User Management**
  - GET /users/profile
  - PUT /users/profile
  - GET /users/history
- **Career Assessment**
  - GET /disc/questions
  - POST /disc/submit
  - GET /interest-profile/questions
- **Content Management**
  - GET /explore/videos
  - GET /explore/playlists
  - POST /creator/upload

Full API documentation is available at `/api-docs` when running the server.

## Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Deploy to production server**
   - Ensure all production environment variables are set
   - Set up PM2 or similar process manager
   ```bash
   pm2 start ecosystem.config.js
   ```

## Error Handling

The application uses a centralized error handling system. All errors are logged and appropriate HTTP status codes are returned.

## Security Features

- JWT-based authentication
- Rate limiting
- CORS protection
- Input validation
- XSS protection
- Security headers
- Password hashing

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@careerexplorer.com or create an issue in the repository.
