# 📦 Build Instructions for Submission

## ⚠️ CRITICAL: Must Rebuild Before Submission!

I've updated your Vite configuration to use relative paths (added `base: './'`). You **MUST** rebuild your application before submitting.

## 🔧 Step-by-Step Build Process

### 1. Navigate to Project Root
```bash
cd /Users/yblim/Documents/GitHub/Eventurer
```

### 2. Ensure Environment Variables Are Set
Make sure your `.env` file exists with all required API keys:
```bash
# Check if .env file exists
ls -la .env
```

If not, copy from `.env.example`:
```bash
cp .env.example .env
# Then edit .env with your actual API keys
```

### 3. Run the Build
```bash
npm run build
```

This will:
- ✅ Bundle all your React components
- ✅ Minify JavaScript and CSS
- ✅ Use **relative paths** (thanks to `base: './'` in vite.config.ts)
- ✅ Output everything to the `build/` folder

### 4. Verify the Build

#### Test Option A: Open Directly (Quick Test)
```bash
# On macOS
open build/index.html

# On Windows
start build/index.html

# On Linux
xdg-open build/index.html
```

The page should load without being blank!

#### Test Option B: Local Server (Full Test)
```bash
cd build
python3 -m http.server 8000
```
Then open: http://localhost:8000

### 5. Package for Submission

**Option 1: Submit the `build/` folder directly**
- Just copy/compress the entire `build/` folder

**Option 2: Create a ZIP file**
```bash
cd /Users/yblim/Documents/GitHub/Eventurer
zip -r Eventurer-Submission.zip build/
```

## ✅ What Changed

### Before (Absolute Paths - Won't Work):
```html
<script src="/assets/index-CrVoOx5R.js"></script>
```
❌ This tries to load from root of filesystem when using `file://` protocol

### After (Relative Paths - Works!):
```html
<script src="./assets/index-CrVoOx5R.js"></script>
```
✅ This loads relative to the HTML file location

## 📁 Expected Build Output

After running `npm run build`, your `build/` folder should contain:

```
build/
├── index.html              # Entry point with RELATIVE paths
├── assets/
│   ├── index-[hash].js    # Bundled JavaScript
│   └── index-[hash].css   # Bundled CSS
├── favicon.png
├── final-optimized.glb
├── gmaps-smoke.html
└── README.md
```

## 🐛 Troubleshooting

### Issue: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: Build fails with errors
**Solution:**
1. Delete `node_modules` and `build` folders
2. Run `npm install`
3. Run `npm run build` again

### Issue: Blank screen when opening index.html
**Solution:**
1. Check browser console (F12) for errors
2. Verify you rebuilt AFTER adding `base: './'` to vite.config.ts
3. Check that paths in index.html start with `./` not `/`

### Issue: API features don't work
**Solution:**
- This is expected with `file://` protocol due to CORS restrictions
- Use a local server (python http.server) to test full functionality
- For submission, this is usually acceptable as graders will use a server

## 📝 Submission Checklist

- [ ] Updated vite.config.ts with `base: './'` ✅ (Already done!)
- [ ] Run `npm run build` to regenerate build folder
- [ ] Test by opening `build/index.html` directly - should NOT be blank
- [ ] Test with local server for full functionality
- [ ] Verify all assets are in `build/` folder
- [ ] Create ZIP file if required: `Eventurer-Submission.zip`
- [ ] Include README.md in build folder ✅ (Already included!)

## 🎯 Ready to Submit

Once you've completed the rebuild, your `build/` folder is ready for submission as a self-contained static website accessible via `index.html`!

---

Need help? Check that:
1. ✅ vite.config.ts has `base: './'`
2. ✅ You ran `npm run build` AFTER the config change
3. ✅ The generated index.html uses relative paths (starts with `./`)
