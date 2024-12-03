#!/bin/bash

# Print colorful status messages
print_status() {
    echo -e "\033[1;34m==>\033[0m $1"
}

print_error() {
    echo -e "\033[1;31mError:\033[0m $1"
}

print_success() {
    echo -e "\033[1;32mSuccess:\033[0m $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found. Please create one from .env.example"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required commands
for cmd in node npm; do
    if ! command_exists "$cmd"; then
        print_error "$cmd is required but not installed."
        exit 1
    fi
done

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install dependencies"
        exit 1
    fi
    print_success "Dependencies installed successfully"
fi

# Generate Prisma client
print_status "Generating Prisma client..."
npm run prisma:generate
if [ $? -ne 0 ]; then
    print_error "Failed to generate Prisma client"
    exit 1
fi
print_success "Prisma client generated successfully"

# Run database migrations
print_status "Running database migrations..."
npm run prisma:migrate
if [ $? -ne 0 ]; then
    print_error "Failed to run database migrations"
    exit 1
fi
print_success "Database migrations completed successfully"

# Start the services
print_status "Starting services..."
if command_exists concurrently; then
    npm run dev:all
else
    print_status "Installing concurrently..."
    npm install -g concurrently
    if [ $? -eq 0 ]; then
        npm run dev:all
    else
        print_error "Failed to install concurrently"
        exit 1
    fi
fi
