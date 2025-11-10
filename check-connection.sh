#!/bin/bash

echo "=========================================="
echo "  MongoDB Atlas Connection Diagnostics"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "   Run: ./create-env.sh"
    exit 1
fi

echo "✅ .env file exists"
echo ""

# Read the connection string
MONGODB_URI=$(grep MONGODB_URI .env | cut -d '=' -f2)

if [ -z "$MONGODB_URI" ]; then
    echo "❌ MONGODB_URI not found in .env file"
    exit 1
fi

echo "📋 Your connection string:"
echo "   $MONGODB_URI"
echo ""

# Check for placeholder password
if [[ $MONGODB_URI == *"<db_password>"* ]]; then
    echo "❌ CRITICAL ERROR: You're using <db_password> placeholder!"
    echo ""
    echo "   This is NOT a real password. You need to:"
    echo "   1. Go to MongoDB Atlas → Database Access"
    echo "   2. Reset password for user 'rahulbharuka5_db_user'"
    echo "   3. Copy the NEW password"
    echo "   4. Run: ./create-env.sh"
    echo "   5. Enter your NEW password"
    echo ""
    exit 1
fi

if [[ $MONGODB_URI == *"YOUR_PASSWORD"* ]] || [[ $MONGODB_URI == *"YOUR_ACTUAL_PASSWORD"* ]]; then
    echo "❌ CRITICAL ERROR: You're using a placeholder password!"
    echo ""
    echo "   Replace YOUR_PASSWORD with your real MongoDB Atlas password"
    echo "   Run: ./create-env.sh"
    echo ""
    exit 1
fi

echo "✅ No placeholder detected in password"
echo ""

# Check if database name is present
if [[ $MONGODB_URI == *"/event-management"* ]]; then
    echo "✅ Database name 'event-management' found"
else
    echo "⚠️  Database name 'event-management' not found"
    echo "   Your connection string should have '/event-management' before the '?'"
fi

echo ""
echo "=========================================="
echo "  Next Steps to Fix Authentication Error"
echo "=========================================="
echo ""
echo "The 'bad auth' error means your password is incorrect."
echo ""
echo "To fix this:"
echo ""
echo "1. Go to https://cloud.mongodb.com/"
echo "2. Click 'Database Access' (left sidebar)"
echo "3. Find user: rahulbharuka5_db_user"
echo "4. Click 'Edit' → 'Edit Password'"
echo "5. Set a NEW password (write it down!)"
echo "6. Click 'Update User'"
echo ""
echo "7. Click 'Network Access' (left sidebar)"
echo "8. Click 'Add IP Address'"
echo "9. Click 'Allow Access from Anywhere' (0.0.0.0/0)"
echo "10. Click 'Confirm'"
echo ""
echo "11. Run: ./create-env.sh"
echo "12. Enter your NEW password"
echo ""
echo "13. Run: npm run dev"
echo ""
echo "=========================================="
