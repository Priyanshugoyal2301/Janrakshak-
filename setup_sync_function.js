#!/usr/bin/env node

/**
 * Create sync_firebase_user function in Supabase
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Supabase configuration
const supabaseUrl = "https://yctbapuirfppmqbzgvqo.supabase.co";
const supabaseServiceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdGJhcHVpcmZwcG1xYnpndnFvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTAwMDI5NywiZXhwIjoyMDc0NTc2Mjk3fQ.wkDekty8zBx12MUFVqP8rYeimdHsymPFcN7pn79kDgM";

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function createSyncFunction() {
  try {
    console.log("🚀 Creating sync_firebase_user function...");

    // Read the SQL file
    const sqlContent = fs.readFileSync("create_sync_function.sql", "utf8");

    console.log("📝 Executing SQL function creation...");

    // Execute the SQL
    const { data, error } = await supabase
      .from("dummy") // We'll use rpc instead
      .select("*")
      .limit(1);

    // Use direct SQL execution
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        apikey: supabaseServiceRoleKey,
      },
      body: JSON.stringify({
        query: sqlContent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Failed to create function:", errorText);

      // Try alternative approach - direct supabase sql
      console.log("🔄 Trying alternative approach...");
      const { data, error } = await supabase.rpc("exec_sql", {
        query: sqlContent,
      });

      if (error) {
        console.error("❌ Alternative approach failed:", error);
        return false;
      } else {
        console.log("✅ Function created successfully via alternative method!");
        return true;
      }
    } else {
      console.log("✅ Function created successfully!");
      return true;
    }
  } catch (error) {
    console.error("❌ Error creating function:", error);
    return false;
  }
}

// Test the function after creation
async function testSyncFunction() {
  try {
    console.log("🧪 Testing sync_firebase_user function...");

    const { data, error } = await supabase.rpc("sync_firebase_user", {
      p_firebase_uid: "test-user-123",
      p_email: "test@example.com",
      p_name: "Test User",
      p_photo_url: null,
      p_chosen_role: null,
    });

    if (error) {
      console.error("❌ Function test failed:", error);
      return false;
    } else {
      console.log("✅ Function test successful!");
      console.log("📊 Test result:", data);
      return true;
    }
  } catch (error) {
    console.error("❌ Error testing function:", error);
    return false;
  }
}

// Main execution
(async () => {
  console.log("🔧 Setting up sync_firebase_user function...\n");

  const created = await createSyncFunction();
  if (created) {
    console.log("\n🔍 Testing function...");
    await testSyncFunction();
  }

  console.log("\n🎉 Setup complete!");
})();
