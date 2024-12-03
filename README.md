# Midway Cleaning Company Platform

A comprehensive, real-time enabled service management platform for cleaning operations with enterprise-grade security and scalability.

## 🌟 Features

### Client Portal
- 📱 Service booking and management
- 🔄 Real-time service tracking with WebSocket
- 💳 Secure payment processing
- 📄 Document management
- 💬 Real-time chat system
- 👤 Personalized user profiles
- 🔔 Custom notification preferences

### Admin Dashboard
- 👥 Staff management and scheduling
- 📊 Analytics and reporting
- 📦 Inventory tracking
- 🛠️ Equipment maintenance
- 👨‍💼 User management system
- 🔔 Real-time notification center

### Enterprise Features
- 📍 Multi-location support
- 📦 Custom service packages
- 📊 Advanced analytics
- 📱 Mobile-responsive design
- 🔒 Enterprise-grade security
- 🔄 Real-time updates

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 13 with TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **API**: REST + WebSocket
- **Real-time**: Socket.IO with Redis adapter
- **Security**: 
  - Rate limiting (Redis-based)
  - Request validation (Zod)
  - File upload security
  - CORS and CSP headers
  - IP-based protection
- **Monitoring**: Sentry, Pino logging
- **State Management**: React Query, Zustand

### Security Features
- 🔒 Multi-layered security architecture
- 🛡️ Rate limiting and DDoS protection
- ✅ Input validation and sanitization
- 📄 Secure file uploads
- 🔐 Advanced authentication
- 🌐 CORS and CSP configuration
- 🔍 IP-based security
- ⚡ Real-time security monitoring

## 🚀 Getting Started

### Prerequisites
- Node.js 16.8 or later
- PostgreSQL 12 or later
- Redis 6 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/midway-cleaning-co.git
cd midway-cleaning-co
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Configure environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/midway_cleaning"

# Redis
REDIS_URL="redis://localhost:6379"

# Security
ALLOWED_ORIGINS="http://localhost:3000"
WHITELISTED_IPS=""
BLACKLISTED_IPS=""
TRUSTED_PROXIES="127.0.0.1"
MAX_REQUEST_SIZE="10485760"
MAX_UPLOAD_SIZE="52428800"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""

# AWS (File Storage)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
AWS_BUCKET_NAME=""

# Email
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASSWORD=""
```

5. Set up the database
```bash
# Create database
npx prisma db push

# Apply migrations
npx prisma migrate dev

# Seed initial data
npm run db:seed
```

6. Start the development server
```bash
# Start all services
npm run dev:all

# Or start services separately
npm run dev        # Next.js server
npm run websocket  # WebSocket server
```

## 📚 Documentation

Detailed documentation is available in the `/docs` directory:

- [API Documentation](./docs/api/README.md)
- [Security Guide](./docs/security/README.md)
- [Deployment Guide](./docs/deployment/README.md)
- [Development Guide](./docs/development/README.md)
- [Testing Guide](./docs/testing/README.md)

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e

# Run all tests (CI mode)
npm run test:ci
```

## 🚀 Deployment

See [Deployment Guide](./docs/deployment/README.md) for detailed instructions on:
- Production environment setup
- Security configurations
- Performance optimization
- Monitoring and logging
- Scaling strategies

## 📈 Monitoring

The platform includes comprehensive monitoring:
- Application performance monitoring with Sentry
- Custom metrics tracking
- Error tracking and alerting
- Real-time WebSocket monitoring
- Security event logging

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- All contributors and maintainers
