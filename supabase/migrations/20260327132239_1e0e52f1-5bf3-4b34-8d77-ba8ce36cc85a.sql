
-- Fix RLS on keep_alive table
ALTER TABLE public.keep_alive ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read keep_alive" ON public.keep_alive FOR SELECT USING (true);
