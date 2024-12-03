#!/bin/bash

echo "Starting Midway Cleaning Co Services..."

# Check for .env file
if [ ! -f .env ]; then
    echo "Error: .env file not found"
    echo "Please create a .env file from .env.example"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Generate Prisma client and run migrations
echo "Setting up database..."
npm run prisma:generate
npm run prisma:migrate

# Start all services
echo "Starting services..."
npm run dev:all
