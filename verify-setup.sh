#!/bin/bash

echo "=========================================="
echo "  Event Management System - Setup Verification"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Found $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found"
    exit 1
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} Found v$NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

# Check MongoDB
echo -n "Checking MongoDB... "
if pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✓${NC} MongoDB is running"
else
    echo -e "${YELLOW}⚠${NC} MongoDB is not running"
    echo "  Start it with: mongod"
fi

echo ""
echo "Checking project structure..."

# Check backend files
echo -n "  Backend server... "
if [ -f "server/server.js" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
fi

echo -n "  Backend models... "
if [ -f "server/models/Profile.js" ] && [ -f "server/models/Event.js" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
fi

echo -n "  Backend routes... "
if [ -f "server/routes/profiles.js" ] && [ -f "server/routes/events.js" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
fi

# Check frontend files
echo -n "  Frontend App... "
if [ -f "client/src/App.js" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
fi

echo -n "  Frontend components... "
COMPONENT_COUNT=$(ls -1 client/src/components/*.js 2>/dev/null | wc -l)
if [ "$COMPONENT_COUNT" -eq 5 ]; then
    echo -e "${GREEN}✓${NC} (5 components)"
else
    echo -e "${YELLOW}⚠${NC} ($COMPONENT_COUNT components, expected 5)"
fi

echo -n "  Zustand store... "
if [ -f "client/src/store/useStore.js" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
fi

echo -n "  Styles... "
if [ -f "client/src/styles/App.css" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
fi

# Check dependencies
echo ""
echo "Checking dependencies..."

echo -n "  Backend node_modules... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC} Run: npm install"
fi

echo -n "  Frontend node_modules... "
if [ -d "client/node_modules" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC} Run: cd client && npm install"
fi

# Check documentation
echo ""
echo "Checking documentation..."

DOC_FILES=("README.md" "QUICK_START.md" "ARCHITECTURE.md" "DEPLOYMENT.md" "TESTING.md" "VIDEO_GUIDE.md" "SUBMISSION_CHECKLIST.md" "PROJECT_SUMMARY.md" "START_HERE.md" "GETTING_STARTED.txt")
DOC_COUNT=0

for file in "${DOC_FILES[@]}"; do
    if [ -f "$file" ]; then
        ((DOC_COUNT++))
    fi
done

echo -n "  Documentation files... "
if [ "$DOC_COUNT" -eq 10 ]; then
    echo -e "${GREEN}✓${NC} ($DOC_COUNT/10 files)"
else
    echo -e "${YELLOW}⚠${NC} ($DOC_COUNT/10 files)"
fi

# Check configuration
echo ""
echo "Checking configuration..."

echo -n "  .env.example... "
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
fi

echo -n "  .gitignore... "
if [ -f ".gitignore" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
fi

echo -n "  package.json... "
if [ -f "package.json" ] && [ -f "client/package.json" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
fi

# Summary
echo ""
echo "=========================================="
echo "  Summary"
echo "=========================================="
echo ""

if [ "$DOC_COUNT" -eq 10 ] && [ -d "node_modules" ] && [ -d "client/node_modules" ]; then
    echo -e "${GREEN}✓ Setup is complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Make sure MongoDB is running: mongod"
    echo "  2. Start the application: npm run dev"
    echo "  3. Open browser: http://localhost:3000"
    echo ""
    echo "Read START_HERE.md for detailed instructions."
else
    echo -e "${YELLOW}⚠ Setup needs attention${NC}"
    echo ""
    if [ ! -d "node_modules" ]; then
        echo "  Run: npm install"
    fi
    if [ ! -d "client/node_modules" ]; then
        echo "  Run: cd client && npm install"
    fi
    if ! pgrep -x "mongod" > /dev/null; then
        echo "  Start MongoDB: mongod"
    fi
fi

echo ""
echo "=========================================="
