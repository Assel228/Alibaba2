// Node.js Supabase Test Script
// Save this as server-test.js and run with: node server-test.js

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://smgxivzlexhahfhlrlrp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZ3hpdnpsZXhoYWhmaGxybHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNjMwNTQsImV4cCI6MjA3NjkzOTA1NH0.UFt0TP0Zzo7aTl2h9xw870XP0KQBPoLVf6QA2DOLm1Y';

async function testSupabase() {
    console.log('🧪 Starting Supabase test...\n');
    
    try {
        // Initialize Supabase client
        console.log('1. Initializing Supabase client...');
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('   ✅ Client initialized\n');
        
        // Test connection by checking if table exists
        console.log('2. Testing database connection...');
        try {
            const { data, error } = await supabase
                .from('feedback')
                .select('count')
                .single();
            
            if (error) {
                if (error.code === '42P01') {
                    console.log('   ℹ️  Feedback table does not exist yet\n');
                } else {
                    console.log(`   ❌ Connection test failed: ${error.message}`);
                    console.log(`   Code: ${error.code}\n`);
                }
            } else {
                console.log('   ✅ Database connection successful\n');
            }
        } catch (error) {
            console.log(`   ❌ Connection error: ${error.message}\n`);
        }
        
        // Try to insert data
        console.log('3. Attempting to insert test data...');
        try {
            const testData = {
                name: 'Node.js Test User',
                email: 'nodejs@test.com',
                message: 'Test message from Node.js script',
                created_at: new Date().toISOString()
            };
            
            const { data, error } = await supabase
                .from('feedback')
                .insert([testData]);
            
            if (error) {
                console.log(`   ❌ Insert failed: ${error.message}`);
                console.log(`   Code: ${error.code}`);
                console.log(`   Hint: ${error.hint || 'None'}\n`);
            } else {
                console.log('   ✅ Data inserted successfully\n');
            }
        } catch (error) {
            console.log(`   ❌ Insert error: ${error.message}\n`);
        }
        
        // Retrieve data
        console.log('4. Retrieving data...');
        try {
            const { data, error } = await supabase
                .from('feedback')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);
            
            if (error) {
                console.log(`   ❌ Data retrieval failed: ${error.message}\n`);
            } else {
                if (data && data.length > 0) {
                    console.log(`   ✅ Found ${data.length} records:`);
                    data.forEach((record, index) => {
                        console.log(`      ${index + 1}. ${record.name} (${record.email}) - ${record.message.substring(0, 50)}...`);
                    });
                } else {
                    console.log('   ℹ️  No records found\n');
                }
            }
        } catch (error) {
            console.log(`   ❌ Data retrieval error: ${error.message}\n`);
        }
        
        console.log('🏁 Test completed!');
    } catch (error) {
        console.error('💥 Test failed with error:', error.message);
    }
}

// Run the test
testSupabase();