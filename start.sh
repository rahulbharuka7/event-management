#!/bin/bash

echo "🚀 Starting Event Management System..."

# check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "Run: mongod"
    exit 1
fi

echo "✅ MongoDB is running"

# check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
fi

# start the application
echo "🔧 Starting backend and frontend..."
npm run dev
