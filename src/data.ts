export interface Question {
  id: string;
  text: string;
  textZh?: string;
  textZhSimp?: string;
  options: string[];
  optionsZh?: string[];
  optionsZhSimp?: string[];
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
  titleZh?: string;
  titleZhSimp?: string;
  description: string;
  descriptionZh?: string;
  descriptionZhSimp?: string;
  color: string;
  concepts: string[];
  conceptsZh?: string[];
  conceptsZhSimp?: string[];
  vocab: Vocab[];
  questions: Question[];
}

export const units: Unit[] = [
  {
    id: 1,
    title: "States of matter",
    titleZh: "物態",
    titleZhSimp: "物态",
    description: "Understanding solids, liquids, gases and their changes of state.",
    descriptionZh: "了解固體、液體、氣體及其物態變化。",
    descriptionZhSimp: "了解固体、液体、气体及其物态变化。",
    color: "bg-emerald-500",
    concepts: [
      "Matter exists in three common states: [[solid|emerald]] (s), [[liquid|blue]] (l), [[gas|orange]] (g). The same substance can exist in different states under different conditions.",
      "Particle model comparisons: [[Solids|emerald]] (closely packed, regular arrangement, vibrate), [[Liquids|blue]] (close, random arrangement, move/slide), [[Gases|orange]] (far apart, random, rapid motion).",
      "State changes happen by putting energy in ([[heating|rose]] - endothermic) or taking energy out ([[cooling|blue]] - exothermic).",
      "Names of state changes: [[Melting|rose]] (s→l), [[Freezing|blue]] (l→s), [[Boiling|rose]]/Evaporating (l→g), [[Condensing|blue]] (g→l), [[Sublimation|rose]] (s→g), [[Deposition|blue]] (g→s).",
      "[[Temperature|amber]] is a measure of the average [[kinetic energy|orange]] (KE) of particles. Higher temperature means faster particle motion.",
      "[[Heating|rose]]/[[cooling|blue]] curves: Temperature stays constant during state changes ([[melting|rose]]/[[boiling|rose]]) as energy is used to overcome attractions between particles.",
      "Predicting state: A substance is [[solid|emerald]] below its melting point, [[liquid|blue]] between melting and boiling points, and [[gas|orange]] above its boiling point.",
      "[[Kinetic molecular theory|amber]] (KMT): Gas particles are in constant random motion; [[pressure|rose]] is caused by collisions with container walls.",
      "Gas behavior: Decreasing [[volume|blue]] or increasing [[temperature|amber]] increases collision frequency and thus increases [[pressure|rose]].",
      "[[Diffusion|emerald]]: Net movement of particles from high to low concentration. It occurs in liquids and gases but not solids.",
      "Factors affecting diffusion: Rate increases with higher [[temperature|amber]] (more KE) and lower [[relative molecular mass|blue]] (lighter particles move faster).",
      "NH3 and HCl experiment: [[NH3|emerald]] (Mr=17) diffuses faster than [[HCl|rose]] (Mr=36.5), so the white ammonium chloride ring forms closer to the HCl end."
    ],
    conceptsZh: [
      "物質以三種常見狀態存在：[[固體|emerald]] (s)、[[液體|blue]] (l)、[[氣體|orange]] (g)。同一種物質在不同條件下可以以不同狀態存在。",
      "微粒模型比較：[[固體|emerald]]（緊密堆積，規則排列，振動），[[液體|blue]]（靠近，隨機排列，移動/滑動），[[氣體|orange]]（相距較遠，隨機，快速運動）。",
      "物態變化通過輸入能量（[[加熱|rose]] - 吸熱）或取出能量（[[冷卻|blue]] - 放熱）發生。",
      "物態變化的名稱：[[熔化|rose]] (s→l)，[[凝固|blue]] (l→s)，[[沸騰|rose]]/蒸發 (l→g)，[[凝結|blue]] (g→l)，[[昇華|rose]] (s→g)，[[凝華|blue]] (g→s)。",
      "[[溫度|amber]]是微粒平均[[動能|orange]] (KE) 的度量。溫度越高意味著微粒運動越快。",
      "[[加熱|rose]]/[[冷卻|blue]]曲線：在物態變化（[[熔化|rose]]/[[沸騰|rose]]）期間，溫度保持不變，因為能量被用於克服微粒之間的吸引力。",
      "預測狀態：物質在熔點以下為[[固體|emerald]]，在熔點和沸點之間為[[液體|blue]]，在沸點以上為[[氣體|orange]]。",
      "[[分子動力論|amber]] (KMT)：氣體微粒處於不斷的隨機運動中；[[壓力|rose]]是由與容器壁的碰撞引起的。",
      "氣體行為：減小[[體積|blue]]或增加[[溫度|amber]]會增加碰撞頻率，從而增加[[壓力|rose]]。",
      "[[擴散|emerald]]：微粒從高濃度向低濃度的淨移動。它發生在液體和氣體中，但不發生在固體中。",
      "影響擴散的因素：速率隨[[溫度|amber]]升高（更多動能）和[[相對分子質量|blue]]降低（較輕的微粒移動更快）而增加。",
      "NH3 和 HCl 實驗：[[NH3|emerald]] (Mr=17) 比 [[HCl|rose]] (Mr=36.5) 擴散得更快，因此白色氯化銨環形成的更靠近 HCl 端。"
    ],
    conceptsZhSimp: [
      "物质以三种常见状态存在：[[固体|emerald]] (s)、[[液体|blue]] (l)、[[气体|orange]] (g)。同一种物质在不同条件下可以以不同状态存在。",
      "微粒模型比较：[[固体|emerald]]（紧密堆积，规则排列，振动），[[液体|blue]]（靠近，随机排列，移动/滑动），[[气体|orange]]（相距较远，随机，快速运动）。",
      "物态变化通过输入能量（[[加热|rose]] - 吸热）或取出能量（[[冷却|blue]] - 放热）发生。",
      "物态变化的名称：[[熔化|rose]] (s→l)，[[凝固|blue]] (l→s)，[[沸腾|rose]]/蒸发 (l→g)，[[凝结|blue]] (g→l)，[[升华|rose]] (s→g)，[[凝华|blue]] (g→s)。",
      "[[温度|amber]]是微粒平均[[动能|orange]] (KE) 的度量。温度越高意味着微粒运动越快。",
      "[[加热|rose]]/[[冷却|blue]]曲线：在物态变化（[[熔化|rose]]/[[沸腾|rose]]）期间，温度保持不变，因为能量被用于克服微粒之间的吸引力。",
      "预测状态：物质在熔点以下为[[固体|emerald]]，在熔点和沸点之间为[[液体|blue]]，在沸点以上为[[气体|orange]]。",
      "[[分子动力论|amber]] (KMT)：气体微粒处于不断的随机运动中；[[压力|rose]]是由与容器壁的碰撞引起的。",
      "气体行为：减小[[体积|blue]]或增加[[温度|amber]]会增加碰撞频率，从而增加[[压力|rose]]。",
      "[[扩散|emerald]]：微粒从高浓度向低浓度的净移动。它发生在液体和气体中，但不发生在固体中。",
      "影响扩散的因素：速率随[[温度|amber]]升高（更多动能）和[[相对分子质量|blue]]降低（较轻的微粒移动更快）而增加。",
      "NH3 和 HCl 实验：[[NH3|emerald]] (Mr=17) 比 [[HCl|rose]] (Mr=36.5) 扩散得更快，因此白色氯化铵环形成的更靠近 HCl 端。"
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
      { 
        id: "1-1", 
        text: "Which statement best describes particles in a [[solid|emerald]]?", 
        textZh: "哪項陳述最能描述[[固體|emerald]]中的微粒？",
        textZhSimp: "哪项陈述最能描述[[固体|emerald]]中的微粒？",
        options: ["Far apart and move rapidly in random motion", "Close together, regular arrangement, vibrate about fixed positions", "Close together, random arrangement, move past each other freely", "Far apart, fixed arrangement, do not move"], 
        optionsZh: ["相距較遠且在隨機運動中快速移動", "靠近，規則排列，在固定位置附近振動", "靠近，隨機排列，自由地相互移動", "相距較遠，固定排列，不移動"],
        optionsZhSimp: ["相距较远且在随机运动中快速移动", "靠近，规则排列，在固定位置附近振动", "靠近，随机排列，自由地相互移动", "相距较远，固定排列，不移动"],
        correctAnswer: "Close together, regular arrangement, vibrate about fixed positions" 
      },
      { 
        id: "1-2", 
        text: "Which state has a [[fixed volume|blue]] but a [[variable shape|amber]]?", 
        textZh: "哪種狀態具有[[固定體積|blue]]但[[形狀可變|amber]]？",
        textZhSimp: "哪种状态具有[[固定体积|blue]]但[[形状可变|amber]]？",
        options: ["Solid", "Liquid", "Gas", "Plasma"], 
        optionsZh: ["固體", "液體", "氣體", "等離子體"],
        optionsZhSimp: ["固体", "液体", "气体", "等离子体"],
        correctAnswer: "Liquid" 
      },
      { 
        id: "1-3", 
        text: "Which state has both [[variable shape|amber]] and [[variable volume|blue]]?", 
        textZh: "哪種狀態同時具有[[形狀可變|amber]]和[[體積可變|blue]]？",
        textZhSimp: "哪种状态同时具有[[形状可变|amber]]和[[体积可变|blue]]？",
        options: ["Solid", "Liquid", "Gas", "Crystal"], 
        optionsZh: ["固體", "液體", "氣體", "晶體"],
        optionsZhSimp: ["固体", "液体", "气体", "晶体"],
        correctAnswer: "Gas" 
      },
      { 
        id: "1-4", 
        text: "In which state are particles [[closest together|emerald]]?", 
        textZh: "在哪些狀態下微粒[[最靠近|emerald]]？",
        textZhSimp: "在哪些状态下微粒[[最靠近|emerald]]？",
        options: ["Gas", "Liquid", "Solid", "All are equally close"], 
        optionsZh: ["氣體", "液體", "固體", "所有都同樣靠近"],
        optionsZhSimp: ["气体", "液体", "固体", "所有都同样靠近"],
        correctAnswer: "Solid" 
      },
      { 
        id: "1-5", 
        text: "In which state are particles in [[constant, random motion|orange]] and [[far apart|blue]]?", 
        textZh: "在哪些狀態下微粒處於[[恆定、隨機運動|orange]]且[[相距較遠|blue]]？",
        textZhSimp: "在哪些状态下微粒处于[[恒定、随机运动|orange]]且[[相距较远|blue]]？",
        options: ["Solid", "Liquid", "Gas", "Solid and liquid"], 
        optionsZh: ["固體", "液體", "氣體", "固體和液體"],
        optionsZhSimp: ["固体", "液体", "气体", "固体和液体"],
        correctAnswer: "Gas" 
      },
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
    titleZh: "原子、元素和化合物",
    titleZhSimp: "原子、元素和化合物",
    description: "The building blocks of matter and how they combine.",
    descriptionZh: "物質的組成部分及其結合方式。",
    descriptionZhSimp: "物质的组成部分及其结合方式。",
    color: "bg-blue-500",
    concepts: [
      "Everything can be classified as an [[element|blue]] (one type of atom), [[compound|orange]] (two or more types of atoms chemically combined), or [[mixture|slate]] (substances physically mixed but not bonded).",
      "An [[atom|amber]] is the smallest unit of an element that retains its properties. 'Atom' comes from 'atomos', meaning indivisible.",
      "Atoms contain three sub-atomic particles: [[Protons|rose]] (p+, positive, in nucleus), [[Neutrons|slate]] (n, neutral, in nucleus), and [[Electrons|blue]] (e–, negative, in shells).",
      "Almost all the mass of an atom is in the central [[nucleus|rose]]; most of the atom is empty space.",
      "[[Proton number|rose]] / [[atomic number|rose]] (Z) is the number of protons. In a neutral atom, number of electrons = Z.",
      "[[Mass number|slate]] / [[nucleon number|slate]] (A) = protons + neutrons. Number of neutrons = A − Z.",
      "[[AXZ notation|amber]]: A (top) is mass number, Z (bottom) is atomic number, X is the element symbol.",
      "[[Electrons|blue]] are arranged in [[shells|blue]] (2, 8, 8 for Z=1-20), filling from the shell closest to the nucleus first.",
      "[[Periodic Table|emerald]]: Group number (columns) relates to [[valence electrons|blue]]; Period number (rows) equals the number of occupied [[shells|blue]].",
      "[[Isotopes|purple]] are atoms of the same element with the same number of [[protons|rose]] but different numbers of [[neutrons|slate]]. They have the same chemical properties but different physical properties.",
      "[[Physical properties|slate]] can be observed without forming new substances; [[chemical properties|rose]] describe how a substance reacts.",
      "[[Relative atomic mass|amber]] (Ar) is the weighted average mass of the isotopes of an element, weighted by isotopic abundance.",
      "[[Ions|blue]] are charged particles. [[Cations|rose]] are positive (loss of electrons); [[Anions|blue]] are negative (gain of electrons).",
      "[[Ionic bonding|orange]] is the strong electrostatic attraction between oppositely charged ions, formed by electron transfer from metal to non-metal.",
      "[[Ionic compounds|orange]] form a [[giant ionic lattice|orange]] with high melting points, and conduct electricity when molten or aqueous. They are [[brittle|rose]] because layers can slide and like charges repel.",
      "[[Covalent bonds|blue]] form when non-metal atoms share pairs of electrons to achieve noble gas configurations. Dot-and-cross diagrams show only outer shell electrons.",
      "[[Simple molecular substances|blue]] have low melting points due to weak [[intermolecular forces|slate]] and are poor conductors.",
      "[[Giant covalent structures|emerald]] (diamond, graphite, SiO2) have high melting points. [[Graphite|slate]] conducts electricity due to [[delocalised electrons|blue]].",
      "[[Metallic bonding|amber]] is the attraction between positive metal ions and a 'sea' of [[delocalised electrons|blue]]. Metals are [[malleable|emerald]] because layers of ions can slide.",
      "Classification: Metal only → [[giant metallic|amber]]; Metal + non-metal → [[giant ionic|orange]]; Non-metals only → [[simple molecules|blue]] or [[giant covalent|emerald]]."
    ],
    conceptsZh: [
      "一切都可以分類為[[元素|blue]]（一種原子）、[[化合物|orange]]（兩種或多種化學結合的原子）或[[混合物|slate]]（物理混合但未結合的物質）。",
      "[[原子|amber]]是保留其性質的元素的最小單位。「原子」一詞來自「atomos」，意為不可分割。",
      "原子包含三種亞原子微粒：[[質子|rose]]（p+，正電，在原子核中）、[[中子|slate]]（n，中性，在原子核中）和[[電子|blue]]（e–，負電，在電子層中）。",
      "原子幾乎所有的質量都在中央的[[原子核|rose]]中；原子的大部分是真空空間。",
      "[[質子數|rose]] / [[原子序數|rose]] (Z) 是質子的數量。在電中性原子中，電子數 = Z。",
      "[[質量數|slate]] / [[核子數|slate]] (A) = 質子 + 中子。中子數 = A − Z。",
      "[[AXZ 符號|amber]]：A（頂部）是質量數，Z（底部）是原子序數，X 是元素符號。",
      "[[電子|blue]]排列在[[電子層|blue]]中（Z=1-20 為 2, 8, 8），從最靠近原子核的電子層開始填充。",
      "[[週期表|emerald]]：族號（列）與[[價電子|blue]]有關；週期號（行）等於佔用的[[電子層|blue]]數。",
      "[[同位素|purple]]是具有相同[[質子|rose]]數但[[中子|slate]]數不同的同一種元素的原子。它們具有相同的化學性質，但物理性質不同。",
      "[[物理性質|slate]]可以在不形成新物質的情況下觀察到；[[化學性質|rose]]描述物質如何反應。",
      "[[相對原子質量|amber]] (Ar) 是元素同位素的加權平均質量，按同位素豐度加權。",
      "[[離子|blue]]是帶電微粒。[[陽離子|rose]]帶正電（失去電子）；[[陰離子|blue]]帶負電（得到電子）。",
      "[[離子鍵|orange]]是帶相反電荷的離子之間的強靜電引力，由金屬向非金屬的電子轉移形成。",
      "[[離子化合物|orange]]形成具有高熔點的[[巨型離子晶格|orange]]，並在熔融或水溶液狀態下導電。它們很[[脆|rose]]，因為層可以滑動且同性電荷相互排斥。",
      "[[共價鍵|blue]]在非金屬原子共享電子對以實現惰性氣體配置時形成。點叉圖僅顯示外層電子。",
      "[[簡單分子物質|blue]]由於微弱的[[分子間作用力|slate]]而具有低熔點，且導電性差。",
      "[[巨型共價結構|emerald]]（金剛石、石墨、SiO2）具有高熔點。[[石墨|slate]]由於[[離域電子|blue]]而導電。",
      "[[金屬鍵|amber]]是正金屬離子與[[離域電子|blue]]「海」之間的吸引力。金屬具有[[延展性|emerald]]，因為離子層可以滑動。",
      "分類：僅金屬 → [[巨型金屬|amber]]；金屬 + 非金屬 → [[巨型離子|orange]]；僅非金屬 → [[簡單分子|blue]] 或 [[巨型共價|emerald]]。"
    ],
    conceptsZhSimp: [
      "一切都可以分类为[[元素|blue]]（一种原子）、[[化合物|orange]]（两种或多种化学结合的原子）或[[混合物|slate]]（物理混合但未结合的物质）。",
      "[[原子|amber]]是保留其性质的元素的最小单位。“原子”一词来自“atomos”，意为不可分割。",
      "原子包含三种亚原子微粒：[[质子|rose]]（p+，正电，在原子核中）、[[中子|slate]]（n，中性，在原子核中）和[[电子|blue]]（e–，负电，在电子层中）。",
      "原子几乎所有的质量都在中央的[[原子核|rose]]中；原子的大部分是真空空间。",
      "[[质子数|rose]] / [[原子序数|rose]] (Z) 是质子的数量。在电中性原子中，电子数 = Z。",
      "[[质量数|slate]] / [[核子数|slate]] (A) = 质子 + 中子。中子数 = A − Z。",
      "[[AXZ 符号|amber]]：A（顶部）是质量数，Z（底部）是原子序数，X 是元素符号。",
      "[[电子|blue]]排列在[[电子层|blue]]中（Z=1-20 为 2, 8, 8），从最靠近原子核的电子层开始填充。",
      "[[周期表|emerald]]：族号（列）与[[价电子|blue]]有关；周期号（行）等于占用的[[电子层|blue]]数。",
      "[[同位素|purple]]是具有相同[[质子|rose]]数但[[中子|slate]]数不同的同一种元素的原子。它们具有相同的化学性质，但物理性质不同。",
      "[[物理性质|slate]]可以在不形成新物质的情况下观察到；[[化学性质|rose]]描述物质如何反应。",
      "[[相对原子质量|amber]] (Ar) 是元素同位素的加权平均质量，按同位素丰度加权。",
      "[[离子|blue]]是带电微粒。[[阳离子|rose]]带正电（失去电子）；[[阴离子|blue]]带负电（得到电子）。",
      "[[离子键|orange]]是带相反电荷的离子之间的强静电引力，由金属向非金属的电子转移形成。",
      "[[离子化合物|orange]]形成具有高熔点的[[巨型离子晶格|orange]]，并在熔融或水溶液状态下导电。它们很[[脆|rose]]，因为层可以滑动且同性电荷相互排斥。",
      "[[共价键|blue]]在非金属原子共享电子对以实现惰性气体配置时形成。点叉图仅显示外层电子。",
      "[[简单分子物质|blue]]由于微弱的[[分子间作用力|slate]]而具有低熔点，且导电性差。",
      "[[巨型共价结构|emerald]]（金刚石、石墨、SiO2）具有高熔点。[[石墨|slate]]由于[[离域电子|blue]]而导电。",
      "[[金属键|amber]]是正金属离子与[[离域电子|blue]]“海”之间的吸引力。金属具有[[延展性|emerald]]，因为离子层可以滑动。",
      "分类：仅金属 → [[巨型金属|amber]]；金属 + 非金属 → [[巨型离子|orange]]；仅非金属 → [[简单分子|blue]] 或 [[巨型共价|emerald]]。"
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
      { 
        id: "2-1", 
        text: "What is a substance made of only [[one type of atom|blue]]?", 
        textZh: "什麼是僅由[[一種原子|blue]]組成的物質？",
        textZhSimp: "什么是仅由[[一种原子|blue]]组成的物质？",
        options: ["Compound", "Mixture", "Element", "Isotope"], 
        optionsZh: ["化合物", "混合物", "元素", "同位素"],
        optionsZhSimp: ["化合物", "混合物", "元素", "同位素"],
        correctAnswer: "Element" 
      },
      { 
        id: "2-2", 
        text: "Which sub-atomic particles are found in the [[nucleus|rose]]?", 
        textZh: "哪些亞原子微粒存在於[[原子核|rose]]中？",
        textZhSimp: "哪些亚原子微粒存在于[[原子核|rose]]中？",
        options: ["Protons and electrons", "Electrons and neutrons", "Protons and neutrons", "Only neutrons"], 
        optionsZh: ["質子和電子", "電子和中子", "質子和中子", "僅中子"],
        optionsZhSimp: ["质子和电子", "电子和中子", "质子和中子", "仅中子"],
        correctAnswer: "Protons and neutrons" 
      },
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
    titleZh: "化學計量學",
    titleZhSimp: "化学计量学",
    description: "Chemical formulas, equations, and calculations.",
    descriptionZh: "化學式、方程式和計算。",
    descriptionZhSimp: "化学式、方程式和计算。",
    color: "bg-orange-500",
    concepts: [
      "[[Chemical formulas|amber]] represent the ratio of atoms in a compound.",
      "[[Relative atomic mass|amber]] (Ar) and [[relative molecular mass|orange]] (Mr) are used in calculations.",
      "The [[mole|rose]] is the unit for amount of substance.",
      "One mole contains [[6.02 x 10^23|blue]] particles ([[Avogadro constant|blue]]).",
      "[[Balanced equations|emerald]] show the mole ratio of reactants and products.",
      "[[Empirical formula|slate]] is the simplest whole-number ratio of atoms.",
      "[[Molecular formula|slate]] is the actual number of atoms in a molecule.",
      "[[Percentage yield|rose]] = (actual yield / theoretical yield) x 100%.",
      "[[Percentage purity|emerald]] = (mass of pure substance / total mass) x 100%.",
      "[[Molar volume|blue]] of a gas is [[24 dm³|blue]] at room temperature and pressure (r.t.p.)."
    ],
    conceptsZh: [
      "[[化學式|amber]]表示化合物中原子的比例。",
      "[[相對原子質量|amber]] (Ar) 和[[相對分子質量|orange]] (Mr) 用於計算。",
      "[[摩爾|rose]]是物質的量的單位。",
      "一摩爾包含[[6.02 x 10^23|blue]]個微粒（[[阿佛加德羅常數|blue]]）。",
      "[[平衡方程式|emerald]]顯示反應物和生成物的摩爾比。",
      "[[實驗式|slate]]是原子最簡單的整數比。",
      "[[分子式|slate]]是分子中原子的實際數量。",
      "[[百分產率|rose]] = (實際產量 / 理論產量) x 100%。",
      "[[百分純度|emerald]] = (純物質質量 / 總質量) x 100%。",
      "在室溫和室壓 (r.t.p.) 下，氣體的[[摩爾體積|blue]]為[[24 dm³|blue]]。"
    ],
    conceptsZhSimp: [
      "[[化学式|amber]]表示化合物中原子的比例。",
      "[[相对原子质量|amber]] (Ar) 和[[相对分子质量|orange]] (Mr) 用于计算。",
      "[[摩尔|rose]]是物质的量的单位。",
      "一摩尔包含[[6.02 x 10^23|blue]]个微粒（[[阿佛加德罗常数|blue]]）。",
      "[[平衡方程式|emerald]]显示反应物和生成物的摩尔比。",
      "[[实验式|slate]]是原子最简单的整数比。",
      "[[分子式|slate]]是分子中原子的实际数量。",
      "[[百分产率|rose]] = (实际产量 / 理论产量) x 100%。",
      "[[百分纯度|emerald]] = (纯物质质量 / 总质量) x 100%。",
      "在室温和室压 (r.t.p.) 下，气体的[[摩尔体积|blue]]为[[24 dm³|blue]]。"
    ],
    vocab: [
      { term: "Mole", traditional: "摩爾", simplified: "摩尔", definition: "The unit for amount of substance." },
      { term: "Relative Atomic Mass", traditional: "相對原子質量", simplified: "相对原子质量", definition: "The average mass of an atom relative to 1/12th of carbon-12." },
      { term: "Empirical Formula", traditional: "實驗式", simplified: "实验式", definition: "The simplest whole-number ratio of atoms in a compound." }
    ],
    questions: [
      { 
        id: "3-1", 
        text: "What is the unit for the [[amount of a substance|rose]]?", 
        textZh: "[[物質的量|rose]]的單位是什麼？",
        textZhSimp: "[[物质的量|rose]]的单位是什么？",
        options: ["Gram", "Mole", "Liter", "Pascal"], 
        optionsZh: ["克", "摩爾", "升", "帕斯卡"],
        optionsZhSimp: ["克", "摩尔", "升", "帕斯卡"],
        correctAnswer: "Mole" 
      }
    ]
  },
  {
    id: 4,
    title: "Electrochemistry",
    titleZh: "電化學",
    titleZhSimp: "电化学",
    description: "Electricity and chemical changes.",
    descriptionZh: "電與化學變化。",
    descriptionZhSimp: "电与化学变化。",
    color: "bg-yellow-500",
    concepts: [
      "[[Electrolysis|amber]] is the breakdown of an ionic compound by electricity.",
      "The [[electrolyte|blue]] is the liquid (molten or aqueous) that conducts electricity.",
      "[[Anode|rose]] is the positive electrode; [[Cathode|blue]] is the negative electrode.",
      "[[Oxidation|rose]] occurs at the anode; [[Reduction|blue]] occurs at the cathode ([[OIL RIG|amber]]).",
      "[[Electroplating|emerald]] is using electrolysis to coat an object with a metal.",
      "In the electrolysis of [[brine|blue]], chlorine gas forms at the anode and hydrogen gas at the cathode.",
      "[[Hydrogen fuel cells|emerald]] produce electricity from the reaction between hydrogen and oxygen.",
      "[[Conductors|slate]] allow electricity to pass; [[insulators|slate]] do not.",
      "During electrolysis, [[ions|amber]] move towards the electrodes of opposite charge.",
      "[[Refining copper|rose]] uses an impure copper anode and a pure copper cathode."
    ],
    conceptsZh: [
      "[[電解|amber]]是利用電分解離子化合物的過程。",
      "[[電解質|blue]]是導電的液體（熔融或水溶液）。",
      "[[陽極|rose]]是正極；[[陰極|blue]]是負極。",
      "[[氧化|rose]]發生在陽極；[[還原|blue]]發生在陰極（[[OIL RIG|amber]]：氧化是失去，還原是得到）。",
      "[[電鍍|emerald]]是利用電解在物體表面鍍上一層金屬。",
      "在[[食鹽水|blue]]的電解中，氯氣在陽極形成，氫氣在陰極形成。",
      "[[氫燃料電池|emerald]]通過氫氣和氧氣的反應產生電能。",
      "[[導體|slate]]允許電流通過；[[絕緣體|slate]]則不允許。",
      "在電解過程中，[[離子|amber]]向帶相反電荷的電極移動。",
      "[[精煉銅|rose]]使用不純的銅陽極和純銅陰極。"
    ],
    conceptsZhSimp: [
      "[[电解|amber]]是利用电分解离子化合物的过程。",
      "[[电解质|blue]]是导电的液体（熔融或水溶液）。",
      "[[阳极|rose]]是正极；[[阴极|blue]]是负极。",
      "[[氧化|rose]]发生在阳极；[[还原|blue]]发生在阴极（[[OIL RIG|amber]]：氧化是失去，还原是得到）。",
      "[[电镀|emerald]]是利用电解在物体表面镀上一层金属。",
      "在[[食盐水|blue]]的电解中，氯气在阳极形成，氢气在阴极形成。",
      "[[氢燃料电池|emerald]]通过氢气和氧气的反应产生电能。",
      "[[导体|slate]]允许电流通过；[[绝缘体|slate]]则不允许。",
      "在电解过程中，[[离子|amber]]向带相反电荷的电极移动。",
      "[[精炼铜|rose]]使用不纯的铜阳极和纯铜阴极。"
    ],
    vocab: [
      { term: "Electrolysis", traditional: "電解", simplified: "电解", definition: "Breaking down a substance using electricity." },
      { term: "Electrode", traditional: "電極", simplified: "电极", definition: "A conductor through which electricity enters or leaves an electrolyte." }
    ],
    questions: [
      { 
        id: "4-1", 
        text: "Which electrode is the [[negative|blue]] one in electrolysis?", 
        textZh: "在電解中，哪個電極是[[負極|blue]]？",
        textZhSimp: "在电解中，哪个电极是[[负极|blue]]？",
        options: ["Anode", "Cathode", "Electrolyte", "Battery"], 
        optionsZh: ["陽極", "陰極", "電解質", "電池"],
        optionsZhSimp: ["阳极", "阴极", "电解质", "电池"],
        correctAnswer: "Cathode" 
      }
    ]
  },
  {
    id: 5,
    title: "Chemical energetics",
    titleZh: "化學能量學",
    titleZhSimp: "化学能量学",
    description: "Energy changes in chemical reactions.",
    descriptionZh: "化學反應中的能量變化。",
    descriptionZhSimp: "化学反应中的能量变化。",
    color: "bg-red-500",
    concepts: [
      "[[Exothermic|rose]] reactions release heat energy to the surroundings (ΔH is negative).",
      "[[Endothermic|blue]] reactions absorb heat energy from the surroundings (ΔH is positive).",
      "[[Enthalpy change|amber]] (ΔH) is the energy change during a reaction.",
      "[[Bond breaking|blue]] is endothermic; [[bond making|rose]] is exothermic.",
      "[[Activation energy|orange]] is the minimum energy needed for a reaction to start.",
      "[[Energy level diagrams|emerald]] show the relative energies of reactants and products.",
      "[[Reaction pathway diagrams|emerald]] include the activation energy peak.",
      "[[Combustion|rose]] and [[neutralization|emerald]] are typically exothermic.",
      "[[Photosynthesis|emerald]] and [[thermal decomposition|blue]] are typically endothermic.",
      "[[Bond energy|amber]] is the energy required to break 1 mole of a covalent bond."
    ],
    conceptsZh: [
      "[[放熱|rose]]反應向環境釋放熱能（ΔH 為負）。",
      "[[吸熱|blue]]反應從環境吸收熱能（ΔH 為正）。",
      "[[焓變|amber]] (ΔH) 是反應過程中的能量變化。",
      "[[斷鍵|blue]]是吸熱過程；[[成鍵|rose]]是放熱過程。",
      "[[活化能|orange]]是反應開始所需的最低能量。",
      "[[能量圖|emerald]]顯示反應物和生成物的相對能量。",
      "[[反應途徑圖|emerald]]包含活化能峰值。",
      "[[燃燒|rose]]和[[中和反應|emerald]]通常是放熱的。",
      "[[光合作用|emerald]]和[[熱分解|blue]]通常是吸熱的。",
      "[[鍵能|amber]]是斷開 1 摩爾共價鍵所需的能量。"
    ],
    conceptsZhSimp: [
      "[[放热|rose]]反应向环境释放热能（ΔH 为负）。",
      "[[吸热|blue]]反应从环境吸收热能（ΔH 为正）。",
      "[[焓变|amber]] (ΔH) 是反应过程中的能量变化。",
      "[[断键|blue]]是吸热过程；[[成键|rose]]是放热过程。",
      "[[活化能|orange]]是反应开始所需的最低能量。",
      "[[能量图|emerald]]显示反应物和生成物的相对能量。",
      "[[反应途径图|emerald]]包含活化能峰值。",
      "[[燃烧|rose]]和[[中和反应|emerald]]通常是放热的。",
      "[[光合作用|emerald]]和[[热分解|blue]]通常是吸热的。",
      "[[键能|amber]]是断开 1 摩尔共价键所需的能量。"
    ],
    vocab: [
      { term: "Exothermic", traditional: "放熱", simplified: "放热", definition: "A reaction that releases heat." },
      { term: "Endothermic", traditional: "吸熱", simplified: "吸热", definition: "A reaction that absorbs heat." }
    ],
    questions: [
      { 
        id: "5-1", 
        text: "In an [[exothermic|rose]] reaction, the temperature of the surroundings:", 
        textZh: "在[[放熱|rose]]反應中，環境溫度會：",
        textZhSimp: "在[[放热|rose]]反应中，环境温度会：",
        options: ["Increases", "Decreases", "Stays the same", "Becomes zero"], 
        optionsZh: ["升高", "降低", "保持不變", "變為零"],
        optionsZhSimp: ["升高", "降低", "保持不变", "变为零"],
        correctAnswer: "Increases" 
      }
    ]
  },
  {
    id: 6,
    title: "Chemical reactions",
    titleZh: "化學反應",
    titleZhSimp: "化学反应",
    description: "Rates of reaction and reversible reactions.",
    descriptionZh: "反應速率和可逆反應。",
    descriptionZhSimp: "反应速率和可逆反应。",
    color: "bg-purple-500",
    concepts: [
      "[[Rate of reaction|amber]] depends on [[concentration|blue]], [[temperature|rose]], [[surface area|emerald]], and [[catalysts|orange]].",
      "[[Collision theory|slate]]: particles must collide with enough energy ([[activation energy|orange]]) to react.",
      "[[Reversible reactions|purple]] can go both ways (A + B ⇌ C + D).",
      "[[Equilibrium|emerald]] is reached when forward and backward rates are equal in a closed system.",
      "[[Le Chatelier's principle|amber]]: changing conditions shifts equilibrium to oppose the change.",
      "[[Redox|rose]] reactions involve both [[reduction|blue]] (gain of e-) and [[oxidation|rose]] (loss of e-).",
      "[[Oxidizing agents|rose]] get reduced; [[reducing agents|blue]] get oxidized.",
      "[[Photochemical reactions|emerald]] (e.g., photosynthesis) are started by light energy.",
      "[[Catalysts|orange]] speed up reactions by providing an alternative pathway with lower activation energy.",
      "[[Enzymes|emerald]] are biological catalysts."
    ],
    conceptsZh: [
      "[[反應速率|amber]]取決於[[濃度|blue]]、[[溫度|rose]]、[[表面積|emerald]]和[[催化劑|orange]]。",
      "[[碰撞理論|slate]]：微粒必須以足夠的能量（[[活化能|orange]]）碰撞才能發生反應。",
      "[[可逆反應|purple]]可以雙向進行 (A + B ⇌ C + D)。",
      "在封閉體系中，當正向和逆向速率相等時達到[[平衡|emerald]]。",
      "[[勒夏特列原理|amber]]：改變條件會使平衡向減弱這種改變的方向移動。",
      "[[氧化還原|rose]]反應同時涉及[[還原|blue]]（得到電子）和[[氧化|rose]]（失去電子）。",
      "[[氧化劑|rose]]被還原；[[還原劑|blue]]被氧化。",
      "[[光化學反應|emerald]]（如光合作用）由光能引發。",
      "[[催化劑|orange]]通過提供具有較低活化能的替代途徑來加速反應。",
      "[[酶|emerald]]是生物催化劑。"
    ],
    conceptsZhSimp: [
      "[[反应速率|amber]]取决于[[浓度|blue]]、[[温度|rose]]、[[表面积|emerald]]和[[催化剂|orange]]。",
      "[[碰撞理论|slate]]：微粒必须以足够的能量（[[活化能|orange]]）碰撞才能发生反应。",
      "[[可逆反应|purple]]可以双向进行 (A + B ⇌ C + D)。",
      "在封闭体系中，当正向和逆向速率相等时达到[[平衡|emerald]]。",
      "[[勒夏特列原理|amber]]：改变条件会使平衡向减弱这种改变的方向移动。",
      "[[氧化还原|rose]]反应同时涉及[[还原|blue]]（得到电子）和[[氧化|rose]]（失去电子）。",
      "[[氧化剂|rose]]被还原；[[还原剂|blue]]被氧化。",
      "[[光化学反应|emerald]]（如光合作用）由光能引发。",
      "[[催化剂|orange]]通过提供具有较低活化能的替代途径来加速反应。",
      "[[酶|emerald]]是生物催化剂。"
    ],
    vocab: [
      { term: "Catalyst", traditional: "催化劑", simplified: "催化剂", definition: "A substance that speeds up a reaction without being used up." },
      { term: "Equilibrium", traditional: "平衡", simplified: "平衡", definition: "A state where forward and backward reactions happen at the same rate." }
    ],
    questions: [
      { 
        id: "6-1", 
        text: "What does a [[catalyst|orange]] do to the rate of reaction?", 
        textZh: "[[催化劑|orange]]對反應速率有什麼作用？",
        textZhSimp: "[[催化剂|orange]]对反应速率有什么作用？",
        options: ["Speeds it up", "Slows it down", "Stops it", "Has no effect"], 
        optionsZh: ["加速", "減慢", "停止", "沒有影響"],
        optionsZhSimp: ["加速", "减慢", "停止", "没有影响"],
        correctAnswer: "Speeds it up" 
      }
    ]
  },
  {
    id: 7,
    title: "Acids, bases and salts",
    titleZh: "酸、鹼和鹽",
    titleZhSimp: "酸、碱和盐",
    description: "Properties and reactions of acids and bases.",
    descriptionZh: "酸和鹼的性質與反應。",
    descriptionZhSimp: "酸和碱的性质与反应。",
    color: "bg-indigo-500",
    concepts: [
      "[[Acids|rose]] have a pH less than 7 and turn litmus [[red|rose]].",
      "[[Bases|blue]] (alkalis) have a pH greater than 7 and turn litmus [[blue|blue]].",
      "[[Neutralization|emerald]]: Acid + Base → Salt + Water.",
      "[[Indicators|amber]] like phenolphthalein and methyl orange show pH changes.",
      "[[Strong acids|rose]] fully ionize in water; [[weak acids|orange]] only partially ionize.",
      "[[Amphoteric oxides|slate]] (e.g., Al2O3) react with both acids and bases.",
      "[[Acidic oxides|rose]] are non-metal oxides; [[basic oxides|blue]] are metal oxides.",
      "[[Salts|emerald]] are formed when the hydrogen of an acid is replaced by a metal or ammonium ion.",
      "[[Solubility rules|slate]]: All nitrates are soluble; most carbonates are insoluble.",
      "[[Titration|amber]] is used to find the concentration of an acid or alkali."
    ],
    conceptsZh: [
      "[[酸|rose]]的 pH 值小於 7，能使石蕊變[[紅|rose]]。",
      "[[鹼|blue]]（鹼液）的 pH 值大於 7，能使石蕊變[[藍|blue]]。",
      "[[中和反應|emerald]]：酸 + 鹼 → 鹽 + 水。",
      "[[指示劑|amber]]（如酚酞和甲基橙）顯示 pH 值的變化。",
      "[[強酸|rose]]在水中完全電離；[[弱酸|orange]]僅部分電離。",
      "[[兩性氧化物|slate]]（如 Al2O3）既能與酸反應也能與鹼反應。",
      "[[酸性氧化物|rose]]是非金屬氧化物；[[鹼性氧化物|blue]]是金屬氧化物。",
      "當酸中的氫被金屬或銨離子取代時，就形成了[[鹽|emerald]]。",
      "[[溶解性規則|slate]]：所有硝酸鹽都可溶；大多數碳酸鹽不溶。",
      "[[滴定|amber]]用於測定酸或鹼的濃度。"
    ],
    conceptsZhSimp: [
      "[[酸|rose]]的 pH 值小于 7，能使石蕊变[[红|rose]]。",
      "[[碱|blue]]（碱液）的 pH 值大于 7，能使石蕊变[[蓝|blue]]。",
      "[[中和反应|emerald]]：酸 + 碱 → 盐 + 水。",
      "[[指示剂|amber]]（如酚酞和甲基橙）显示 pH 值的变化。",
      "[[强酸|rose]]在水中完全电离；[[弱酸|orange]]仅部分电离。",
      "[[两性氧化物|slate]]（如 Al2O3）既能与酸反应也能与碱反应。",
      "[[酸性氧化物|rose]]是非金属氧化物；[[碱性氧化物|blue]]是金属氧化物。",
      "当酸中的氢被金属或铵离子取代时，就形成了[[盐|emerald]]。",
      "[[溶解性规则|slate]]：所有硝酸盐都可溶；大多数碳酸盐不溶。",
      "[[滴定|amber]]用于测定酸或碱的浓度。"
    ],
    vocab: [
      { term: "Acid", traditional: "酸", simplified: "酸", definition: "A substance with a pH less than 7." },
      { term: "Alkali", traditional: "鹼", simplified: "碱", definition: "A soluble base with a pH greater than 7." }
    ],
    questions: [
      { 
        id: "7-1", 
        text: "What is the pH of a [[neutral|emerald]] solution?", 
        textZh: "[[中性|emerald]]溶液的 pH 值是多少？",
        textZhSimp: "[[中性|emerald]]溶液的 pH 值是多少？",
        options: ["0", "7", "14", "1"], 
        optionsZh: ["0", "7", "14", "1"],
        optionsZhSimp: ["0", "7", "14", "1"],
        correctAnswer: "7" 
      }
    ]
  },
  {
    id: 8,
    title: "The Periodic Table",
    titleZh: "週期表",
    titleZhSimp: "周期表",
    description: "Trends and patterns in the elements.",
    descriptionZh: "元素的趨勢和規律。",
    descriptionZhSimp: "元素的趋势和规律。",
    color: "bg-cyan-500",
    concepts: [
      "Elements are arranged by increasing [[atomic number|rose]].",
      "[[Groups|slate]] are vertical columns; [[Periods|slate]] are horizontal rows.",
      "[[Group I|amber]] (Alkali metals) are reactive, soft, and reactivity increases down the group.",
      "[[Group VII|rose]] (Halogens) are diatomic non-metals; reactivity decreases down the group.",
      "[[Group VIII|blue]] (Noble gases) are unreactive (monatomic) due to full outer shells.",
      "[[Transition elements|emerald]] have high densities, high melting points, and form colored compounds.",
      "[[Metallic character|amber]] decreases across a period and increases down a group.",
      "[[Valence electrons|blue]] determine the chemical properties of an element.",
      "[[Noble gases|blue]] are used in lamps (Argon) and balloons (Helium).",
      "[[Halogens|rose]] undergo displacement reactions based on their reactivity."
    ],
    conceptsZh: [
      "元素按[[原子序數|rose]]遞增排列。",
      "[[族|slate]]是垂直列；[[週期|slate]]是水平行。",
      "[[第一族|amber]]（鹼金屬）具有反應性且質軟，反應性隨族序向下遞增。",
      "[[第七族|rose]]（鹵素）是雙原子非金屬，反應性隨族序向下遞減。",
      "[[第八族|blue]]（惰性氣體）由於具有完整的外層電子層而不具反應性（單原子）。",
      "[[過渡元素|emerald]]具有高密度、高熔點，並形成有色化合物。",
      "[[金屬性|amber]]沿週期向右遞減，沿族向下遞增。",
      "[[價電子|blue]]決定元素的化學性質。",
      "[[惰性氣體|blue]]用於燈具（氬氣）和氣球（氦氣）。",
      "[[鹵素|rose]]根據其反應性發生置換反應。"
    ],
    conceptsZhSimp: [
      "元素按[[原子序数|rose]]递增排列。",
      "[[族|slate]]是垂直列；[[周期|slate]]是水平行。",
      "[[第一族|amber]]（碱金属）具有反应性且质软，反应性随族序向下递增。",
      "[[第七族|rose]]（卤素）是双原子非金属，反应性随族序向下递减。",
      "[[第八族|blue]]（惰性气体）由于具有完整的外层电子层而不具反应性（单原子）。",
      "[[过渡元素|emerald]]具有高密度、高熔点，并形成有色化合物。",
      "[[金属性|amber]]沿周期向右递减，沿族向下递增。",
      "[[价电子|blue]]决定元素的化学性质。",
      "[[惰性气体|blue]]用于灯具（氩气）和气球（氦气）。",
      "[[卤素|rose]]根据其反应性发生置换反应。"
    ],
    vocab: [
      { term: "Group", traditional: "族", simplified: "族", definition: "A vertical column in the periodic table." },
      { term: "Period", traditional: "週期", simplified: "周期", definition: "A horizontal row in the periodic table." }
    ],
    questions: [
      { 
        id: "8-1", 
        text: "Which group contains the [[Noble Gases|blue]]?", 
        textZh: "哪一族包含[[惰性氣體|blue]]？",
        textZhSimp: "哪一族包含[[惰性气体|blue]]？",
        options: ["Group I", "Group VII", "Group VIII", "Group II"], 
        optionsZh: ["第一族", "第七族", "第八族", "第二族"],
        optionsZhSimp: ["第一族", "第七族", "第八族", "第二族"],
        correctAnswer: "Group VIII" 
      }
    ]
  },
  {
    id: 9,
    title: "Metals",
    titleZh: "金屬",
    titleZhSimp: "金属",
    description: "Properties, extraction, and uses of metals.",
    descriptionZh: "金屬的性質、提取和用途。",
    descriptionZhSimp: "金属的性质、提取和用途。",
    color: "bg-slate-500",
    concepts: [
      "[[Metals|slate]] are typically shiny, conduct heat/electricity, and are [[malleable|emerald]].",
      "[[Alloys|amber]] are mixtures of a metal with other elements; they are harder than pure metals.",
      "The [[reactivity series|rose]] lists metals from most to least reactive (K > Na > Ca > Mg > Al > Zn > Fe > Pb > Cu > Ag > Au).",
      "[[Extraction|orange]]: Metals below carbon are extracted by reduction with carbon.",
      "[[Aluminium|blue]] is extracted from [[bauxite|blue]] by electrolysis.",
      "[[Iron|slate]] is extracted in a [[blast furnace|orange]] using hematite, coke, and limestone.",
      "[[Rusting|rose]] of iron requires both oxygen and water.",
      "[[Prevention of rust|emerald]]: painting, oiling, galvanizing, or sacrificial protection.",
      "[[Uses of metals|slate]]: Aluminium for aircraft (low density); Copper for wiring (conductivity).",
      "[[Sacrificial protection|emerald]] involves using a more reactive metal (e.g., Zinc) to protect Iron."
    ],
    conceptsZh: [
      "[[金屬|slate]]通常具有光澤、導熱/導電，且具有[[延展性|emerald]]。",
      "[[合金|amber]]是金屬與其他元素的混合物；它們比純金屬更硬。",
      "[[反應性序列|rose]]按反應性從強到弱排列金屬 (K > Na > Ca > Mg > Al > Zn > Fe > Pb > Cu > Ag > Au)。",
      "[[提取|orange]]：碳以下的金屬通過碳還原法提取。",
      "[[鋁|blue]]是通過電解從[[鋁土礦|blue]]中提取的。",
      "[[鐵|slate]]是在[[高爐|orange]]中利用赤鐵礦、焦炭和石灰石提取的。",
      "鐵的[[生鏽|rose]]需要氧氣和水。",
      "[[防鏽|emerald]]：噴漆、塗油、鍍鋅或犧議性保護。",
      "[[金屬的用途|slate]]：鋁用於飛機（低密度）；銅用於電線（導電性）。",
      "[[犧牲性保護|emerald]]涉及使用更活潑的金屬（如鋅）來保護鐵。"
    ],
    conceptsZhSimp: [
      "[[金属|slate]]通常具有光泽、导热/导电，且具有[[延展性|emerald]]。",
      "[[合金|amber]]是金属与其他元素的混合物；它们比纯金属更硬。",
      "[[反应性序列|rose]]按反应性从强到弱排列金属 (K > Na > Ca > Mg > Al > Zn > Fe > Pb > Cu > Ag > Au)。",
      "[[提取|orange]]：碳以下的金属通过碳还原法提取。",
      "[[铝|blue]]是通过电解从[[铝土矿|blue]]中提取的。",
      "[[铁|slate]]是在[[高炉|orange]]中利用赤铁矿、焦炭和石灰石提取的。",
      "铁的[[生锈|rose]]需要氧气和水。",
      "[[防锈|emerald]]：喷漆、涂油、镀锌或牺牲性保护。",
      "[[金属的用途|slate]]：铝用于飞机（低密度）；铜用于电线（导电性）。",
      "[[牺牲性保护|emerald]]涉及使用更活泼的金属（如锌）来保护铁。"
    ],
    vocab: [
      { term: "Alloy", traditional: "合金", simplified: "合金", definition: "A mixture of two or more elements, where at least one is a metal." },
      { term: "Corrosion", traditional: "腐蝕", simplified: "腐蚀", definition: "The gradual destruction of materials by chemical reaction." }
    ],
    questions: [
      { 
        id: "9-1", 
        text: "Which metal is the [[most reactive|rose]] in this list?", 
        textZh: "在此列表中，哪種金屬的[[反應性最強|rose]]？",
        textZhSimp: "在此列表中，哪种金属的[[反应性最强|rose]]？",
        options: ["Gold", "Iron", "Potassium", "Copper"], 
        optionsZh: ["金", "鐵", "鉀", "銅"],
        optionsZhSimp: ["金", "铁", "钾", "铜"],
        correctAnswer: "Potassium" 
      }
    ]
  },
  {
    id: 10,
    title: "Chemistry of the environment",
    titleZh: "環境化學",
    titleZhSimp: "环境化学",
    description: "Water, air, and pollution.",
    descriptionZh: "水、空氣和污染。",
    descriptionZhSimp: "水、空气和污染。",
    color: "bg-teal-500",
    concepts: [
      "[[Clean air|blue]] is 78% nitrogen, 21% oxygen, and small amounts of other gases.",
      "[[Air pollutants|rose]]: CO (incomplete combustion), SO2 (fossil fuels), NOx (car engines).",
      "[[Greenhouse gases|amber]] (CO2, CH4) contribute to [[global warming|rose]].",
      "[[Water treatment|emerald]] involves filtration and chlorination.",
      "[[Fertilizers|orange]] contain Nitrogen (N), Phosphorus (P), and Potassium (K) for plant growth.",
      "[[Acid rain|rose]] is caused by SO2 and NOx dissolving in rainwater.",
      "[[Catalytic converters|emerald]] in cars remove CO, NOx, and unburnt hydrocarbons.",
      "[[Carbon cycle|slate]] involves photosynthesis, respiration, and combustion.",
      "[[Global warming|rose]] leads to climate change and rising sea levels.",
      "[[Desalination|blue]] is the removal of salt from seawater to produce drinking water."
    ],
    conceptsZh: [
      "[[潔淨空氣|blue]]包含 78% 的氮氣、21% 的氧氣和少量其他氣體。",
      "[[空氣污染物|rose]]：CO（不完全燃燒）、SO2（化石燃料）、NOx（汽車引擎）。",
      "[[溫室氣體|amber]]（CO2、CH4）導致[[全球變暖|rose]]。",
      "[[水處理|emerald]]涉及過濾和氯化。",
      "[[肥料|orange]]含有氮 (N)、磷 (P) 和鉀 (K)，用於植物生長。",
      "[[酸雨|rose]]是由 SO2 和 NOx 溶解在雨水中引起的。",
      "汽車中的[[催化轉換器|emerald]]可去除 CO、NOx 和未燃燒的碳氫化合物。",
      "[[碳循環|slate]]涉及光合作用、呼吸作用和燃燒。",
      "[[全球變暖|rose]]導致氣候變化和海平面上升。",
      "[[海水淡化|blue]]是從海水中去除鹽分以生產飲用水的過程。"
    ],
    conceptsZhSimp: [
      "[[洁净空气|blue]]包含 78% 的氮气、21% 的氧气和少量其他气体。",
      "[[空气污染物|rose]]：CO（不完全燃烧）、SO2（化石燃料）、NOx（汽车引擎）。",
      "[[温室气体|amber]]（CO2、CH4）导致[[全球变暖|rose]]。",
      "[[水处理|emerald]]涉及过滤和氯化。",
      "[[肥料|orange]]含有氮 (N)、磷 (P) 和钾 (K)，用于植物生长。",
      "[[酸雨|rose]]是由 SO2 和 NOx 溶解在雨水中引起的。",
      "汽车中的[[催化转换器|emerald]]可去除 CO、NOx 和未燃烧的碳氢化合物。",
      "[[碳循环|slate]]涉及光合作用、呼吸作用和燃烧。",
      "[[全球变暖|rose]]导致气候变化和海平面上升。",
      "[[海水淡化|blue]]是从海水中去除盐分以生产饮用水的过程。"
    ],
    vocab: [
      { term: "Pollution", traditional: "污染", simplified: "污染", definition: "Harmful substances introduced into the environment." },
      { term: "Greenhouse Gas", traditional: "溫室氣體", simplified: "温室气体", definition: "Gases that trap heat in the atmosphere." }
    ],
    questions: [
      { 
        id: "10-1", 
        text: "What is the [[most abundant gas|blue]] in the Earth's atmosphere?", 
        textZh: "地球大氣中[[含量最高的氣體|blue]]是什麼？",
        textZhSimp: "地球大气中[[含量最高的气体|blue]]是什么？",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"], 
        optionsZh: ["氧氣", "氮氣", "二氧化碳", "氬氣"],
        optionsZhSimp: ["氧气", "氮气", "二氧化碳", "氩气"],
        correctAnswer: "Nitrogen" 
      }
    ]
  },
  {
    id: 11,
    title: "Organic chemistry",
    titleZh: "有機化學",
    titleZhSimp: "有机化学",
    description: "Carbon compounds and fuels.",
    descriptionZh: "碳化合物和燃料。",
    descriptionZhSimp: "碳化合物和燃料。",
    color: "bg-orange-700",
    concepts: [
      "[[Hydrocarbons|amber]] contain only carbon and hydrogen.",
      "[[Alkanes|blue]] are saturated (single bonds); [[Alkenes|rose]] are unsaturated (double bonds).",
      "[[Fractional distillation|emerald]] separates petroleum into useful fractions.",
      "[[Alcohols|orange]] contain the [[-OH functional group|orange]].",
      "[[Carboxylic acids|rose]] contain the [[-COOH functional group|rose]].",
      "[[Polymers|slate]] are large molecules made of many [[monomers|slate]].",
      "[[Homologous series|amber]] have the same functional group and general formula.",
      "[[Cracking|orange]] breaks long-chain alkanes into smaller alkanes and alkenes.",
      "[[Addition reactions|emerald]] occur in alkenes (e.g., with bromine water).",
      "[[Substitution reactions|blue]] occur in alkanes (e.g., with chlorine in UV light)."
    ],
    conceptsZh: [
      "[[烴|amber]]僅包含碳和氫。",
      "[[烷烴|blue]]是飽和的（單鍵）；[[烯烴|rose]]是不飽和的（雙鍵）。",
      "[[分餾|emerald]]將石油分離成有用的餾分。",
      "[[醇類|orange]]含有 [[-OH 官能團|orange]]。",
      "[[羧酸|rose]]含有 [[-COOH 官能團|rose]]。",
      "[[聚合物|slate]]是由許多[[單體|slate]]組成的大分子。",
      "[[同系列|amber]]具有相同的官能團和通式。",
      "[[裂化|orange]]將長鏈烷烴分解成較小的烷烴和烯烴。",
      "[[加成反應|emerald]]發生在烯烴中（例如與溴水反應）。",
      "[[取代反應|blue]]發生在烷烴中（例如在紫外光下與氯氣反應）。"
    ],
    conceptsZhSimp: [
      "[[烃|amber]]仅包含碳和氢。",
      "[[烷烃|blue]]是饱和的（单键）；[[烯烃|rose]]是不饱和的（双键）。",
      "[[分馏|emerald]]将石油分离成有用的馏分。",
      "[[醇类|orange]]含有 [[-OH 官能团|orange]]。",
      "[[羧酸|rose]]含有 [[-COOH 官能团|rose]]。",
      "[[聚合物|slate]]是由许多[[单体|slate]]组成的大分子。",
      "[[同系列|amber]]具有相同的官能团和通式。",
      "[[裂化|orange]]将长链烷烃分解成较小的烷烃和烯烃。",
      "[[加成反应|emerald]]发生在烯烃中（例如与溴水反应）。",
      "[[取代反应|blue]]发生在烷烃中（例如在紫外光下与氯气反应）。"
    ],
    vocab: [
      { term: "Hydrocarbon", traditional: "烴", simplified: "烃", definition: "A compound made of only hydrogen and carbon." },
      { term: "Polymer", traditional: "聚合物", simplified: "聚合物", definition: "A large molecule made of repeating units." }
    ],
    questions: [
      { 
        id: "11-1", 
        text: "Which of these is a [[saturated hydrocarbon|blue]]?", 
        textZh: "以下哪項是[[飽和烴|blue]]？",
        textZhSimp: "以下哪项是[[饱和烃|blue]]？",
        options: ["Ethene", "Ethane", "Ethanol", "Ethanoic acid"], 
        optionsZh: ["乙烯", "乙烷", "乙醇", "乙酸"],
        optionsZhSimp: ["乙烯", "乙烷", "乙醇", "乙酸"],
        correctAnswer: "Ethane" 
      }
    ]
  },
  {
    id: 12,
    title: "Experimental techniques and chemical analysis",
    titleZh: "實驗技術和化學分析",
    titleZhSimp: "实验技术和化学分析",
    description: "Laboratory methods and testing for ions.",
    descriptionZh: "實驗室方法和離子測試。",
    descriptionZhSimp: "实验室方法和离子测试。",
    color: "bg-pink-500",
    concepts: [
      "[[Apparatus|slate]] for measuring volume: [[measuring cylinder|amber]], [[pipette|emerald]], [[burette|blue]].",
      "[[Separation techniques|orange]]: [[filtration|blue]], [[crystallization|emerald]], [[distillation|rose]], [[chromatography|purple]].",
      "[[Tests for anions|rose]]: carbonate, chloride, iodide, nitrate, sulfate.",
      "[[Tests for cations|blue]]: using aqueous sodium hydroxide and ammonia.",
      "[[Tests for gases|emerald]]: hydrogen, oxygen, carbon dioxide, ammonia, chlorine.",
      "[[Purity|slate]] can be checked by measuring melting and boiling points.",
      "[[Chromatography|purple]] uses a solvent to separate pigments based on solubility.",
      "[[Flame tests|rose]] identify metal ions (e.g., Lithium is red, Copper is blue-green).",
      "[[Precipitation reactions|emerald]] are used to identify aqueous ions.",
      "[[Rf value|amber]] = distance moved by substance / distance moved by solvent."
    ],
    conceptsZh: [
      "用於測量體體積的[[儀器|slate]]：[[量筒|amber]]、[[移液管|emerald]]、[[滴定管|blue]]。",
      "[[分離技術|orange]]：[[過濾|blue]]、[[結晶|emerald]]、[[蒸餾|rose]]、[[層析法|purple]]。",
      "[[陰離子測試|rose]]：碳酸鹽、氯化物、碘化物、硝酸鹽、硫酸鹽。",
      "[[陽離子測試|blue]]：使用氫氧化鈉水溶液和氨水。",
      "[[氣體測試|emerald]]：氫氣、氧氣、二氧化碳、氨氣、氯氣。",
      "可以通過測量熔點和沸點來檢查[[純度|slate]]。",
      "[[層析法|purple]]利用溶劑根據溶解度分離色素。",
      "[[焰色反應|rose]]識別金屬離子（例如：鋰為紅色，銅為藍綠色）。",
      "[[沉澱反應|emerald]]用於識別水溶液中的離子。",
      "[[Rf 值|amber]] = 物質移動距離 / 溶劑移動距離。"
    ],
    conceptsZhSimp: [
      "用于测量体积的[[仪器|slate]]：[[量筒|amber]]、[[移液管|emerald]]、[[滴定管|blue]]。",
      "[[分离技术|orange]]：[[过滤|blue]]、[[结晶|emerald]]、[[蒸馏|rose]]、[[层析法|purple]]。",
      "[[阴离子测试|rose]]：碳酸盐、氯化物、碘化物、硝酸盐、硫酸盐。",
      "[[阳离子测试|blue]]：使用氢氧化钠水溶液和氨水。",
      "[[气体测试|emerald]]：氢气、氧气、二氧化碳、氨气、氯气。",
      "可以通过测量熔点和沸点来检查[[纯度|slate]]。",
      "[[层析法|purple]]利用溶剂根据溶解度分离色素。",
      "[[焰色反应|rose]]识别金属离子（例如：锂为红色，铜为蓝绿色）。",
      "[[沉淀反应|emerald]]用于识别水溶液中的离子。",
      "[[Rf 值|amber]] = 物质移动距离 / 溶剂移动距离。"
    ],
    vocab: [
      { term: "Titration", traditional: "滴定", simplified: "滴定", definition: "A technique to find the concentration of a solution." },
      { term: "Distillation", traditional: "蒸餾", simplified: "蒸馏", definition: "Separating liquids based on boiling points." }
    ],
    questions: [
      { 
        id: "12-1", 
        text: "Which piece of apparatus is [[most accurate|emerald]] for measuring 25.0 cm³ of liquid?", 
        textZh: "哪種儀器測量 25.0 cm³ 液體[[最準確|emerald]]？",
        textZhSimp: "哪种仪器测量 25.0 cm³ 液体[[最准确|emerald]]？",
        options: ["Beaker", "Measuring cylinder", "Pipette", "Conical flask"], 
        optionsZh: ["燒杯", "量筒", "移液管", "錐形瓶"],
        optionsZhSimp: ["烧杯", "量筒", "移液管", "锥形瓶"],
        correctAnswer: "Pipette" 
      }
    ]
  }
];
