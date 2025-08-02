#!/bin/bash

echo "🚀 Fix Ask Ed Production Environment Variables"
echo "============================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it first:"
    echo "   npm i -g vercel"
    exit 1
fi

echo "This script will set the required environment variables in Vercel."
echo ""

# Check current .env.local for values
if [ -f .env.local ]; then
    echo "📋 Found .env.local file. Reading values..."
    
    # Read the values (without exposing them)
    OPENAI_KEY=$(grep "^OPENAI_API_KEY=" .env.local | cut -d'=' -f2)
    SUPABASE_URL=$(grep "^NEXT_PUBLIC_SUPABASE_URL=" .env.local | cut -d'=' -f2)
    SUPABASE_ANON=$(grep "^NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env.local | cut -d'=' -f2)
    
    if [ -z "$OPENAI_KEY" ]; then
        echo "❌ OPENAI_API_KEY not found in .env.local"
        exit 1
    fi
    
    if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON" ]; then
        echo "❌ Supabase credentials not found in .env.local"
        exit 1
    fi
    
    echo "✅ All required values found in .env.local"
    echo ""
    
    echo "📝 Setting environment variables in Vercel..."
    echo ""
    
    # Set the environment variables
    echo "Setting OPENAI_API_KEY..."
    echo "$OPENAI_KEY" | vercel env add OPENAI_API_KEY production
    
    echo "Setting NEXT_PUBLIC_SUPABASE_URL..."
    echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
    
    echo "Setting NEXT_PUBLIC_SUPABASE_ANON_KEY..."
    echo "$SUPABASE_ANON" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
    
    # Also set non-public versions for server-side usage
    echo "Setting SUPABASE_URL..."
    echo "$SUPABASE_URL" | vercel env add SUPABASE_URL production
    
    echo "Setting SUPABASE_ANON_KEY..."
    echo "$SUPABASE_ANON" | vercel env add SUPABASE_ANON_KEY production
    
    echo ""
    echo "✅ Environment variables set!"
    echo ""
    
    echo "🔄 Triggering redeployment..."
    vercel --prod --yes
    
    echo ""
    echo "✅ Deployment triggered!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Wait for deployment to complete (check Vercel dashboard)"
    echo "2. Test the health endpoint: https://your-domain.com/api/ask-ed/health"
    echo "3. Test Ask Ed at: https://your-domain.com/ask-ed"
    
else
    echo "❌ No .env.local file found"
    echo ""
    echo "Please create a .env.local file with:"
    echo "OPENAI_API_KEY=sk-..."
    echo "NEXT_PUBLIC_SUPABASE_URL=https://..."
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ..."
    exit 1
fi