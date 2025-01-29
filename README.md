# Midway Cleaning Company Platform

A comprehensive service management platform for cleaning operations, built with modern web technologies.

## Overview

The Midway Cleaning Company Platform is a web-based application designed to streamline cleaning service operations, task management, and client communication.

## 🌟 Features

### Task Management
- Create and manage cleaning tasks
- Assign tasks to staff members
- Track task status and completion
- Set priorities and due dates

### Staff Management
- Staff scheduling and availability
- Performance tracking
- Task assignment
- Staff profiles

### Location Management
- Multiple location support
- Location-specific task assignments
- Facility management
- Custom cleaning requirements

### Quality Control
- Inspection scheduling
- Quality reports
- Compliance tracking
- Issue management

## 🛠️ Tech Stack

- **Frontend**: Next.js 13 with TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: React Query

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or later
- npm or yarn
- PostgreSQL 12 or later

### Installation

1. Clone the repository
```bash
git clone https://github.com/GrayGhostDev/Midway_Cleaning_app.git
cd Midway_Cleaning_app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
- Set up your database connection
- Configure Clerk authentication
- Add any other required environment variables

5. Set up the database
```bash
npx prisma db push
```

6. Start the development server
```bash
npm run dev
```

## 🌐 Deployment

The application is deployed using GitHub Pages and can be accessed at:
https://grayghostdev.github.io/Midway_Cleaning_app/

## 🔒 Security

- Secure authentication with Clerk
- Input validation and sanitization
- Protected API routes
- Secure data handling

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
