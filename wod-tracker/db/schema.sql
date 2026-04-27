-- =========================================
-- EXTENSIONS
-- =========================================
create extension if not exists "pgcrypto";

-- =========================================
-- ENUM TYPES
-- =========================================
create type wod_type as enum (
'AMRAP',
'EMOM',
'FOR_TIME',
'STRENGTH',
'ENDURANCE',
'CHIPPER',
'INTERVAL'
);

create type difficulty_level as enum (
'RX',
'SCALED',
'INTERMEDIATE'
);

create type exercise_category as enum (
'STRENGTH',
'GYMNASTICS',
'CARDIO',
'OLYMPIC',
'OTHER'
);

create type block_type as enum (
'STRENGTH',
'METCON'
);

-- =========================================
-- TABLE: exercises
-- =========================================
create table exercises (
id uuid primary key default gen_random_uuid(),
name text not null unique,
category exercise_category not null,
created_at timestamp default now()
);

-- =========================================
-- TABLE: wods (día completo)
-- =========================================
create table wods (
id uuid primary key default gen_random_uuid(),
date date not null unique,
title text,
description text,
is_endurance boolean default false,
image_url text,
created_at timestamp default now()
);

-- =========================================
-- TABLE: wod_blocks (fuerza / metcon)
-- =========================================
create table wod_blocks (
id uuid primary key default gen_random_uuid(),
wod_id uuid not null references wods(id) on delete cascade,
block_type block_type not null,
wod_type wod_type,
duration_minutes int,
notes text,
order_index int not null
);

-- =========================================
-- TABLE: wod_variants (RX / SCALED / INTERMEDIATE)
-- =========================================
create table wod_variants (
id uuid primary key default gen_random_uuid(),
wod_block_id uuid not null references wod_blocks(id) on delete cascade,
difficulty difficulty_level not null,
notes text,
created_at timestamp default now()
);

-- Evitar duplicados de dificultad por bloque
create unique index unique_wod_block_difficulty
on wod_variants (wod_block_id, difficulty);

-- =========================================
-- TABLE: wod_exercises
-- =========================================
create table wod_exercises (
id uuid primary key default gen_random_uuid(),
wod_variant_id uuid not null references wod_variants(id) on delete cascade,
exercise_id uuid references exercises(id),
order_index int not null,
reps int,
weight text,
distance text,
time_seconds int,
notes text
);

-- =========================================
-- TABLE: tags
-- =========================================
create table tags (
id uuid primary key default gen_random_uuid(),
name text unique not null
);

create table wod_tags (
wod_id uuid references wods(id) on delete cascade,
tag_id uuid references tags(id) on delete cascade,
primary key (wod_id, tag_id)
);

-- =========================================
-- INDEXES
-- =========================================
create index idx_wods_date on wods(date);
create index idx_exercises_name on exercises(name);
create index idx_wod_blocks_wod on wod_blocks(wod_id);
create index idx_wod_variants_block on wod_variants(wod_block_id);
create index idx_wod_exercises_variant on wod_exercises(wod_variant_id);

-- =========================================
-- TABLE: wod_analyses (análisis de IA)
-- =========================================
create table wod_analyses (
id uuid primary key default gen_random_uuid(),
wod_id uuid not null references wods(id) on delete cascade,
image_url text not null,
analysis_result jsonb, -- Resultado del análisis de IA
status text default 'pending', -- pending, confirmed, rejected
analyzed_at timestamp,
confirmed_at timestamp,
confirmed_by text,
created_at timestamp default now()
);

create index idx_wod_analyses_wod on wod_analyses(wod_id);
create index idx_wod_analyses_status on wod_analyses(status);

-- =========================================
-- TABLE: exercise_weights (pesos predeterminados por variante)
-- =========================================
create table exercise_weights (
id uuid primary key default gen_random_uuid(),
exercise_id uuid not null references exercises(id) on delete cascade,
difficulty difficulty_level not null,
weight_kg text, -- ej: "60kg", "RX: 95kg / Escalado: 65kg"
notes text,
created_at timestamp default now(),
unique(exercise_id, difficulty)
);

create index idx_exercise_weights_exercise on exercise_weights(exercise_id);

-- =========================================
-- SEED DATA (ejercicios completos)
-- =========================================
insert into exercises (name, category) values
-- Gymnastics
('Pull-ups', 'GYMNASTICS'),
('Strict Pull-ups', 'GYMNASTICS'),
('Kipping Pull-ups', 'GYMNASTICS'),
('Push-ups', 'GYMNASTICS'),
('Handstand Push-ups', 'GYMNASTICS'),
('Air Squats', 'GYMNASTICS'),
('Sit-ups', 'GYMNASTICS'),
('Box Jumps', 'GYMNASTICS'),
('Dips', 'GYMNASTICS'),
('Muscle-ups', 'GYMNASTICS'),
('Toes to Bar', 'GYMNASTICS'),
('Burpees', 'GYMNASTICS'),
('Ring Dips', 'GYMNASTICS'),
-- Olympic Lifts
('Thrusters', 'OLYMPIC'),
('Clean', 'OLYMPIC'),
('Clean & Jerk', 'OLYMPIC'),
('Snatch', 'OLYMPIC'),
('Power Clean', 'OLYMPIC'),
('Hang Power Clean', 'OLYMPIC'),
('Power Snatch', 'OLYMPIC'),
('Hang Power Snatch', 'OLYMPIC'),
-- Strength
('Deadlift', 'STRENGTH'),
('Back Squat', 'STRENGTH'),
('Front Squat', 'STRENGTH'),
('Goblet Squat', 'STRENGTH'),
('Overhead Press', 'STRENGTH'),
('Bench Press', 'STRENGTH'),
('Weighted Dips', 'STRENGTH'),
('Split Jerk', 'STRENGTH'),
-- Cardio
('Running', 'CARDIO'),
('Row', 'CARDIO'),
('Bike', 'CARDIO'),
('Double Unders', 'CARDIO'),
('Rope Skips', 'CARDIO'),
('Wall Balls', 'CARDIO'),
('KB Swings', 'CARDIO'),
('Farmer Carries', 'CARDIO'),
-- Other
('Medicine Ball Slams', 'OTHER'),
('Box Step-ups', 'OTHER'),
('Sled Push', 'OTHER'),
('Sled Drag', 'OTHER'),
('Kettlebell Snatches', 'OTHER'),
('Lat Pulldowns', 'OTHER'),
('Barbell Rows', 'OTHER'),
('Bent-over Rows', 'OTHER');

-- =========================================
-- OPTIONAL: TAGS BASE
-- =========================================
insert into tags (name) values
('ENDURANCE'),
('HERO'),
('STRENGTH_FOCUS'),
('GYMNASTICS_FOCUS');
