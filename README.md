
<div align="center">
  <img src="https://github.com/yamamahashayer/Minterviewer/blob/main/public/CoveringLight.png" alt="Minterviewer Logo" width="700" style="border-radius: 15px;">
</div>

Your personal AI-powered interview coach and career development platform.


![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=flat-square&logo=tailwind-css)
![React Native](https://img.shields.io/badge/React%20Native-Expo-blue?style=flat-square&logo=react)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Installation & Development](#installation--development)
- [Deployment](#deployment)
- [Authentication & Authorization](#authentication--authorization)
- [API Documentation](#api-documentation)
- [Mobile App](#mobile-app)
- [Contributing](#contributing)

## Overview

Minterviewer is a revolutionary AI-powered career development platform that transforms how job seekers prepare for interviews and connect with industry professionals. By combining cutting-edge artificial intelligence with human mentorship, we bridge the gap between academic preparation and real-world career success.

**The Problem We Solve:**
- Traditional interview preparation lacks personalized feedback and real-world practice
- Job seekers struggle to access quality mentorship and industry insights
- Companies face challenges in identifying truly qualified candidates beyond resumes
- Career development resources are fragmented and often ineffective

**Our Solution:**
Minterviewer creates a comprehensive ecosystem where technology empowers human potential. Our AI-driven interview simulations provide instant, actionable feedback while our mentorship network connects ambitious individuals with experienced professionals who can guide their career journey.

**Who We Serve:**
- **Job Seekers**: Gain confidence through AI-powered practice sessions and personalized coaching
- **Career Changers**: Transition smoothly into new roles with targeted skill development
- **Students**: Bridge the gap between education and employment with practical experience
- **Industry Professionals**: Share expertise and build their personal brand as mentors
- **Recruiters**: Identify top talent through AI-enhanced screening and objective evaluation

**Our Impact:**
We're not just preparing people for interviews – we're building careers, fostering professional growth, and creating meaningful connections that last a lifetime. Every feature is designed with one goal: to transform career anxiety into career confidence.

## Features

### For Mentees
- **AI-Powered CV Analysis**: ATS scoring, keyword coverage analysis, and personalized improvement suggestions
- **CV Upload & Parsing**: Upload resumes with Affinda AI parsing and structured data extraction
- **AI Interview Practice**: Real-time mock interviews with emotion detection and performance scoring
- **Interview Reports**: Detailed AI-generated feedback with strengths, improvements, and scoring
- **Job Applications**: Apply to jobs with AI-powered CV screening and interview scheduling
- **Mentor Sessions**: Book 1-on-1 sessions with industry professionals via video calls
- **Performance Analytics**: Track progress with detailed reports, interview history, and goal tracking

### For Mentors
- **Profile Management**: Showcase expertise, availability, and pricing
- **Session Booking**: Manage appointments with integrated calendar and video calls
- **Earnings Dashboard**: Track payments and financial performance
- **Feedback System**: Provide structured feedback to mentees
- **Stripe Integration**: Receive payments directly to connected accounts

### For Companies
- **Job Posting**: Create and manage job listings with custom requirements and application tracking
- **AI Screening**: Automated CV analysis and candidate ranking with ATS scoring
- **Interview Management**: Schedule and conduct AI or human interviews with evaluation system
- **Applicant Tracking**: Complete pipeline management with status updates and communication
- **Analytics Dashboard**: Recruitment metrics, applicant insights, and hiring analytics

### For Administrators
- **User Management**: Oversee all platform users and roles with authentication control
- **Platform Analytics**: Comprehensive usage statistics, user activity, and system performance metrics
- **Content Moderation**: Review and manage platform content and user-generated data
- **System Configuration**: Manage platform settings, integrations, and external service connections

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (Next.js)     │◄──►│   (MongoDB)     │
│                 │    │   Routes        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │   External APIs │              │
         └──────────────►│   (AI, Stripe, │◄─────────────┘
                        │    Email, etc.) │
                        └─────────────────┘
```

### Core Components
- **Authentication Layer**: JWT-based auth with role-based access control and secure token management
- **AI Services**: Integration with OpenAI, Google Gemini, and ElevenLabs for intelligent analysis and interactions
- **CV Processing**: Affinda API for intelligent CV parsing, data extraction, and structured analysis
- **Payment Processing**: Stripe Connect for mentor payments, platform fees, and secure financial transactions
- **Real-time Communication**: 
  - Jitsi integration for high-quality video calls and mentor sessions
  - Firebase for instant notifications and real-time messaging/chat between users
- **File Processing**: PDF parsing, CV analysis, document generation, and export capabilities
- 
## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with PostCSS
- **UI Components**: Radix UI + shadcn/ui component system
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes (dark/light mode)
- **Custom Hooks**: Custom React hooks in `/hooks` directory
- **Context**: React Context for theme and global state

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **File Processing**: pdf-parse, puppeteer
- **Email**: Nodemailer
- **Video**: Jitsi integration (for mentor sessions)
- **Real-time**: Firebase (notifications and messaging)

### AI & External Services
- **OpenAI**: GPT-4 for code analysis and speech-to-text
- **Google Gemini**: AI insights via OpenRouter (CV analysis, interviews, reports)
- **OpenRouter**: AI gateway for Gemini model access
- **ElevenLabs**: Speech-to-text and text-to-speech for AI interviews
- **Affinda**: CV parsing and document extraction
- **Face API.js**: Local emotion detection during interviews
- **Stripe**: Payment processing and Connect for mentors

### Mobile App
- **Framework**: React Native with Expo SDK 54 for cross-platform development
- **Navigation**: React Navigation (bottom-tabs, stack, native) for intuitive mobile navigation
- **Storage**: Expo Secure Store for secure authentication token storage and data persistence
- **Charts**: React Native Chart Kit for data visualization and analytics display
- **HTTP Client**: Axios for robust API communication and data synchronization
- **Package Name**: com.minterviewer.mobile for app store distribution
- **Platform Support**: iOS, Android, Web for maximum reach and accessibility
- **Configuration**: Expo app.json with custom settings and platform-specific optimizations

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint with Next.js configuration
- **Type Checking**: TypeScript 5.9.3
- **Environment**: dotenv
- **UI Components**: shadcn/ui with Radix UI
- **Styling**: PostCSS with Tailwind CSS
- **Code Formatting**: ESLint rules

### Configuration Files
- **`next.config.ts`**: Next.js configuration with image optimization
- **`tsconfig.json`**: TypeScript configuration with path aliases
- **`components.json`**: shadcn/ui component configuration
- **`postcss.config.mjs`**: PostCSS configuration for Tailwind
- **`eslint.config.mjs`**: ESLint configuration for code quality
- **`.gitignore`**: Git ignore rules for Node.js and Next.js

## Project Structure

```
Minterviewer/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── (dashboard)/              # Role-based dashboards
│   │   ├── admin/               # Admin dashboard
│   │   ├── company/             # Company dashboard
│   │   ├── mentee/              # Mentee dashboard
│   │   └── mentor/              # Mentor dashboard
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── company/             # Company management
│   │   ├── mentee/              # Mentee operations
│   │   ├── mentor/              # Mentor operations
│   │   ├── stripe/              # Payment processing
│   │   └── ...                  # Other API endpoints
│   ├── components/              # Reusable components
│   └── public/                  # Public pages
├── components/                  # Shared UI components
├── Context/                     # React contexts (Theme, etc.)
├── lib/                         # Utility libraries
│   ├── auth-helper.ts           # Authentication utilities
│   ├── mongodb.js               # Database connection
│   ├── email.ts                 # Email service
│   └── ...                      # Other utilities
├── models/                      # Mongoose schemas
├── hooks/                       # Custom React hooks
├── types/                       # TypeScript type definitions
├── Minterviewer-Mobile/         # React Native mobile app
│   ├── src/                     # Mobile app source
│   ├── assets/                  # Mobile assets
│   ├── app.json                 # Expo configuration
│   └── package.json             # Mobile dependencies
├── public/                      # Static assets
├── scripts/                     # Build and utility scripts
│   └── seed.js                  # Database seeding
├── components.json              # shadcn/ui configuration
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── postcss.config.mjs          # PostCSS configuration
├── eslint.config.mjs            # ESLint configuration
├── .gitignore                   # Git ignore rules
└── package.json                 # Main dependencies
```

## Environment Variables

Create a `.env.local` file in the root directory:

**Note**: A `.env` file exists in the project. Copy it to `.env.local` for local development.

```env
# Database
MONGODB_URI=mongodb://localhost:27017/Minterviewer

# Authentication
JWT_SECRET=your-super-secret-jwt-key
NEXTAUTH_URL=http://localhost:3000

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI Services
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=...
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=...

# OpenRouter (Gateway for Gemini)
OPENROUTER_API_KEY=sk-or-...

# Affinda (CV Parsing)
AFFINDA_API_KEY=your-affinda-key
AFFINDA_WORKSPACE=your-workspace-id
AFFINDA_DOCUMENT_TYPE=resume

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Firebase (Notifications)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

## Installation & Development

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Minterviewer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env .env.local  # Copy existing .env file
   # Edit .env.local with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Web app: http://localhost:3000
   - API docs: http://localhost:3000/api

### Mobile App Development

The React Native mobile app uses Expo for cross-platform development:

**Mobile Configuration:**
- **Package Name**: `com.minterviewer.mobile`
- **Expo Version**: ~54.0.30
- **Orientation**: Portrait only
- **Platform Support**: iOS, Android, Web

**Mobile Setup:**
1. **Navigate to mobile directory**
   ```bash
   cd Minterviewer-Mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Expo development server**
   ```bash
   npm start
   ```

4. **Run on device/emulator**
   ```bash
   npm run android    # Android
   npm run ios        # iOS
   npm run web        # Web
   ```

**Mobile-Specific Files:**
- `app.json` - Expo configuration
- `.gitignore` - Mobile-specific ignore rules
- `tsconfig.json` - Mobile TypeScript configuration

## Deployment

### Vercel (Recommended)

1. **Connect repository to Vercel**
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

### Database Setup

For production, use MongoDB Atlas:
1. Create a cluster
2. Set up database user and IP whitelist
3. Update `MONGODB_URI` in production environment

### Firebase Setup

For notifications and real-time features:
1. Create Firebase project at https://console.firebase.google.com
2. Enable Cloud Firestore and Cloud Messaging
3. Generate service account key
4. Add Firebase credentials to environment variables:
   - `FIREBASE_PROJECT_ID` 
   - `FIREBASE_PRIVATE_KEY` 
   - `FIREBASE_CLIENT_EMAIL` 

### Stripe Setup

1. Create Stripe account
2. Set up Connect for mentor payments
3. Configure webhooks
4. Add keys to environment variables

## Authentication & Authorization

### User Roles
- **Mentee**: Job seekers and interview preparation users
- **Mentor**: Industry professionals providing coaching
- **Company**: Recruiters and hiring managers
- **Admin**: Platform administrators

### Authentication Flow
1. User registration with email/password
2. JWT token generation upon login
3. Token-based API authentication
4. Role-based access control for routes and resources

### Authorization Middleware
Protected routes use JWT verification and role checking:
```typescript
// Example middleware usage
const { user, role } = await getUserFromToken(token);
if (!user || requiredRoles.includes(role)) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

## API Documentation

### Core Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/forgot-password` - Password reset
- `GET /api/auth/session` - Get current session

#### Mentee Operations
- `GET /api/mentee/dashboard` - Dashboard data
- `POST /api/mentee/cv/upload` - Upload CV for analysis
- `GET /api/mentee/applications` - Job applications
- `POST /api/mentee/interview/start` - Start AI interview

#### Mentor Operations
- `GET /api/mentor/dashboard` - Dashboard data
- `POST /api/mentor/sessions` - Create time slots
- `GET /api/mentor/earnings` - Payment history
- `POST /api/mentor/feedback` - Submit feedback

#### Company Operations
- `POST /api/company/jobs` - Post job listing
- `GET /api/company/applicants` - View applicants
- `POST /api/company/interview/schedule` - Schedule interviews

#### Payment Processing
- `POST /api/stripe/create-checkout-session` - Create payment
- `POST /api/stripe/webhook` - Handle webhooks
- `POST /api/stripe/connect` - Stripe Connect setup

### Response Format
All API responses follow consistent format:
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

## Mobile App

The React Native mobile app provides core functionality for on-the-go access:

### Features
- User authentication and profile management with secure JWT authentication
- Dashboard overview with real-time statistics and progress tracking
- Session booking and management with calendar integration and payment processing
- AI interview practice with emotion detection and performance scoring
- Notifications and messaging system with real-time updates
- Job browsing and applications with AI-powered screening
- Cross-platform synchronization with web application for seamless experience

### Technical Details
- Built with Expo SDK 54 for cross-platform compatibility across iOS, Android, and Web
- Secure storage implementation using Expo Secure Store for authentication tokens and sensitive data
- Responsive design optimized for various screen sizes and device orientations
- Real-time data synchronization with web application ensuring consistent user experience
- Offline capabilities for core functionality with intelligent caching strategies

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices and strict typing for robust code quality
- Use conventional commit messages for clear version control history
- Ensure all tests pass before submitting changes to maintain code reliability
- Update documentation for new features to keep project knowledge current
- Follow the established code style and patterns for consistency across the codebase
- Use ESLint configuration for code quality and maintainability
- Test on both web and mobile platforms when applicable to ensure cross-platform compatibility

### Code Quality
- Run `npm run lint` to check for linting errors and maintain code standards
- Follow the existing component structure and architectural patterns
- Implement proper error handling and user feedback mechanisms
- Write clean, maintainable, and well-documented code for future maintenance

---
## Contributors

<div align="center">
<table>
  <tr>
    <td align="center" width="50%">
      <a href="https://github.com/yamamahashayer">
        <img src="https://github.com/yamamahashayer.png"
             width="110"
             alt="Yamamah Ashayer"
             style="border-radius: 50%;" />
        <br />
        <strong>Yamamah Ashayer</strong>
      </a>
      <br />
      <sub>GitHub: <a href="https://github.com/yamamahashayer">@yamamahashayer</a></sub>
    </td>
    <td align="center" width="50%">
      <a href="https://github.com/YaraDaraghmeh">
        <img src="https://github.com/YaraDaraghmeh.png"
             width="110"
             alt="Yara Daraghmeh"
             style="border-radius: 50%;" />
        <br />
        <strong>Yara Daraghmeh</strong>
      </a>
      <br />
      <sub>GitHub: <a href="https://github.com/YaraDaraghmeh">@YaraDaraghmeh</a></sub>
    </td>
  </tr>
</table>
</div>
