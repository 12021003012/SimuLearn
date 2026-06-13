/**
 * Pre-built curriculum data — JEE (Main + Advanced), B.Tech, MBBS, AI/ML.
 * Chapter lists are curated — NO AI needed to browse.
 * Each chapter slug is used as the /learn/[slug] query.
 */

export interface Chapter {
  id: string;
  title: string;
  description: string;
  slug: string;
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedMin: number;
  hasSimulation: boolean;
}

export interface ChapterGroup {
  title: string;
  chapters: Chapter[];
}

export interface SubjectCurriculum {
  subject: string;
  label: string;
  emoji: string;
  color: string;
  tagline: string;
  groups: ChapterGroup[];
}

export const CURRICULUM: Record<string, SubjectCurriculum> = {
  physics: {
    subject: "physics",
    label: "Physics",
    emoji: "⚛️",
    color: "blue",
    tagline: "From mechanics to modern physics — complete JEE & NEET syllabus",
    groups: [
      {
        title: "Mechanics (Class 11)",
        chapters: [
          { id: "p1", title: "Units & Measurements", description: "Dimensions, dimensional analysis, errors in measurement, significant figures", slug: "Units and measurements dimensional analysis errors significant figures", tags: ["JEE Main", "NEET"], difficulty: 1, estimatedMin: 12, hasSimulation: false },
          { id: "p2", title: "Kinematics — Motion in 1D", description: "Position-time graphs, equations of motion, free fall, relative velocity", slug: "Kinematics motion in straight line equations of motion free fall", tags: ["JEE Main", "NEET"], difficulty: 2, estimatedMin: 15, hasSimulation: true },
          { id: "p3", title: "Kinematics — Motion in 2D", description: "Projectile motion, uniform circular motion, relative velocity in 2D", slug: "Projectile motion circular motion relative velocity 2D kinematics", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 20, hasSimulation: true },
          { id: "p4", title: "Newton's Laws of Motion", description: "First, second, third law, inertial frames, friction, pseudo forces", slug: "Newton's laws of motion friction inertial frames pseudo forces", tags: ["JEE Main", "NEET"], difficulty: 2, estimatedMin: 18, hasSimulation: true },
          { id: "p5", title: "Work, Energy & Power", description: "Work-energy theorem, KE, PE, conservative forces, power, collisions", slug: "Work energy power theorem conservative forces collisions physics", tags: ["JEE Main", "NEET"], difficulty: 3, estimatedMin: 20, hasSimulation: true },
          { id: "p6", title: "Rotational Motion", description: "Torque, moment of inertia, angular momentum, rolling motion, parallel axes", slug: "Rotational motion torque moment of inertia angular momentum rolling", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
          { id: "p7", title: "Centre of Mass & System of Particles", description: "Centre of mass, linear momentum conservation, variable mass systems", slug: "Centre of mass system of particles linear momentum conservation", tags: ["JEE Advanced"], difficulty: 4, estimatedMin: 22, hasSimulation: true },
          { id: "p8", title: "Gravitation", description: "Universal law, acceleration due to gravity, orbital mechanics, escape velocity, Kepler's laws", slug: "Gravitation escape velocity orbital mechanics Kepler's laws satellites", tags: ["JEE Main", "NEET"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
        ],
      },
      {
        title: "Properties of Matter & Fluid Mechanics (Class 11)",
        chapters: [
          { id: "p9", title: "Elasticity & Stress-Strain", description: "Hooke's law, Young's/Bulk/Shear modulus, stress-strain curves", slug: "Elasticity stress strain Hooke's law Young's modulus bulk modulus", tags: ["JEE Main"], difficulty: 2, estimatedMin: 15, hasSimulation: true },
          { id: "p10", title: "Fluid Mechanics", description: "Pascal's law, Archimedes, Bernoulli's theorem, viscosity, surface tension", slug: "Fluid mechanics Pascal Archimedes Bernoulli viscosity surface tension", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 25, hasSimulation: true },
        ],
      },
      {
        title: "Thermal Physics (Class 11)",
        chapters: [
          { id: "p11", title: "Thermal Expansion & Calorimetry", description: "Linear, area, volume expansion, heat transfer, specific heat capacity", slug: "Thermal expansion calorimetry heat transfer specific heat conduction", tags: ["JEE Main"], difficulty: 2, estimatedMin: 15, hasSimulation: true },
          { id: "p12", title: "Thermodynamics", description: "Zeroth, First, Second law, Carnot engine, entropy, reversible processes", slug: "Thermodynamics first law second law Carnot cycle entropy heat engines", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
          { id: "p13", title: "Kinetic Theory of Gases", description: "Ideal gas, RMS speed, degrees of freedom, equipartition of energy", slug: "Kinetic theory of gases ideal gas RMS speed equipartition energy", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 20, hasSimulation: true },
        ],
      },
      {
        title: "Oscillations & Waves (Class 11)",
        chapters: [
          { id: "p14", title: "Simple Harmonic Motion", description: "SHM equations, energy, phase, simple pendulum, spring-mass system", slug: "Simple harmonic motion SHM pendulum springs energy oscillations", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
          { id: "p15", title: "Forced & Damped Oscillations", description: "Damping, resonance, forced oscillations, Q-factor", slug: "Damped forced oscillations resonance Q-factor vibration physics", tags: ["JEE Advanced"], difficulty: 4, estimatedMin: 20, hasSimulation: true },
          { id: "p16", title: "Wave Motion & Superposition", description: "Transverse/longitudinal waves, standing waves, harmonics, beats, Doppler effect", slug: "Wave motion superposition standing waves harmonics beats Doppler effect", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
        ],
      },
      {
        title: "Electrostatics (Class 12)",
        chapters: [
          { id: "p17", title: "Electric Charges & Coulomb's Law", description: "Charge quantization, Coulomb's law, superposition, electric field lines", slug: "Electric charges Coulomb's law superposition electric field lines", tags: ["JEE Main", "NEET"], difficulty: 3, estimatedMin: 18, hasSimulation: true },
          { id: "p18", title: "Electric Potential & Gauss's Law", description: "Potential, potential energy, Gauss's law applications, flux", slug: "Electric potential Gauss's law electric flux potential energy", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 25, hasSimulation: true },
          { id: "p19", title: "Capacitance & Dielectrics", description: "Parallel plate, series/parallel combinations, energy stored, dielectrics", slug: "Capacitance capacitor dielectrics energy stored series parallel", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 20, hasSimulation: true },
        ],
      },
      {
        title: "Current Electricity (Class 12)",
        chapters: [
          { id: "p20", title: "Ohm's Law & DC Circuits", description: "Resistance, Kirchhoff's laws, Wheatstone bridge, cells, drift velocity", slug: "Ohm's law Kirchhoff's laws DC circuits Wheatstone bridge drift velocity", tags: ["JEE Main", "NEET"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
          { id: "p21", title: "Heating Effect & Electrical Energy", description: "Joule heating, power, fuse, electrical instruments", slug: "Heating effect of current electrical energy power Joule's law", tags: ["JEE Main"], difficulty: 2, estimatedMin: 15, hasSimulation: true },
        ],
      },
      {
        title: "Magnetism & EMI (Class 12)",
        chapters: [
          { id: "p22", title: "Magnetic Effects of Current", description: "Biot-Savart law, Ampere's law, solenoid, force on wire, galvanometer", slug: "Magnetic effects current Biot-Savart Ampere's law solenoid force", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 25, hasSimulation: true },
          { id: "p23", title: "Magnetism & Magnetic Materials", description: "Magnetic dipole, Earth's field, para/dia/ferromagnetism, hysteresis", slug: "Magnetism magnetic materials ferromagnetism hysteresis dipole", tags: ["JEE Main"], difficulty: 3, estimatedMin: 18, hasSimulation: false },
          { id: "p24", title: "Electromagnetic Induction", description: "Faraday's law, Lenz's law, motional EMF, eddy currents, inductance", slug: "Electromagnetic induction Faraday's law Lenz's law EMF inductance", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 25, hasSimulation: true },
          { id: "p25", title: "Alternating Current", description: "AC circuits, RLC, impedance, resonance, power factor, transformers", slug: "Alternating current AC circuits RLC resonance impedance transformers", tags: ["JEE Main"], difficulty: 4, estimatedMin: 25, hasSimulation: true },
          { id: "p26", title: "Electromagnetic Waves", description: "Maxwell's equations, displacement current, EM spectrum, properties", slug: "Electromagnetic waves Maxwell equations EM spectrum displacement current", tags: ["JEE Main", "NEET"], difficulty: 2, estimatedMin: 15, hasSimulation: false },
        ],
      },
      {
        title: "Optics (Class 12)",
        chapters: [
          { id: "p27", title: "Ray Optics — Reflection & Refraction", description: "Mirrors, lenses, prism, total internal reflection, optical instruments", slug: "Ray optics reflection refraction lenses prism total internal reflection", tags: ["JEE Main", "NEET"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
          { id: "p28", title: "Wave Optics", description: "Huygens' principle, Young's double-slit, diffraction, polarization", slug: "Wave optics YDSE interference diffraction polarization Huygens", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 25, hasSimulation: true },
        ],
      },
      {
        title: "Modern Physics (Class 12)",
        chapters: [
          { id: "p29", title: "Dual Nature of Radiation & Matter", description: "Photoelectric effect, Einstein's equation, de Broglie wavelength", slug: "Photoelectric effect Einstein equation de Broglie wavelength dual nature", tags: ["JEE Main", "NEET"], difficulty: 3, estimatedMin: 18, hasSimulation: true },
          { id: "p30", title: "Atoms — Bohr Model", description: "Rutherford's experiment, Bohr model, hydrogen spectrum, energy levels", slug: "Bohr model hydrogen spectrum energy levels Rutherford scattering", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 20, hasSimulation: true },
          { id: "p31", title: "Nuclear Physics", description: "Nuclear fission, fusion, mass defect, binding energy, radioactivity", slug: "Nuclear physics fission fusion binding energy radioactivity decay", tags: ["JEE Main", "NEET"], difficulty: 4, estimatedMin: 22, hasSimulation: true },
          { id: "p32", title: "Semiconductor Devices", description: "p-n junction, diodes, transistors, logic gates", slug: "Semiconductors p-n junction diode transistor logic gates electronics", tags: ["JEE Main", "NEET"], difficulty: 3, estimatedMin: 20, hasSimulation: true },
        ],
      },
    ],
  },

  chemistry: {
    subject: "chemistry",
    label: "Chemistry",
    emoji: "🧪",
    color: "green",
    tagline: "Physical, Inorganic & Organic — complete JEE & NEET chemistry",
    groups: [
      {
        title: "Physical Chemistry — Foundation (Class 11)",
        chapters: [
          { id: "c1", title: "Some Basic Concepts of Chemistry", description: "Mole concept, molar mass, stoichiometry, empirical & molecular formulas", slug: "Basic concepts chemistry mole concept stoichiometry molar mass", tags: ["JEE Main", "NEET"], difficulty: 2, estimatedMin: 15, hasSimulation: false },
          { id: "c2", title: "Atomic Structure", description: "Bohr's model, quantum numbers, orbitals, Aufbau principle, Hund's rule", slug: "Atomic structure quantum numbers orbitals Aufbau Hund's rule electron configuration", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
          { id: "c3", title: "States of Matter — Gases", description: "Ideal gas equation, kinetic molecular theory, real gases, van der Waals", slug: "States of matter gases ideal gas equation kinetic theory van der Waals", tags: ["JEE Advanced"], difficulty: 3, estimatedMin: 18, hasSimulation: true },
          { id: "c4", title: "Chemical Thermodynamics", description: "Enthalpy, entropy, Gibbs free energy, Hess's law, bond energy", slug: "Chemical thermodynamics enthalpy entropy Gibbs free energy Hess's law", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 28, hasSimulation: false },
          { id: "c5", title: "Chemical Equilibrium", description: "Law of mass action, Kp, Kc, Le Chatelier's principle, ICE tables", slug: "Chemical equilibrium mass action Kp Kc Le Chatelier principle ICE", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
          { id: "c6", title: "Ionic Equilibrium", description: "pH, buffer solutions, solubility product, common ion effect, Henderson equation", slug: "Ionic equilibrium pH buffer Henderson equation solubility product Ksp", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 25, hasSimulation: false },
        ],
      },
      {
        title: "Physical Chemistry — Applied (Class 12)",
        chapters: [
          { id: "c7", title: "Solutions & Colligative Properties", description: "Raoult's law, Henry's law, osmotic pressure, boiling/freezing point changes", slug: "Solutions colligative properties Raoult's law osmotic pressure boiling point", tags: ["JEE Main", "NEET"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
          { id: "c8", title: "Electrochemistry", description: "Galvanic cells, Nernst equation, electrolysis, molar conductivity, Kohlrausch", slug: "Electrochemistry Nernst equation galvanic cell electrolysis conductivity", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
          { id: "c9", title: "Chemical Kinetics", description: "Rate laws, order, molecularity, Arrhenius equation, half-life, activation energy", slug: "Chemical kinetics rate law order Arrhenius equation half life activation", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
          { id: "c10", title: "Surface Chemistry", description: "Adsorption, colloids, emulsions, catalysis, Langmuir isotherm", slug: "Surface chemistry adsorption colloids catalysis Langmuir isotherm", tags: ["JEE Advanced"], difficulty: 3, estimatedMin: 18, hasSimulation: false },
        ],
      },
      {
        title: "Inorganic Chemistry (Class 11 & 12)",
        chapters: [
          { id: "c11", title: "Periodic Table & Periodicity", description: "Modern periodic law, trends in atomic/ionic radii, IE, EA, electronegativity", slug: "Periodic table periodicity atomic radius ionization energy electronegativity", tags: ["JEE Main", "NEET"], difficulty: 2, estimatedMin: 18, hasSimulation: false },
          { id: "c12", title: "Chemical Bonding & Molecular Structure", description: "Ionic, covalent bonding, VSEPR, hybridization, MOT, hydrogen bonding", slug: "Chemical bonding VSEPR hybridization molecular orbital theory MOT", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
          { id: "c13", title: "s-Block Elements", description: "Alkali and alkaline earth metals, properties, compounds, diagonal relationship", slug: "s-block elements alkali alkaline earth metals compounds diagonal", tags: ["JEE Advanced", "NEET"], difficulty: 2, estimatedMin: 18, hasSimulation: false },
          { id: "c14", title: "p-Block Elements (Groups 13-18)", description: "General trends, anomalous properties, key compounds of B, C, N, O, halogens", slug: "p-block elements groups 13-18 boron carbon nitrogen oxygen halogens", tags: ["JEE Main", "NEET"], difficulty: 3, estimatedMin: 30, hasSimulation: false },
          { id: "c15", title: "d-Block & f-Block Elements", description: "Transition metals, oxidation states, colour, catalytic properties, lanthanoid contraction", slug: "d-block f-block transition metals oxidation states lanthanoid contraction", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 25, hasSimulation: false },
          { id: "c16", title: "Coordination Compounds", description: "Werner's theory, ligands, IUPAC naming, isomerism, VBT, CFT", slug: "Coordination compounds Werner theory ligands CFT crystal field isomerism", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
          { id: "c17", title: "Metallurgy & Isolation of Elements", description: "Ores, extraction methods, thermodynamic principles, electrochemical extraction", slug: "Metallurgy extraction of metals ores thermodynamic Ellingham diagram", tags: ["JEE Advanced"], difficulty: 3, estimatedMin: 20, hasSimulation: false },
        ],
      },
      {
        title: "Organic Chemistry — Fundamentals (Class 11)",
        chapters: [
          { id: "c18", title: "General Organic Chemistry (GOC)", description: "Hybridization, isomerism, inductive/resonance effects, carbocations, radicals", slug: "General organic chemistry GOC inductive resonance hyperconjugation carbocation", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 25, hasSimulation: false },
          { id: "c19", title: "Hydrocarbons", description: "Alkanes, alkenes, alkynes, aromatic — EAS, Friedel-Crafts, Markovnikov's rule", slug: "Hydrocarbons alkanes alkenes alkynes aromatic EAS Friedel-Crafts", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 25, hasSimulation: false },
          { id: "c20", title: "Stereochemistry & Isomerism", description: "Geometrical, optical isomerism, chirality, R/S configuration, E/Z nomenclature", slug: "Stereochemistry optical isomerism chirality R S configuration E Z", tags: ["JEE Advanced"], difficulty: 4, estimatedMin: 22, hasSimulation: true },
        ],
      },
      {
        title: "Organic Chemistry — Functional Groups (Class 12)",
        chapters: [
          { id: "c21", title: "Haloalkanes & Haloarenes", description: "SN1, SN2 mechanisms, elimination reactions, Grignard reagent", slug: "Haloalkanes haloarenes SN1 SN2 elimination Grignard reagent reactions", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 22, hasSimulation: false },
          { id: "c22", title: "Alcohols, Phenols & Ethers", description: "Preparation, properties, reactions, acidity comparison, Williamson synthesis", slug: "Alcohols phenols ethers Williamson synthesis acidity reactions", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 22, hasSimulation: false },
          { id: "c23", title: "Aldehydes, Ketones & Carboxylic Acids", description: "Nucleophilic addition, Aldol, Cannizzaro, hell-Volhard-Zelinsky", slug: "Aldehydes ketones carboxylic acids Aldol Cannizzaro nucleophilic addition", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 28, hasSimulation: false },
          { id: "c24", title: "Amines & Diazonium Salts", description: "Classification, basicity, Gabriel synthesis, coupling reactions", slug: "Amines diazonium salts basicity Gabriel synthesis coupling reactions", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 22, hasSimulation: false },
          { id: "c25", title: "Biomolecules", description: "Carbohydrates, proteins, DNA/RNA, vitamins, enzymes", slug: "Biomolecules carbohydrates proteins DNA RNA nucleic acids vitamins", tags: ["JEE Main", "NEET"], difficulty: 2, estimatedMin: 20, hasSimulation: false },
          { id: "c26", title: "Polymers & Chemistry in Everyday Life", description: "Addition/condensation polymers, drugs, food chemistry", slug: "Polymers addition condensation drugs chemistry in everyday life", tags: ["JEE Main", "NEET"], difficulty: 2, estimatedMin: 15, hasSimulation: false },
        ],
      },
    ],
  },

  mathematics: {
    subject: "mathematics",
    label: "Mathematics",
    emoji: "📐",
    color: "purple",
    tagline: "Algebra, Calculus, Coordinate Geometry & more — JEE complete syllabus",
    groups: [
      {
        title: "Algebra (Class 11 & 12)",
        chapters: [
          { id: "m1", title: "Sets, Relations & Functions", description: "Types of sets, Venn diagrams, relations, one-to-one, onto, composite functions", slug: "Sets relations functions types Venn diagrams one-to-one onto composite", tags: ["JEE Main"], difficulty: 2, estimatedMin: 18, hasSimulation: false },
          { id: "m2", title: "Complex Numbers", description: "Argand diagram, modulus, argument, De Moivre's theorem, roots of unity", slug: "Complex numbers Argand diagram modulus argument De Moivre theorem", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
          { id: "m3", title: "Quadratic Equations", description: "Discriminant, nature of roots, Vieta's formulas, graph of quadratics", slug: "Quadratic equations discriminant roots Vieta's formulas parabola graph", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 20, hasSimulation: true },
          { id: "m4", title: "Permutations & Combinations", description: "Counting principle, arrangements, selections, derangements, multinomial", slug: "Permutations combinations counting principle derangements selections", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 22, hasSimulation: false },
          { id: "m5", title: "Binomial Theorem", description: "General term, middle term, properties of binomial coefficients", slug: "Binomial theorem general term middle term coefficients expansion", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 18, hasSimulation: false },
          { id: "m6", title: "Sequences & Series", description: "AP, GP, HP, AGP, telescoping series, summation techniques", slug: "Sequences series AP GP HP AGP telescoping summation techniques", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 22, hasSimulation: false },
          { id: "m7", title: "Matrices & Determinants", description: "Operations, inverse, adjoint, Cramer's rule, system of equations", slug: "Matrices determinants inverse adjoint Cramer's rule linear equations", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 25, hasSimulation: false },
        ],
      },
      {
        title: "Trigonometry (Class 11)",
        chapters: [
          { id: "m8", title: "Trigonometric Functions & Identities", description: "All identities, compound angles, multiple angles, T-ratios", slug: "Trigonometric functions identities compound angles multiple double half", tags: ["JEE Main"], difficulty: 2, estimatedMin: 20, hasSimulation: true },
          { id: "m9", title: "Trigonometric Equations", description: "General solutions, auxiliary angle method, parametric equations", slug: "Trigonometric equations general solutions auxiliary angle method", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 18, hasSimulation: false },
          { id: "m10", title: "Inverse Trigonometric Functions", description: "Domain, range, principal values, properties, composition", slug: "Inverse trigonometric functions domain range principal values properties", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 20, hasSimulation: true },
        ],
      },
      {
        title: "Coordinate Geometry (Class 11 & 12)",
        chapters: [
          { id: "m11", title: "Straight Lines", description: "Slopes, equations, angle between lines, distance from point to line, family of lines", slug: "Straight lines slope equation angle distance family concurrent", tags: ["JEE Main"], difficulty: 2, estimatedMin: 18, hasSimulation: true },
          { id: "m12", title: "Circles", description: "Standard/general forms, tangent, normal, radical axis, family of circles", slug: "Circle equation tangent normal radical axis family of circles", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
          { id: "m13", title: "Parabola", description: "Standard forms, parametric, tangent, normal, focal chord properties", slug: "Parabola standard form parametric tangent normal focal chord", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 25, hasSimulation: true },
          { id: "m14", title: "Ellipse & Hyperbola", description: "Standard forms, eccentricity, tangent, normal, asymptotes, director circle", slug: "Ellipse hyperbola eccentricity tangent normal asymptotes director circle", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
        ],
      },
      {
        title: "Calculus (Class 12)",
        chapters: [
          { id: "m15", title: "Limits & Continuity", description: "L'Hôpital's rule, sandwich theorem, algebra of limits, types of discontinuity", slug: "Limits continuity L'Hopital sandwich theorem types of discontinuity", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
          { id: "m16", title: "Differentiation", description: "Chain rule, implicit, parametric, logarithmic differentiation, higher-order", slug: "Differentiation chain rule implicit parametric logarithmic higher order", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 22, hasSimulation: false },
          { id: "m17", title: "Application of Derivatives", description: "Tangent/normal, maxima/minima, monotonicity, Rolle's theorem, LMVT", slug: "Application derivatives tangent normal maxima minima Rolle's theorem LMVT", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
          { id: "m18", title: "Indefinite Integration", description: "Substitution, by parts, partial fractions, special integrals, reduction formulas", slug: "Indefinite integration substitution by parts partial fractions reduction", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 28, hasSimulation: false },
          { id: "m19", title: "Definite Integration & Area", description: "Fundamental theorem, properties, area under curves, bounded regions", slug: "Definite integration area under curves fundamental theorem bounded", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
          { id: "m20", title: "Differential Equations", description: "Order, degree, separation, homogeneous, linear first-order, exact", slug: "Differential equations order degree separation homogeneous linear exact", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 25, hasSimulation: false },
        ],
      },
      {
        title: "Vectors & 3D Geometry (Class 12)",
        chapters: [
          { id: "m21", title: "Vector Algebra", description: "Dot product, cross product, scalar triple product, vector triple product", slug: "Vector algebra dot product cross product scalar triple product", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
          { id: "m22", title: "3D Geometry", description: "Direction cosines, line/plane equations, angle between planes, shortest distance", slug: "3D geometry direction cosines line plane equations shortest distance", tags: ["JEE Main", "JEE Advanced"], difficulty: 4, estimatedMin: 25, hasSimulation: true },
        ],
      },
      {
        title: "Probability & Statistics",
        chapters: [
          { id: "m23", title: "Statistics", description: "Mean, median, mode, variance, standard deviation, grouped data", slug: "Statistics mean median mode variance standard deviation grouped data", tags: ["JEE Main"], difficulty: 2, estimatedMin: 15, hasSimulation: false },
          { id: "m24", title: "Probability", description: "Conditional probability, Bayes' theorem, random variables, distributions", slug: "Probability Bayes theorem conditional random variables distributions", tags: ["JEE Main", "JEE Advanced"], difficulty: 3, estimatedMin: 22, hasSimulation: false },
        ],
      },
    ],
  },

  biology: {
    subject: "biology",
    label: "Biology",
    emoji: "🧬",
    color: "emerald",
    tagline: "Cell biology to ecology — complete NEET & CBSE biology",
    groups: [
      {
        title: "Cell Biology & Biomolecules (Class 11)",
        chapters: [
          { id: "b1", title: "Cell Structure & Organelles", description: "Prokaryotic vs eukaryotic, membrane, nucleus, ER, mitochondria, chloroplasts", slug: "Cell structure organelles prokaryotic eukaryotic membrane nucleus ER", tags: ["NEET", "CBSE"], difficulty: 2, estimatedMin: 20, hasSimulation: true },
          { id: "b2", title: "Cell Division — Mitosis & Meiosis", description: "Cell cycle, mitosis stages, meiosis I & II, crossing over, significance", slug: "Cell division mitosis meiosis cell cycle crossing over significance", tags: ["NEET", "CBSE"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
          { id: "b3", title: "Biomolecules", description: "Carbohydrates, proteins, lipids, nucleic acids, enzymes", slug: "Biomolecules carbohydrates proteins lipids nucleic acids enzymes biology", tags: ["NEET", "CBSE"], difficulty: 2, estimatedMin: 18, hasSimulation: false },
        ],
      },
      {
        title: "Plant Biology (Class 11)",
        chapters: [
          { id: "b4", title: "Photosynthesis", description: "Light reactions, Calvin cycle, C3/C4/CAM plants, factors affecting", slug: "Photosynthesis light reactions Calvin cycle C3 C4 CAM chloroplast", tags: ["NEET", "CBSE"], difficulty: 3, estimatedMin: 25, hasSimulation: true },
          { id: "b5", title: "Plant Respiration", description: "Glycolysis, Krebs cycle, ETC, fermentation, respiratory quotient", slug: "Plant respiration glycolysis Krebs cycle electron transport chain", tags: ["NEET"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
          { id: "b6", title: "Transport in Plants", description: "Xylem, phloem, transpiration, water potential, mineral nutrition", slug: "Transport in plants xylem phloem transpiration water potential minerals", tags: ["NEET"], difficulty: 3, estimatedMin: 20, hasSimulation: true },
        ],
      },
      {
        title: "Human Physiology (Class 11 & 12)",
        chapters: [
          { id: "b7", title: "Digestive System", description: "GI tract, enzymes, absorption, liver functions, disorders", slug: "Human digestive system GI tract enzymes absorption liver pancreas", tags: ["NEET", "CBSE"], difficulty: 2, estimatedMin: 20, hasSimulation: false },
          { id: "b8", title: "Cardiovascular System", description: "Heart anatomy, cardiac cycle, blood groups, ECG, blood vessels", slug: "Cardiovascular system heart cardiac cycle blood groups ECG vessels", tags: ["NEET", "CBSE"], difficulty: 3, estimatedMin: 25, hasSimulation: true },
          { id: "b9", title: "Respiratory System", description: "Breathing mechanics, gas exchange, oxygen dissociation curve, disorders", slug: "Respiratory system breathing gas exchange oxygen dissociation curve", tags: ["NEET", "CBSE"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
          { id: "b10", title: "Nervous System", description: "Neuron, synapse, reflex arc, brain anatomy, sensory reception", slug: "Nervous system neuron synapse reflex arc brain anatomy senses", tags: ["NEET", "CBSE"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
          { id: "b11", title: "Excretory System", description: "Kidney structure, nephron, urine formation, osmoregulation", slug: "Excretory system kidney nephron urine formation osmoregulation", tags: ["NEET", "CBSE"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
        ],
      },
      {
        title: "Genetics & Evolution (Class 12)",
        chapters: [
          { id: "b12", title: "Molecular Basis of Inheritance", description: "DNA replication, transcription, translation, gene expression, lac operon", slug: "DNA replication transcription translation gene expression lac operon", tags: ["NEET", "CBSE"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
          { id: "b13", title: "Mendelian Genetics", description: "Laws of inheritance, monohybrid, dihybrid crosses, incomplete dominance", slug: "Mendelian genetics inheritance monohybrid dihybrid incomplete dominance", tags: ["NEET", "CBSE"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
          { id: "b14", title: "Evolution", description: "Darwin's theory, natural selection, speciation, Hardy-Weinberg equilibrium", slug: "Evolution Darwin natural selection speciation Hardy-Weinberg adaptive radiation", tags: ["NEET"], difficulty: 3, estimatedMin: 22, hasSimulation: false },
          { id: "b15", title: "Biotechnology & Applications", description: "Recombinant DNA, PCR, gene cloning, GMOs, gene therapy", slug: "Biotechnology recombinant DNA PCR gene cloning GMO gene therapy", tags: ["NEET", "CBSE"], difficulty: 3, estimatedMin: 22, hasSimulation: false },
        ],
      },
      {
        title: "Ecology (Class 12)",
        chapters: [
          { id: "b16", title: "Ecology & Ecosystem", description: "Food chains, energy flow, ecological pyramids, biogeochemical cycles", slug: "Ecosystem biodiversity food chain energy flow ecological pyramids cycles", tags: ["NEET", "CBSE"], difficulty: 2, estimatedMin: 18, hasSimulation: true },
          { id: "b17", title: "Human Reproduction", description: "Male/female reproductive system, gametogenesis, menstrual cycle, ART", slug: "Human reproduction gametogenesis menstrual cycle embryology ART", tags: ["NEET", "CBSE"], difficulty: 3, estimatedMin: 22, hasSimulation: false },
        ],
      },
    ],
  },

  computer_science: {
    subject: "computer_science",
    label: "Computer Science & AI",
    emoji: "💻",
    color: "orange",
    tagline: "B.Tech CSE complete roadmap — from programming to AI/ML & LLMs",
    groups: [
      {
        title: "Programming Fundamentals (Easy)",
        chapters: [
          { id: "cs1", title: "Programming Basics — C/C++/Python", description: "Variables, loops, conditionals, functions, recursion, I/O", slug: "Programming basics C C++ Python variables loops functions recursion", tags: ["B.Tech", "Foundation"], difficulty: 1, estimatedMin: 15, hasSimulation: true },
          { id: "cs2", title: "Object-Oriented Programming", description: "Classes, inheritance, polymorphism, encapsulation, abstraction, SOLID", slug: "Object oriented programming OOP classes inheritance polymorphism SOLID", tags: ["B.Tech", "Foundation"], difficulty: 2, estimatedMin: 20, hasSimulation: false },
          { id: "cs3", title: "Discrete Mathematics", description: "Set theory, logic, graph theory, combinatorics, relations", slug: "Discrete mathematics set theory logic graph theory combinatorics relations", tags: ["B.Tech", "GATE"], difficulty: 2, estimatedMin: 22, hasSimulation: false },
          { id: "cs4", title: "Web Technologies Basics", description: "HTML5, CSS3, JavaScript, DOM manipulation, responsive design", slug: "Web development HTML CSS JavaScript DOM responsive design basics", tags: ["B.Tech", "Foundation"], difficulty: 1, estimatedMin: 18, hasSimulation: true },
        ],
      },
      {
        title: "Data Structures & Algorithms (Moderate)",
        chapters: [
          { id: "cs5", title: "Arrays, Strings & Linked Lists", description: "Array operations, string algorithms, singly/doubly linked lists", slug: "Arrays strings linked lists operations traversal reversal algorithms", tags: ["B.Tech", "GATE", "DSA"], difficulty: 2, estimatedMin: 22, hasSimulation: true },
          { id: "cs6", title: "Stacks, Queues & Hashing", description: "Stack/Queue implementations, priority queue, hash tables, collision handling", slug: "Stacks queues hashing priority queue hash tables collision resolution", tags: ["B.Tech", "GATE", "DSA"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
          { id: "cs7", title: "Trees & Binary Search Trees", description: "BST operations, AVL trees, Red-Black, segment trees, Trie", slug: "Trees BST AVL Red-Black segment tree Trie binary tree traversal", tags: ["B.Tech", "GATE", "DSA"], difficulty: 3, estimatedMin: 25, hasSimulation: true },
          { id: "cs8", title: "Graphs & Graph Algorithms", description: "BFS, DFS, shortest path (Dijkstra), MST (Kruskal, Prim), topological sort", slug: "Graphs BFS DFS Dijkstra shortest path MST Kruskal Prim topological sort", tags: ["B.Tech", "GATE", "DSA"], difficulty: 4, estimatedMin: 30, hasSimulation: true },
          { id: "cs9", title: "Dynamic Programming", description: "Memoization, tabulation, knapsack, LCS, LIS, matrix chain, coin change", slug: "Dynamic programming memoization tabulation knapsack LCS LIS optimization", tags: ["B.Tech", "GATE", "DSA"], difficulty: 4, estimatedMin: 30, hasSimulation: true },
          { id: "cs10", title: "Sorting & Searching", description: "Merge sort, quick sort, heap sort, binary search, time complexity analysis", slug: "Sorting algorithms merge sort quick sort heap sort binary search complexity", tags: ["B.Tech", "GATE", "DSA"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
        ],
      },
      {
        title: "Systems & Architecture (Moderate)",
        chapters: [
          { id: "cs11", title: "Database Management Systems", description: "ER diagrams, normalization, SQL, transactions ACID, indexing", slug: "DBMS database SQL normalization ER diagrams transactions ACID indexing", tags: ["B.Tech", "GATE"], difficulty: 3, estimatedMin: 25, hasSimulation: false },
          { id: "cs12", title: "Operating Systems", description: "Process scheduling, deadlocks, memory management, paging, virtual memory", slug: "Operating systems process scheduling deadlocks paging virtual memory", tags: ["B.Tech", "GATE"], difficulty: 3, estimatedMin: 28, hasSimulation: true },
          { id: "cs13", title: "Computer Networks", description: "OSI/TCP-IP models, routing protocols, HTTP, DNS, sockets, security", slug: "Computer networks OSI TCP IP routing HTTP DNS sockets network security", tags: ["B.Tech", "GATE"], difficulty: 3, estimatedMin: 28, hasSimulation: true },
          { id: "cs14", title: "Computer Organization", description: "CPU pipeline, cache mapping, ALU design, memory hierarchy", slug: "Computer organization architecture CPU pipeline cache ALU memory hierarchy", tags: ["B.Tech", "GATE"], difficulty: 3, estimatedMin: 25, hasSimulation: true },
        ],
      },
      {
        title: "Advanced CS (Year 3-4)",
        chapters: [
          { id: "cs15", title: "Theory of Computation", description: "DFA, NFA, regular expressions, CFGs, Turing machines, decidability", slug: "Theory of computation DFA NFA regular expressions CFG PDA Turing machine", tags: ["B.Tech", "GATE"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
          { id: "cs16", title: "Compiler Design", description: "Lexical analysis, parsing (LL/LR), syntax trees, code generation", slug: "Compiler design lexical analysis parsing LL LR syntax tree code generation", tags: ["B.Tech", "GATE"], difficulty: 5, estimatedMin: 30, hasSimulation: false },
          { id: "cs17", title: "Cloud Computing & Distributed Systems", description: "Virtualization, microservices, consensus, CAP theorem", slug: "Cloud computing distributed systems microservices consensus CAP theorem", tags: ["B.Tech"], difficulty: 4, estimatedMin: 25, hasSimulation: false },
          { id: "cs18", title: "Cybersecurity & Cryptography", description: "Encryption (AES, RSA), hashing, digital signatures, OWASP", slug: "Cybersecurity cryptography AES RSA encryption hashing digital signatures", tags: ["B.Tech"], difficulty: 4, estimatedMin: 25, hasSimulation: false },
        ],
      },
      {
        title: "Machine Learning & AI",
        chapters: [
          { id: "cs19", title: "ML Fundamentals", description: "Supervised/unsupervised learning, regression, classification, evaluation", slug: "Machine learning fundamentals supervised unsupervised regression classification", tags: ["B.Tech", "AI/ML"], difficulty: 3, estimatedMin: 25, hasSimulation: true },
          { id: "cs20", title: "Neural Networks & Deep Learning", description: "Perceptrons, backpropagation, activation functions, optimizers", slug: "Neural networks deep learning backpropagation activation functions optimizers", tags: ["B.Tech", "AI/ML"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
          { id: "cs21", title: "CNNs & Computer Vision", description: "Convolution, pooling, ResNet, object detection, segmentation", slug: "CNN convolutional neural network computer vision ResNet object detection", tags: ["B.Tech", "AI/ML"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
          { id: "cs22", title: "Transformers & LLM Architecture", description: "Self-attention, multi-head attention, BERT, GPT, positional encoding", slug: "Transformers LLM architecture self-attention BERT GPT positional encoding", tags: ["AI/ML", "Advanced"], difficulty: 5, estimatedMin: 35, hasSimulation: true },
          { id: "cs23", title: "NLP & Text Processing", description: "Tokenization, embeddings, Word2Vec, fine-tuning, text generation", slug: "NLP natural language processing tokenization embeddings Word2Vec generation", tags: ["B.Tech", "AI/ML"], difficulty: 4, estimatedMin: 28, hasSimulation: false },
          { id: "cs24", title: "LLM Training & Alignment", description: "Pre-training, RLHF, DPO, SFT, LoRA, quantization, prompt engineering", slug: "LLM training alignment RLHF DPO SFT LoRA quantization prompt engineering", tags: ["AI/ML", "Advanced"], difficulty: 5, estimatedMin: 35, hasSimulation: false },
          { id: "cs25", title: "RAG & AI Agents", description: "Retrieval-augmented generation, vector databases, tool-use, multi-agent", slug: "RAG retrieval augmented generation vector database AI agents tool-use ReAct", tags: ["AI/ML", "Advanced"], difficulty: 5, estimatedMin: 30, hasSimulation: false },
        ],
      },
    ],
  },

  electronics: {
    subject: "electronics",
    label: "Electronics & Communication",
    emoji: "⚡",
    color: "cyan",
    tagline: "B.Tech ECE — circuits, signals, VLSI, communications & embedded",
    groups: [
      {
        title: "Circuit Analysis & Devices (Foundation)",
        chapters: [
          { id: "ec1", title: "Network Analysis", description: "KVL, KCL, Thevenin, Norton, Superposition, transient response", slug: "Network analysis KVL KCL Thevenin Norton superposition transient AC", tags: ["B.Tech", "GATE"], difficulty: 2, estimatedMin: 22, hasSimulation: true },
          { id: "ec2", title: "Electronic Devices", description: "PN junction, BJT, FET, MOSFET biasing, characteristics", slug: "Electronic devices PN junction BJT FET MOSFET biasing characteristics", tags: ["B.Tech", "GATE"], difficulty: 3, estimatedMin: 25, hasSimulation: true },
          { id: "ec3", title: "Digital Electronics", description: "Boolean algebra, K-maps, combinational/sequential circuits, flip-flops", slug: "Digital electronics Boolean K-map combinational sequential flip-flops counters", tags: ["B.Tech", "GATE"], difficulty: 2, estimatedMin: 22, hasSimulation: true },
          { id: "ec4", title: "Analog Circuits & Op-Amps", description: "Op-amp circuits, differential amplifier, feedback, oscillators", slug: "Analog circuits Op-Amp feedback oscillators power amplifiers differential", tags: ["B.Tech", "GATE"], difficulty: 3, estimatedMin: 25, hasSimulation: true },
        ],
      },
      {
        title: "Signals & Communications (Moderate)",
        chapters: [
          { id: "ec5", title: "Signals & Systems", description: "LTI systems, convolution, Fourier/Laplace/Z-transform, sampling", slug: "Signals systems LTI convolution Fourier Laplace Z-transform sampling", tags: ["B.Tech", "GATE"], difficulty: 3, estimatedMin: 28, hasSimulation: true },
          { id: "ec6", title: "Control Systems", description: "Transfer function, Bode/Nyquist plots, root locus, PID", slug: "Control systems transfer function Bode Nyquist root locus PID stability", tags: ["B.Tech", "GATE"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
          { id: "ec7", title: "Communication Systems", description: "AM/FM modulation, PCM, digital modulation (ASK, FSK, PSK), noise", slug: "Communication systems AM FM modulation PCM digital ASK FSK PSK noise", tags: ["B.Tech", "GATE"], difficulty: 3, estimatedMin: 25, hasSimulation: true },
          { id: "ec8", title: "Electromagnetic Theory", description: "Maxwell's equations, wave propagation, transmission lines", slug: "Electromagnetic theory Maxwell equations wave propagation transmission lines", tags: ["B.Tech", "GATE"], difficulty: 4, estimatedMin: 25, hasSimulation: true },
        ],
      },
      {
        title: "Advanced ECE (Year 3-4)",
        chapters: [
          { id: "ec9", title: "Digital Signal Processing", description: "DFT, FFT, FIR/IIR filter design, windowing, spectral analysis", slug: "Digital signal processing DSP DFT FFT FIR IIR filter design windowing", tags: ["B.Tech", "GATE"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
          { id: "ec10", title: "Microprocessors & Embedded Systems", description: "ARM architecture, assembly programming, interfacing, RTOS", slug: "Microprocessors embedded systems ARM assembly interfacing RTOS", tags: ["B.Tech"], difficulty: 3, estimatedMin: 25, hasSimulation: false },
          { id: "ec11", title: "VLSI Design", description: "CMOS technology, logic gates layout, Verilog/VHDL", slug: "VLSI design CMOS technology logic layout Verilog VHDL propagation delay", tags: ["B.Tech"], difficulty: 5, estimatedMin: 30, hasSimulation: true },
          { id: "ec12", title: "Antennas & Satellite Communication", description: "Radiation patterns, antenna arrays, radar, satellite links", slug: "Antennas satellite communication radiation patterns arrays radar GPS", tags: ["B.Tech"], difficulty: 4, estimatedMin: 25, hasSimulation: true },
        ],
      },
    ],
  },

  mechanical: {
    subject: "mechanical",
    label: "Mechanical Engineering",
    emoji: "⚙️",
    color: "slate",
    tagline: "B.Tech ME — mechanics, thermodynamics, manufacturing, fluid dynamics",
    groups: [
      {
        title: "Foundation (Year 1-2)",
        chapters: [
          { id: "me1", title: "Engineering Mechanics", description: "Coplanar forces, free body diagrams, friction, trusses, dynamics", slug: "Engineering mechanics forces free body diagrams friction trusses dynamics", tags: ["B.Tech", "GATE"], difficulty: 2, estimatedMin: 22, hasSimulation: true },
          { id: "me2", title: "Material Science & Metallurgy", description: "Crystal structures, phase diagrams, iron-carbon diagram, heat treatment", slug: "Material science metallurgy crystal structures phase diagrams heat treatment", tags: ["B.Tech", "GATE"], difficulty: 2, estimatedMin: 20, hasSimulation: false },
          { id: "me3", title: "Strength of Materials", description: "Stress-strain, bending moment, shear force diagrams, deflection, torsion", slug: "Strength of materials stress strain bending moment shear force torsion", tags: ["B.Tech", "GATE"], difficulty: 3, estimatedMin: 25, hasSimulation: true },
        ],
      },
      {
        title: "Core Subjects (Moderate)",
        chapters: [
          { id: "me4", title: "Thermodynamics", description: "Laws of thermodynamics, Rankine/Otto/Diesel cycles, refrigeration", slug: "Thermodynamics laws Rankine Otto Diesel cycle refrigeration entropy ME", tags: ["B.Tech", "GATE"], difficulty: 3, estimatedMin: 28, hasSimulation: true },
          { id: "me5", title: "Fluid Mechanics", description: "Bernoulli, boundary layer, turbulent flow, pumps, dimensional analysis", slug: "Fluid mechanics Bernoulli boundary layer turbulent flow pumps ME", tags: ["B.Tech", "GATE"], difficulty: 3, estimatedMin: 28, hasSimulation: true },
          { id: "me6", title: "Kinematics & Dynamics of Machines", description: "Mechanisms, gears, cams, flywheels, governors, balancing", slug: "Kinematics dynamics machines mechanisms gears cams flywheels governors", tags: ["B.Tech", "GATE"], difficulty: 3, estimatedMin: 25, hasSimulation: true },
          { id: "me7", title: "Manufacturing Technology", description: "Casting, forming, welding, machining, CNC programming", slug: "Manufacturing technology casting welding machining CNC turning milling", tags: ["B.Tech", "GATE"], difficulty: 3, estimatedMin: 25, hasSimulation: true },
        ],
      },
      {
        title: "Advanced Topics (Year 3-4)",
        chapters: [
          { id: "me8", title: "Heat & Mass Transfer", description: "Conduction, convection, radiation, heat exchangers, Fick's law", slug: "Heat mass transfer conduction convection radiation heat exchangers fins", tags: ["B.Tech", "GATE"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
          { id: "me9", title: "Mechanical Vibrations", description: "Free/forced vibrations, damping, resonance, vibration isolation", slug: "Mechanical vibrations free forced damping SDOF MDOF isolation resonance", tags: ["B.Tech", "GATE"], difficulty: 4, estimatedMin: 25, hasSimulation: true },
          { id: "me10", title: "Turbomachinery", description: "Pelton wheel, Francis/Kaplan turbines, centrifugal pumps, compressors", slug: "Turbomachinery Pelton Francis Kaplan turbines centrifugal pumps compressors", tags: ["B.Tech", "GATE"], difficulty: 4, estimatedMin: 25, hasSimulation: true },
          { id: "me11", title: "Robotics & Industrial Automation", description: "Robot kinematics, CIM, FMS, PLC programming, Industry 4.0", slug: "Robotics automation CIM FMS PLC programming Industry 4.0 kinematics", tags: ["B.Tech"], difficulty: 4, estimatedMin: 25, hasSimulation: true },
        ],
      },
    ],
  },

  medicine: {
    subject: "medicine",
    label: "Medical Science (MBBS)",
    emoji: "🏥",
    color: "red",
    tagline: "Complete MBBS curriculum — Pre-clinical through Clinical rotations",
    groups: [
      {
        title: "Phase 1: Human Anatomy",
        chapters: [
          { id: "med1", title: "Upper & Lower Limb Anatomy", description: "Muscles, nerves, blood vessels, joints of all limbs", slug: "Upper lower limb anatomy muscles nerves vessels joints shoulder hip", tags: ["MBBS Phase 1"], difficulty: 3, estimatedMin: 28, hasSimulation: false },
          { id: "med2", title: "Thorax & Abdomen", description: "Heart, lungs, diaphragm, GI tract, liver, kidney gross anatomy", slug: "Thorax abdomen anatomy heart lungs GI tract liver kidney gross", tags: ["MBBS Phase 1"], difficulty: 3, estimatedMin: 28, hasSimulation: true },
          { id: "med3", title: "Head, Neck & Neuroanatomy", description: "Cranial nerves, brain regions, spinal cord, neck triangles", slug: "Head neck neuroanatomy cranial nerves brain spinal cord neck triangles", tags: ["MBBS Phase 1"], difficulty: 4, estimatedMin: 30, hasSimulation: true },
          { id: "med4", title: "Histology & Embryology", description: "Microscopic tissues, fetal development, congenital anomalies", slug: "Histology embryology microscopic tissues fetal development anomalies", tags: ["MBBS Phase 1"], difficulty: 3, estimatedMin: 25, hasSimulation: true },
        ],
      },
      {
        title: "Phase 1: Physiology & Biochemistry",
        chapters: [
          { id: "med5", title: "Cardiovascular Physiology", description: "Cardiac cycle, ECG, blood pressure regulation, hemodynamics", slug: "Cardiovascular physiology cardiac cycle ECG blood pressure hemodynamics", tags: ["MBBS Phase 1"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
          { id: "med6", title: "Respiratory & Renal Physiology", description: "Gas exchange, ventilation-perfusion, nephron, GFR, acid-base", slug: "Respiratory renal physiology gas exchange nephron GFR acid-base balance", tags: ["MBBS Phase 1"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
          { id: "med7", title: "Neurophysiology", description: "Action potentials, synaptic transmission, CNS functions, reflexes", slug: "Neurophysiology action potentials synapse CNS reflexes EEG brain functions", tags: ["MBBS Phase 1"], difficulty: 4, estimatedMin: 30, hasSimulation: true },
          { id: "med8", title: "Metabolism & Molecular Biology", description: "Glycolysis, Krebs cycle, amino acid metabolism, DNA/RNA biology", slug: "Metabolism molecular biology glycolysis Krebs cycle DNA RNA biochemistry", tags: ["MBBS Phase 1"], difficulty: 4, estimatedMin: 28, hasSimulation: true },
        ],
      },
      {
        title: "Phase 2: Pathology & Microbiology",
        chapters: [
          { id: "med9", title: "General & Systemic Pathology", description: "Cell injury, inflammation, neoplasia, organ-specific pathology", slug: "General systemic pathology cell injury inflammation neoplasia cancer", tags: ["MBBS Phase 2"], difficulty: 3, estimatedMin: 28, hasSimulation: false },
          { id: "med10", title: "Hematology", description: "Anemia, leukemia, coagulation disorders, blood transfusion", slug: "Hematology anemia leukemia coagulation disorders blood transfusion", tags: ["MBBS Phase 2"], difficulty: 3, estimatedMin: 25, hasSimulation: false },
          { id: "med11", title: "Microbiology & Immunology", description: "Bacteriology, virology, parasitology, immune response, vaccines", slug: "Microbiology immunology bacteriology virology parasitology vaccines", tags: ["MBBS Phase 2"], difficulty: 3, estimatedMin: 28, hasSimulation: true },
        ],
      },
      {
        title: "Phase 2: Pharmacology",
        chapters: [
          { id: "med12", title: "General Pharmacology", description: "Pharmacokinetics, pharmacodynamics, drug-receptor interactions", slug: "General pharmacology pharmacokinetics pharmacodynamics drug receptors dose", tags: ["MBBS Phase 2"], difficulty: 3, estimatedMin: 25, hasSimulation: true },
          { id: "med13", title: "Systemic Pharmacology", description: "ANS, CVS, CNS drugs, antimicrobials, chemotherapy, ADRs", slug: "Systemic pharmacology ANS CVS CNS drugs antimicrobials chemotherapy ADR", tags: ["MBBS Phase 2"], difficulty: 4, estimatedMin: 30, hasSimulation: false },
        ],
      },
      {
        title: "Phase 3: Community Medicine & Forensics",
        chapters: [
          { id: "med14", title: "Epidemiology & Preventive Medicine", description: "Disease transmission, biostatistics, national health programs", slug: "Epidemiology preventive medicine disease transmission biostatistics", tags: ["MBBS Phase 3"], difficulty: 3, estimatedMin: 25, hasSimulation: false },
          { id: "med15", title: "Forensic Medicine & Toxicology", description: "Medical jurisprudence, autopsy, cause of death, poisoning", slug: "Forensic medicine toxicology autopsy cause of death poisoning legal", tags: ["MBBS Phase 3"], difficulty: 3, estimatedMin: 25, hasSimulation: false },
          { id: "med16", title: "ENT & Ophthalmology", description: "Ear/nose/throat diseases, eye anatomy, cataracts, glaucoma", slug: "ENT ophthalmology ear nose throat cataracts glaucoma refractive errors", tags: ["MBBS Phase 3"], difficulty: 3, estimatedMin: 22, hasSimulation: true },
        ],
      },
      {
        title: "Phase 4: Clinical Medicine & Surgery",
        chapters: [
          { id: "med17", title: "General Medicine", description: "Cardiology, pulmonology, gastroenterology, nephrology, neurology", slug: "General medicine internal cardiology pulmonology gastroenterology nephrology", tags: ["MBBS Phase 4"], difficulty: 4, estimatedMin: 35, hasSimulation: false },
          { id: "med18", title: "General Surgery", description: "Appendicitis, hernias, trauma, burns, orthopedics, anesthesia", slug: "General surgery appendicitis hernias trauma burns orthopedics anesthesia", tags: ["MBBS Phase 4"], difficulty: 4, estimatedMin: 30, hasSimulation: false },
          { id: "med19", title: "Obstetrics & Gynecology", description: "Antenatal care, labor, postpartum, gynecological disorders", slug: "Obstetrics gynecology antenatal labor postpartum gynecological disorders", tags: ["MBBS Phase 4"], difficulty: 4, estimatedMin: 30, hasSimulation: false },
          { id: "med20", title: "Pediatrics", description: "Neonatal care, developmental milestones, childhood diseases, nutrition", slug: "Pediatrics neonatal care developmental milestones childhood diseases nutrition", tags: ["MBBS Phase 4"], difficulty: 3, estimatedMin: 28, hasSimulation: false },
        ],
      },
    ],
  },
};

export function getSubjectCurriculum(subject: string): SubjectCurriculum | null {
  return CURRICULUM[subject] ?? null;
}

export function getAllChapters(subject: string): Chapter[] {
  const curr = CURRICULUM[subject];
  if (!curr) return [];
  return curr.groups.flatMap((g) => g.chapters);
}

export function getAllSubjects(): SubjectCurriculum[] {
  return Object.values(CURRICULUM);
}

export function searchChapters(query: string): Array<Chapter & { subject: string }> {
  const q = query.toLowerCase();
  const results: Array<Chapter & { subject: string } & { _score: number }> = [];
  for (const [subject, curr] of Object.entries(CURRICULUM)) {
    for (const group of curr.groups) {
      for (const chapter of group.chapters) {
        const score =
          (chapter.title.toLowerCase().includes(q) ? 3 : 0) +
          (chapter.description.toLowerCase().includes(q) ? 2 : 0) +
          (chapter.slug.toLowerCase().includes(q) ? 1 : 0) +
          (chapter.tags.some((t) => t.toLowerCase().includes(q)) ? 1 : 0);
        if (score > 0) {
          results.push({ ...chapter, subject, _score: score });
        }
      }
    }
  }
  results.sort((a, b) => b._score - a._score);
  return results.slice(0, 20);
}

export function getTotalStats() {
  let totalChapters = 0;
  let totalSimulations = 0;
  for (const curr of Object.values(CURRICULUM)) {
    for (const group of curr.groups) {
      totalChapters += group.chapters.length;
      totalSimulations += group.chapters.filter((c) => c.hasSimulation).length;
    }
  }
  return { totalChapters, totalSimulations, totalSubjects: Object.keys(CURRICULUM).length };
}
