-- Create table for persistent Ask Ed cache
CREATE TABLE IF NOT EXISTS ask_ed_cache (
  id SERIAL PRIMARY KEY,
  cache_key VARCHAR(500) UNIQUE NOT NULL,
  query TEXT NOT NULL,
  setting_type VARCHAR(50),
  context TEXT NOT NULL,
  response_template TEXT,
  confidence JSONB,
  sources JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  access_count INTEGER DEFAULT 1
);

-- Create index for faster lookups
CREATE INDEX idx_ask_ed_cache_key ON ask_ed_cache(cache_key);
CREATE INDEX idx_ask_ed_cache_created ON ask_ed_cache(created_at);

-- Create function to update last_accessed and access_count
CREATE OR REPLACE FUNCTION update_cache_access()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_accessed = NOW();
  NEW.access_count = OLD.access_count + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for cache access updates
CREATE TRIGGER update_ask_ed_cache_access
BEFORE UPDATE ON ask_ed_cache
FOR EACH ROW
WHEN (OLD.cache_key = NEW.cache_key AND OLD.context = NEW.context)
EXECUTE FUNCTION update_cache_access();

-- Grant permissions
GRANT ALL ON ask_ed_cache TO authenticated;
GRANT ALL ON ask_ed_cache TO service_role;