-- SQL for Supabase: create a table to store grades
create table if not exists grades (
  id bigint generated always as identity primary key,
  course text,
  grade numeric not null,
  credits numeric,
  created_at timestamptz default now()
);
