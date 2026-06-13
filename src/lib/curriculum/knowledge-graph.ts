import { TopicNode, Subject } from "@/types";

// In-memory knowledge graph for quick lookups
// In production, this would be backed by a graph database or PostgreSQL

export const CURRICULUM_GRAPH: TopicNode[] = [
  {
    id: "physics_shm",
    title: "Simple Harmonic Motion",
    subject: "physics",
    grade_levels: ["class_11", "jee_mains"],
    prerequisites: ["physics_kinematics", "math_trigonometry"],
    real_world_mappings: [
      { device: "car_suspension", aspect: "spring_damper", description: "How shock absorbers use SHM to smooth rides" },
      { device: "pendulum_clock", aspect: "timekeeping", description: "How pendulums maintain precise time" },
      { device: "guitar_string", aspect: "vibration", description: "How strings produce musical notes" },
    ],
    exam_relevance: {
      cbse: { weight: "high", questions: 3 },
      jee_mains: { weight: "high", questions: 2 },
      jee_advanced: { weight: "medium", questions: 1 },
      neet: { weight: "low", questions: 0 },
      general: { weight: "medium", questions: 0 },
    },
    difficulty_range: [3, 7],
  },
  {
    id: "physics_em_induction",
    title: "Electromagnetic Induction",
    subject: "physics",
    grade_levels: ["class_12", "jee_mains", "jee_advanced"],
    prerequisites: ["physics_magnetism", "physics_electric_current"],
    real_world_mappings: [
      { device: "wireless_charger", aspect: "changing_flux", description: "How phones charge without wires" },
      { device: "electric_generator", aspect: "rotation_in_field", description: "How power plants generate electricity" },
      { device: "induction_cooktop", aspect: "eddy_currents", description: "How induction stoves heat pans" },
    ],
    exam_relevance: {
      cbse: { weight: "high", questions: 4 },
      jee_mains: { weight: "high", questions: 3 },
      jee_advanced: { weight: "high", questions: 2 },
      neet: { weight: "low", questions: 0 },
      general: { weight: "medium", questions: 0 },
    },
    difficulty_range: [4, 9],
  },
  {
    id: "cs_sorting",
    title: "Sorting Algorithms",
    subject: "computer_science",
    grade_levels: ["class_11", "class_12"],
    prerequisites: ["cs_arrays", "cs_loops"],
    real_world_mappings: [
      { device: "library_system", aspect: "arranging_books", description: "How libraries organize millions of books" },
      { device: "search_engine", aspect: "ranking_results", description: "How Google orders search results" },
      { device: "ecommerce", aspect: "price_sorting", description: "How Amazon sorts products by price" },
    ],
    exam_relevance: {
      cbse: { weight: "medium", questions: 2 },
      jee_mains: { weight: "low", questions: 0 },
      jee_advanced: { weight: "low", questions: 0 },
      neet: { weight: "low", questions: 0 },
      general: { weight: "high", questions: 0 },
    },
    difficulty_range: [2, 6],
  },
  {
    id: "bio_circulation",
    title: "Human Circulatory System",
    subject: "biology",
    grade_levels: ["class_11", "neet"],
    prerequisites: ["bio_cell_biology"],
    real_world_mappings: [
      { device: "plumbing_system", aspect: "pipes_and_pump", description: "How home plumbing mirrors blood vessels" },
      { device: "traffic_system", aspect: "flow_regulation", description: "How traffic signals work like heart valves" },
      { device: "delivery_network", aspect: "distribution", description: "How courier services mirror blood delivery" },
    ],
    exam_relevance: {
      cbse: { weight: "high", questions: 3 },
      jee_mains: { weight: "low", questions: 0 },
      jee_advanced: { weight: "low", questions: 0 },
      neet: { weight: "high", questions: 5 },
      general: { weight: "medium", questions: 0 },
    },
    difficulty_range: [3, 7],
  },
  {
    id: "chem_electrochemistry",
    title: "Electrochemistry",
    subject: "chemistry",
    grade_levels: ["class_12", "jee_mains", "neet"],
    prerequisites: ["chem_redox", "chem_solutions"],
    real_world_mappings: [
      { device: "lithium_battery", aspect: "galvanic_cell", description: "How phone batteries store and release energy" },
      { device: "electroplating", aspect: "electrolysis", description: "How chrome bumpers get their shiny coating" },
      { device: "rust_prevention", aspect: "corrosion", description: "How ships avoid rusting in saltwater" },
    ],
    exam_relevance: {
      cbse: { weight: "high", questions: 3 },
      jee_mains: { weight: "high", questions: 3 },
      jee_advanced: { weight: "medium", questions: 1 },
      neet: { weight: "medium", questions: 2 },
      general: { weight: "medium", questions: 0 },
    },
    difficulty_range: [4, 8],
  },
];

export function findTopicByQuery(query: string): TopicNode | undefined {
  const q = query.toLowerCase();
  return CURRICULUM_GRAPH.find(
    (t) =>
      q.includes(t.title.toLowerCase()) ||
      t.real_world_mappings.some((m) => q.includes(m.device.replace(/_/g, " ")))
  );
}

export function getTopicsBySubject(subject: Subject): TopicNode[] {
  return CURRICULUM_GRAPH.filter((t) => t.subject === subject);
}

export function getPrerequisites(topicId: string): TopicNode[] {
  const topic = CURRICULUM_GRAPH.find((t) => t.id === topicId);
  if (!topic) return [];
  return CURRICULUM_GRAPH.filter((t) => topic.prerequisites.includes(t.id));
}

export function getRelatedTopics(topicId: string): TopicNode[] {
  const topic = CURRICULUM_GRAPH.find((t) => t.id === topicId);
  if (!topic) return [];
  return CURRICULUM_GRAPH.filter(
    (t) => t.id !== topicId && t.subject === topic.subject
  ).slice(0, 5);
}
