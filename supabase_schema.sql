-- ==========================================
-- DataPact Hub - Initial Database Schema
-- Supabase PostgreSQL
-- ==========================================

-- 1. ENUMS (Custom Types)
CREATE TYPE user_role AS ENUM ('admin', 'data_owner', 'user');
CREATE TYPE asset_engine AS ENUM ('kafka', 'snowflake', 'postgresql', 'bigquery', 's3');
CREATE TYPE contract_status AS ENUM ('active', 'draft', 'deprecated');
CREATE TYPE request_status AS ENUM ('in_review', 'approved', 'rejected');

-- 2. TABLES

-- Users Extension (Links to Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    system_role user_role DEFAULT 'user'::user_role,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspaces (Organizations)
CREATE TABLE public.workspaces (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    default_timezone TEXT DEFAULT 'UTC',
    compliance_standard TEXT DEFAULT 'GDPR',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspace Members
CREATE TABLE public.workspace_members (
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role DEFAULT 'user'::user_role,
    PRIMARY KEY (workspace_id, user_id)
);

-- Domains (Product Areas like Analytics, Risk, Marketing)
CREATE TABLE public.domains (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    lead_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Assets (The physical data sources)
CREATE TABLE public.data_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES public.domains(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    technical_name TEXT NOT NULL, -- e.g. topic.analytics.v1
    engine asset_engine NOT NULL,
    environment TEXT DEFAULT 'production',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Contracts (The rules bound to an asset)
CREATE TABLE public.data_contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    asset_id UUID REFERENCES public.data_assets(id) ON DELETE CASCADE,
    version TEXT NOT NULL, -- e.g. 'v1.2.0'
    status contract_status DEFAULT 'draft'::contract_status,
    yaml_definition JSONB NOT NULL, -- Stores the compiled contract rules
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(asset_id, version)
);

-- Change Requests (Approvals / Pull Requests for contracts)
CREATE TABLE public.change_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_id UUID REFERENCES public.data_contracts(id) ON DELETE CASCADE,
    proposed_by UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    diff_summary JSONB, -- Stores the changes (ADDED, REMOVED, UNCHANGED)
    status request_status DEFAULT 'in_review'::request_status,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Observability & Violations Logs
CREATE TABLE public.observability_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    asset_id UUID REFERENCES public.data_assets(id) ON DELETE CASCADE,
    rule_violated TEXT NOT NULL, -- e.g. 'PII Violation: email'
    payload_sample JSONB,
    action_taken TEXT, -- e.g. 'Quarantined', 'Dropped'
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_assets ENABLE ROW LEVEL SECURITY;

-- Example: Users can only see assets in their workspace
CREATE POLICY "Users can view assets in their workspace" 
ON public.data_assets FOR SELECT 
USING (
    workspace_id IN (
        SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
);

-- Example: Only Admins and Data Owners can modify assets
CREATE POLICY "Only admins or owners can edit assets" 
ON public.data_assets FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.workspace_members 
        WHERE user_id = auth.uid() 
        AND workspace_id = data_assets.workspace_id 
        AND role IN ('admin', 'data_owner')
    )
);
