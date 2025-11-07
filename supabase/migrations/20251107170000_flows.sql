-- Create flows table for backend logic
CREATE TABLE IF NOT EXISTS public.flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  flow_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id)
);

-- Enable Row Level Security
ALTER TABLE public.flows ENABLE ROW LEVEL SECURITY;

-- Create policies for flows
CREATE POLICY "Users can view their own flows" 
ON public.flows 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = flows.project_id 
    AND projects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own flows" 
ON public.flows 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = flows.project_id 
    AND projects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own flows" 
ON public.flows 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = flows.project_id 
    AND projects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own flows" 
ON public.flows 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = flows.project_id 
    AND projects.user_id = auth.uid()
  )
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_flows_project_id ON public.flows(project_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_flows_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_flows_updated_at
BEFORE UPDATE ON public.flows
FOR EACH ROW
EXECUTE FUNCTION public.update_flows_updated_at();

