// ===== Core Domain Types =====

export type Subject =
  | "physics"
  | "chemistry"
  | "mathematics"
  | "biology"
  | "computer_science"
  | "electronics"
  | "mechanical"
  | "medicine"
  | "general";

export type ContentFormat =
  | "simulation"
  | "diagram"
  | "video"
  | "flowchart"
  | "quiz"
  | "text"
  | "animation";

export type QueryIntent =
  | "mechanism_explanation"
  | "concept_learning"
  | "problem_solving"
  | "comparison"
  | "real_world_connection"
  | "how_it_works";

export type Difficulty = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type ExamType = "cbse" | "jee_mains" | "jee_advanced" | "neet" | "general";

// ===== Query & Classification =====

export interface QueryClassification {
  intent: QueryIntent;
  subject: Subject;
  topics: string[];
  complexity: Difficulty;
  suggested_formats: ContentFormat[];
  real_world_device?: string;
  exam_relevance: ExamType[];
}

// ===== Lesson Content =====

export interface LessonSection {
  id: string;
  type: "hook" | "explanation" | "simulation" | "diagram" | "math" | "quiz" | "related";
  title: string;
  content: string; // markdown for text, HTML for simulation, JSON for quiz
  order: number;
}

export interface LessonResponse {
  id: string;
  query: string;
  title: string;
  classification: QueryClassification;
  sections: LessonSection[];
  created_at: string;
  cached: boolean;
}

// ===== Simulation =====

export interface SimulationConfig {
  id: string;
  title: string;
  engine: "p5js" | "threejs" | "d3";
  html_content: string;
  parameters: SimParameter[];
  topic_id?: string;
}

export interface SimParameter {
  name: string;
  label: string;
  type: "slider" | "toggle" | "select";
  min?: number;
  max?: number;
  step?: number;
  default_value: number | boolean | string;
}

// ===== Quiz =====

export interface QuizQuestion {
  id: string;
  type: "mcq" | "numerical" | "true_false" | "ordering";
  question: string;
  options?: string[];
  correct_answer: string | number;
  explanation: string;
  difficulty: Difficulty;
  hint?: string;
}

export interface QuizSet {
  topic: string;
  questions: QuizQuestion[];
}

// ===== Knowledge Graph =====

export interface TopicNode {
  id: string;
  title: string;
  subject: Subject;
  grade_levels: string[];
  prerequisites: string[];
  real_world_mappings: RealWorldMapping[];
  exam_relevance: Record<ExamType, { weight: "high" | "medium" | "low"; questions: number }>;
  difficulty_range: [Difficulty, Difficulty];
}

export interface RealWorldMapping {
  device: string;
  aspect: string;
  description: string;
}

// ===== User & Progress =====

export interface UserProfile {
  id: string;
  name: string;
  role: "student" | "teacher" | "admin";
  grade_level?: string;
  target_exam?: ExamType;
  learning_style: LearningStyle;
  avatar_config?: AvatarConfig;
  streak_days: number;
  total_xp: number;
  level: number;
}

export interface LearningStyle {
  visual: number;    // 0-1
  kinesthetic: number;
  analytical: number;
}

export interface AvatarConfig {
  sprite: string;
  accessories: string[];
  color_scheme: string;
}

export interface UserProgress {
  user_id: string;
  topic_id: string;
  mastery_score: number; // 0-1
  time_spent_seconds: number;
  attempts: number;
  last_interaction: string;
  quiz_scores: number[];
}

// ===== RPG World =====

export interface WorldZone {
  id: string;
  name: string;
  subject: Subject;
  description: string;
  unlock_requirement: { topic_id: string; mastery: number }[];
  npcs: NPC[];
  quests: Quest[];
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  zone_id: string;
  dialogue_style: "socratic" | "friendly" | "challenging";
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: "explanation" | "simulation_challenge" | "speed_quiz" | "boss_battle";
  topic_ids: string[];
  xp_reward: number;
  item_rewards: string[];
}

// ===== API Types =====

export interface LearnRequest {
  query: string;
  format_preference?: ContentFormat;
  grade_level?: string;
  target_exam?: ExamType;
  user_id?: string;
}

export interface SimulateRequest {
  topic: string;
  engine?: "p5js" | "threejs" | "d3";
  parameters?: Record<string, unknown>;
  context?: string;
}

export interface TutorMessage {
  role: "user" | "assistant";
  content: string;
  type?: "text" | "simulation_trigger" | "diagram" | "quiz";
}

// ===== Mock Test System =====

export type MockTestFormat = "jee_mains" | "jee_advanced" | "gate" | "neet" | "custom";
export type QuestionDifficulty = "easy" | "medium" | "hard" | "advanced";

export interface MockTestConfig {
  id: string;
  title: string;
  format: MockTestFormat;
  subjects: Subject[];
  totalQuestions: number;
  duration: number; // minutes
  sections: MockTestSection[];
  negativeMarking: boolean;
  markingScheme: MarkingScheme;
  source?: string; // e.g., "JEE Mains 2024 Jan Shift 1", "Allen DPP", "GATE 2023"
}

export interface MockTestSection {
  id: string;
  title: string;
  subject: Subject;
  questionCount: number;
  questionTypes: ("mcq" | "numerical" | "msq" | "assertion_reason" | "matrix_match" | "integer_type")[];
  markingScheme: MarkingScheme;
}

export interface MarkingScheme {
  correct: number;
  incorrect: number; // negative value for negative marking
  unattempted: number;
  partial?: number; // for MSQ in JEE Advanced
}

export interface MockTestQuestion {
  id: string;
  sectionId: string;
  type: "mcq" | "numerical" | "msq" | "assertion_reason" | "matrix_match" | "integer_type";
  question: string; // markdown with LaTeX
  options?: string[];
  correctAnswer: string | string[] | number; // string for MCQ, string[] for MSQ, number for numerical
  explanation: string;
  difficulty: QuestionDifficulty;
  subject: Subject;
  topic: string;
  subtopic?: string;
  source?: string; // "JEE Advanced 2022 Paper 1 Q14"
  marks: number;
  negativeMarks: number;
  hint?: string;
  solution_steps?: string[]; // Step-by-step solution
}

export interface MockTestAttempt {
  id: string;
  testId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  timeSpent: number; // seconds
  answers: Record<string, string | string[] | number | null>;
  markedForReview: string[]; // question IDs
  visitedQuestions: string[];
  score?: MockTestScore;
  status: "in_progress" | "submitted" | "timed_out";
}

export interface MockTestScore {
  total: number;
  maxTotal: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  sectionScores: Record<string, { score: number; max: number; correct: number; incorrect: number }>;
  percentile?: number;
  rank?: number;
  timeTaken: number; // seconds
  accuracy: number; // percentage
}

