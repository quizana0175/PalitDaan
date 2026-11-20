#!/data/data/com.termux/files/usr/bin/bash

# ==========================================================
# PalitDaan Green - Termux Fast Tablet Presentation Launcher
# ==========================================================

echo "🌿 Starting PalitDaan Green for Tablet Presentation..."

# Check Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed."
    echo "👉 Please run: pkg update && pkg install nodejs-lts"
    exit 1
fi

echo "✅ Node.js $(node -v) detected."

# Check if dist folder exists for instant presentation
if [ -d "dist" ]; then
    echo "🚀 Pre-built presentation bundle detected (instant start)!"
    echo "🌐 Opening server on http://localhost:5173 ..."
    
    # Try to open tablet browser automatically if termux-api is available
    if command -v termux-open-url &> /dev/null; then
        (sleep 1 && termux-open-url "http://localhost:5173") &
    fi
    
    node server.js
else
    echo "📦 Building or starting development server..."
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies (first time only)..."
        npm install
    fi
    npm run dev -- --host
fi
