# Getting Started on Your Computer

This guide will help you set up the Creative Discovery Workshop project on your local machine so you can work independently.

## What You'll Need

Before starting, make sure you have these programs installed:

1. **Node.js** (version 18 or higher) - Download from https://nodejs.org/
2. **Git** - Download from https://git-scm.com/
3. **A code editor** - We recommend Visual Studio Code (https://code.visualstudio.com/)

## Step-by-Step Setup

### 1. Configure Git (First Time Only)

Open your terminal or command prompt and run these commands with your information:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

This tells Git who you are when you make changes.

### 2. Clone the Project

Navigate to where you want to store the project and run:

```bash
git clone https://github.com/Rise-O-Matic/Creative-Discovery-Workshop.git
cd Creative-Discovery-Workshop/creative-brief-wizard
```

### 3. Install Dependencies

```bash
npm install
```

This downloads all the libraries the project needs. It may take a few minutes.

### 4. Start the Development Server

```bash
npm run dev
```

You should see output like:
```
VITE v7.3.0  ready in 313 ms
➜  Local:   http://localhost:5173/
```

### 5. Open in Your Browser

Go to **http://localhost:5173/** in your web browser. You should see the Creative Discovery Workshop application!

## Daily Workflow

Every time you want to work on the project:

1. **Open your terminal** and navigate to the project:
   ```bash
   cd path/to/Creative-Discovery-Workshop/creative-brief-wizard
   ```

2. **Pull the latest changes** (if working with others):
   ```bash
   git pull origin main
   ```

3. **Start the server**:
   ```bash
   npm run dev
   ```

4. **Make your changes** in your code editor

5. **See changes instantly** in your browser (no need to refresh!)

6. **When done, stop the server** by pressing `Ctrl + C` in the terminal

## Saving Your Work

When you've made changes you want to keep:

```bash
# See what you changed
git status

# Add your changes
git add .

# Commit with a message
git commit -m "Describe what you changed"

# Push to GitHub
git push origin main
```

## Common Issues and Solutions

### "Port 5173 is already in use"

**Problem**: Another program is using that port, or you have the server running in another terminal.

**Solution**: 
- Close any other terminals running the dev server
- Or change the port in `vite.config.ts`

### "npm: command not found"

**Problem**: Node.js is not installed or not in your PATH.

**Solution**: 
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### Changes not showing in browser

**Problem**: The server might not be running or there's a compilation error.

**Solution**:
- Check the terminal for error messages
- Try hard refreshing: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Restart the dev server

### Git push rejected

**Problem**: Someone else pushed changes before you.

**Solution**:
```bash
git pull origin main
# Resolve any conflicts if needed
git push origin main
```

## Project Structure Quick Reference

```
creative-brief-wizard/
├── src/
│   ├── components/       # Reusable UI components
│   ├── features/         # Main app features (discovery, diverge, etc.)
│   ├── contexts/         # Global state management
│   ├── hooks/            # Custom React hooks
│   ├── services/         # External services (AI, document generation)
│   └── App.tsx           # Main application component
├── public/               # Static files
├── vite.config.ts        # Vite configuration
└── package.json          # Project dependencies
```

## Where to Find Help

1. **Check the DEVELOPER_CHEAT_SHEET.md** for quick command reference
2. **Check the LOCAL_DEVELOPMENT_GUIDE.md** for detailed explanations
3. **Look at the browser console** (F12) for error messages
4. **Check the terminal** where the dev server is running for errors

## Tips for Success

- **Save frequently** - The app auto-saves to localStorage, but save your code files often
- **Use Git often** - Commit your changes regularly so you can undo if needed
- **Read error messages** - They usually tell you exactly what's wrong
- **Don't be afraid to experiment** - You can always undo changes with Git

## Next Steps

Now that you have the project running:

1. Explore the existing code in the `src/` directory
2. Make a small change to see how it works
3. Read through the existing documentation files
4. Start working on your features!

---

**Remember**: The development server must be running (`npm run dev`) for you to see the application in your browser. Keep that terminal window open while you work!
