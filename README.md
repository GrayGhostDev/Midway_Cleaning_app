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
- **Performance Optimizations**:
  - Edge Computing:
    - Cloudflare Workers for edge caching
    - Edge API routes with Next.js
    - Dynamic edge config
  - Database Optimization:
    - Horizontal sharding strategy
    - Read replicas configuration
    - Query optimization layer
  - Progressive Web App:
    - Service worker implementation
    - Offline functionality
    - Push notifications
  - Performance Testing:
    - Automated lighthouse testing
    - Load testing with k6
    - Real user monitoring
- **Service Architecture**:
  - Microservices for core functionalities
  - Event-driven architecture using Apache Kafka/RabbitMQ
  - Service mesh for microservices communication
- **DevOps Pipeline**:
  - Infrastructure as Code (Terraform/Pulumi)
  - GitOps workflow with ArgoCD
  - Automated canary deployments
- **API Layer**:
  - REST API with OpenAPI/Swagger
  - GraphQL with Apollo Server (optional)
  - API versioning strategy
- **Background Processing**:
  - Bull for job queues
  - Scheduled tasks with node-cron
- **Caching Strategy**:
  - Redis for session storage
  - Content caching with CDN
  - Browser caching policies
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
- **Service Mesh Architecture**:
  - Istio for service mesh implementation
    - Traffic management and load balancing
    - Service discovery and configuration
    - Security with mutual TLS
  - Service mesh observability
    - Distributed tracing with Jaeger
    - Metrics collection with Prometheus
    - Service mesh dashboard with Kiali

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
- **Optional Components**:
  - ElasticSearch for advanced search
  - MinIO for local S3-compatible storage
  - Mailhog for local email testing
  - Jaeger for distributed tracing

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
NEXT_PUBLIC_CLERK_SIGN_IN_URL=""
NEXT_PUBLIC_CLERK_SIGN_UP_URL=""
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=""
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=""

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

# Performance
CACHE_TTL="3600"
REDIS_CACHE_PREFIX="midway:"
WEBSOCKET_HEARTBEAT_INTERVAL="30000"

# Monitoring
SENTRY_DSN=""
SENTRY_ENVIRONMENT="development"
LOG_LEVEL="debug"
ENABLE_API_LOGGING="true"

# Feature Flags
ENABLE_WEBSOCKETS="true"
ENABLE_FILE_UPLOAD="true"
MAINTENANCE_MODE="false"

# Rate Limiting
RATE_LIMIT_WINDOW="15m"
RATE_LIMIT_MAX_REQUESTS="100"

# Performance Configuration
EDGE_CACHING_ENABLED="true"
EDGE_CACHE_TTL="3600"
PWA_ENABLED="true"
DB_POOL_SIZE="20"
DB_IDLE_TIMEOUT="10000"
QUERY_TIMEOUT="5000"
MAX_CONNECTIONS="100"

# Cloudflare Configuration
CLOUDFLARE_API_TOKEN=""
CLOUDFLARE_ZONE_ID=""
CLOUDFLARE_ACCOUNT_ID=""

# Performance Monitoring
PERFORMANCE_BUDGET_CLS="0.1"
PERFORMANCE_BUDGET_FID="100"
PERFORMANCE_BUDGET_LCP="2500"
PERFORMANCE_BUDGET_TTI="3500"

# Database Sharding
ENABLE_SHARDING="true"
SHARD_COUNT="4"
SHARD_KEY="customer_id"
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
  - REST API endpoints
  - WebSocket events
  - Authentication flows
  - Rate limiting
  - Error handling
  - API versioning
  - Swagger/OpenAPI specifications
- [Security Guide](./docs/security/README.md)
- [Deployment Guide](./docs/deployment/README.md)
- [Development Guide](./docs/development/README.md)
- [Testing Guide](./docs/testing/README.md)

## 🧪 Testing

The platform uses the following testing frameworks:
- Jest for unit and integration testing
- Cypress for end-to-end testing
- React Testing Library for component testing
- k6 for load testing
- MSW (Mock Service Worker) for API mocking

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e

# Run load tests
npm run test:load

# Run all tests (CI mode)
npm run test:ci
```

## 🚀 Deployment

See [Deployment Guide](./docs/deployment/README.md) for detailed instructions on:
- ### Infrastructure Options
  - Docker Swarm/Kubernetes deployments
  - AWS ECS/EKS configuration
  - Zero-downtime deployment strategy
  - Blue-green deployment support
  
- ### Scaling Strategy
  - Horizontal scaling configuration
  - Database replication setup
  - Redis cluster configuration
  - Load balancer setup

## 📈 Monitoring

The platform includes comprehensive monitoring:
- Application performance monitoring with Sentry
- **Observability Stack**:
  - Metrics: Prometheus with Grafana dashboards
  - Tracing: OpenTelemetry with Jaeger
  - Logging: ELK Stack (Elasticsearch, Logstash, Kibana)
 
- **Service Health Monitoring**:
  - Service mesh metrics with Istio
  - Circuit breaker status monitoring
  - Feature flag usage analytics
  - Event sourcing metrics
  - CQRS performance monitoring

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

## 🛠️ Development Tools

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks
- lint-staged for staged files linting
- TypeScript for static type checking

### Development Experience
- Docker for containerization
- Docker Compose for local development
- Hot Module Replacement (HMR)
- VS Code debugging configurations
- Chrome DevTools integration

### Performance Monitoring
- Lighthouse CI for performance metrics
- Bundle analyzer for package size optimization
- Memory leak detection tools
- WebSocket connection monitoring

### Infrastructure Options
  - Docker Swarm/Kubernetes deployments
  - AWS ECS/EKS configuration
  **Service Mesh Deployment**:
    - Istio service mesh configuration
    - Envoy proxy setup
    - mTLS certificate management
  
  **Event Infrastructure**:
    - Kafka cluster deployment
    - Event store configuration
    - CQRS service deployment
    - Feature flag service setup

## Authentication

This project uses Clerk for authentication and user management. Key features include:

- Custom-styled sign-in and sign-up pages
- Role-based access control
- Protected routes and API endpoints
- Social authentication providers
- User profile management
- Session handling
- Webhook integration
- MFA support
- Admin role management

### Authentication Setup

1. Create a Clerk account and project at [clerk.com](https://clerk.com)
2. Copy your API keys from the Clerk Dashboard
3. Configure environment variables in `.env.local`
4. Set up roles in Clerk Dashboard
5. Configure webhook endpoints (optional)

## Project Structure

The application uses Next.js Pages Router with the following structure:

```
src/
├── components/     # React components
├── pages/         # Next.js pages
│   ├── api/       # API routes
│   ├── dashboard/ # Dashboard pages
│   ├── sign-in/   # Authentication pages
│   └── sign-up/
├── styles/        # Global styles
├── lib/          # Utility functions
└── types/        # TypeScript types
```

Note: This project uses the Next.js Pages Router exclusively. The App Router (`app/` directory) is not used.
