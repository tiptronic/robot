#!/bin/bash

# Exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check architecture
check_architecture() {
    local arch=$1
    if ! command_exists arch; then
        print_error "The 'arch' command is not available. This script requires macOS."
        exit 1
    fi
    
    if ! arch -$arch true >/dev/null 2>&1; then
        print_error "Cannot execute $arch architecture. Make sure Rosetta 2 is installed."
        print_warning "Install Rosetta 2 with: softwareupdate --install-rosetta"
        exit 1
    fi
}

# Function to check Node.js
check_node() {
    if ! command_exists node; then
        print_error "Node.js is not installed or not in PATH"
        exit 1
    fi
    
    print_status "Node.js version: $(node --version)"
}

# Function to check npm
check_npm() {
    if ! command_exists npm; then
        print_error "npm is not installed or not in PATH"
        exit 1
    fi
    
    print_status "npm version: $(npm --version)"
}

# Function to check lipo
check_lipo() {
    if ! command_exists lipo; then
        print_error "lipo command not found. This script requires macOS with Xcode Command Line Tools."
        exit 1
    fi
}

# Function to build for specific architecture
build_for_arch() {
    local arch=$1
    local arch_name=$2
    
    print_status "Building for $arch_name ($arch)..."
    
    # Clean previous build
    if [ -d "build" ]; then
        rm -rf build
        print_status "Cleaned previous build"
    fi
    
    # Build for architecture
    if ! arch -$arch npm rebuild --build-from-source; then
        print_error "Failed to build for $arch_name ($arch)"
        print_warning "Make sure you have the correct Node.js version for $arch_name"
        print_warning "You may need to install Node.js for $arch_name using nvm or similar"
        exit 1
    fi
    
    # Copy the built binary
    if [ -f "build/Release/robotjs.node" ]; then
        cp build/Release/robotjs.node "build/Release/robotjs.node-$arch"
        print_success "Built $arch_name binary successfully"
    else
        print_error "Build completed but robotjs.node not found"
        exit 1
    fi
}

# Function to create universal binary
create_universal_binary() {
    print_status "Creating universal binary..."
    
    if [ ! -f "build/Release/robotjs.node-arm64" ] || [ ! -f "build/Release/robotjs.node-x64" ]; then
        print_error "Missing architecture-specific binaries"
        print_error "Expected: build/Release/robotjs.node-arm64 and build/Release/robotjs.node-x64"
        exit 1
    fi
    
    if ! lipo -create -output build/Release/robotjs.node build/Release/robotjs.node-arm64 build/Release/robotjs.node-x64; then
        print_error "Failed to create universal binary with lipo"
        exit 1
    fi
    
    print_success "Universal binary created successfully"
}

# Function to verify universal binary
verify_universal_binary() {
    print_status "Verifying universal binary..."
    
    if [ ! -f "build/Release/robotjs.node" ]; then
        print_error "Universal binary not found"
        exit 1
    fi
    
    local file_info=$(file build/Release/robotjs.node)
    echo -e "${BLUE}Binary info:${NC} $file_info"
    
    if echo "$file_info" | grep -q "arm64" && echo "$file_info" | grep -q "x86_64"; then
        print_success "Universal binary verified - supports both ARM64 and x86_64"
    else
        print_warning "Binary may not be universal. File info: $file_info"
    fi
}

# Function to test the binary
test_binary() {
    print_status "Testing the universal binary..."
    
    if ! node -e "const robot = require('./build/Release/robotjs.node'); console.log('Binary loaded successfully'); console.log('Screen size:', robot.getScreenSize());"; then
        print_error "Failed to load and test the binary"
        exit 1
    fi
    
    print_success "Binary test passed"
}

# Main execution
main() {
    print_status "Starting universal binary build for RobotJS..."
    print_status "Current architecture: $(uname -m)"
    print_status "Working directory: $(pwd)"
    
    # Pre-flight checks
    print_status "Running pre-flight checks..."
    check_node
    check_npm
    check_lipo
    check_architecture "arm64"
    check_architecture "x86_64"
    
    # Create build directory if it doesn't exist
    mkdir -p build/Release
    
    # Build for both architectures
    build_for_arch "arm64" "ARM64 (Apple Silicon)"
    build_for_arch "x86_64" "x86_64 (Intel)"
    
    # Create universal binary
    create_universal_binary
    
    # Verify and test
    verify_universal_binary
    test_binary
    
    print_success "Universal binary build completed successfully!"
    print_status "Binary location: build/Release/robotjs.node"
    
    # Clean up intermediate files
    print_status "Cleaning up intermediate files..."
    rm -f build/Release/robotjs.node-arm64
    rm -f build/Release/robotjs.node-x64
    print_success "Cleanup completed"
}

# Trap to handle script interruption
trap 'print_error "Script interrupted by user"; exit 1' INT TERM

# Run main function
main "$@"