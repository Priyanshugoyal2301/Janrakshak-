#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yctbapuirfppmqbzgvqo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdGJhcHVpcmZwcG1xYnpndnFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwMDAyOTcsImV4cCI6MjA3NDU3NjI5N30.HyuVCIlShAfZbEvFrLEk0dXJQKw4Hsu2yYjkjp68C2E';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAlerts() {
  try {
    console.log('🔍 Testing admin alerts functionality...');
    
    // Test 1: Get all alerts
    console.log('\n1. Testing getAdminAlerts...');
    const { data: alerts, error: alertsError } = await supabase
      .from('admin_alerts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (alertsError) {
      console.log(`❌ Error getting alerts: ${alertsError.message}`);
    } else {
      console.log(`✅ Found ${alerts.length} alerts`);
      alerts.forEach(alert => {
        console.log(`   - ${alert.type} (${alert.severity}): ${alert.message.substring(0, 50)}...`);
      });
    }
    
    // Test 2: Create a new alert
    console.log('\n2. Testing createAlert...');
    const newAlert = {
      type: 'Test Alert',
      severity: 'medium',
      message: 'This is a test alert created from the test script',
      region: 'Test Region',
      sent_to: ['test_users'],
      status: 'active',
      expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      created_by: 'test@janrakshak.com',
      delivery_count: 0,
      read_count: 0
    };
    
    const { data: createdAlert, error: createError } = await supabase
      .from('admin_alerts')
      .insert([newAlert])
      .select()
      .single();
    
    if (createError) {
      console.log(`❌ Error creating alert: ${createError.message}`);
    } else {
      console.log(`✅ Alert created successfully: ${createdAlert.id}`);
      
      // Test 3: Update alert status
      console.log('\n3. Testing updateAlertStatus...');
      const { error: updateError } = await supabase
        .from('admin_alerts')
        .update({ status: 'delivered', updated_at: new Date().toISOString() })
        .eq('id', createdAlert.id);
      
      if (updateError) {
        console.log(`❌ Error updating alert: ${updateError.message}`);
      } else {
        console.log(`✅ Alert status updated successfully`);
      }
      
      // Test 4: Delete the test alert
      console.log('\n4. Testing deleteAlert...');
      const { error: deleteError } = await supabase
        .from('admin_alerts')
        .delete()
        .eq('id', createdAlert.id);
      
      if (deleteError) {
        console.log(`❌ Error deleting alert: ${deleteError.message}`);
      } else {
        console.log(`✅ Alert deleted successfully`);
      }
    }
    
    // Test 5: Test real-time subscription
    console.log('\n5. Testing real-time subscription...');
    const subscription = supabase
      .channel('admin_alerts_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_alerts' }, (payload) => {
        console.log('📡 Real-time update received:', payload);
      })
      .subscribe();
    
    // Wait a bit for subscription to establish
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create another test alert to trigger the subscription
    const { data: triggerAlert, error: triggerError } = await supabase
      .from('admin_alerts')
      .insert([{
        type: 'Subscription Test',
        severity: 'low',
        message: 'Testing real-time subscription',
        region: 'Test',
        sent_to: ['test'],
        status: 'active',
        expires_at: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
        created_by: 'test@janrakshak.com'
      }])
      .select()
      .single();
    
    if (triggerError) {
      console.log(`❌ Error creating trigger alert: ${triggerError.message}`);
    } else {
      console.log(`✅ Trigger alert created: ${triggerAlert.id}`);
      
      // Clean up
      await supabase
        .from('admin_alerts')
        .delete()
        .eq('id', triggerAlert.id);
    }
    
    // Unsubscribe
    subscription.unsubscribe();
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAlerts();