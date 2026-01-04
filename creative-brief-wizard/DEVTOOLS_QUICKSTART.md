# DevTools Quick Start Guide

## How to Use Mock Data Fill

### Quick Start (3 Steps)

1. **Start the app in dev mode**
   ```bash
   npm run dev
   ```

2. **Trigger the mock data fill** (choose one):
   - Press `Ctrl+Shift+F` (Windows/Linux) or `Cmd+Shift+F` (Mac)
   - OR click the purple floating button in the bottom-right corner

3. **Confirm and fill**
   - Choose "Fill All Phases" or "Fill Current Phase Only"
   - Click "Fill Mock Data"
   - See success toast notification

## What You Get

All fields populated with realistic "EcoBottle Launch Campaign" mock data:
- Project details and stakeholders
- Customer discovery answers
- 20 brainstorming sticky notes
- 4 organized clusters with AI summaries
- Complete spot exercises (story beats, promises/proofs, constraints, etc.)
- Prioritized requirements (must/could/won't have)

## Visual Guide

```
┌─────────────────────────────────────────────┐
│  Creative Brief Wizard                      │
│                                             │
│  [Your content here]                        │
│                                             │
│                                    ┌───────┐│
│                                    │ DEV   ││
│                                    │  🧪   ││ ← Click this
│                                    └───────┘│
└─────────────────────────────────────────────┘
         OR press Ctrl+Shift+F
```

## Important Notes

- **Only in development**: DevTools only appear when running `npm run dev`
- **Will overwrite data**: Filling mock data replaces existing session data
- **Persists**: Mock data is saved to localStorage like normal data

## Troubleshooting

**Don't see the button?**
- Make sure you're running `npm run dev` (not `npm run build`)
- Check you're in development mode

**Keyboard shortcut not working?**
- Try the floating button instead
- Check if a browser extension is blocking the shortcut

---

For detailed documentation, see `DEV_TOOLS_README.md`
