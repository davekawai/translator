# Translator Setup Guide

## Quick Start (3 steps)

### 1. Create a folder
```bash
mkdir translator
cd translator
```

### 2. Create `package.json`
Create a file named `package.json` with this content:
```json
{
  "name": "translator",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "node-fetch": "^2.7.0"
  }
}
```

### 3. Download these files and save them in the translator folder:
- `server.js` (Node.js backend)
- `index.html` (The translator interface)

---

## Running the Translator

### First time setup:
```bash
npm install
```

### Start the server:
```bash
npm start
```

You should see:
```
✅ Translator running at http://localhost:3000
```

### Open the translator:
Go to **http://localhost:3000** in your browser

---

## Features
✅ 26 languages (including Chinese Simplified & Traditional)
✅ Unlimited translations (no API limits)
✅ Works offline after started
✅ Mobile-friendly design
✅ Translate 2 texts simultaneously

---

## Troubleshooting

**"Cannot find module 'express'"**
→ Run: `npm install`

**"EADDRINUSE: address already in use :::3000"**
→ The port is already in use. Either:
  - Close other apps using port 3000
  - Or change port 3000 to 3001 in server.js (2 places)

**Translations not working**
→ Make sure server.js is running (check console for errors)

---

## What's Happening?

1. The Node.js server runs on port 3000
2. Your browser opens index.html
3. When you type, the HTML sends requests to the local Node.js server
4. The server proxies requests to MyMemory API (free translation service)
5. Translations are returned to your browser

This bypasses CORS issues because the request goes from browser → your local server → API (no CORS problems!)

---

## To Deploy Online

Once tested locally, you can deploy to Heroku, Vercel, or any Node.js hosting:

```bash
git init
git add .
git commit -m "Initial commit"
# Then follow your hosting provider's deploy steps
```
