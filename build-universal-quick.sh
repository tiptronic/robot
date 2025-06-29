#!/bin/bash
set -e

# Clean previous builds
rm -rf build

# Build ARM64
echo "Building for ARM64..."
arch -arm64 npm rebuild --build-from-source
cp build/Release/robotjs.node build/Release/robotjs.node-arm64

# Build x86_64
echo "Building for x86_64..."
rm -rf build
arch -x86_64 npm rebuild --build-from-source
cp build/Release/robotjs.node build/Release/robotjs.node-x64

# Combine with lipo
echo "Creating universal binary..."
lipo -create -output build/Release/robotjs.node build/Release/robotjs.node-arm64 build/Release/robotjs.node-x64

# Verify
echo "Result:"
file build/Release/robotjs.node