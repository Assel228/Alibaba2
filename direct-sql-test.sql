-- Direct SQL Test for Supabase Feedback Table

-- 1. First, let's check if the feedback table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'feedback'
);

-- 2. If the table doesn't exist, create it
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Check the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'feedback' 
ORDER BY ordinal_position;

-- 4. Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- 5. Drop any existing policies (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public inserts" ON feedback;
DROP POLICY IF EXISTS "Allow public selects" ON feedback;

-- 6. Create policy to allow anyone to insert feedback
CREATE POLICY "Allow public inserts" ON feedback
    FOR INSERT WITH CHECK (true);

-- 7. Create policy to allow anyone to read feedback
CREATE POLICY "Allow public selects" ON feedback
    FOR SELECT USING (true);

-- 8. Grant necessary permissions
GRANT INSERT, SELECT ON TABLE feedback TO anon;
GRANT USAGE ON SEQUENCE feedback_id_seq TO anon;

-- 9. Insert a test record
INSERT INTO feedback (name, email, message) 
VALUES ('SQL Test User', 'sqltest@example.com', 'Test message inserted via SQL')
RETURNING *;

-- 10. Check all records in the table
SELECT * FROM feedback ORDER BY created_at DESC;

-- 11. Count total records
SELECT COUNT(*) as total_records FROM feedback;