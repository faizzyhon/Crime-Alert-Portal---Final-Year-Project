-- Create storage bucket for crime report images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public uploads
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

-- Create policy to allow public access to images
CREATE POLICY "Allow public access to images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');
