#!/usr/bin/env node

/**
 * Create Emergency Contacts Table Script
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Use the keys from the setup file
const supabaseUrl = "https://yctbapuirfppmqbzgvqo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdGJhcHVpcmZwcG1xYnpndnFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwMDAyOTcsImV4cCI6MjA3NDU3NjI5N30.HyuVCIlShAfZbEvFrLEk0dXJQKw4Hsu2yYjkjp68C2E";

const supabase = createClient(supabaseUrl, supabaseKey);

async function createEmergencyContactsTable() {
  try {
    console.log("🚀 Creating emergency_contacts table...");

    // Read the SQL file
    const sqlContent = fs.readFileSync(
      "create_emergency_contacts_tables.sql",
      "utf8"
    );

    console.log("📝 SQL content loaded, executing...");

    // Execute the SQL using Supabase client
    const { data, error } = await supabase.rpc("exec_sql", {
      sql: sqlContent,
    });

    if (error) {
      console.error("❌ Error creating emergency_contacts table:", error);
      // Try alternative method - execute in parts
      console.log("🔄 Trying to execute SQL in smaller parts...");
      await executeInParts(sqlContent);
    } else {
      console.log("✅ Emergency contacts table created successfully!");
      console.log("Data:", data);
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    // Try alternative method
    console.log("🔄 Trying alternative execution method...");
    await executeInParts();
  }
}

async function executeInParts(sqlContent = null) {
  try {
    if (!sqlContent) {
      sqlContent = fs.readFileSync(
        "create_emergency_contacts_tables.sql",
        "utf8"
      );
    }

    // Split into individual statements and filter out comments
    const statements = sqlContent
      .split(";")
      .map((stmt) => stmt.trim())
      .filter(
        (stmt) =>
          stmt.length > 0 &&
          !stmt.startsWith("--") &&
          !stmt.startsWith("/*") &&
          stmt !== ""
      );

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement individually
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        try {
          console.log(
            `⏳ Executing statement ${i + 1}/${statements.length}...`
          );
          console.log(`SQL: ${statement.substring(0, 100)}...`);

          const { data, error } = await supabase.rpc("exec_sql", {
            sql: statement + ";",
          });

          if (error) {
            console.error(`❌ Error in statement ${i + 1}:`, error);
            // Continue with next statement
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (stmtError) {
          console.error(`❌ Exception in statement ${i + 1}:`, stmtError);
          // Continue with next statement
        }
      }
    }

    console.log("✅ All statements executed (some may have failed)");
  } catch (error) {
    console.error("❌ Error executing in parts:", error);
  }
}

// Run the script
createEmergencyContactsTable().catch(console.error);
