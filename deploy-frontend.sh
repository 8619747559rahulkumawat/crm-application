#!/bin/bash

# Netlify Auto Deploy Script
echo "🚀 Deploying CRM Frontend to Netlify..."

# Navigate to frontend
cd frontend

# Build the app
echo "📦 Building React app..."
npm run build

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📥 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=build --site=crm-app-$(date +%s)

echo "✅ Frontend deployed successfully!"
echo "🔗 Live URL will be shown above"
