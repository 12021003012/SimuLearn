// Maps keywords from learn topics to prebuilt simulation HTML paths in /public/simulations/
// Used to automatically embed relevant simulations inline on lesson pages.

export interface SimulationMapping {
  path: string; // relative to public/, served at root
  title: string;
  keywords: string[]; // topic keywords that match this simulation
}

export const PREBUILT_SIMULATIONS: SimulationMapping[] = [
  // Physics
  { path: "/simulations/physics/newtons-second-law.html", title: "Newton's Second Law — F = ma Lab", keywords: ["newton", "newton's second law", "second law", "F=ma", "force and acceleration", "net force", "force mass acceleration"] },
  { path: "/simulations/physics/projectile-motion.html", title: "Projectile Motion Simulator", keywords: ["projectile", "projectile motion", "kinematics", "trajectory", "launch angle", "parabolic motion"] },
  { path: "/simulations/physics/wave-interference.html", title: "Wave Interference Simulator", keywords: ["wave", "interference", "superposition", "waves", "standing wave", "constructive", "destructive"] },
  { path: "/simulations/physics/spring-mass-damper.html", title: "Spring-Mass-Damper System", keywords: ["spring", "oscillation", "SHM", "simple harmonic", "damping", "resonance", "mass-spring"] },
  { path: "/simulations/physics/lens-optics.html", title: "Lens Optics Simulator", keywords: ["lens", "optics", "refraction", "focal length", "convex lens", "concave lens", "ray optics", "image formation"] },
  { path: "/simulations/physics/electric-circuit.html", title: "Electric Circuit Simulator", keywords: ["circuit", "electric", "resistor", "ohm", "voltage", "current", "series", "parallel", "kirchhoff"] },
  // Math
  { path: "/simulations/math/integration-area.html", title: "Integration Area Visualizer", keywords: ["integration", "integral", "area under curve", "definite integral", "riemann", "calculus"] },
  { path: "/simulations/math/conic-sections.html", title: "Conic Sections Explorer", keywords: ["conic", "ellipse", "parabola", "hyperbola", "conic sections", "eccentricity"] },
  // CS
  { path: "/simulations/cs/sorting-algorithms.html", title: "Sorting Algorithms Visualizer", keywords: ["sorting", "bubble sort", "merge sort", "quick sort", "insertion sort", "algorithm", "comparison sort"] },
  { path: "/simulations/cs/dijkstra-pathfinding.html", title: "Dijkstra's Pathfinding", keywords: ["dijkstra", "pathfinding", "shortest path", "graph traversal", "weighted graph"] },
  { path: "/simulations/cs/binary-search-tree.html", title: "Binary Search Tree Visualizer", keywords: ["binary search tree", "BST", "tree traversal", "inorder", "preorder", "binary tree"] },
  // Chemistry
  { path: "/simulations/chemistry/molecular-orbital.html", title: "Molecular Orbital Viewer", keywords: ["molecular orbital", "MO theory", "bonding orbital", "antibonding", "HOMO", "LUMO"] },
  { path: "/simulations/chemistry/reaction-kinetics.html", title: "Reaction Kinetics Simulator", keywords: ["kinetics", "reaction rate", "rate constant", "activation energy", "arrhenius", "chemical kinetics"] },
  // Biology
  { path: "/simulations/biology/neuron-action-potential.html", title: "Neuron Action Potential", keywords: ["neuron", "action potential", "nerve impulse", "depolarization", "synapse", "sodium potassium"] },
  { path: "/simulations/biology/heart-circulation.html", title: "Heart & Circulation Model", keywords: ["heart", "circulation", "blood flow", "cardiac", "cardiovascular", "atrium", "ventricle"] },
  { path: "/simulations/biology/cell-division.html", title: "Cell Division Animation", keywords: ["mitosis", "meiosis", "cell division", "chromosome", "cell cycle", "cytokinesis"] },
];

/**
 * Find matching prebuilt simulations for a given topic/query string.
 * Returns all simulations where at least one keyword matches (case-insensitive).
 */
export function findMatchingSimulations(query: string): SimulationMapping[] {
  const lower = query.toLowerCase();
  return PREBUILT_SIMULATIONS.filter((sim) =>
    sim.keywords.some((kw) => lower.includes(kw.toLowerCase()))
  );
}
