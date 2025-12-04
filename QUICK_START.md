# OPMC Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Set Up Supabase (2 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in:
   - Project name: `opmc`
   - Database password: (choose a strong password)
   - Region: (choose closest to you)
4. Wait for project to be created (~2 minutes)

### Step 2: Run SQL Setup (1 minute)

1. In your Supabase dashboard, click "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy and paste the entire contents of `supabase-setup.sql`
4. Click "Run" button
5. You should see "Success. No rows returned"

### Step 3: Get Your Credentials (30 seconds)

1. In Supabase dashboard, click "Settings" (gear icon) → "API"
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### Step 4: Configure Your App (30 seconds)

1. In your project folder, copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Open `.env` and paste your credentials:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### Step 5: Run the App (1 minute)

```bash
npm run dev
```

Open your browser to `http://localhost:3000` 🎉

---

## 📱 First Time Usage

### Add Your First Medicine

**Option 1: Via Supabase Dashboard**
1. Go to Supabase → Table Editor → `medicines`
2. Click "Insert" → "Insert row"
3. Enter medicine name (e.g., "Paracetamol 500mg")
4. Leave location fields empty for now
5. Click "Save"

**Option 2: Via SQL**
```sql
INSERT INTO medicines (name) VALUES 
  ('Paracetamol 500mg'),
  ('Amoxicillin 500mg'),
  ('Ibuprofen 400mg');
```

### Set Location for a Medicine

1. Open the app on your phone/browser
2. Find the medicine in the list
3. Tap on it
4. Select each coordinate using the pickers:
   - Baris (Row): A
   - Rak (Shelf): 1
   - Tingkat (Level): 2
   - Petak (Compartment): 3
5. Tap "Save Location"
6. You'll see the location code: **A.1.2.3**

### Customize Location Options

1. Tap the gear icon (⚙️) in top-right
2. Scroll to "Location Configuration"
3. Add your own values:
   - For Baris: A, B, C, D, E, etc.
   - For Rak: 1, 2, 3, 4, 5, etc.
   - For Tingkat: 1, 2, 3, 4, etc.
   - For Petak: 1, 2, 3, 4, etc.

### Export Your Data

1. Go to Settings (gear icon)
2. Tap "Export to Excel"
3. File downloads as `OPMC_Master_List_2025-12-04.xlsx`
4. Open in Excel/Google Sheets

---

## 🌐 Deploy to Netlify (Optional)

### Quick Deploy (Drag & Drop)

1. Build your app:
   ```bash
   npm run build
   ```

2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist` folder onto Netlify
4. Go to Site Settings → Environment Variables
5. Add your Supabase credentials:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Trigger a redeploy

Your app is now live! 🎉

---

## 💡 Tips & Tricks

### Bulk Import Medicines

Use SQL to quickly add many medicines:

```sql
INSERT INTO medicines (name) VALUES 
  ('Medicine 1'),
  ('Medicine 2'),
  ('Medicine 3')
ON CONFLICT (name) DO NOTHING;
```

### Search Tips

- Search is case-insensitive
- Searches medicine names only
- Use filters to show only medicines with/without locations

### Mobile Usage

- Add to home screen for app-like experience
- Works offline once loaded (but needs internet for updates)
- Optimized for touch - no typing required for location updates!

---

## ❓ Troubleshooting

**Problem: "Failed to load medicines"**
- Check your `.env` file has correct credentials
- Verify Supabase project is active
- Check browser console for errors

**Problem: Pickers show no options**
- Go to Settings → Location Configuration
- Add values for each category
- Or run the sample data from `supabase-setup.sql`

**Problem: Can't save location**
- Check browser console for errors
- Verify Supabase RLS policies are set correctly
- Make sure you selected all 4 coordinates

---

## 📞 Need Help?

Check the full `README.md` for detailed documentation.
