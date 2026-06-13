-- SimuLearn Database Schema
-- Run this in Supabase SQL Editor

-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- ===== Topics (Curriculum Knowledge Graph) =====
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subject TEXT NOT NULL CHECK (subject IN ('physics','chemistry','mathematics','biology','computer_science','history','geography','medicine','general')),
    grade_levels TEXT[] DEFAULT '{}',
    parent_topic_id UUID REFERENCES topics(id),
    prerequisites UUID[] DEFAULT '{}',
    real_world_tags TEXT[] DEFAULT '{}',
    difficulty_level INT CHECK (difficulty_level BETWEEN 1 AND 10),
    exam_relevance JSONB DEFAULT '{}',
    embedding VECTOR(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== Simulations =====
CREATE TABLE simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id),
    title TEXT NOT NULL,
    description TEXT,
    engine TEXT CHECK (engine IN ('p5js','threejs','d3','unity_webgl','phaser')),
    template_code TEXT,
    parameters JSONB DEFAULT '{}',
    thumbnail_url TEXT,
    difficulty INT CHECK (difficulty BETWEEN 1 AND 5),
    avg_engagement_score FLOAT DEFAULT 0,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== Users =====
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'student' CHECK (role IN ('student','teacher','admin')),
    grade_level TEXT,
    target_exam TEXT,
    learning_style JSONB DEFAULT '{"visual": 0.33, "kinesthetic": 0.33, "analytical": 0.34}',
    avatar_config JSONB DEFAULT '{}',
    streak_days INT DEFAULT 0,
    total_xp INT DEFAULT 0,
    level INT DEFAULT 1,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== User Progress =====
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id),
    mastery_score FLOAT DEFAULT 0 CHECK (mastery_score BETWEEN 0 AND 1),
    time_spent_seconds INT DEFAULT 0,
    attempts INT DEFAULT 0,
    quiz_scores FLOAT[] DEFAULT '{}',
    last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, topic_id)
);

