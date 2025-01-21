#!/bin/bash

echo "Verifying project structure..."

# Check for App Router files
if [ -d "app" ]; then
  echo "Error: App Router directory found"
  exit 1
fi

# Verify Pages Router structure
required_dirs=(
  "src/pages"
  "src/components"
  "src/styles"
  "src/lib"
  "src/types"
)

for dir in "${required_dirs[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "Error: Missing required directory: $dir"
    exit 1
  fi
done

# Check for duplicate middleware
if [ -f "src/middleware/index.ts" ] && [ -f "src/middleware.ts" ]; then
  echo "Error: Duplicate middleware files found"
  exit 1
fi

# Ensure middleware is in correct location
if [ ! -f "src/middleware.ts" ]; then
  echo "Error: Missing middleware.ts file"
  exit 1
fi

echo "Project structure verification complete"
exit 0 