#!/bin/bash

echo "🚀 Quick Fix for Ask Ed Production Issues"
echo "========================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "This script will help you quickly fix Ask Ed in production."
echo ""

echo "1️⃣  Checking current environment..."
if [ -f .env.local ]; then
    echo -e "${GREEN}✓${NC} Found .env.local"
else
    echo -e "${RED}✗${NC} No .env.local found"
fi

echo ""
echo "2️⃣  Required Environment Variables for Production:"
echo ""
echo "OPENAI_API_KEY=sk-..."
echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ..."
echo "SUPABASE_URL=https://your-project.supabase.co"
echo "SUPABASE_ANON_KEY=eyJ..."
echo ""

echo "3️⃣  Quick Actions:"
echo ""
echo "a) Set environment variables in Vercel:"
echo "   vercel env add OPENAI_API_KEY production"
echo "   vercel env add NEXT_PUBLIC_SUPABASE_URL production"
echo "   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production"
echo "   vercel env add SUPABASE_URL production"
echo "   vercel env add SUPABASE_ANON_KEY production"
echo ""

echo "b) Redeploy after setting variables:"
echo "   vercel --prod --force"
echo ""

echo "4️⃣  Test endpoints after deployment:"
echo ""
echo "   curl https://your-domain.com/api/ask-ed/health"
echo "   curl https://your-domain.com/api/status"
echo ""

echo "5️⃣  If documents are missing, run locally then redeploy:"
echo ""
echo "   npm run process:documents"
echo "   vercel --prod"
echo ""

echo -e "${YELLOW}📝 Note:${NC} Make sure to run the database setup in Supabase SQL editor first!"
echo "   See: supabase/migrations/001_ask_ed_schema.sql"
echo ""

# Offer to run verification
read -p "Would you like to run the deployment verification script? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    npm run verify:deployment
fi