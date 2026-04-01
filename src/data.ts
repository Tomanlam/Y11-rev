export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface Vocab {
  term: string;
  definition: string;
  traditional: string;
  simplified: string;
}

export interface Unit {
  id: number;
  title: string;
  description: string;
  color: string;
  concepts: string[];
  vocab: Vocab[];
  questions: Question[];
}

export const units: Unit[] = [
  {
    id: 1,
    title: "States of matter",
    description: "Understanding solids, liquids, gases and their changes of state.",
    color: "bg-emerald-500",
    concepts: [
      "Matter exists in three common states: solid (s), liquid (l), gas (g). The same substance can exist in different states under different conditions.",
      "Particle model comparisons: Solids (closely packed, regular arrangement, vibrate), Liquids (close, random arrangement, move/slide), Gases (far apart, random, rapid motion).",
      "State changes happen by putting energy in (heating - endothermic) or taking energy out (cooling - exothermic).",
      "Names of state changes: Melting (s→l), Freezing (l→s), Boiling/Evaporating (l→g), Condensing (g→l), Sublimation (s→g), Deposition (g→s).",
      "Temperature is a measure of the average kinetic energy (KE) of particles. Higher temperature means faster particle motion.",
      "Heating/cooling curves: Temperature stays constant during state changes (melting/boiling) as energy is used to overcome attractions between particles.",
      "Predicting state: A substance is solid below its melting point, liquid between melting and boiling points, and gas above its boiling point.",
      "Kinetic molecular theory (KMT): Gas particles are in constant random motion; pressure is caused by collisions with container walls.",
      "Gas behavior: Decreasing volume or increasing temperature increases collision frequency and thus increases pressure.",
      "Diffusion: Net movement of particles from high to low concentration. It occurs in liquids and gases but not solids.",
      "Factors affecting diffusion: Rate increases with higher temperature (more KE) and lower relative molecular mass (lighter particles move faster).",
      "NH3 and HCl experiment: NH3 (Mr=17) diffuses faster than HCl (Mr=36.5), so the white ammonium chloride ring forms closer to the HCl end."
    ],
    vocab: [
      { term: "Matter", traditional: "物質", simplified: "物质", definition: "Anything that has mass and occupies space." },
      { term: "Solid", traditional: "固體", simplified: "固体", definition: "State with fixed shape and fixed volume." },
      { term: "Liquid", traditional: "液體", simplified: "液体", definition: "State with fixed volume but variable shape (takes the shape of its container)." },
      { term: "Gas", traditional: "氣體", simplified: "气体", definition: "State with variable shape and variable volume (fills its container)." },
      { term: "Particle model", traditional: "微粒模型", simplified: "微粒模型", definition: "Explanation of states of matter using particles, their arrangement, spacing, and motion." },
      { term: "Arrangement", traditional: "排列", simplified: "排列", definition: "How particles are positioned (regular in solids; random in liquids/gases)." },
      { term: "Particle separation (spacing)", traditional: "微粒間距", simplified: "微粒间距", definition: "Distance between particles (small in solids/liquids; large in gases)." },
      { term: "Motion", traditional: "運動", simplified: "運動", definition: "How particles move (vibrate in solids; move/slide in liquids; rapid random motion in gases)." },
      { term: "State change (change of state)", traditional: "物態變化", simplified: "物态变化", definition: "Physical change between solid, liquid, and gas." },
      { term: "Energy transfer", traditional: "能量轉移", simplified: "能量转移", definition: "Putting energy in (heating) or taking energy out (cooling)." },
      { term: "Endothermic", traditional: "吸熱", simplified: "吸热", definition: "Process that absorbs energy from surroundings." },
      { term: "Exothermic", traditional: "放熱", simplified: "放热", definition: "Process that releases energy to surroundings." },
      { term: "Melting", traditional: "熔化", simplified: "熔化", definition: "Solid → liquid." },
      { term: "Freezing", traditional: "凝固", simplified: "凝固", definition: "Liquid → solid." },
      { term: "Boiling", traditional: "沸騰", simplified: "沸腾", definition: "Liquid → gas at the boiling point (throughout the liquid)." },
      { term: "Evaporation", traditional: "蒸發", simplified: "蒸发", definition: "Liquid → gas below boiling point (at the surface)." },
      { term: "Condensation", traditional: "凝結", simplified: "凝结", definition: "Gas → liquid." },
      { term: "Sublimation", traditional: "昇華", simplified: "升华", definition: "Solid → gas." },
      { term: "Deposition", traditional: "凝華", simplified: "凝华", definition: "Gas → solid." },
      { term: "Temperature", traditional: "溫度", simplified: "温度", definition: "Measure of the average kinetic energy of particles." },
      { term: "Kinetic energy (KE)", traditional: "動能", simplified: "动能", definition: "Energy of a moving particle." },
      { term: "Heating curve", traditional: "加熱曲線", simplified: "加熱曲線", definition: "Graph of temperature vs time (or energy added) as a substance is heated." },
      { term: "Cooling curve", traditional: "冷卻曲線", simplified: "冷卻曲線", definition: "Graph of temperature vs time (or energy removed) as a substance is cooled." },
      { term: "Melting point (m.p.)", traditional: "熔點", simplified: "熔点", definition: "Temperature at which solid and liquid coexist." },
      { term: "Boiling point (b.p.)", traditional: "沸點", simplified: "沸点", definition: "Temperature at which liquid and gas coexist." },
      { term: "Kinetic molecular theory (KMT)", traditional: "分子動力論", simplified: "分子动力论", definition: "Model explaining gas behavior in terms of constant random motion of particles." },
      { term: "Pressure (gas pressure)", traditional: "壓力", simplified: "压力", definition: "Force per unit area from gas particles colliding with container walls." },
      { term: "Volume", traditional: "體積", simplified: "体积", definition: "Space occupied by a substance (for a gas, it depends on the container)." },
      { term: "Collision frequency", traditional: "碰撞頻率", simplified: "碰撞频率", definition: "How often particles hit the container walls." },
      { term: "Concentration", traditional: "濃度", simplified: "浓度", definition: "Number of particles per unit volume." },
      { term: "Diffusion", traditional: "擴散", simplified: "扩散", definition: "Net movement of particles from high concentration to low concentration until evenly spread." },
      { term: "Net movement", traditional: "淨移動", simplified: "净移动", definition: "Overall movement in one direction even though particles move randomly." },
      { term: "Rate of diffusion", traditional: "擴散速率", simplified: "扩散速率", definition: "How quickly diffusion happens." },
      { term: "Relative atomic mass (Ar)", traditional: "相對原子質量", simplified: "相对原子质量", definition: "Average mass of an atom compared with 1/12 of the mass of carbon-12." },
      { term: "Relative molecular mass (Mr)", traditional: "相對分子質量", simplified: "相对分子质量", definition: "Sum of relative atomic masses for all atoms in a molecule." }
    ],
    questions: [
      { id: "1-1", text: "Which statement best describes particles in a solid?", options: ["Far apart and move rapidly in random motion", "Close together, regular arrangement, vibrate about fixed positions", "Close together, random arrangement, move past each other freely", "Far apart, fixed arrangement, do not move"], correctAnswer: "Close together, regular arrangement, vibrate about fixed positions" },
      { id: "1-2", text: "Which state has a fixed volume but a variable shape?", options: ["Solid", "Liquid", "Gas", "Plasma"], correctAnswer: "Liquid" },
      { id: "1-3", text: "Which state has both variable shape and variable volume?", options: ["Solid", "Liquid", "Gas", "Crystal"], correctAnswer: "Gas" },
      { id: "1-4", text: "In which state are particles closest together?", options: ["Gas", "Liquid", "Solid", "All are equally close"], correctAnswer: "Solid" },
      { id: "1-5", text: "In which state are particles in constant, random motion and far apart?", options: ["Solid", "Liquid", "Gas", "Solid and liquid"], correctAnswer: "Gas" },
      { id: "1-6", text: "Melting is the change from:", options: ["Gas to liquid", "Liquid to gas", "Solid to liquid", "Liquid to solid"], correctAnswer: "Solid to liquid" },
      { id: "1-7", text: "Freezing is the change from:", options: ["Liquid to solid", "Solid to liquid", "Gas to liquid", "Solid to gas"], correctAnswer: "Liquid to solid" },
      { id: "1-8", text: "Condensation is the change from:", options: ["Liquid to gas", "Gas to liquid", "Solid to liquid", "Solid to gas"], correctAnswer: "Gas to liquid" },
      { id: "1-9", text: "Sublimation is the change from:", options: ["Liquid to solid", "Gas to liquid", "Solid to gas", "Liquid to gas"], correctAnswer: "Solid to gas" },
      { id: "1-10", text: "Deposition is the change from:", options: ["Solid to liquid", "Gas to solid", "Liquid to gas", "Liquid to solid"], correctAnswer: "Gas to solid" },
      { id: "1-11", text: "Which process is endothermic?", options: ["Freezing", "Condensing", "Melting", "Deposition"], correctAnswer: "Melting" },
      { id: "1-12", text: "Which process is exothermic?", options: ["Boiling", "Evaporation", "Sublimation", "Condensation"], correctAnswer: "Condensation" },
      { id: "1-13", text: "Endothermic processes:", options: ["Release energy to the surroundings", "Absorb energy from the surroundings", "Always decrease temperature of surroundings", "Only happen in gases"], correctAnswer: "Absorb energy from the surroundings" },
      { id: "1-14", text: "Exothermic processes:", options: ["Absorb energy from the surroundings", "Always require a flame", "Release energy to the surroundings", "Only occur at the melting point"], correctAnswer: "Release energy to the surroundings" },
      { id: "1-15", text: "Temperature is a measure of the average ___ of particles.", options: ["mass", "potential energy", "kinetic energy", "volume"], correctAnswer: "kinetic energy" },
      { id: "1-16", text: "When temperature increases, particles generally:", options: ["move more slowly", "have lower kinetic energy", "move faster on average", "stop colliding"], correctAnswer: "move faster on average" },
      { id: "1-17", text: "During melting on a heating curve, the temperature:", options: ["decreases steadily", "stays constant while the state changes", "increases rapidly because particles stop moving", "cannot be measured"], correctAnswer: "stays constant while the state changes" },
      { id: "1-18", text: "During boiling on a heating curve, the added energy is mainly used to:", options: ["decrease particle motion", "increase particle separation (overcome attractions)", "reduce the number of particles", "change liquid into solid"], correctAnswer: "increase particle separation (overcome attractions)" },
      { id: "1-19", text: "The melting point is the temperature at which:", options: ["only solid exists", "solid and liquid coexist", "liquid and gas coexist", "only gas exists"], correctAnswer: "solid and liquid coexist" },
      { id: "1-20", text: "The boiling point is the temperature at which:", options: ["solid and liquid coexist", "only liquid exists", "liquid and gas coexist", "gas and solid coexist"], correctAnswer: "liquid and gas coexist" },
      { id: "1-21", text: "A substance has m.p. = 20 °C and b.p. = 80 °C. What is its state at 10 °C?", options: ["Solid", "Liquid", "Gas", "Liquid + gas"], correctAnswer: "Solid" },
      { id: "1-22", text: "A substance has m.p. = 20 °C and b.p. = 80 °C. What is its state at 50 °C?", options: ["Solid", "Liquid", "Gas", "Solid + liquid"], correctAnswer: "Liquid" },
      { id: "1-23", text: "A substance has m.p. = 20 °C and b.p. = 80 °C. What is its state at 80 °C?", options: ["Solid", "Liquid", "Gas", "Liquid + gas"], correctAnswer: "Liquid + gas" },
      { id: "1-24", text: "A substance has m.p. = 20 °C and b.p. = 80 °C. What is its state at 100 °C?", options: ["Solid", "Liquid", "Gas", "Solid + liquid"], correctAnswer: "Gas" },
      { id: "1-25", text: "According to KMT, gas particles are in:", options: ["fixed positions", "constant, random motion", "a regular lattice", "no motion at all"], correctAnswer: "constant, random motion" },
      { id: "1-26", text: "Gas pressure is caused by:", options: ["gas particles sticking to the wall", "gas particles colliding with the container walls", "liquid particles colliding with gas particles", "solids melting"], correctAnswer: "gas particles colliding with the container walls" },
      { id: "1-27", text: "If gas particles collide with the walls more frequently, the pressure:", options: ["decreases", "stays the same", "increases", "becomes zero"], correctAnswer: "increases" },
      { id: "1-28", text: "If the volume of a gas is decreased at constant temperature, the pressure will usually:", options: ["decrease because particles move slower", "increase because collisions become more frequent", "stay constant because temperature is constant", "drop to zero"], correctAnswer: "increase because collisions become more frequent" },
      { id: "1-29", text: "For a fixed amount of gas at constant temperature, pressure is ___ to volume.", options: ["directly proportional", "inversely proportional", "unrelated", "equal"], correctAnswer: "inversely proportional" },
      { id: "1-30", text: "If the temperature of a gas is increased at constant volume, the pressure will usually:", options: ["decrease", "stay constant", "increase", "become zero"], correctAnswer: "increase" },
      { id: "1-31", text: "Diffusion occurs in:", options: ["solids only", "liquids and gases only", "gases only", "all states equally"], correctAnswer: "liquids and gases only" },
      { id: "1-32", text: "Diffusion is best defined as:", options: ["movement of particles from low to high concentration only", "net movement of particles from high to low concentration until evenly spread", "particles stopping when concentration is equal", "particles moving only in straight lines"], correctAnswer: "net movement of particles from high to low concentration until evenly spread" },
      { id: "1-33", text: "In diffusion, particles move randomly but there is an overall movement from:", options: ["low concentration to high concentration", "high concentration to low concentration", "high temperature to low temperature", "low pressure to high pressure"], correctAnswer: "high concentration to low concentration" },
      { id: "1-34", text: "Diffusion stops when:", options: ["particles stop moving", "concentrations become equal on both sides", "temperature becomes zero", "the container breaks"], correctAnswer: "concentrations become equal on both sides" },
      { id: "1-35", text: "A region of high concentration has:", options: ["fewer particles per unit volume", "more particles per unit volume", "no particles", "only solid particles"], correctAnswer: "more particles per unit volume" },
      { id: "1-36", text: "Increasing temperature increases the rate of diffusion because particles:", options: ["get heavier", "move faster on average", "move in more regular patterns", "stop colliding"], correctAnswer: "move faster on average" },
      { id: "1-37", text: "Which condition gives the fastest diffusion (all else equal)?", options: ["Lower temperature", "Higher temperature", "Larger particles", "Higher relative molecular mass"], correctAnswer: "Higher temperature" },
      { id: "1-38", text: "Which gas diffuses faster, if conditions are the same?", options: ["The gas with larger relative molecular mass", "The gas with smaller relative molecular mass", "Both diffuse at the same rate", "The gas that is coloured"], correctAnswer: "The gas with smaller relative molecular mass" },
      { id: "1-39", text: "Relative molecular mass (Mr) is found by:", options: ["counting neutrons only", "summing the relative atomic masses of atoms in the molecule", "measuring volume at room temperature", "multiplying by temperature"], correctAnswer: "summing the relative atomic masses of atoms in the molecule" },
      { id: "1-40", text: "What is the relative molecular mass of NH3? (Ar: N = 14, H = 1)", options: ["14", "15", "17", "18"], correctAnswer: "17" },
      { id: "1-41", text: "What is the relative molecular mass of H2O? (Ar: H = 1, O = 16)", options: ["17", "18", "19", "20"], correctAnswer: "18" },
      { id: "1-42", text: "What is the relative molecular mass of HCl? (Ar: H = 1, Cl = 35.5)", options: ["34.5", "35.5", "36.0", "36.5"], correctAnswer: "36.5" },
      { id: "1-43", text: "In the NH3 and HCl diffusion experiment, the white solid formed is:", options: ["sodium chloride", "ammonium chloride", "hydrogen chloride", "ammonia"], correctAnswer: "ammonium chloride" },
      { id: "1-44", text: "The balanced word/equation for the reaction is:", options: ["NH3 + HCl → NH4Cl", "NH3 + Cl2 → NH3Cl2", "H2 + Cl2 → 2HCl", "NH3 + H2O → NH4OH"], correctAnswer: "NH3 + HCl → NH4Cl" },
      { id: "1-45", text: "In the NH3 and HCl diffusion experiment, the white ring forms closer to the HCl end because:", options: ["HCl diffuses faster", "NH3 diffuses faster", "both diffuse equally", "NH4Cl diffuses to the HCl end"], correctAnswer: "NH3 diffuses faster" },
      { id: "1-46", text: "Which statement about particles in a liquid is correct?", options: ["They are in fixed positions and only vibrate", "They are far apart and move extremely rapidly", "They are close together and can move past each other", "They form a regular lattice and cannot move"], correctAnswer: "They are close together and can move past each other" },
      { id: "1-47", text: "Which statement about gases is correct?", options: ["Gases have fixed shape and fixed volume", "Gas particles are close together", "Gases fill the container because particles move freely and are far apart", "Gas particles do not collide"], correctAnswer: "Gases fill the container because particles move freely and are far apart" },
      { id: "1-48", text: "Which change of state is exothermic?", options: ["Sublimation", "Boiling", "Melting", "Freezing"], correctAnswer: "Freezing" },
      { id: "1-49", text: "On a cooling curve, during condensation the temperature:", options: ["stays constant while gas changes to liquid", "increases steadily", "decreases steadily with no flat section", "becomes negative immediately"], correctAnswer: "stays constant while gas changes to liquid" },
      { id: "1-50", text: "At the melting point, a substance is:", options: ["only solid", "only liquid", "both solid and liquid", "both gas and liquid"], correctAnswer: "both solid and liquid" }
    ],
  },
  {
    id: 2,
    title: "Atoms, elements and compounds",
    description: "The building blocks of matter and how they combine.",
    color: "bg-blue-500",
    concepts: [
      "Everything can be classified as an element (one type of atom), compound (two or more types of atoms chemically combined), or mixture (substances physically mixed but not bonded).",
      "An atom is the smallest unit of an element that retains its properties. 'Atom' comes from 'atomos', meaning indivisible.",
      "Atoms contain three sub-atomic particles: Protons (p+, positive, in nucleus), Neutrons (n, neutral, in nucleus), and Electrons (e–, negative, in shells).",
      "Almost all the mass of an atom is in the central nucleus; most of the atom is empty space.",
      "Proton number / atomic number (Z) is the number of protons. In a neutral atom, number of electrons = Z.",
      "Mass number / nucleon number (A) = protons + neutrons. Number of neutrons = A − Z.",
      "AXZ notation: A (top) is mass number, Z (bottom) is atomic number, X is the element symbol.",
      "Electrons are arranged in shells (2, 8, 8 for Z=1-20), filling from the shell closest to the nucleus first.",
      "Periodic Table: Group number (columns) relates to valence electrons; Period number (rows) equals the number of occupied shells.",
      "Isotopes are atoms of the same element with the same number of protons but different numbers of neutrons. They have the same chemical properties but different physical properties.",
      "Physical properties can be observed without forming new substances; chemical properties describe how a substance reacts.",
      "Relative atomic mass (Ar) is the weighted average mass of the isotopes of an element, weighted by isotopic abundance.",
      "Ions are charged particles. Cations are positive (loss of electrons); Anions are negative (gain of electrons).",
      "Ionic bonding is the strong electrostatic attraction between oppositely charged ions, formed by electron transfer from metal to non-metal.",
      "Ionic compounds form a giant ionic lattice with high melting points, and conduct electricity when molten or aqueous. They are brittle because layers can slide and like charges repel.",
      "Covalent bonds form when non-metal atoms share pairs of electrons to achieve noble gas configurations. Dot-and-cross diagrams show only outer shell electrons.",
      "Simple molecular substances have low melting points due to weak intermolecular forces and are poor conductors.",
      "Giant covalent structures (diamond, graphite, SiO2) have high melting points. Graphite conducts electricity due to delocalised electrons.",
      "Metallic bonding is the attraction between positive metal ions and a 'sea' of delocalised electrons. Metals are malleable because layers of ions can slide.",
      "Classification: Metal only → giant metallic; Metal + non-metal → giant ionic; Non-metals only → simple molecules or giant covalent."
    ],
    vocab: [
      { term: "Element", traditional: "元素", simplified: "元素", definition: "A pure substance made of only one type of atom." },
      { term: "Compound", traditional: "化合物", simplified: "化合物", definition: "A pure substance containing two or more different types of atoms chemically combined." },
      { term: "Mixture", traditional: "混合物", simplified: "混合物", definition: "An impure substance containing two or more substances physically mixed." },
      { term: "Atom", traditional: "原子", simplified: "原子", definition: "The smallest unit of an element that retains its properties." },
      { term: "Proton", traditional: "質子", simplified: "质子", definition: "Positively charged sub-atomic particle in the nucleus." },
      { term: "Neutron", traditional: "中子", simplified: "中子", definition: "Neutral sub-atomic particle in the nucleus." },
      { term: "Electron", traditional: "電子", simplified: "电子", definition: "Negatively charged sub-atomic particle in shells." },
      { term: "Nucleus", traditional: "原子核", simplified: "原子核", definition: "The central part of an atom containing protons and neutrons." },
      { term: "Atomic number (Z)", traditional: "原子序數", simplified: "原子序数", definition: "The number of protons in the nucleus of an atom." },
      { term: "Mass number (A)", traditional: "質量數", simplified: "质量数", definition: "The total number of protons and neutrons in the nucleus." },
      { term: "Isotope", traditional: "同位素", simplified: "同位素", definition: "Atoms of the same element with different numbers of neutrons." },
      { term: "Relative atomic mass (Ar)", traditional: "相對原子質量", simplified: "相对原子质量", definition: "Weighted average mass of the isotopes of an element." },
      { term: "Ion", traditional: "離子", simplified: "离子", definition: "A charged particle formed by the loss or gain of electrons." },
      { term: "Cation", traditional: "陽離子", simplified: "阳离子", definition: "A positively charged ion formed by losing electrons." },
      { term: "Anion", traditional: "陰離子", simplified: "阴离子", definition: "A negatively charged ion formed by gaining electrons." },
      { term: "Ionic bond", traditional: "離子鍵", simplified: "离子键", definition: "Electrostatic attraction between oppositely charged ions." },
      { term: "Covalent bond", traditional: "共價鍵", simplified: "共价键", definition: "Bond formed by the sharing of electron pairs between atoms." },
      { term: "Metallic bond", traditional: "金屬鍵", simplified: "金属键", definition: "Attraction between metal ions and delocalised electrons." },
      { term: "Giant ionic lattice", traditional: "巨型離子晶格", simplified: "巨型离子晶格", definition: "Regular arrangement of alternating positive and negative ions." },
      { term: "Intermolecular forces", traditional: "分子間作用力", simplified: "分子间作用力", definition: "Weak forces of attraction between simple molecules." },
      { term: "Malleable", traditional: "有延展性", simplified: "有延展性", definition: "Able to be hammered or pressed into shape without breaking." },
      { term: "Valence electrons", traditional: "價電子", simplified: "价电子", definition: "Electrons in the outermost shell of an atom." },
      { term: "Delocalised electrons", traditional: "離域電子", simplified: "离域电子", definition: "Electrons that are free to move throughout a structure." }
    ],
    questions: [
      { id: "2-1", text: "What is a substance made of only one type of atom?", options: ["Compound", "Mixture", "Element", "Isotope"], correctAnswer: "Element" },
      { id: "2-2", text: "Which sub-atomic particles are found in the nucleus?", options: ["Protons and electrons", "Electrons and neutrons", "Protons and neutrons", "Only neutrons"], correctAnswer: "Protons and neutrons" },
      { id: "2-3", text: "The atomic number (Z) represents the number of:", options: ["Neutrons", "Protons", "Nucleons", "Shells"], correctAnswer: "Protons" },
      { id: "2-4", text: "How many neutrons are in an atom with mass number 35 and atomic number 17?", options: ["17", "18", "35", "52"], correctAnswer: "18" },
      { id: "2-5", text: "What is the electronic configuration of an atom with 13 electrons?", options: ["2,8,3", "2,8,8,3", "2,11", "13"], correctAnswer: "2,8,3" },
      { id: "2-6", text: "The period number in the Periodic Table tells us the number of:", options: ["Valence electrons", "Protons", "Occupied electron shells", "Neutrons"], correctAnswer: "Occupied electron shells" },
      { id: "2-7", text: "Isotopes of the same element have the same:", options: ["Mass number", "Number of neutrons", "Chemical properties", "Physical properties"], correctAnswer: "Chemical properties" },
      { id: "2-8", text: "Which type of ion is formed when a metal atom loses electrons?", options: ["Anion", "Cation", "Isotope", "Molecule"], correctAnswer: "Cation" },
      { id: "2-9", text: "Ionic bonding is the electrostatic attraction between:", options: ["Two nuclei", "Oppositely charged ions", "Shared electrons and nuclei", "Metal ions and delocalised electrons"], correctAnswer: "Oppositely charged ions" },
      { id: "2-10", text: "Why do simple molecular substances have low boiling points?", options: ["Strong covalent bonds break easily", "Weak intermolecular forces are easily overcome", "They have no electrons", "They are made of ions"], correctAnswer: "Weak intermolecular forces are easily overcome" },
      { id: "2-11", text: "Which of these is a property of diamond?", options: ["Soft and slippery", "Conducts electricity", "Very hard 3D network", "Low melting point"], correctAnswer: "Very hard 3D network" },
      { id: "2-12", text: "Metals are malleable because:", options: ["They have strong covalent bonds", "Layers of ions can slide over each other", "They have weak intermolecular forces", "They are made of molecules"], correctAnswer: "Layers of ions can slide over each other" },
      { id: "2-13", text: "What is the charge of an ion from Group VI?", options: ["+2", "-2", "+6", "-6"], correctAnswer: "-2" },
      { id: "2-14", text: "Which particle has a relative mass of almost zero?", options: ["Proton", "Neutron", "Electron", "Alpha particle"], correctAnswer: "Electron" },
      { id: "2-15", text: "A compound contains two or more elements that are:", options: ["Physically mixed", "Chemically combined in fixed ratios", "Always gases", "Separable by filtration"], correctAnswer: "Chemically combined in fixed ratios" },
      { id: "2-16", text: "Relative atomic mass (Ar) is the weighted average mass of:", options: ["Protons and neutrons", "Isotopes of an element", "Molecules in a compound", "Electrons in a shell"], correctAnswer: "Isotopes of an element" },
      { id: "2-17", text: "Which substance conducts electricity when solid?", options: ["Sodium chloride", "Diamond", "Copper", "Sulfur"], correctAnswer: "Copper" },
      { id: "2-18", text: "What type of bond is formed by sharing a pair of electrons?", options: ["Ionic", "Covalent", "Metallic", "Hydrogen"], correctAnswer: "Covalent" },
      { id: "2-19", text: "Which of these is a polyatomic ion?", options: ["Cl-", "Na+", "OH-", "O2-"], correctAnswer: "OH-" },
      { id: "2-20", text: "Ionic compounds are brittle because:", options: ["They have weak bonds", "Shifting layers bring like charges together", "They are made of molecules", "They are soft"], correctAnswer: "Shifting layers bring like charges together" }
    ]
  },
  {
    id: 3,
    title: "Stoichiometry",
    description: "Chemical formulas, equations, and calculations.",
    color: "bg-orange-500",
    concepts: [
      "Chemical formulas represent the ratio of atoms in a compound.",
      "Relative atomic mass (Ar) and relative molecular mass (Mr) are used in calculations.",
      "The mole is the unit for amount of substance.",
      "One mole contains 6.02 x 10^23 particles (Avogadro constant).",
      "Balanced equations show the mole ratio of reactants and products."
    ],
    vocab: [
      { term: "Mole", traditional: "摩爾", simplified: "摩尔", definition: "The unit for amount of substance." },
      { term: "Relative Atomic Mass", traditional: "相對原子質量", simplified: "相对原子质量", definition: "The average mass of an atom relative to 1/12th of carbon-12." },
      { term: "Empirical Formula", traditional: "實驗式", simplified: "实验式", definition: "The simplest whole-number ratio of atoms in a compound." }
    ],
    questions: [
      { id: "3-1", text: "What is the unit for the amount of a substance?", options: ["Gram", "Mole", "Liter", "Pascal"], correctAnswer: "Mole" }
    ]
  },
  {
    id: 4,
    title: "Electrochemistry",
    description: "Electricity and chemical changes.",
    color: "bg-yellow-500",
    concepts: [
      "Electrolysis is the breakdown of an ionic compound by electricity.",
      "The electrolyte is the liquid that conducts electricity.",
      "Anode is the positive electrode; Cathode is the negative electrode.",
      "Oxidation occurs at the anode; Reduction occurs at the cathode (OIL RIG).",
      "Electroplating is using electrolysis to coat an object with a metal."
    ],
    vocab: [
      { term: "Electrolysis", traditional: "電解", simplified: "电解", definition: "Breaking down a substance using electricity." },
      { term: "Electrode", traditional: "電極", simplified: "电极", definition: "A conductor through which electricity enters or leaves an electrolyte." }
    ],
    questions: [
      { id: "4-1", text: "Which electrode is the negative one in electrolysis?", options: ["Anode", "Cathode", "Electrolyte", "Battery"], correctAnswer: "Cathode" }
    ]
  },
  {
    id: 5,
    title: "Chemical energetics",
    description: "Energy changes in chemical reactions.",
    color: "bg-red-500",
    concepts: [
      "Exothermic reactions release heat energy to the surroundings.",
      "Endothermic reactions absorb heat energy from the surroundings.",
      "Enthalpy change (ΔH) is negative for exothermic and positive for endothermic.",
      "Bond breaking is endothermic; bond making is exothermic.",
      "Activation energy is the minimum energy needed for a reaction to start."
    ],
    vocab: [
      { term: "Exothermic", traditional: "放熱", simplified: "放热", definition: "A reaction that releases heat." },
      { term: "Endothermic", traditional: "吸熱", simplified: "吸热", definition: "A reaction that absorbs heat." }
    ],
    questions: [
      { id: "5-1", text: "In an exothermic reaction, the temperature of the surroundings:", options: ["Increases", "Decreases", "Stays the same", "Becomes zero"], correctAnswer: "Increases" }
    ]
  },
  {
    id: 6,
    title: "Chemical reactions",
    description: "Rates of reaction and reversible reactions.",
    color: "bg-purple-500",
    concepts: [
      "Rate of reaction depends on concentration, temperature, surface area, and catalysts.",
      "Collision theory: particles must collide with enough energy to react.",
      "Reversible reactions can go both ways (A + B ⇌ C + D).",
      "Equilibrium is reached when the forward and backward rates are equal.",
      "Redox reactions involve both reduction and oxidation."
    ],
    vocab: [
      { term: "Catalyst", traditional: "催化劑", simplified: "催化剂", definition: "A substance that speeds up a reaction without being used up." },
      { term: "Equilibrium", traditional: "平衡", simplified: "平衡", definition: "A state where forward and backward reactions happen at the same rate." }
    ],
    questions: [
      { id: "6-1", text: "What does a catalyst do to the rate of reaction?", options: ["Speeds it up", "Slows it down", "Stops it", "Has no effect"], correctAnswer: "Speeds it up" }
    ]
  },
  {
    id: 7,
    title: "Acids, bases and salts",
    description: "Properties and reactions of acids and bases.",
    color: "bg-indigo-500",
    concepts: [
      "Acids have a pH less than 7 and turn litmus red.",
      "Bases (alkalis) have a pH greater than 7 and turn litmus blue.",
      "Neutralization: Acid + Base → Salt + Water.",
      "Indicators like phenolphthalein and methyl orange show pH changes.",
      "Strong acids fully ionize in water; weak acids only partially ionize."
    ],
    vocab: [
      { term: "Acid", traditional: "酸", simplified: "酸", definition: "A substance with a pH less than 7." },
      { term: "Alkali", traditional: "鹼", simplified: "碱", definition: "A soluble base with a pH greater than 7." }
    ],
    questions: [
      { id: "7-1", text: "What is the pH of a neutral solution?", options: ["0", "7", "14", "1"], correctAnswer: "7" }
    ]
  },
  {
    id: 8,
    title: "The Periodic Table",
    description: "Trends and patterns in the elements.",
    color: "bg-cyan-500",
    concepts: [
      "Elements are arranged by increasing atomic number.",
      "Groups are vertical columns; Periods are horizontal rows.",
      "Group I (Alkali metals) are reactive and soft.",
      "Group VII (Halogens) are reactive non-metals.",
      "Group VIII/0 (Noble gases) are unreactive.",
      "Transition elements are metals with high densities and colored compounds."
    ],
    vocab: [
      { term: "Group", traditional: "族", simplified: "族", definition: "A vertical column in the periodic table." },
      { term: "Period", traditional: "週期", simplified: "周期", definition: "A horizontal row in the periodic table." }
    ],
    questions: [
      { id: "8-1", text: "Which group contains the Noble Gases?", options: ["Group I", "Group VII", "Group VIII", "Group II"], correctAnswer: "Group VIII" }
    ]
  },
  {
    id: 9,
    title: "Metals",
    description: "Properties, extraction, and uses of metals.",
    color: "bg-slate-500",
    concepts: [
      "Metals are shiny, malleable, and conduct heat/electricity.",
      "Alloys are mixtures of a metal with other elements.",
      "Reactivity series: K > Na > Ca > Mg > Al > Zn > Fe > Pb > Cu > Ag > Au.",
      "Extraction of iron occurs in the Blast Furnace.",
      "Aluminum is extracted by electrolysis of bauxite."
    ],
    vocab: [
      { term: "Alloy", traditional: "合金", simplified: "合金", definition: "A mixture of two or more elements, where at least one is a metal." },
      { term: "Corrosion", traditional: "腐蝕", simplified: "腐蚀", definition: "The gradual destruction of materials by chemical reaction." }
    ],
    questions: [
      { id: "9-1", text: "Which metal is the most reactive in this list?", options: ["Gold", "Iron", "Potassium", "Copper"], correctAnswer: "Potassium" }
    ]
  },
  {
    id: 10,
    title: "Chemistry of the environment",
    description: "Water, air, and pollution.",
    color: "bg-teal-500",
    concepts: [
      "Water treatment involves filtration and chlorination.",
      "Air is 78% nitrogen, 21% oxygen, and 1% other gases.",
      "Pollutants include carbon monoxide, sulfur dioxide, and nitrogen oxides.",
      "The greenhouse effect is caused by CO2 and methane.",
      "Global warming leads to climate change."
    ],
    vocab: [
      { term: "Pollution", traditional: "污染", simplified: "污染", definition: "Harmful substances introduced into the environment." },
      { term: "Greenhouse Gas", traditional: "溫室氣體", simplified: "温室气体", definition: "Gases that trap heat in the atmosphere." }
    ],
    questions: [
      { id: "10-1", text: "What is the most abundant gas in the Earth's atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"], correctAnswer: "Nitrogen" }
    ]
  },
  {
    id: 11,
    title: "Organic chemistry",
    description: "Carbon compounds and fuels.",
    color: "bg-orange-700",
    concepts: [
      "Hydrocarbons contain only carbon and hydrogen.",
      "Alkanes are saturated (single bonds); Alkenes are unsaturated (double bonds).",
      "Fractional distillation separates petroleum into useful fractions.",
      "Alcohols contain the -OH functional group.",
      "Polymers are large molecules made of many monomers."
    ],
    vocab: [
      { term: "Hydrocarbon", traditional: "烴", simplified: "烃", definition: "A compound made of only hydrogen and carbon." },
      { term: "Polymer", traditional: "聚合物", simplified: "聚合物", definition: "A large molecule made of repeating units." }
    ],
    questions: [
      { id: "11-1", text: "Which of these is a saturated hydrocarbon?", options: ["Ethene", "Ethane", "Ethanol", "Ethanoic acid"], correctAnswer: "Ethane" }
    ]
  },
  {
    id: 12,
    title: "Experimental techniques and chemical analysis",
    description: "Laboratory methods and testing for ions.",
    color: "bg-pink-500",
    concepts: [
      "Apparatus for measuring volume: measuring cylinder, pipette, burette.",
      "Separation techniques: filtration, crystallization, distillation, chromatography.",
      "Tests for anions: carbonate, chloride, iodide, nitrate, sulfate.",
      "Tests for cations: using aqueous sodium hydroxide and ammonia.",
      "Tests for gases: hydrogen, oxygen, carbon dioxide, ammonia, chlorine."
    ],
    vocab: [
      { term: "Titration", traditional: "滴定", simplified: "滴定", definition: "A technique to find the concentration of a solution." },
      { term: "Distillation", traditional: "蒸餾", simplified: "蒸馏", definition: "Separating liquids based on boiling points." }
    ],
    questions: [
      { id: "12-1", text: "Which piece of apparatus is most accurate for measuring 25.0 cm³ of liquid?", options: ["Beaker", "Measuring cylinder", "Pipette", "Conical flask"], correctAnswer: "Pipette" }
    ]
  }
];
