#!/bin/bash

# HerbalKyore React App - Quick Commands

echo "🌿 HerbalKyore React App - Quick Commands"
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
    echo ""
fi

# Display menu
echo "Choose an option:"
echo "1) Start development server (npm start)"
echo "2) Build for production (npm run build)"
echo "3) Install/Update dependencies (npm install)"
echo "4) Check for errors (npm run build --dry-run)"
echo "5) Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🚀 Starting development server..."
        npm start
        ;;
    2)
        echo "🏗️ Building for production..."
        npm run build
        echo "✅ Build complete! Check the 'build' folder."
        ;;
    3)
        echo "📦 Installing/Updating dependencies..."
        npm install
        echo "✅ Done!"
        ;;
    4)
        echo "🔍 Checking for errors..."
        npm run build
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        ;;
esac
