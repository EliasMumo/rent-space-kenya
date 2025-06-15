
-- Create tables for advanced search and user features

-- Add missing columns to existing properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS inquiry_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS neighborhood_info jsonb DEFAULT '{}';

-- Create property comparisons table
CREATE TABLE IF NOT EXISTS public.property_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  property_ids uuid[] NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  is_read boolean DEFAULT false,
  related_property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create property views tracking table
CREATE TABLE IF NOT EXISTS public.property_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ip_address inet,
  user_agent text,
  viewed_at timestamp with time zone DEFAULT now()
);

-- Create search preferences table
CREATE TABLE IF NOT EXISTS public.search_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  min_price numeric,
  max_price numeric,
  property_types text[],
  bedrooms_min integer,
  bedrooms_max integer,
  bathrooms_min integer,
  bathrooms_max integer,
  preferred_amenities text[],
  preferred_locations text[],
  is_furnished boolean,
  is_pet_friendly boolean,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Create saved searches table
CREATE TABLE IF NOT EXISTS public.saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  search_name text NOT NULL,
  search_criteria jsonb NOT NULL,
  is_active boolean DEFAULT true,
  last_notification_sent timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Create inquiries table (enhanced messaging)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  inquiry_type text DEFAULT 'general', -- 'general', 'viewing', 'application'
  status text DEFAULT 'pending', -- 'pending', 'responded', 'closed'
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies for new tables
ALTER TABLE public.property_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- RLS policies for property_comparisons
CREATE POLICY "Users can manage their own comparisons" 
  ON public.property_comparisons 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for property_views (allow anyone to create, users can view their own)
CREATE POLICY "Anyone can record property views" 
  ON public.property_views 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view their own property views" 
  ON public.property_views 
  FOR SELECT 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS policies for search_preferences
CREATE POLICY "Users can manage their own search preferences" 
  ON public.search_preferences 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS policies for saved_searches
CREATE POLICY "Users can manage their own saved searches" 
  ON public.saved_searches 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS policies for inquiries
CREATE POLICY "Users can view inquiries they sent or received" 
  ON public.inquiries 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Authenticated users can create inquiries" 
  ON public.inquiries 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update inquiries they received" 
  ON public.inquiries 
  FOR UPDATE 
  USING (auth.uid() = receiver_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON public.property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_user_id ON public.property_views(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON public.inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_sender_id ON public.inquiries(sender_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_receiver_id ON public.inquiries(receiver_id);

-- Function to increment property view count
CREATE OR REPLACE FUNCTION increment_property_views(property_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.properties 
  SET view_count = COALESCE(view_count, 0) + 1 
  WHERE id = property_uuid;
END;
$$;

-- Function to increment inquiry count
CREATE OR REPLACE FUNCTION increment_inquiry_count(property_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.properties 
  SET inquiry_count = COALESCE(inquiry_count, 0) + 1 
  WHERE id = property_uuid;
END;
$$;
