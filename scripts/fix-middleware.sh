#!/bin/bash

echo "Fixing middleware files..."

# Remove duplicate middleware file
rm -f src/middleware/index.ts

# Ensure middleware is in correct location
if [ ! -f "src/middleware.ts" ]; then
  echo "Error: Missing middleware.ts file"
  exit 1
fi

# Remove any stray middleware files
find src/pages -name "middleware.ts" -type f -delete
find src/pages -name "middleware" -type d -exec rm -rf {} +

echo "Middleware files fixed" 