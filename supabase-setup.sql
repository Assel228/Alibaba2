-- Supabase SQL Setup Script for MovieMatch Feedback Table

-- 1. Create the feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- 3. Create policy to allow anyone to insert feedback
CREATE POLICY "Allow public inserts" ON feedback
    FOR INSERT WITH CHECK (true);

-- 4. Create policy to allow anyone to read feedback
CREATE POLICY "Allow public selects" ON feedback
    FOR SELECT USING (true);

-- 5. Grant necessary permissions
GRANT INSERT, SELECT ON TABLE feedback TO anon;

-- 6. Grant usage on sequence for id auto-increment
GRANT USAGE ON SEQUENCE feedback_id_seq TO anon;

-- 7. Verify the table structure
-- Run this query to check if the table was created correctly:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'feedback' 
-- ORDER BY ordinal_position;

-- 8. Test insert (optional)
-- INSERT INTO feedback (name, email, message) 
-- VALUES ('Test User', 'test@example.com', 'Test message from SQL setup');