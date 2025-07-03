# Career Explorer

## Project Overview

Career Explorer is a comprehensive career guidance platform designed to help students discover suitable career paths through AI-powered assessments and personalized recommendations. The platform combines psychometric testing (DISC personality assessment), interest profiling (RAISEC), and educational survey data to provide tailored career recommendations and insights.

## Key Features

### Assessment Center

- **DISC Personality Assessment**: Evaluates behavioral traits and working styles
- **Interest Profiler (RAISEC)**: Identifies career interests across six domains (Realistic, Artistic, Investigative, Social, Enterprising, Conventional)
- **Educational Survey**: Gathers academic background, preferences, and career aspirations
- **AI-Powered Analysis**: Combines assessment results to generate personalized career recommendations

### Career Exploration

- **Video-Based Career Exploration**: Browse and watch career-related videos
- **Creator Profiles**: Access content from career advisors and professionals
- **Career Path Information**: Detailed information about various career options

### Resume Builder

- **Template Selection**: Choose from multiple resume templates
- **Resume Dashboard**: Manage and edit created resumes
- **PDF Export**: Download completed resumes in PDF format

### User Dashboard

- **Assessment Results**: View and analyze assessment results
- **Career Recommendations**: Access AI-generated career suggestions
- **Progress Tracking**: Monitor completion of assessments and activities

### Additional Features

- **Workspace**: Collaborative environment for career exploration
- **Payment Integration**: Premium features access through Stripe
- **School Integration**: Special access options for educational institutions

## Tech Stack

### Frontend

- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit with Redux Persist
- **Routing**: React Router DOM v6
- **UI Components**: Material UI, React Icons
- **Data Visualization**: ECharts
- **PDF Generation**: React PDF, jsPDF, html2pdf.js, html2canvas
- **Form Handling**: React Quill (rich text editor)
- **Styling**: CSS Modules

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: AWS S3
- **Background Processing**: BullMQ with Redis
- **Email Service**: Nodemailer
- **Payment Processing**: Stripe

### AI Integration

- **OpenAI Integration**: GPT-4o-mini model for personality analysis and career recommendations
- **O\*NET API**: Career information database integration
- **Custom Python Scripts**: Data processing and analysis

## Setup and Installation

### Prerequisites

- Node.js 20.x
- npm 10.x or higher
- MongoDB
- Redis
- Python 3.x (for AI analysis scripts)

### Backend Setup

1. Navigate to the server directory:

   ```
   cd server
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a .env file based on .env.example:

   ```
   cp .env.example .env
   ```

4. Configure the environment variables in .env with your specific values:

   - MongoDB connection string
   - JWT secrets
   - AWS credentials
   - OpenAI API key
   - Stripe keys
   - Email service credentials
   - O\*NET API credentials

5. Start the development server:
   ```
   npm run server
   ```

### Frontend Setup

1. Navigate to the client directory:

   ```
   cd client
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Environment Requirements

### Backend Environment Variables

- `TITLE`: Application name
- `PORT`: Server port
- `MONGO_RUNNING_DATABASE`: MongoDB database name
- `MONGO`: MongoDB connection string
- `NODE_ENV`: Environment (development/production)
- `DOMAIN`, `HOST`: Frontend URL
- `SERVER_API`: Backend URL
- `JWT_ACCESS_TOKEN`, `JWT_REFRESH_TOKEN`, `JWT_INVITATION_TOKEN`: JWT secrets
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`, `AWS_REGION`, `AWS_S3_DOMAIN`: AWS S3 configuration
- `ONET_BASE_URL`, `ONET_TOKEN`: O\*NET API credentials
- `OPENAI_API_KEY`: OpenAI API key
- `PUBLISHABLE_KEY`, `SECRET_KEY`: Stripe API keys
- Email service configuration variables

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Minimum 4GB RAM
- Stable internet connection

## AI-Powered Career Recommendations

The Career Explorer platform leverages AI technology to provide personalized career recommendations through a multi-step process:

1. **Data Collection**:

   - DISC personality assessment evaluates behavioral traits (Dominance, Influence, Steadiness, Compliance)
   - Interest profiler categorizes career interests according to the RAISEC model
   - Educational survey gathers academic background and preferences

2. **Data Processing**:

   - The platform processes assessment results to identify behavioral patterns, interests, and educational background
   - Python-based analysis scripts calculate compatibility scores with various career paths

3. **AI Analysis**:

   - OpenAI's GPT-4o-mini model analyzes the combined assessment data
   - The AI generates multiple personalized insights:
     - Personality insights (500-word summary)
     - Basic character traits analysis
     - Management responsibility assessment
     - Career pathway recommendations

4. **Personalized Reports**:
   - Detailed assessment reports with career recommendations
   - Personalized development suggestions
   - Educational pathway recommendations

The AI component is carefully designed to provide developmentally appropriate guidance for students, using clear language while maintaining analytical depth. The system avoids direct repetition of assessment scores, instead translating raw data into meaningful insights about personality traits, working styles, and career compatibility.

## Usage Guide

### Student Journey

1. Create an account and log in
2. Complete the assessment center tests:
   - DISC personality assessment
   - Interest profiler
   - Educational survey
3. View assessment results and initial career recommendations
4. Explore detailed career paths through the video library
5. Use the resume builder to create professional resumes
6. Access the workspace for continued career exploration

### Administrator Features

1. Manage user accounts
2. Access analytics on assessment completion
3. Configure school access codes
4. Monitor platform usage

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