-- ===== Generated Content Cache =====
CREATE TABLE generated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_hash TEXT UNIQUE NOT NULL,
    query_text TEXT NOT NULL,
    topic_id UUID REFERENCES topics(id),
    classification JSONB,
    sections JSONB NOT NULL,
    generation_model TEXT,
    quality_score FLOAT DEFAULT 0,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== Quizzes =====
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id),
    content_id UUID REFERENCES generated_content(id),
    questions JSONB NOT NULL,
    difficulty INT CHECK (difficulty BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== RPG World State =====
CREATE TABLE player_state (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_zone TEXT DEFAULT 'physics_plains',
    inventory JSONB DEFAULT '[]',
    active_quests UUID[] DEFAULT '{}',
    completed_quests UUID[] DEFAULT '{}',
    achievements TEXT[] DEFAULT '{}',
    world_config JSONB DEFAULT '{}'
);

-- ===== Quests =====
CREATE TABLE quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    zone TEXT NOT NULL,
    quest_type TEXT CHECK (quest_type IN ('explanation','simulation_challenge','speed_quiz','boss_battle')),
    topic_ids UUID[] DEFAULT '{}',
    xp_reward INT DEFAULT 10,
    item_rewards TEXT[] DEFAULT '{}',
    prerequisites UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== Indexes =====
CREATE INDEX idx_topics_subject ON topics(subject);
CREATE INDEX idx_topics_grade ON topics USING GIN(grade_levels);
CREATE INDEX idx_topics_real_world ON topics USING GIN(real_world_tags);
CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_progress_topic ON user_progress(topic_id);
CREATE INDEX idx_generated_hash ON generated_content(query_hash);
CREATE INDEX idx_simulations_topic ON simulations(topic_id);

-- ===== Seed Data: Core Topics =====
INSERT INTO topics (title, subject, grade_levels, real_world_tags, difficulty_level) VALUES
('Kinematics', 'physics', ARRAY['class_11','jee_mains'], ARRAY['car_motion','sports','rockets'], 3),
('Newton''s Laws of Motion', 'physics', ARRAY['class_11','jee_mains','jee_advanced'], ARRAY['car_engine','elevator','rocket_launch'], 4),
('Simple Harmonic Motion', 'physics', ARRAY['class_11','jee_mains'], ARRAY['car_suspension','pendulum_clock','guitar_string'], 5),
('Wave Optics', 'physics', ARRAY['class_12','jee_advanced'], ARRAY['anti_reflective_coating','hologram','fiber_optics'], 7),
('Electromagnetic Induction', 'physics', ARRAY['class_12','jee_mains'], ARRAY['wireless_charger','generator','metal_detector'], 6),
('Thermodynamics', 'physics', ARRAY['class_11','jee_mains','jee_advanced'], ARRAY['refrigerator','car_engine','power_plant'], 6),
('Sets and Functions', 'mathematics', ARRAY['class_11','jee_mains'], ARRAY['database_queries','venn_diagrams'], 2),
('Coordinate Geometry', 'mathematics', ARRAY['class_11','jee_mains'], ARRAY['gps_navigation','game_physics','satellite_orbit'], 4),
('Calculus - Differentiation', 'mathematics', ARRAY['class_12','jee_mains','jee_advanced'], ARRAY['speed_measurement','optimization','growth_rate'], 6),
('Calculus - Integration', 'mathematics', ARRAY['class_12','jee_mains','jee_advanced'], ARRAY['area_calculation','volume_measurement','probability'], 7),
('Complex Numbers', 'mathematics', ARRAY['class_11','jee_advanced'], ARRAY['ac_circuits','signal_processing','fractals'], 6),
('Electrochemistry', 'chemistry', ARRAY['class_12','jee_mains','neet'], ARRAY['battery','electroplating','corrosion'], 5),
('Chemical Kinetics', 'chemistry', ARRAY['class_12','jee_mains'], ARRAY['food_preservation','enzyme_catalysis','combustion'], 5),
('Organic Chemistry - Reactions', 'chemistry', ARRAY['class_12','jee_advanced'], ARRAY['medicine_synthesis','polymer_production','perfumes'], 8),
('Coordination Compounds', 'chemistry', ARRAY['class_12','jee_advanced'], ARRAY['hemoglobin','chlorophyll','catalysts'], 7),
('Cell Biology', 'biology', ARRAY['class_11','neet'], ARRAY['cell_phone_analogy','factory_systems'], 3),
('Plant Physiology', 'biology', ARRAY['class_11','neet'], ARRAY['irrigation','agriculture','transpiration'], 4),
('Human Anatomy - Circulatory', 'biology', ARRAY['class_11','neet'], ARRAY['plumbing_system','pump_mechanics'], 5),
('Human Anatomy - Nervous System', 'biology', ARRAY['class_12','neet'], ARRAY['electrical_wiring','internet_network','computer'], 6),
('Genetics and Evolution', 'biology', ARRAY['class_12','neet'], ARRAY['family_tree','breeding','dna_testing'], 6),
('Sorting Algorithms', 'computer_science', ARRAY['class_11','class_12'], ARRAY['library_books','playing_cards','warehouse'], 3),
('Graph Theory', 'computer_science', ARRAY['class_12','jee_advanced'], ARRAY['social_networks','maps','logistics'], 5),
('Neural Networks & AI', 'computer_science', ARRAY['general'], ARRAY['face_recognition','recommendation','self_driving'], 6),
('Data Structures', 'computer_science', ARRAY['class_12'], ARRAY['file_system','browser_history','undo_system'], 4),
('Ancient Civilizations', 'history', ARRAY['class_11'], ARRAY['architecture','trade_routes','writing_systems'], 3),
('World Wars', 'history', ARRAY['class_12'], ARRAY['technology','geopolitics','economics'], 5),
('Plate Tectonics', 'geography', ARRAY['class_11'], ARRAY['earthquakes','mountains','volcanoes'], 4),
('Climate and Weather', 'geography', ARRAY['class_11'], ARRAY['forecasting','agriculture','aviation'], 4),
('Renal System', 'medicine', ARRAY['neet'], ARRAY['dialysis_machine','water_filter','chemical_plant'], 6),
('Cardiovascular System', 'medicine', ARRAY['neet'], ARRAY['pump','pipes','pressure_system'], 5);
