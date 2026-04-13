# Teacher Rapport Tracker 📚

A mobile-first PWA to track daily interactions with teachers and build real relationships.

## Features
- Track 6 subjects across a 5-day school week
- 4 daily actions per teacher: hi before class, thank you after, comment/message, Smart Period visit
- Color-coded subjects with visual progress dots
- Week navigation with totals
- Fully offline — data saved on the device
- Installable on iPhone or Android like a real app

---

## 🚀 Deploy to GitHub Pages (One-Time Setup)

### Step 1 — Create the GitHub repo
1. Go to [github.com](https://github.com) and sign in
2. Click **New repository**
3. Name it exactly: `teacher-tracker`
4. Set it to **Public**
5. Click **Create repository**

### Step 2 — Upload this code
In the repo you just created, click **uploading an existing file** and drag in all these files, or use Git:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/teacher-tracker.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. In your repo, go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Save

The app will automatically build and deploy. Check the **Actions** tab to watch it go. Takes about 60–90 seconds.

Your app will be live at:
```
https://YOUR_USERNAME.github.io/teacher-tracker/
```

---

## 📱 Install on iPhone

1. Open Safari on the iPhone
2. Go to `https://YOUR_USERNAME.github.io/teacher-tracker/`
3. Tap the **Share** button (box with arrow)
4. Tap **Add to Home Screen**
5. Tap **Add**

It will appear on the home screen like a real app — no App Store needed.

---

## 🛠 Local Development

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`

---

## ⚙️ Customization

To change the repo name / base URL, edit `vite.config.js`:
```js
base: "/your-repo-name/",
```
And update `index.html` icon paths to match.
