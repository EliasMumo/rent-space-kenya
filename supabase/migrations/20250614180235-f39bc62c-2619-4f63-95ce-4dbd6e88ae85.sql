
-- Create reviews table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create messages table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create favorites table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Enable RLS on all tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Landlords can manage their own properties" ON public.properties;
DROP POLICY IF EXISTS "Everyone can view available properties" ON public.properties;
DROP POLICY IF EXISTS "Tenants can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Everyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update message read status" ON public.messages;
DROP POLICY IF EXISTS "Users can manage their favorites" ON public.favorites;

-- Create policies for properties
CREATE POLICY "Landlords can manage their own properties" 
  ON public.properties 
  FOR ALL 
  USING (auth.uid() = landlord_id);

CREATE POLICY "Everyone can view available properties" 
  ON public.properties 
  FOR SELECT 
  USING (is_available = true);

-- Create policies for reviews
CREATE POLICY "Tenants can create reviews" 
  ON public.reviews 
  FOR INSERT 
  WITH CHECK (auth.uid() = tenant_id);

CREATE POLICY "Everyone can view reviews" 
  ON public.reviews 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own reviews" 
  ON public.reviews 
  FOR UPDATE 
  USING (auth.uid() = tenant_id);

-- Create policies for messages
CREATE POLICY "Users can send messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view their messages" 
  ON public.messages 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can update message read status" 
  ON public.messages 
  FOR UPDATE 
  USING (auth.uid() = receiver_id);

-- Create policies for favorites
CREATE POLICY "Users can manage their favorites" 
  ON public.favorites 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Add caretaker fields to profiles table (if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'caretaker_phone') THEN
        ALTER TABLE public.profiles ADD COLUMN caretaker_phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'display_phone_preference') THEN
        ALTER TABLE public.profiles ADD COLUMN display_phone_preference TEXT DEFAULT 'owner' CHECK (display_phone_preference IN ('owner', 'caretaker'));
    END IF;
END $$;
