#!/bin/bash

echo "Starting Midway Cleaning Co Services..."

# Clean up file structure
if ! npm run cleanup; then
    echo "Error: File structure cleanup failed"
    exit 1
fi

# Check for .env.local and required variables
if [ ! -f .env.local ]; then
    echo "Error: .env.local file not found"
    echo "Please create a .env.local file with required environment variables"
    exit 1
fi

# Verify all required environment variables
required_vars=(
    "DATABASE_URL"
    "REDIS_URL"
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
    "CLERK_SECRET_KEY"
    "NEXT_PUBLIC_CLERK_SIGN_IN_URL"
    "NEXT_PUBLIC_CLERK_SIGN_UP_URL"
    "AWS_ACCESS_KEY_ID"
    "STRIPE_SECRET_KEY"
)

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env.local; then
        echo "Error: Missing required environment variable: ${var}"
        exit 1
    fi
done

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Database setup
echo "Setting up database..."
npm run prisma:generate
npm run prisma:migrate

# Check if Redis is running
if ! pgrep redis-server > /dev/null
then
    echo "Starting Redis..."
    redis-server &
    sleep 2
fi

# Check if PostgreSQL is running
if ! pgrep postgres > /dev/null
then
    echo "Starting PostgreSQL..."
    pg_ctl -D /usr/local/var/postgres start &
    sleep 2
fi

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Start services
echo "Starting all services..."
npm run dev:all

# Start WebSocket server
npm run websocket &

# Wait for all background processes
wait
