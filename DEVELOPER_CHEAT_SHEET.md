# Developer Cheat Sheet: Creative Discovery Workshop

Quick reference for common commands and workflows when working on this project.

## Essential Commands

| Task | Command | When to Use |
| :--- | :--- | :--- |
| **Start development server** | `npm run dev` | Every time you want to work on the project |
| **Stop development server** | `Ctrl + C` | When you're done working |
| **Install dependencies** | `npm install` | After cloning the repo or when `package.json` changes |
| **Build for production** | `npm run build` | When you want to create a production-ready version |
| **Preview production build** | `npm run preview` | To test the production build locally |

## Git Workflow

```bash
# Check what files have changed
git status

# Add all changes
git add .

# Commit with a message
git commit -m "Your descriptive message here"

# Push to GitHub
git push origin main

# Pull latest changes from GitHub
git pull origin main

# Create a new branch
git checkout -b feature-name

# Switch between branches
git checkout branch-name
```

## Project URLs

- **Local Development**: http://localhost:5173/
- **GitHub Repository**: https://github.com/Rise-O-Matic/Creative-Discovery-Workshop

## Key File Locations

| What You Want to Edit | Where to Find It |
| :--- | :--- |
| **Welcome page** | `src/features/welcome/` |
| **Discovery phase** | `src/features/discovery/` |
| **Diverge phase** | `src/features/diverge/` |
| **Global styles** | `src/index.css` |
| **App-level logic** | `src/App.tsx` |
| **Timer functionality** | `src/contexts/MeetingTimerContext.tsx` |
| **Session data** | `src/contexts/SessionContext.tsx` |
| **Vite configuration** | `vite.config.ts` |

## Browser Developer Tools

| Shortcut | What It Does |
| :--- | :--- |
| `F12` or `Ctrl+Shift+I` (Windows/Linux) | Open Developer Tools |
| `Cmd+Option+I` (Mac) | Open Developer Tools |
| `Ctrl+Shift+R` (Windows/Linux) | Hard refresh (bypass cache) |
| `Cmd+Shift+R` (Mac) | Hard refresh (bypass cache) |

## Debugging Tips

1. **Check the terminal** where `npm run dev` is running for compilation errors
2. **Check the browser console** (F12 → Console tab) for runtime errors
3. **Use `console.log()`** to inspect variables and data flow
4. **React DevTools** browser extension can help inspect component state

## When Things Go Wrong

| Problem | Quick Fix |
| :--- | :--- |
| **Server won't start** | 1. Make sure you're in the `creative-brief-wizard` directory<br>2. Check if port 5173 is already in use<br>3. Try `npm install` again |
| **Changes not showing** | 1. Check terminal for errors<br>2. Hard refresh browser (`Ctrl+Shift+R`)<br>3. Restart dev server |
| **Weird errors after pulling** | Run `npm install` to update dependencies |
| **Lost and confused** | Check `git status` to see what you've changed |

## TypeScript Tips

- Files ending in `.tsx` are React components with TypeScript
- Files ending in `.ts` are TypeScript modules (no JSX)
- If you see red squiggly lines in your editor, hover over them to see the type error
- Types are defined in `src/types/index.ts`

## React Component Pattern

```typescript
import React from 'react';

interface MyComponentProps {
  title: string;
  count: number;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, count }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
    </div>
  );
};
```

## Useful Resources

- **React Documentation**: https://react.dev/
- **TypeScript Documentation**: https://www.typescriptlang.org/docs/
- **Vite Documentation**: https://vite.dev/
- **TailwindCSS Documentation**: https://tailwindcss.com/docs

---

**Pro Tip**: Keep this file open in a separate window while you work!
