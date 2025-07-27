#!/bin/bash

# PWA Local Server Script
# This script starts a local server to test PWA functionality

echo "🚀 Starting AnimateItNow PWA Server..."
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "📡 Starting Python HTTP server..."
    echo "🌐 Open: http://localhost:8000"
    echo "🧪 Test PWA: http://localhost:8000/pwa-test.html"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "📡 Starting Python HTTP server..."
    echo "🌐 Open: http://localhost:8000"
    echo "🧪 Test PWA: http://localhost:8000/pwa-test.html"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python -m SimpleHTTPServer 8000
elif command -v node &> /dev/null; then
    echo "📡 Starting Node.js server..."
    if command -v npx &> /dev/null; then
        echo "🌐 Open: http://localhost:3000"
        echo "🧪 Test PWA: http://localhost:3000/pwa-test.html"
        echo ""
        echo "Press Ctrl+C to stop the server"
        echo ""
        npx serve . -l 3000
    else
        echo "❌ npx not found. Please install serve globally:"
        echo "   npm install -g serve"
        echo "   Then run: serve ."
    fi
elif command -v php &> /dev/null; then
    echo "📡 Starting PHP development server..."
    echo "🌐 Open: http://localhost:8000"
    echo "🧪 Test PWA: http://localhost:8000/pwa-test.html"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    php -S localhost:8000
else
    echo "❌ No suitable server found!"
    echo ""
    echo "Please install one of the following:"
    echo "  • Python: python3 -m http.server 8000"
    echo "  • Node.js: npx serve ."
    echo "  • PHP: php -S localhost:8000"
    echo ""
    echo "Or use any other local server of your choice."
    exit 1
fi
