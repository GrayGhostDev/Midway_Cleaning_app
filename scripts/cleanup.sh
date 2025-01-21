#!/bin/bash

echo "Starting project structure cleanup..."

# Make script exit on any error
set -e

# Remove App Router files and directories
echo "Removing App Router files..."
rm -rf app/

# Ensure base directories exist
echo "Creating base directory structure..."
mkdir -p src/{components,pages,styles,lib,types}

# Ensure Pages Router structure exists
echo "Setting up Pages Router structure..."
mkdir -p src/pages/{api,dashboard,sign-in,sign-up}
mkdir -p src/components/{Auth,Dashboard,Navigation,UI}

# Create necessary files if they don't exist
touch src/pages/404.tsx
touch src/pages/500.tsx
touch src/pages/_app.tsx
touch src/pages/index.tsx

# Remove any system files
echo "Cleaning up system files..."
find . -name '.DS_Store' -type f -delete
find . -name 'Thumbs.db' -type f -delete

# Clean up middleware files
echo "Cleaning up middleware..."
rm -rf src/middleware/index.ts
if [ -d "src/middleware" ]; then
  mv src/middleware/* src/ 2>/dev/null || true
  rm -rf src/middleware
fi

# Run middleware fix script
npm run fix:middleware

# Ensure proper file permissions
echo "Setting file permissions..."
chmod +x start.sh
chmod +x scripts/*.sh

# Verify critical files exist
echo "Verifying critical files..."
required_files=(
  "next.config.js"
  "package.json"
  "tsconfig.json"
  ".env.local"
  "src/pages/_app.tsx"
)

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "Warning: Missing critical file: $file"
  fi
done

echo "File structure cleanup complete" 