#!/bin/bash

echo "Verifying project structure..."

# Verify App Router structure
required_dirs=(
  "src/app"
  "src/components"
  "src/lib"
  "src/types"
)

for dir in "${required_dirs[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "Error: Missing required directory: $dir"
    exit 1
  fi
done

# Ensure middleware is in correct location
if [ ! -f "src/middleware.ts" ]; then
  echo "Error: Missing middleware.ts file"
  exit 1
fi

echo "Project structure verification complete"
exit 0
