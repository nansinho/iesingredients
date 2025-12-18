-- Enable RLS on the table
ALTER TABLE cosmetique_fr ENABLE ROW LEVEL SECURITY;

-- Allow public read access for the frontend
CREATE POLICY "Allow public read access" 
ON cosmetique_fr 
FOR SELECT 
USING (true);