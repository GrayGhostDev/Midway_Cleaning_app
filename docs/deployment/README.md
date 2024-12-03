# Deployment Guide

## Overview
This guide covers the deployment process for the Midway Cleaning Platform, including infrastructure setup, security configuration, WebSocket deployment, and monitoring procedures.

## Prerequisites
- Docker and Docker Compose
- Node.js 18 or higher
- PostgreSQL 15
- Redis 7
- Nginx
- SSL certificates
- Clerk account
- AWS account (for file storage)

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/midway-cleaning.git
cd midway-cleaning
```

### 2. Environment Variables
Copy the example environment file and update with your values:
```bash
cp .env.example .env
```

Required variables:
```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://user:password@db:5432/midway_cleaning

# Redis
REDIS_URL=redis://redis:6379

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Security
ALLOWED_ORIGINS=https://your-domain.com
WHITELISTED_IPS=
BLACKLISTED_IPS=
TRUSTED_PROXIES=
MAX_REQUEST_SIZE=10485760
MAX_UPLOAD_SIZE=52428800

# AWS (File Storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=

# WebSocket
WS_SERVER_URL=wss://your-domain.com
WS_AUTH_KEY=your-secret-key
```

### 3. SSL Certificates
Place your SSL certificates in the nginx/ssl directory:
```bash
mkdir -p nginx/ssl
cp /path/to/your/fullchain.pem nginx/ssl/
cp /path/to/your/privkey.pem nginx/ssl/
```

## Production Deployment

### Using Docker Compose

1. Build and start services:
```bash
docker-compose build
docker-compose up -d
```

2. Initialize database:
```bash
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma generate
```

3. Verify deployment:
```bash
docker-compose ps
docker-compose logs -f app
```

## Infrastructure Components

### Database (PostgreSQL)
- Port: 5432
- Volume: postgres_data
- Backup frequency: Daily
- Backup retention: 7 days

### Cache & Rate Limiting (Redis)
- Port: 6379
- Volume: redis_data
- Persistence: AOF enabled
- Rate limiting configuration
- WebSocket state management

### Load Balancer (Nginx)
- Ports: 80 (HTTP), 443 (HTTPS), 8080 (WebSocket)
- SSL termination
- WebSocket proxy
- Rate limiting
- Security headers

### WebSocket Server
- Port: 8080
- Auto-restart enabled
- Redis adapter for scaling
- Authentication middleware
- Rate limiting middleware

### Application Server
- Port: 3000
- Auto-restart enabled
- Health checks
- Security middleware
- File upload handling

## Security Configuration

### Rate Limiting
Configure in docker-compose.yml:
```yaml
services:
  app:
    environment:
      RATE_LIMIT_WINDOW: 60000
      RATE_LIMIT_MAX_AUTHENTICATED: 100
      RATE_LIMIT_MAX_ANONYMOUS: 20
      RATE_LIMIT_MAX_WEBSOCKET: 50
      RATE_LIMIT_MAX_UPLOAD: 10
```

### Security Headers
Update Nginx configuration:
```nginx
add_header Content-Security-Policy "default-src 'self'";
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

### WebSocket Security
Configure WebSocket server:
```yaml
services:
  websocket:
    environment:
      WS_AUTH_REQUIRED: "true"
      WS_MAX_CONNECTIONS: 50
      WS_RATE_LIMIT: "true"
```

## Scaling

### Horizontal Scaling
1. Update docker-compose.yml:
```yaml
services:
  app:
    deploy:
      replicas: 3
  websocket:
    deploy:
      replicas: 2
```

2. Apply changes:
```bash
docker-compose up -d --scale app=3 --scale websocket=2
```

## Monitoring

### Health Checks
Access health endpoints:
- Application: https://your-domain.com/api/health
- WebSocket: https://your-domain.com/ws/health
- Database: https://your-domain.com/api/health/db
- Redis: https://your-domain.com/api/health/redis

### Security Monitoring
Monitor security metrics:
```bash
# View rate limit stats
docker-compose exec redis redis-cli INFO stats | grep rate_limit

# View blocked IPs
docker-compose exec redis redis-cli SMEMBERS blocked_ips

# View WebSocket connections
docker-compose exec redis redis-cli SCARD ws_connections
```

## Backup and Recovery

### Database Backup
Automated daily backup:
```bash
docker-compose exec backup sh -c 'pg_dump -h db -U $POSTGRES_USER -d $POSTGRES_DB -F c -f /backups/backup_$(date +%Y%m%d).dump'
```

### Redis Backup
Backup rate limiting data:
```bash
docker-compose exec redis redis-cli SAVE
```

## Troubleshooting

### Common Issues

1. Rate limiting issues:
```bash
# Check rate limit counters
docker-compose exec redis redis-cli SCAN 0 MATCH rate_limit:*

# Reset rate limits
docker-compose exec redis redis-cli DEL rate_limit:*
```

2. WebSocket connection issues:
```bash
# Check WebSocket logs
docker-compose logs websocket

# Verify WebSocket proxy
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Host: your-domain.com" -H "Origin: https://your-domain.com" https://your-domain.com/ws
```

### Recovery Procedures

1. Security recovery:
```bash
# Clear blocked IPs
docker-compose exec redis redis-cli DEL blocked_ips

# Reset rate limits
docker-compose exec redis redis-cli FLUSHDB

# Restart security services
docker-compose restart app websocket
```

## Maintenance

### Security Updates
1. Update security configurations:
```bash
# Update security headers
docker-compose exec nginx nginx -s reload

# Update rate limits
docker-compose up -d
```

2. Monitor security logs:
```bash
# View security events
docker-compose logs -f app | grep SECURITY

# View rate limit events
docker-compose logs -f app | grep RATE_LIMIT
```

## Support

### Contact Information
- Security Team: security@midwaycleaning.com
- DevOps Team: devops@midwaycleaning.com
- Emergency: +1-XXX-XXX-XXXX

### Documentation
- API Documentation: /docs/api
- Security Guide: /docs/security
- WebSocket Guide: /docs/websocket

### Incident Response
1. Log security incident
2. Assess security impact
3. Implement security fix
4. Update security documentation
5. Conduct security post-mortem
