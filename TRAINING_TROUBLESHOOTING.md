# 🛠️ Training Management System Troubleshooting Guide

## 🚀 Quick Start Checklist

### 1. Database Setup ✅

Run these SQL scripts in **Supabase SQL Editor** (in order):

```sql
-- First: Run integrated_training_schema.sql
-- Then: Run training_seed_data.sql
-- Test: Run test_training_setup.sql to verify
```

### 2. Verify Tables Created ✅

Check that these tables exist in Supabase:

- `training_themes`
- `target_audiences`
- `training_partners`
- `training_sessions`
- `training_participants`
- `training_coverage`
- `training_session_themes`
- `training_session_audiences`

### 3. Test Database Connection ✅

Navigate to: `/admin/training`

If you see "Loading..." indefinitely, check:

- Supabase connection in your `.env`
- RLS policies are enabled
- Tables have proper permissions

## 🔧 Common Issues & Solutions

### Issue 1: "Cannot read properties" errors

**Solution**: Ensure all UI components are installed:

```bash
# These should already be installed in your project:
npm install @radix-ui/react-tabs
npm install @radix-ui/react-select
npm install @radix-ui/react-checkbox
```

### Issue 2: Database connection errors

**Solution**: Check your Supabase configuration:

1. Verify `.env` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Test connection in Supabase dashboard
3. Check RLS policies are enabled

### Issue 3: Navigation not working

**Solution**:

- Verify route is added to `App.tsx` ✅
- Check `AdminLayout.tsx` has training menu item ✅
- Ensure `AdminProtectedRoute` is working

### Issue 4: Empty dashboard

**Solution**:

1. Run seed data SQL scripts
2. Check browser console for errors
3. Verify Supabase table permissions

## 🎯 Testing Steps

### Step 1: Basic Navigation

1. Go to `/admin`
2. Click "Training Management" in sidebar
3. Should load training dashboard

### Step 2: Data Entry

1. Click "New Training" button
2. Should switch to "Data Entry" tab
3. Fill out form and submit
4. Should create new training session

### Step 3: Reports

1. Click "Reports" tab
2. Should show analytics dashboard
3. Try changing date filters

## 📊 Expected Behavior

### Dashboard Tab

- Shows 6 metric cards (sessions, participants, etc.)
- Recent sessions list
- Coverage analysis

### Data Entry Tab

- Form with all training fields
- State/district dropdowns populated
- Theme/audience multi-select working

### Reports Tab

- Key metrics overview
- Geographic coverage charts
- Performance analytics
- Export functionality

## 🚨 Emergency Reset

If nothing works, run this in Supabase SQL Editor:

```sql
-- Drop all training tables (CAUTION!)
DROP TABLE IF EXISTS training_session_audiences CASCADE;
DROP TABLE IF EXISTS training_session_themes CASCADE;
DROP TABLE IF EXISTS training_participants CASCADE;
DROP TABLE IF EXISTS training_sessions CASCADE;
DROP TABLE IF EXISTS training_coverage CASCADE;
DROP TABLE IF EXISTS training_partners CASCADE;
DROP TABLE IF EXISTS target_audiences CASCADE;
DROP TABLE IF EXISTS training_themes CASCADE;

-- Then re-run the schema and seed data
```

## 📞 Support

If issues persist:

1. Check browser console for JavaScript errors
2. Check Supabase logs for database errors
3. Verify all files were created correctly
4. Test with simple SQL queries first

## ✅ Success Indicators

Training system is working when:

- ✅ Navigation shows "Training Management"
- ✅ Dashboard loads with metrics
- ✅ Data entry form is functional
- ✅ Reports show analytics
- ✅ No console errors

The system should handle:

- Creating training sessions
- Managing partnerships
- Tracking geographic coverage
- Generating reports and analytics
