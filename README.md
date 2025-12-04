# OPMC - Outpatient Pharmacy Department Master Catalogue

A mobile-first web application for managing medicine locations in a pharmacy department.

## Tech Stack

- **Frontend**: React (Vite)
- **UI Library**: Ant Design Mobile
- **Database**: Supabase
- **Deployment**: Netlify (recommended)
- **Export**: SheetJS (xlsx)

## Features

### Main Inventory Page
- Search medicines by name
- Filter by location status (All, With Location, Missing Location)
- Quick update modal with picker-based location selection
- Real-time updates with toast notifications

### Settings Page
- **Export to Excel**: Download complete inventory as `.xlsx` file
- **Location Configuration**: Manage valid values for:
  - Baris (Row)
  - Rak (Shelf)
  - Tingkat (Level)
  - Petak (Compartment)

## Setup Instructions

### 1. Database Setup (Supabase)

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL script from `supabase-setup.sql`
4. Copy your project URL and anon key

### 2. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

The production files will be in the `dist` folder.

## Deployment to Netlify

### Option 1: Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize and deploy:
   ```bash
   netlify init
   netlify deploy --prod
   ```

### Option 2: Netlify Dashboard

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to [Netlify](https://netlify.com) and create a new site
3. Drag and drop the `dist` folder
4. Add environment variables in Site Settings → Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Option 3: Git-based Deployment

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Site Settings

## Database Schema

### `medicines` Table
- `id` (uuid, primary key)
- `name` (text, unique)
- `baris` (text, nullable)
- `rak` (text, nullable)
- `tingkat` (text, nullable)
- `petak` (text, nullable)
- `last_updated` (timestamp)

### `location_options` Table
- `id` (uuid, primary key)
- `category` (text) - 'baris', 'rak', 'tingkat', or 'petak'
- `value` (text)

## Usage Guide

### Adding Medicines

You can add medicines directly in Supabase:

```sql
INSERT INTO medicines (name) VALUES ('Medicine Name');
```

Or use the Supabase dashboard Table Editor.

### Updating Locations

1. Open the app on your mobile device
2. Search for the medicine
3. Tap on the medicine card
4. Select location coordinates using the pickers
5. Tap "Save Location"

### Exporting Data

1. Go to Settings (gear icon in top-right)
2. Tap "Export to Excel"
3. File will download as `OPMC_Master_List_YYYY-MM-DD.xlsx`

### Managing Location Options

1. Go to Settings
2. Scroll to "Location Configuration"
3. Add or delete values for each category
4. These values will appear in the location pickers

## Mobile Optimization

- Viewport optimized for mobile devices
- Touch-friendly interface
- Sticky search bar and filters
- Smooth animations and transitions
- Maximum width of 480px on larger screens

## Security Notes

⚠️ **Important**: This app has no authentication as specified. The Supabase policies allow all operations. For production use, consider:

- Adding authentication
- Restricting database access
- Implementing user roles
- Adding audit logging

## Troubleshooting

### App not connecting to Supabase
- Check that `.env` file exists and has correct credentials
- Verify Supabase project is active
- Check browser console for errors

### Location pickers showing no options
- Verify `location_options` table has data
- Run the sample data insert from `supabase-setup.sql`

### Excel export not working
- Check browser console for errors
- Verify all medicines are being fetched from Supabase
- Ensure popup blockers aren't preventing download

## License

ISC

## Support

For issues or questions, please contact your system administrator.
