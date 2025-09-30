#!/usr/bin/env node

/**
 * Database Setup Script for Jalrakshak Admin Panel
 * This script sets up all required Supabase tables and sample data
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://yctbapuirfppmqbzgvqo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdGJhcHVpcmZwcG1xYnpndnFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwMDAyOTcsImV4cCI6MjA3NDU3NjI5N30.HyuVCIlShAfZbEvFrLEk0dXJQKw4Hsu2yYjkjp68C2E';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');
    
    // Read the SQL setup file
    const sqlPath = path.join(__dirname, 'supabase_setup.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            console.warn(`⚠️  Warning in statement ${i + 1}:`, error.message);
            // Continue with other statements even if one fails
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.warn(`⚠️  Error in statement ${i + 1}:`, err.message);
        }
      }
    }
    
    // Test the setup by querying each table
    console.log('\n🧪 Testing database setup...');
    
    const tables = [
      'user_profiles',
      'admin_alerts', 
      'admin_shelters',
      'admin_missions',
      'admin_system_logs',
      'admin_notifications',
      'location_data',
      'user_locations'
    ];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table ${table}: ${error.message}`);
        } else {
          console.log(`✅ Table ${table}: OK (${data?.length || 0} records)`);
        }
      } catch (err) {
        console.log(`❌ Table ${table}: ${err.message}`);
      }
    }
    
    console.log('\n🎉 Database setup completed!');
    console.log('📊 You can now use the admin dashboard with real data.');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Alternative method using direct SQL execution
async function setupDatabaseAlternative() {
  try {
    console.log('🚀 Starting alternative database setup...');
    
    // Create tables one by one using Supabase client
    const tables = [
      {
        name: 'user_profiles',
        sql: `
          CREATE TABLE IF NOT EXISTS user_profiles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            firebase_uid TEXT UNIQUE,
            email TEXT NOT NULL,
            display_name TEXT,
            photo_url TEXT,
            role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'emergency_responder', 'volunteer', 'rescue_team')),
            disabled BOOLEAN DEFAULT FALSE,
            joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            last_login TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            phone TEXT,
            emergency_contact TEXT,
            specialization TEXT,
            experience TEXT,
            team TEXT,
            status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
            region TEXT DEFAULT 'Unknown',
            reports_submitted INTEGER DEFAULT 0,
            last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            is_online BOOLEAN DEFAULT FALSE,
            volunteer_status TEXT DEFAULT 'inactive' CHECK (volunteer_status IN ('inactive', 'active', 'standby', 'busy')),
            availability TEXT DEFAULT '24/7',
            rating DECIMAL(3,1) DEFAULT 0.0,
            missions_completed INTEGER DEFAULT 0
          );
        `
      },
      {
        name: 'admin_alerts',
        sql: `
          CREATE TABLE IF NOT EXISTS admin_alerts (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            type TEXT NOT NULL,
            severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
            message TEXT NOT NULL,
            region TEXT NOT NULL,
            sent_to TEXT[] DEFAULT '{}',
            status TEXT DEFAULT 'active' CHECK (status IN ('active', 'delivered', 'dismissed')),
            expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
            created_by TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            delivery_count INTEGER DEFAULT 0,
            read_count INTEGER DEFAULT 0
          );
        `
      },
      {
        name: 'admin_shelters',
        sql: `
          CREATE TABLE IF NOT EXISTS admin_shelters (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            address TEXT,
            capacity INTEGER NOT NULL DEFAULT 0,
            current_occupancy INTEGER DEFAULT 0,
            status TEXT DEFAULT 'available' CHECK (status IN ('available', 'near_full', 'full')),
            contact_person TEXT,
            contact_phone TEXT,
            contact_email TEXT,
            facilities TEXT[] DEFAULT '{}',
            coordinates JSONB DEFAULT '{"lat": 0, "lng": 0}',
            is_active BOOLEAN DEFAULT TRUE,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'admin_missions',
        sql: `
          CREATE TABLE IF NOT EXISTS admin_missions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            mission_id TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            origin TEXT NOT NULL,
            destination TEXT NOT NULL,
            mode TEXT DEFAULT 'Road' CHECK (mode IN ('Road', 'Boat', 'Air')),
            assigned_team TEXT NOT NULL,
            team_leader TEXT NOT NULL,
            team_contact TEXT NOT NULL,
            status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
            priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
            estimated_time TEXT,
            distance TEXT,
            start_time TIMESTAMP WITH TIME ZONE,
            expected_completion TIMESTAMP WITH TIME ZONE,
            actual_completion TIMESTAMP WITH TIME ZONE,
            description TEXT,
            coordinates JSONB DEFAULT '{"origin": {"lat": 0, "lng": 0}, "destination": {"lat": 0, "lng": 0}}',
            route JSONB DEFAULT '[]',
            alternate_routes JSONB DEFAULT '[]',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'location_data',
        sql: `
          CREATE TABLE IF NOT EXISTS location_data (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            state TEXT NOT NULL,
            district TEXT NOT NULL,
            lat DECIMAL(10, 8) NOT NULL,
            lng DECIMAL(11, 8) NOT NULL,
            current_water_level DECIMAL(5, 2) DEFAULT 0,
            risk_level TEXT DEFAULT 'safe' CHECK (risk_level IN ('safe', 'warning', 'critical')),
            weather_data JSONB DEFAULT '{"temperature": 0, "humidity": 0, "precipitation": 0, "wind_speed": 0}',
            last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      }
    ];
    
    // Create tables
    for (const table of tables) {
      try {
        console.log(`⏳ Creating table ${table.name}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: table.sql });
        
        if (error) {
          console.warn(`⚠️  Warning creating ${table.name}:`, error.message);
        } else {
          console.log(`✅ Table ${table.name} created successfully`);
        }
      } catch (err) {
        console.warn(`⚠️  Error creating ${table.name}:`, err.message);
      }
    }
    
    // Insert sample data
    console.log('\n📊 Inserting sample data...');
    
    // Sample users
    const { error: usersError } = await supabase
      .from('user_profiles')
      .upsert([
        {
          firebase_uid: 'sample-user-1',
          email: 'admin@jalrakshak.com',
          display_name: 'Admin User',
          role: 'admin',
          status: 'active',
          region: 'Chennai',
          specialization: 'Emergency Management',
          experience: '5 years',
          team: 'Team Alpha',
          volunteer_status: 'active',
          availability: '24/7',
          rating: 4.8,
          missions_completed: 25
        },
        {
          firebase_uid: 'sample-user-2',
          email: 'volunteer@jalrakshak.com',
          display_name: 'John Doe',
          role: 'volunteer',
          status: 'active',
          region: 'Chennai',
          specialization: 'Water Rescue',
          experience: '3 years',
          team: 'Team Beta',
          volunteer_status: 'active',
          availability: 'Weekends',
          rating: 4.5,
          missions_completed: 15
        }
      ]);
    
    if (usersError) {
      console.warn('⚠️  Warning inserting users:', usersError.message);
    } else {
      console.log('✅ Sample users inserted');
    }
    
    // Sample alerts
    const { error: alertsError } = await supabase
      .from('admin_alerts')
      .upsert([
        {
          type: 'Flood Warning',
          severity: 'high',
          message: 'Heavy rainfall expected in Chennai area. Please stay indoors and avoid low-lying areas.',
          region: 'Chennai',
          sent_to: ['all_users'],
          status: 'active',
          expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          created_by: 'admin@jalrakshak.com',
          delivery_count: 150,
          read_count: 120
        },
        {
          type: 'Weather Update',
          severity: 'medium',
          message: 'Rain intensity decreasing in Tamil Nadu region. Conditions improving.',
          region: 'Tamil Nadu',
          sent_to: ['chennai_users'],
          status: 'active',
          expires_at: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
          created_by: 'admin@jalrakshak.com',
          delivery_count: 75,
          read_count: 60
        }
      ]);
    
    if (alertsError) {
      console.warn('⚠️  Warning inserting alerts:', alertsError.message);
    } else {
      console.log('✅ Sample alerts inserted');
    }
    
    // Sample shelters
    const { error: sheltersError } = await supabase
      .from('admin_shelters')
      .upsert([
        {
          name: 'Chennai Central Shelter',
          location: 'Chennai Central',
          address: '123 Main Street, Chennai Central',
          capacity: 200,
          current_occupancy: 45,
          status: 'available',
          contact_person: 'Rajesh Kumar',
          contact_phone: '+91 98765 43210',
          contact_email: 'rajesh@shelter.com',
          facilities: ['Food', 'Water', 'Medical', 'WiFi', 'Beds'],
          coordinates: { lat: 13.0827, lng: 80.2707 },
          is_active: true,
          notes: 'Main evacuation center'
        },
        {
          name: 'Sector 17 Community Center',
          location: 'Sector 17',
          address: '456 Community Road, Sector 17',
          capacity: 150,
          current_occupancy: 120,
          status: 'near_full',
          contact_person: 'Priya Sharma',
          contact_phone: '+91 98765 43211',
          contact_email: 'priya@shelter.com',
          facilities: ['Food', 'Water', 'Medical', 'Parking'],
          coordinates: { lat: 13.0900, lng: 80.2800 },
          is_active: true,
          notes: 'Community-based shelter'
        }
      ]);
    
    if (sheltersError) {
      console.warn('⚠️  Warning inserting shelters:', sheltersError.message);
    } else {
      console.log('✅ Sample shelters inserted');
    }
    
    // Sample location data
    const { error: locationError } = await supabase
      .from('location_data')
      .upsert([
        {
          state: 'Tamil Nadu',
          district: 'Chennai',
          lat: 13.0827,
          lng: 80.2707,
          current_water_level: 2.5,
          risk_level: 'warning',
          weather_data: { temperature: 28, humidity: 85, precipitation: 15, wind_speed: 12 },
          last_updated: new Date().toISOString()
        },
        {
          state: 'Tamil Nadu',
          district: 'Chennai Central',
          lat: 13.0900,
          lng: 80.2800,
          current_water_level: 3.2,
          risk_level: 'critical',
          weather_data: { temperature: 26, humidity: 90, precipitation: 25, wind_speed: 18 },
          last_updated: new Date().toISOString()
        }
      ]);
    
    if (locationError) {
      console.warn('⚠️  Warning inserting location data:', locationError.message);
    } else {
      console.log('✅ Sample location data inserted');
    }
    
    console.log('\n🎉 Alternative database setup completed!');
    
  } catch (error) {
    console.error('❌ Alternative database setup failed:', error);
  }
}

// Run the setup
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabaseAlternative().then(() => {
    console.log('✅ Setup script completed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Setup script failed:', error);
    process.exit(1);
  });
}

export { setupDatabase, setupDatabaseAlternative };