#!/bin/bash

# Auto-Rickshaw VR Simulator - Deployment Script
# Choose your deployment method

echo "🛺 Auto-Rickshaw VR Simulator - Deployment Helper"
echo "================================================="
echo ""
echo "Choose your deployment method:"
echo "1. GitHub Pages (Free, Git-based)"
echo "2. Netlify (Free, Drag & Drop)"
echo "3. Vercel (Free, Professional)"
echo "4. Firebase Hosting (Google)"
echo "5. Surge.sh (Ultra Simple)"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "📝 GitHub Pages Deployment Steps:"
        echo "=================================="
        echo "1. Create a new repository on GitHub.com"
        echo "2. Run these commands:"
        echo ""
        echo "   git init"
        echo "   git add ."
        echo "   git commit -m 'Initial commit: Auto-Rickshaw VR Simulator'"
        echo "   git remote add origin https://github.com/YOUR_USERNAME/auto-rickshaw-vr.git"
        echo "   git branch -M main"
        echo "   git push -u origin main"
        echo ""
        echo "3. Go to GitHub repository → Settings → Pages"
        echo "4. Select 'Deploy from branch' → main → / (root)"
        echo "5. Your site will be live at: https://YOUR_USERNAME.github.io/auto-rickshaw-vr"
        echo ""
        read -p "Press Enter to continue..."
        ;;
    2)
        echo ""
        echo "🚀 Netlify Deployment:"
        echo "======================"
        echo "Method 1 - Drag & Drop:"
        echo "1. Go to netlify.com"
        echo "2. Drag your project folder to the deployment area"
        echo "3. Get instant live URL!"
        echo ""
        echo "Method 2 - Git Integration:"
        echo "1. Push code to GitHub first (see option 1)"
        echo "2. Go to netlify.com → New site from Git"
        echo "3. Connect GitHub repository"
        echo "4. Deploy!"
        echo ""
        read -p "Press Enter to continue..."
        ;;
    3)
        echo ""
        echo "⚡ Vercel Deployment:"
        echo "===================="
        echo "Installing Vercel CLI..."
        if command -v npm &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
            echo ""
            echo "Running deployment..."
            vercel --prod
        else
            echo "❌ npm not found. Please install Node.js first."
            echo "Or deploy manually:"
            echo "1. Install Node.js from nodejs.org"
            echo "2. Run: npm install -g vercel"
            echo "3. Run: vercel"
        fi
        ;;
    4)
        echo ""
        echo "🔥 Firebase Hosting:"
        echo "==================="
        if command -v npm &> /dev/null; then
            echo "Installing Firebase CLI..."
            npm install -g firebase-tools
            echo ""
            echo "Login to Firebase..."
            firebase login
            echo ""
            echo "Initializing project..."
            firebase init hosting
            echo ""
            echo "Deploying..."
            firebase deploy
        else
            echo "❌ npm not found. Please install Node.js first."
            echo "Manual steps:"
            echo "1. Install Node.js from nodejs.org"
            echo "2. Run: npm install -g firebase-tools"
            echo "3. Run: firebase login"
            echo "4. Run: firebase init hosting"
            echo "5. Run: firebase deploy"
        fi
        ;;
    5)
        echo ""
        echo "🌊 Surge.sh Deployment:"
        echo "======================="
        if command -v npm &> /dev/null; then
            echo "Installing Surge..."
            npm install -g surge
            echo ""
            echo "Deploying to Surge..."
            surge . auto-rickshaw-vr.surge.sh
        else
            echo "❌ npm not found. Please install Node.js first."
            echo "Manual steps:"
            echo "1. Install Node.js from nodejs.org"
            echo "2. Run: npm install -g surge"
            echo "3. Run: surge"
        fi
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process started!"
echo ""
echo "📋 Post-Deployment Checklist:"
echo "=============================="
echo "✅ Test VR mode works"
echo "✅ Test AI chat functions"  
echo "✅ Test voice input"
echo "✅ Test mobile responsiveness"
echo "✅ Test all game features"
echo "✅ Configure API keys (users will need their own)"
echo ""
echo "📱 Share your deployed app:"
echo "=========================="  
echo "- Social media (Twitter, Facebook, LinkedIn)"
echo "- Reddit communities (r/WebVR, r/gamedev, r/Kerala)"
echo "- Product Hunt launch"
echo "- Indie game showcases"
echo ""
echo "🛺 Your Kerala Auto-Rickshaw VR experience is ready to go live! ✨"