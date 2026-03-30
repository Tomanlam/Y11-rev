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
      "Solids: particles closely packed in a regular arrangement; vibrate about fixed positions; fixed shape; fixed volume.",
      "Liquids: particles close together but randomly arranged; move/slide past each other; variable shape (takes container shape); fixed volume.",
      "Gases: particles far apart and randomly arranged; move quickly and randomly in all directions; variable shape; variable volume (expand to fill container).",
      "Changes of state involve energy transfer: melting (s to l), boiling (l to g), condensation (g to l), freezing (l to s).",
      "Sublimation is the direct change from solid to gas (e.g., dry ice, iodine).",
      "Evaporation occurs at the surface of a liquid over a range of temperatures; boiling occurs throughout the liquid at a specific temperature.",
      "Kinetic particle theory explains how temperature affects the motion and arrangement of particles.",
      "Diffusion is the random movement of particles from a region of higher concentration to a region of lower concentration.",
      "Gas pressure is caused by the collision of gas particles with the walls of their container."
    ],
    vocab: [
      { term: "Matter", traditional: "物質", simplified: "物质", definition: "Anything that has mass and occupies space." },
      { term: "Solid", traditional: "固體", simplified: "固体", definition: "State with fixed shape and fixed volume." },
      { term: "Liquid", traditional: "液體", simplified: "液体", definition: "State with fixed volume but variable shape (takes the shape of its container)." },
      { term: "Gas", traditional: "氣體", simplified: "气体", definition: "State with variable shape and variable volume (fills its container)." },
      { term: "Particle model", traditional: "微粒模型", simplified: "微粒模型", definition: "Explanation of states of matter using particles, their arrangement, spacing, and motion." },
      { term: "Arrangement", traditional: "排列", simplified: "排列", definition: "How particles are positioned (regular in solids; random in liquids/gases)." },
      { term: "Particle separation (spacing)", traditional: "微粒間距", simplified: "微粒间距", definition: "Distance between particles (small in solids/liquids; large in gases)." },
      { term: "Motion", traditional: "運動", simplified: "运动", definition: "How particles move (vibrate in solids; move/slide in liquids; rapid random motion in gases)." },
      { term: "State change", traditional: "物態變化", simplified: "物态变化", definition: "Physical change between solid, liquid, and gas." },
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
      { term: "Heating curve", traditional: "加熱曲線", simplified: "加热曲线", definition: "Graph of temperature vs time (or energy added) as a substance is heated." },
      { term: "Cooling curve", traditional: "冷卻曲線", simplified: "冷却曲线", definition: "Graph of temperature vs time (or energy removed) as a substance is cooled." },
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
      "Elements are pure substances made of only one type of atom.",
      "Compounds are substances made of two or more elements chemically combined.",
      "Atoms consist of a nucleus (protons and neutrons) and electrons in shells.",
      "Protons have a positive charge, electrons have a negative charge, and neutrons are neutral.",
      "The atomic number is the number of protons in an atom.",
      "The mass number is the total number of protons and neutrons."
    ],
    vocab: [
      { term: "Atom", traditional: "原子", simplified: "原子", definition: "The smallest unit of an element." },
      { term: "Element", traditional: "元素", simplified: "元素", definition: "A substance made of only one type of atom." },
      { term: "Compound", traditional: "化合物", simplified: "化合物", definition: "Two or more elements chemically bonded." },
      { term: "Proton", traditional: "質子", simplified: "质子", definition: "Positively charged particle in the nucleus." },
      { term: "Electron", traditional: "電子", simplified: "电子", definition: "Negatively charged particle orbiting the nucleus." }
    ],
    questions: [
      { id: "2-1", text: "What is the charge of a proton?", options: ["Positive", "Negative", "Neutral", "Variable"], correctAnswer: "Positive" },
      { id: "2-2", text: "Which particles are found in the nucleus of an atom?", options: ["Protons and electrons", "Electrons and neutrons", "Protons and neutrons", "Only protons"], correctAnswer: "Protons and neutrons" }
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
