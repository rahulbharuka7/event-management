#!/bin/bash

echo "=========================================="
echo "  Create .env File for MongoDB Atlas"
echo "=========================================="
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled. Your existing .env file is safe."
        exit 0
    fi
fi

echo "Your MongoDB Atlas connection details:"
echo "  Username: rahulbharuka5_db_user"
echo "  Cluster: cluster0.ffe5qw0.mongodb.net"
echo ""
echo "You need to provide your database password."
echo ""
echo "⚠️  IMPORTANT:"
echo "  - This is the password you set for user 'rahulbharuka5_db_user'"
echo "  - Don't remember it? Reset it in MongoDB Atlas → Database Access"
echo ""

read -sp "Enter your MongoDB Atlas password: " DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ No password provided. Cancelled."
    exit 1
fi

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb+srv://rahulbharuka5_db_user:${DB_PASSWORD}@cluster0.ffe5qw0.mongodb.net/event-management?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=development
EOF

echo ""
echo "✅ .env file created successfully!"
echo ""
echo "=========================================="
echo "  IMPORTANT: Whitelist Your IP"
echo "=========================================="
echo ""
echo "Before running the app, make sure to:"
echo "1. Go to https://cloud.mongodb.com/"
echo "2. Click 'Network Access' (left sidebar)"
echo "3. Click 'Add IP Address'"
echo "4. Click 'Allow Access from Anywhere' (0.0.0.0/0)"
echo "5. Click 'Confirm'"
echo ""
echo "=========================================="
echo "  Test Your Connection"
echo "=========================================="
echo ""
echo "Run: npm run dev"
echo ""
echo "You should see: 'Connected to MongoDB' ✅"
echo ""
