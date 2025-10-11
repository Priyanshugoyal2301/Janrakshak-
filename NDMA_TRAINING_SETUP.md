# 🎯 NDMA Training Management System Setup

## 📋 Database Setup Instructions

### Step 1: Execute SQL Scripts in Supabase

1. **Open Supabase SQL Editor**: Go to your Supabase dashboard → SQL Editor

2. **Run Database Schema**:

   - Copy and paste the contents of `integrated_training_schema.sql`
   - Click "Run" to create all tables, relationships, and policies

3. **Run Seed Data**:
   - Copy and paste the contents of `training_seed_data.sql`
   - Click "Run" to populate initial data

### Step 2: Verify Installation

Check that these tables were created:

- ✅ `training_themes`
- ✅ `target_audiences`
- ✅ `training_partners`
- ✅ `training_sessions`
- ✅ `training_participants`
- ✅ `training_coverage`
- ✅ And 6 more related tables

## 🚀 Access the System

1. **Navigate to Admin Panel**: `/admin/training`
2. **Available Features**:
   - 📊 **Dashboard**: Overview statistics and metrics
   - 📅 **Training Sessions**: View and manage sessions
   - 🗺️ **Geographic Coverage**: State/district analysis
   - 📈 **Analytics**: Performance metrics and trends
   - ➕ **Data Entry**: Create new training sessions
   - 📄 **Reports**: Comprehensive reporting and exports

## 🔧 Key Components Created

### Database Layer

- **12 Tables**: Complete relational schema
- **RLS Policies**: Row-level security
- **Triggers**: Automatic updates
- **Views**: Reporting optimization

### Service Layer

- **CRUD Operations**: Full data management
- **Analytics Functions**: Dashboard metrics
- **Reporting**: Export capabilities

### UI Components

- **AdminTraining**: Main dashboard page
- **TrainingDataEntry**: Session creation form
- **TrainingReports**: Analytics and reporting
- **Navigation**: Integrated admin routing

## 📊 Sample Data Included

- **Training Partners**: Government, NGO, Academic institutions
- **Training Themes**: Disaster management topics
- **Target Audiences**: Officials, responders, communities
- **Geographic Coverage**: Flood-prone districts mapped

## 🎯 Next Steps

1. Run the SQL scripts in Supabase
2. Navigate to `/admin/training`
3. Click "New Training" to create your first session
4. Explore reporting and analytics features

The system is now ready for full-scale deployment! 🚀

## 🔍 Troubleshooting

**If you see import errors**:

- Ensure all UI components are installed: `shadcn/ui tabs, cards, buttons, etc.`
- Verify Supabase client is properly configured

**If navigation doesn't work**:

- Check that the route is added to your router
- Verify AdminProtectedRoute is working

**For database issues**:

- Ensure RLS policies are enabled in Supabase
- Check that your Supabase client has proper permissions
