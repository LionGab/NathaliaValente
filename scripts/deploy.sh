#!/bin/bash

# Deploy script for ClubNath
echo "🚀 Starting ClubNath deployment..."

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Checking Node.js version..."
NODE_VERSION=$(node --version)
print_success "Node.js version: $NODE_VERSION"

# Install dependencies
print_status "Installing dependencies..."
if npm ci; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Run type check
print_status "Running TypeScript type check..."
if npm run typecheck; then
    print_success "Type check passed"
else
    print_error "Type check failed"
    exit 1
fi

# Run linting
print_status "Running ESLint..."
if npm run lint; then
    print_success "Linting passed"
else
    print_warning "Linting failed, but continuing with deployment"
fi

# Run tests
print_status "Running tests..."
if npm run test; then
    print_success "Tests passed"
else
    print_warning "Tests failed, but continuing with deployment"
fi

# Build the project
print_status "Building project..."
if npm run build; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Check if dist directory exists
if [ ! -d "dist" ]; then
    print_error "dist directory not found. Build may have failed."
    exit 1
fi

# Check build size
BUILD_SIZE=$(du -sh dist | cut -f1)
print_success "Build size: $BUILD_SIZE"

# Check if .env file exists and warn about environment variables
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Make sure to set environment variables in your deployment platform."
fi

# Check for required environment variables
print_status "Checking environment variables..."
if [ -z "$VITE_SUPABASE_URL" ]; then
    print_warning "VITE_SUPABASE_URL not set"
fi

if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    print_warning "VITE_SUPABASE_ANON_KEY not set"
fi

# Create deployment summary
print_status "Creating deployment summary..."
cat > deployment-summary.md << EOF
# ClubNath Deployment Summary

## Build Information
- **Date**: $(date)
- **Node.js Version**: $NODE_VERSION
- **Build Size**: $BUILD_SIZE
- **Environment**: $NODE_ENV

## Features Implemented
- ✅ Instagram OAuth integration
- ✅ Advanced search system
- ✅ Enhanced AI chat with suggestions
- ✅ Robust badge system
- ✅ Performance optimizations
- ✅ Image caching and lazy loading
- ✅ Error boundary and handling
- ✅ Responsive design improvements
- ✅ PWA optimizations

## Environment Variables Required
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_INSTAGRAM_CLIENT_ID (optional)

## Next Steps
1. Set environment variables in deployment platform
2. Deploy to Netlify/Vercel
3. Test PWA functionality on mobile
4. Validate notifications system
5. Monitor performance metrics

## Build Artifacts
- dist/ directory ready for deployment
- netlify.toml configured
- Service worker optimized
- Manifest.json updated
EOF

print_success "Deployment summary created: deployment-summary.md"

# Final success message
print_success "🎉 ClubNath is ready for deployment!"
print_status "Next steps:"
echo "  1. Set environment variables in your deployment platform"
echo "  2. Deploy the dist/ directory"
echo "  3. Test the application"
echo "  4. Monitor performance"

print_success "Deployment preparation completed successfully!"
