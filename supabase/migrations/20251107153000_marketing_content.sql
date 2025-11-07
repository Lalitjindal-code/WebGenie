-- Marketing content tables for GenieSite website

-- Create features table
CREATE TABLE public.features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  display_order SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pricing plans table
CREATE TABLE public.pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  billing_interval TEXT NOT NULL DEFAULT 'month',
  description TEXT,
  features TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  highlight BOOLEAN NOT NULL DEFAULT FALSE,
  stripe_price_id TEXT,
  cta_label TEXT,
  display_order SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contacts table
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Seed default features
INSERT INTO public.features (slug, title, description, icon, display_order)
VALUES
  ('ai-code-generation', 'AI Code Generation', 'Instantly turns your design into real React + Node.js code.', 'Code2', 1),
  ('drag-drop-builder', 'Drag & Drop Builder', 'Design like Canva, deploy like a dev with pixel-perfect control.', 'LayoutDashboard', 2),
  ('one-click-deploy', 'One-Click Deploy', 'Push live via Vercel instantly without leaving GenieSite.', 'Rocket', 3),
  ('smart-genie-assistant', 'Smart Genie Assistant', 'AI co-builder that helps you improve & fix code in real time.', 'Bot', 4),
  ('logic-flow-builder', 'Logic Flow Builder', 'Visual backend builder powered by Gemini API workflows.', 'Workflow', 5),
  ('real-components', 'Real Components', 'Buttons, Navbars, Cards, Footers—all functional out of the box.', 'Blocks', 6);

-- Seed default team
INSERT INTO public.team_members (name, role, display_order)
VALUES
  ('Lalit Jindal', 'Product Architect', 1),
  ('Pratiksha Ahire', 'Frontend Developer', 2),
  ('Arin Yadav', 'Backend Developer', 3),
  ('Vaibhav Gurjar', 'UI/UX Designer', 4);

-- Seed pricing plans
INSERT INTO public.pricing_plans (name, price, description, features, highlight, stripe_price_id, cta_label, display_order)
VALUES
  (
    'Free',
    0,
    'Launch your first ideas with core Genie magic included.',
    ARRAY['2 Projects', '1 Deployment', 'Limited AI', 'Community Support'],
    FALSE,
    NULL,
    'Start for Free',
    1
  ),
  (
    'Pro',
    499,
    'Unlimited builds, full AI access, and custom domains for power creators.',
    ARRAY['Unlimited Projects', 'Unlimited Deployments', 'Full AI Access', 'Custom Domains', 'Team Sharing'],
    TRUE,
    'pro_plan_test_id',
    'Upgrade to Pro',
    2
  ),
  (
    'Team',
    999,
    'Collaborate at scale with shared assets and priority support.',
    ARRAY['Collaboration', 'Shared Assets', 'Priority Support', 'Unlimited Deployments', 'Role Management'],
    FALSE,
    'team_plan_test_id',
    'Contact Sales',
    3
  );


