-- Add deployed_url to projects table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS deployed_url TEXT;

-- Create deployments table
CREATE TABLE IF NOT EXISTS public.deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('vercel', 'netlify')),
  url TEXT,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;

-- Create policies for deployments
CREATE POLICY "Users can view their own deployments" 
ON public.deployments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = deployments.project_id 
    AND projects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own deployments" 
ON public.deployments 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = deployments.project_id 
    AND projects.user_id = auth.uid()
  )
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_deployments_project_id ON public.deployments(project_id);
CREATE INDEX IF NOT EXISTS idx_deployments_created_at ON public.deployments(created_at DESC);

