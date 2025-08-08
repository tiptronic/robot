#!/bin/bash

echo "Building robotjs for Intel (x86_64) architecture..."

# Set architecture to Intel
export ARCH=x86_64

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf build/
rm -rf node_modules/

# Install dependencies with Intel architecture
echo "Installing dependencies for Intel..."
arch -x86_64 npm install

# Build for Intel
echo "Building native module for Intel..."
arch -x86_64 npm rebuild

# Test the build
echo "Testing Intel build..."
arch -x86_64 node -e "
const robot = require('./index.js');
console.log('Intel build test:');
console.log('- getMouseColor:', typeof robot.getMouseColor);
console.log('- getPixelColor:', typeof robot.getPixelColor);
console.log('- isResourcesValid:', typeof robot.isResourcesValid);
console.log('✅ Intel build successful!');
"

echo "Intel build completed!" 