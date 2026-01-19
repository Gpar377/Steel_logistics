# 🚛 SteelTrack Logistics - AI-Powered Steel Delivery Management

> **Smart logistics platform for Karnataka's steel industry with AI route optimization**

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Demo](https://img.shields.io/badge/demo-live-blue)

---

## 🎯 What This Does

- **AI Route Optimization** - Automatically finds the best delivery routes
- **23 Karnataka Locations** - Bangalore, Mysore, Mangalore, Hubli, and more
- **Real-time Tracking** - Live map showing all drivers and deliveries
- **Smart Scheduling** - Considers traffic, time windows, and vehicle capacity
- **RTO Compliance** - Automatic weight and axle limit checks

---

## 🚀 How to Run (For Non-Coders)

### Step 1: Install Node.js
1. Go to https://nodejs.org
2. Download the **LTS version** (green button)
3. Run the installer
4. Click "Next" until it finishes

### Step 2: Download This Project
1. Click the green **"Code"** button above
2. Click **"Download ZIP"**
3. Extract the ZIP file to your Desktop

### Step 3: Open Terminal/Command Prompt
**Windows:**
- Press `Windows Key + R`
- Type `cmd` and press Enter

**Mac:**
- Press `Command + Space`
- Type `terminal` and press Enter

### Step 4: Navigate to Project Folder
```bash
cd Desktop/steeltrack-logistics-main
```
*(Replace with your actual folder path)*

### Step 5: Install Dependencies
```bash
npm install
```
Wait 1-2 minutes for it to finish.

### Step 6: Start the App
```bash
npx vite
```

### Step 7: Open in Browser
Open your browser and go to:
```
http://localhost:5173
```

**🎉 Done! The app is now running!**

---

## 📱 How to Use

### For Dispatchers
1. Click **"Dispatcher Portal"**
2. Click **"New Order"** to create deliveries
3. Click **"Optimize"** to let AI plan routes
4. View routes on the map

### For Drivers
1. Click **"Driver Companion"**
2. See your assigned deliveries
3. Follow the route on the map
4. Mark deliveries as complete

---

## 🛠️ Troubleshooting

### "npm is not recognized"
- Node.js is not installed. Go back to Step 1.

### Port 5173 already in use
- Close other apps using that port, or the app will use a different port automatically.

### Page shows errors
- Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac) to hard refresh.

---

## 📂 Project Structure

```
steeltrack-logistics/
├── components/          # UI components
├── pages/              # Main pages (Login, Dashboard, Driver App)
├── services/           # AI optimization & routing
├── constants/          # Karnataka locations & data
├── utils/              # Helper functions
└── types.ts            # TypeScript definitions
```

---

## 🇮🇳 Karnataka Coverage

**23 Industrial Hubs:**
- **Bangalore**: Peenya, Electronic City, Whitefield, Jigani, Bidadi
- **Mysore**: Steel Plant, Hebbal, Belagola
- **Mangalore**: New Mangalore Port, NMPT Terminal, Baikampady
- **Hubli, Dharwad, Belgaum, Tumkur, Bellary, Davangere, Shimoga, Hassan**

---

## 🤖 AI Features

- **Genetic Algorithm** - Optimizes routes with 50 individuals over 40 generations
- **Time Window Constraints** - Ensures on-time deliveries
- **Traffic Integration** - Uses OSRM for real-time routing
- **Weight Compliance** - Automatic RTO regulation checks
- **Material Handling** - Crane requirements, loading times

---

## 🔧 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Routing**: Genetic Algorithm + OSRM
- **Maps**: Leaflet
- **UI**: TailwindCSS
- **Charts**: Recharts

---

## 📊 Features

✅ AI route optimization  
✅ 23 Karnataka locations  
✅ Real-time map tracking  
✅ Time window scheduling  
✅ Weight & axle compliance  
✅ Toll & fuel cost calculation  
✅ Analytics dashboard  
✅ Material-specific handling  
✅ Offline mode ready  
✅ Mobile responsive  

---

## 🎓 For Developers

### Quick Start
```bash
npm install
npx vite
```

### Build for Production
```bash
npm run build
```

### Deploy
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

---

## 📝 License

MIT License - Free to use and modify

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📞 Support

- **Issues**: Open an issue on GitHub
- **Email**: support@steeltrack.com
- **Docs**: Check `/IMPROVEMENTS.md` for technical details

---

## 🌟 Star This Repo

If you find this useful, please give it a ⭐ on GitHub!

---

**Status**: ✅ Production Ready | 🚀 Demo Live
