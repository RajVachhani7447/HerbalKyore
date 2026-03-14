# 🚀 Quick Start Guide - HerbalKyore React App

## ⚡ Getting Started in 3 Steps

### Step 1: Install Dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

### Step 2: Organize Images (IMPORTANT!)
The React app expects images in the `public/img/` folder. 

**If you see "img/" folder at the root level**, please move it:
- Move the entire `img` folder into the `public` folder
- Final path should be: `public/img/`

**Windows Command:**
```bash
# If img folder is at root, move it to public:
move img public\img
```

Or simply drag and drop the `img` folder into the `public` folder using File Explorer.

### Step 3: Start the App
```bash
npm start
```

Your app will open at: http://localhost:3000

---

## 📁 Folder Structure Check

Make sure your structure looks like this:

```
HITUMAMA PROJECT/
├── public/
│   ├── index.html
│   └── img/              ← Images should be HERE
│       ├── logo.png
│       ├── 1.jpg
│       ├── 2.jpg
│       └── ... (all other images)
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── data/
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

---

## 🔧 Troubleshooting

### Images not showing?
- Check that `img` folder is in `public/img/`
- Restart the development server (`Ctrl+C` then `npm start`)

### Module not found errors?
- Run `npm install` again
- Delete `node_modules` folder and run `npm install`

### Port 3000 already in use?
- The app will prompt you to use another port (press Y)
- Or stop other apps using port 3000

---

## 🎯 What's New in React Version

✅ Single Page Application (SPA) - No page reloads!
✅ Fast navigation with React Router
✅ Better performance and code organization
✅ Easy to maintain and extend
✅ All original features preserved
✅ Same beautiful design and styling

---

## 📝 Build for Production

When ready to deploy:
```bash
npm run build
```

This creates an optimized `build` folder ready for hosting.

---

## 🆘 Need Help?

- Check the full README.md for detailed documentation
- Contact: herbalkyore@gmail.com

---

**Happy Coding! 🎉**
