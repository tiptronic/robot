#!/bin/bash

echo "Building robotjs for Apple Silicon (ARM64) architecture..."

# Set architecture to Apple Silicon
export ARCH=arm64

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf build/
rm -rf node_modules/

# Install dependencies with Apple Silicon architecture
echo "Installing dependencies for Apple Silicon..."
arch -arm64 npm install

# Build for Apple Silicon
echo "Building native module for Apple Silicon..."
arch -arm64 npm rebuild

# Copy the built binary to robotjs.arm64.node while keeping the original
echo "Creating robotjs.arm64.node copy..."
if [ -f "build/Release/robotjs.node" ]; then
    cp "build/Release/robotjs.node" "build/Release/robotjs.arm64.node"
    echo "✅ Binary copied to robotjs.arm64.node"
elif [ -f "build/Debug/robotjs.node" ]; then
    cp "build/Debug/robotjs.node" "build/Debug/robotjs.arm64.node"
    echo "✅ Binary copied to robotjs.arm64.node"
else
    echo "⚠️  Could not find robotjs.node binary to copy"
fi

# Test the build
echo "Testing Apple Silicon build..."
arch -arm64 node -e "
const robot = require('./index.js');
console.log('Apple Silicon build test:');
console.log('- getMouseColor:', typeof robot.getMouseColor);
console.log('- getPixelColor:', typeof robot.getPixelColor);
console.log('- isResourcesValid:', typeof robot.isResourcesValid);
console.log('✅ Apple Silicon build successful!');
"

echo "Apple Silicon build completed!" 