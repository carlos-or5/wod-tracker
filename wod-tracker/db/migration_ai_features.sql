-- Migration: Agregar tablas y datos para análisis con IA
-- Ejecutar este script en la base de datos después de crear el schema.sql inicial

-- =========================================
-- TABLE: wod_analyses (análisis de IA)
-- =========================================
create table if not exists wod_analyses (
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

create index if not exists idx_wod_analyses_wod on wod_analyses(wod_id);
create index if not exists idx_wod_analyses_status on wod_analyses(status);

-- =========================================
-- TABLE: exercise_weights (pesos predeterminados por variante)
-- =========================================
create table if not exists exercise_weights (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references exercises(id) on delete cascade,
  difficulty difficulty_level not null,
  weight_kg text, -- ej: "60kg", "RX: 95kg / Escalado: 65kg"
  notes text,
  created_at timestamp default now(),
  unique(exercise_id, difficulty)
);

create index if not exists idx_exercise_weights_exercise on exercise_weights(exercise_id);

-- =========================================
-- AGREGAR EJERCICIOS FALTANTES
-- =========================================
insert into exercises (name, category) values
-- Gymnastics adicionales
('Strict Pull-ups', 'GYMNASTICS'),
('Kipping Pull-ups', 'GYMNASTICS'),
('Handstand Push-ups', 'GYMNASTICS'),
('Box Jumps', 'GYMNASTICS'),
('Dips', 'GYMNASTICS'),
('Muscle-ups', 'GYMNASTICS'),
('Toes to Bar', 'GYMNASTICS'),
('Burpees', 'GYMNASTICS'),
('Ring Dips', 'GYMNASTICS'),
-- Olympic Lifts adicionales
('Clean & Jerk', 'OLYMPIC'),
('Power Clean', 'OLYMPIC'),
('Hang Power Clean', 'OLYMPIC'),
('Power Snatch', 'OLYMPIC'),
('Hang Power Snatch', 'OLYMPIC'),
-- Strength adicionales
('Goblet Squat', 'STRENGTH'),
('Overhead Press', 'STRENGTH'),
('Bench Press', 'STRENGTH'),
('Weighted Dips', 'STRENGTH'),
('Split Jerk', 'STRENGTH'),
-- Cardio adicionales
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
('Bent-over Rows', 'OTHER')
on conflict (name) do nothing;

-- =========================================
-- Ejemplos de pesos predeterminados
-- =========================================
-- Puedes agregar pesos predeterminados por ejercicio y dificultad
-- insert into exercise_weights (exercise_id, difficulty, weight_kg) 
-- select id, 'RX' as difficulty, '60kg' from exercises where name = 'Clean'
-- on conflict do nothing;
