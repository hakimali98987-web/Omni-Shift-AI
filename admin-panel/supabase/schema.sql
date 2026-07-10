-- ============================================================================
-- Omni Shift AI — Admin Panel Supabase schema
-- Run this once in the Supabase SQL editor (or via `supabase db push`).
-- ============================================================================

create extension if not exists pgcrypto;

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  icon text not null default 'sparkles',
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text not null default '',
  description text not null default '',
  full_description text not null default '',
  category_id uuid references categories (id) on delete set null,
  pricing text not null default 'Free' check (pricing in ('Free', 'Freemium', 'Paid')),
  website_url text not null default '',
  tags text[] not null default '{}',
  features text[] not null default '{}',
  pros text[] not null default '{}',
  cons text[] not null default '{}',
  -- Array of { "question": string, "answer": string }
  faq jsonb not null default '[]',
  featured boolean not null default false,
  trending boolean not null default false,
  rating double precision not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tools_category_id_idx on tools (category_id);
create index if not exists tools_featured_idx on tools (featured) where featured = true;
create index if not exists tools_trending_idx on tools (trending) where trending = true;

-- Keep updated_at current on every write.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists tools_set_updated_at on tools;
create trigger tools_set_updated_at
  before update on tools
  for each row
  execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- The admin panel writes through the service role key (server-only, bypasses
-- RLS), so these policies only need to allow public read access for the
-- public-facing directory site. Adjust to taste once you wire this schema to
-- the main site's data source too.
-- ----------------------------------------------------------------------------
alter table categories enable row level security;
alter table tools enable row level security;

drop policy if exists "Public read categories" on categories;
create policy "Public read categories" on categories for select using (true);

drop policy if exists "Public read tools" on tools;
create policy "Public read tools" on tools for select using (true);

-- Seed a couple of categories so the "Add Tool" form has options immediately.
insert into categories (slug, name, icon, description) values
  ('writing-content', 'Writing & Content', 'pen-line', 'AI writing assistants and content generators'),
  ('image-generation', 'Image Generation', 'image', 'Text-to-image and creative visual tools'),
  ('coding', 'Coding', 'code-2', 'AI pair programmers and coding assistants'),
  ('productivity', 'Productivity', 'zap', 'AI tools that streamline daily workflows')
on conflict (slug) do nothing;
