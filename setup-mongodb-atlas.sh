#!/bin/bash

echo "=========================================="
echo "  MongoDB Atlas Setup"
echo "=========================================="
echo ""

echo "This script will help you configure MongoDB Atlas connection."
echo ""

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

echo ""
echo "Please follow these steps to get your MongoDB Atlas connection string:"
echo ""
echo "1. Go to https://cloud.mongodb.com/"
echo "2. Log in to your account"
echo "3. Click on your cluster"
echo "4. Click 'Connect' button"
echo "5. Choose 'Connect your application'"
echo "6. Copy the connection string"
echo ""
echo "Your connection string should look like:"
echo "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
echo ""
echo "=========================================="
echo ""

read -p "Paste your MongoDB Atlas connection string here: " MONGODB_URI

# Check if connection string is provided
if [ -z "$MONGODB_URI" ]; then
    echo "❌ No connection string provided. Setup cancelled."
    exit 1
fi

# Check if it's a valid MongoDB Atlas connection string
if [[ ! $MONGODB_URI == mongodb+srv://* ]]; then
    echo "⚠️  Warning: This doesn't look like a MongoDB Atlas connection string."
    echo "It should start with 'mongodb+srv://'"
    read -p "Do you want to continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Add database name if not present
if [[ ! $MONGODB_URI == *"/event-management"* ]]; then
    echo ""
    echo "⚠️  Database name 'event-management' not found in connection string."
    echo "Adding it automatically..."
    
    # Insert database name before the ?
    MONGODB_URI="${MONGODB_URI/\?/event-management?}"
fi

# Create .env file
cat > .env << EOF
# MongoDB Atlas Connection String
MONGODB_URI=$MONGODB_URI

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
EOF

echo ""
echo "✅ .env file created successfully!"
echo ""
echo "Your configuration:"
echo "  Database: event-management"
echo "  Port: 5000"
echo ""
echo "=========================================="
echo "  Important: Whitelist Your IP"
echo "=========================================="
echo ""
echo "Make sure to whitelist your IP address in MongoDB Atlas:"
echo "1. Go to MongoDB Atlas Dashboard"
echo "2. Click 'Network Access' in the left sidebar"
echo "3. Click 'Add IP Address'"
echo "4. Click 'Allow Access from Anywhere' (0.0.0.0/0)"
echo "   OR add your current IP address"
echo ""
echo "=========================================="
echo "  Next Steps"
echo "=========================================="
echo ""
echo "1. Verify your IP is whitelisted in MongoDB Atlas"
echo "2. Run: npm run dev"
echo "3. Check if connection is successful"
echo ""
echo "If you see 'Connected to MongoDB', you're all set! 🎉"
echo ""
