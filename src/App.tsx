/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Heart, 
  BookOpen, 
  GraduationCap, 
  Languages, 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  Trophy,
  ArrowRight,
  ArrowRightLeft,
  ArrowDown,
  ArrowUp,
  Palette,
  Factory,
  Home,
  RefreshCw,
  Thermometer,
  Github,
  ExternalLink,
  Info,
  Zap,
  LayoutGrid,
  List,
  Eye,
  EyeOff,
  FlaskConical,
  Search,
  Calculator,
  Atom,
  Variable,
  Dna,
  Beaker,
  Wind,
  Droplets,
  Flame,
  TrendingUp,
  QrCode,
  Layers,
  Settings,
  Activity,
  Hash,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { units, Unit, Question, Vocab } from './data';

type AppMode = 'splash' | 'dashboard' | 'quiz' | 'quiz-select' | 'revision' | 'vocab' | 'result' | 'user-stats' | 'about' | 'playground' | 'facts';
type QuizSubMode = 'quick' | 'time-attack' | 'marathon';

interface SessionStats {
  [unitId: number]: {
    attemptedQuestions: string[];
    masteredVocab: string[];
  }
}

export default function App() {
  const [mode, setMode] = useState<AppMode>('splash');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [quizProgress, setQuizProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [hearts, setHearts] = useState(5);
  const [quizSubMode, setQuizSubMode] = useState<QuizSubMode>('quick');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isY11Open, setIsY11Open] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({});

  const [isAssistMode, setIsAssistMode] = useState(false);
  const [isSimplified, setIsSimplified] = useState(false);
  const [columns, setColumns] = useState(1);

  const toggleColumns = () => {
    setColumns(prev => (prev % 3) + 1);
  };

  const HighlightedText = ({ text, className = "" }: { text: string, className?: string }) => {
    if (!text) return null;
    
    // Pattern: [[text|color]]
    const parts = text.split(/(\[\[.*?\|.*?\]\])/g);
    
    return (
      <span className={className}>
        {parts.map((part, i) => {
          const match = part.match(/^\[\[(.*?)\|(.*?)\]\]$/);
          if (match) {
            const [_, content, color] = match;
            const colorClasses: { [key: string]: string } = {
              emerald: 'text-emerald-500 bg-emerald-50 px-1 rounded',
              rose: 'text-rose-500 bg-rose-50 px-1 rounded',
              blue: 'text-blue-500 bg-blue-50 px-1 rounded',
              amber: 'text-amber-500 bg-amber-50 px-1 rounded',
              orange: 'text-orange-500 bg-orange-50 px-1 rounded',
              indigo: 'text-indigo-500 bg-indigo-50 px-1 rounded',
              purple: 'text-purple-500 bg-purple-50 px-1 rounded',
              cyan: 'text-cyan-500 bg-cyan-50 px-1 rounded',
              slate: 'text-slate-500 bg-slate-50 px-1 rounded',
              teal: 'text-teal-500 bg-teal-50 px-1 rounded',
              pink: 'text-pink-500 bg-pink-50 px-1 rounded',
            };
            return (
              <span key={i} className={`font-black ${colorClasses[color] || 'text-indigo-500'}`}>
                {content}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  };

  const allConcepts = useMemo(() => units.flatMap(unit => unit.concepts), []);
  const [randomConcept, setRandomConcept] = useState(() => 
    allConcepts[Math.floor(Math.random() * allConcepts.length)]
  );

  const refreshConcept = () => {
    let nextConcept;
    do {
      nextConcept = allConcepts[Math.floor(Math.random() * allConcepts.length)];
    } while (nextConcept === randomConcept && allConcepts.length > 1);
    setRandomConcept(nextConcept);
  };

  // Splash screen timeout
  useEffect(() => {
    if (mode === 'splash') {
      const timer = setTimeout(() => setMode('dashboard'), 3000);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  // Time Attack timer
  useEffect(() => {
    if (mode === 'quiz' && quizSubMode === 'time-attack' && timeLeft > 0 && !isAnswerChecked) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setMode('result');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, quizSubMode, timeLeft, isAnswerChecked]);

  const startQuiz = (unit: Unit) => {
    setSelectedUnit(unit);
    setMode('quiz-select');
  };

  const startQuizWithMode = (unit: Unit, subMode: QuizSubMode) => {
    setQuizSubMode(subMode);
    const shuffled = [...unit.questions].sort(() => 0.5 - Math.random());
    
    if (subMode === 'quick') {
      setQuizQuestions(shuffled.slice(0, 10));
    } else if (subMode === 'time-attack') {
      setQuizQuestions(shuffled);
      setTimeLeft(30);
    } else {
      setQuizQuestions(shuffled);
    }

    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizProgress(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setHearts(5);
    setMode('quiz');
  };

  const startRevision = (unit: Unit) => {
    setSelectedUnit(unit);
    setMode('revision');
  };

  const startVocab = (unit: Unit) => {
    setSelectedUnit(unit);
    setMode('vocab');
  };

  const handleOptionSelect = (option: string) => {
    if (!isAnswerChecked) {
      setSelectedOption(option);
    }
  };

  const checkAnswer = () => {
    if (selectedOption && selectedUnit) {
      setIsAnswerChecked(true);
      
      // Track attempted question
      const qId = quizQuestions[currentQuestionIndex].id;
      setSessionStats(prev => {
        const unitStats = prev[selectedUnit.id] || { attemptedQuestions: [], masteredVocab: [] };
        if (!unitStats.attemptedQuestions.includes(qId)) {
          return {
            ...prev,
            [selectedUnit.id]: {
              ...unitStats,
              attemptedQuestions: [...unitStats.attemptedQuestions, qId]
            }
          };
        }
        return prev;
      });

      if (selectedOption === quizQuestions[currentQuestionIndex].correctAnswer) {
        setScore(prev => prev + 1);
      } else {
        setHearts(prev => Math.max(0, prev - 1));
      }
    }
  };

  const nextQuestion = () => {
    if (hearts <= 0) {
      setMode('result');
      return;
    }
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < quizQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setQuizProgress(((nextIndex) / quizQuestions.length) * 100);
    } else {
      if (quizSubMode === 'time-attack' || quizSubMode === 'marathon') {
        // Shuffle again and continue for time-attack or marathon if we run out of questions
        const reshuffled = [...selectedUnit!.questions].sort(() => 0.5 - Math.random());
        setQuizQuestions(prev => [...prev, ...reshuffled]);
        setCurrentQuestionIndex(nextIndex);
        setSelectedOption(null);
        setIsAnswerChecked(false);
      } else {
        setQuizProgress(100);
        setMode('result');
      }
    }
  };

  // Components
  const SplashScreen = () => (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-red-500 mb-8"
      >
        <Heart size={120} fill="currentColor" />
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800"
      >
        Made with love by Toman
      </motion.h1>
    </div>
  );

  const Y11Splash = ({ onClose }: { onClose: () => void }) => {
    const [activeEmojis, setActiveEmojis] = useState<{ id: number; emoji: string; x: number; y: number; size: number }[]>([]);
    
    const spawnEmoji = () => {
      const facialEmojis = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😻", "😼", "😽", "🙀", "😿", "😾"];
      const id = Date.now();
      const newEmoji = {
        id,
        emoji: facialEmojis[Math.floor(Math.random() * facialEmojis.length)],
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        size: Math.random() * 60 + 40,
      };
      setActiveEmojis(prev => [...prev, newEmoji]);
      setTimeout(() => {
        setActiveEmojis(prev => prev.filter(e => e.id !== id));
      }, 1000);
    };

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05
        }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-orange-500 flex flex-col items-center justify-center p-8 overflow-y-auto"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-[120]"
        >
          <XCircle size={40} />
        </button>

        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-4xl font-black uppercase tracking-tighter mb-12 text-center"
        >
          Class of 2025-26
        </motion.h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-4xl w-full"
        >
          {[
            "Robin", "Tom", "Andy", "Minnie", "Hanna", "Unis", "Frank", "Winnie", 
            "Nicole", "Doris", "Liora", "Jannie", "Pinhong", "Hannah", "Sophie", "Angel"
          ].map((name) => (
            <motion.button
              key={name}
              variants={itemVariants}
              onClick={(e) => {
                e.stopPropagation();
                spawnEmoji();
              }}
              className="text-white text-2xl font-bold uppercase tracking-wide hover:scale-110 transition-transform text-center outline-none"
            >
              {name}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence>
          {activeEmojis.map(emoji => (
            <motion.div
              key={emoji.id}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.5, y: -50 }}
              className="fixed pointer-events-none z-[110]"
              style={{ 
                left: `${emoji.x}%`, 
                top: `${emoji.y}%`, 
                fontSize: `${emoji.size}px` 
              }}
            >
              {emoji.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  const Bubble = ({ i, rate }: { i: number, rate: number, key?: string | number }) => {
    return (
      <motion.div
        initial={{ y: 150, x: 20 + (i * 15) % 80, opacity: 0, scale: 0.5 }}
        animate={{ 
          y: [150, 40], 
          x: 20 + (i * 15) % 80 + Math.sin(i) * 10,
          opacity: [0, 1, 0],
          scale: [0.5, 1, 0.8]
        }}
        transition={{ 
          duration: 2 / rate, 
          repeat: Infinity, 
          delay: i * (0.5 / rate),
          ease: "linear"
        }}
        className="absolute w-2 h-2 bg-white/60 border border-white/80 rounded-full z-0"
      />
    );
  };

  const AcidMolecule = ({ i, active, type }: { i: number, active: boolean, type: 'strong' | 'weak', key?: string | number }) => {
    const delay = i * 0.3;
    // For strong acid, all dissociate. For weak, only the first one dissociates.
    const isDissociated = type === 'strong' || (type === 'weak' && i === 0);
    
    return (
      <motion.div
        initial={{ y: -40, x: 20 + i * 25 }}
        animate={active ? {
          y: 100 + (i % 3) * 15,
          x: 20 + i * 25 + (Math.random() - 0.5) * 10,
        } : { y: -40, x: 20 + i * 25 }}
        transition={{ duration: 1, delay, ease: "easeOut" }}
        className="absolute"
      >
        <div className="relative">
          {/* Conjugate Base (Big White Dot) */}
          <motion.div 
            animate={active && isDissociated ? { x: -8, y: -4, rotate: 45 } : { x: 0, y: 0, rotate: 0 }}
            transition={{ delay: delay + 0.8, type: "spring", stiffness: 100 }}
            className="w-5 h-5 bg-white border-2 border-gray-300 rounded-full shadow-sm flex items-center justify-center z-10"
          >
            <span className="text-[5px] font-black text-gray-400 leading-none">
              {type === 'strong' ? 'Cl⁻' : 'CH₃COO⁻'}
            </span>
          </motion.div>

          {/* H+ Ion (Small Red Dot) */}
          <motion.div 
            animate={active && isDissociated ? { x: 12, y: 8 } : { x: 8, y: -4 }}
            transition={{ delay: delay + 0.8, type: "spring", stiffness: 100 }}
            className="absolute w-2.5 h-2.5 bg-rose-500 rounded-full shadow-sm flex items-center justify-center z-20 border border-rose-600"
          >
             <span className="text-[4px] font-black text-white leading-none">H⁺</span>
          </motion.div>
          
          {/* Connection Line (only visible when not dissociated) */}
          {!active && (
            <div className="absolute top-1 left-3 w-0.5 h-3 bg-gray-300 -rotate-45 -z-10" />
          )}
        </div>
      </motion.div>
    );
  };

  const SimpleSubstanceDrawing = () => (
    <div className="relative w-full h-24 bg-sky-50/30 rounded-xl overflow-hidden border border-sky-100">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            x: [Math.random() * 80, Math.random() * 80],
            y: [Math.random() * 60, Math.random() * 60],
            rotate: [0, 360]
          }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute flex"
          style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 20}%` }}
        >
          <div className="w-2.5 h-2.5 bg-sky-400/40 rounded-full" />
          <div className="w-2.5 h-2.5 bg-sky-400/40 rounded-full -ml-1" />
        </motion.div>
      ))}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-black text-sky-400 uppercase tracking-widest">Loosely Packed</div>
    </div>
  );

  const GiantSubstanceDrawing = () => (
    <div className="relative w-full h-24 bg-rose-50/30 rounded-xl overflow-hidden border border-rose-100">
      <div className="grid grid-cols-6 grid-rows-3 gap-1 p-2 h-full">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
            className="w-full h-full bg-rose-400/40 rounded-sm"
          />
        ))}
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-black text-rose-400 uppercase tracking-widest">Tightly Packed</div>
    </div>
  );

  const SimpleAtomDrawing = () => (
    <div className="relative w-full h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            x: [Math.random() * 10, -Math.random() * 10, Math.random() * 10],
            y: [Math.random() * 10, -Math.random() * 10, Math.random() * 10]
          }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: "linear" }}
          className="absolute w-3 h-3 bg-blue-400 rounded-full shadow-sm"
          style={{ left: `${20 + (i % 3) * 30}%`, top: `${20 + Math.floor(i / 3) * 40}%` }}
        />
      ))}
    </div>
  );

  const SimpleMoleculeDrawing = () => (
    <div className="relative w-full h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            x: [Math.random() * 15, -Math.random() * 15],
            y: [Math.random() * 15, -Math.random() * 15],
            rotate: [0, 360]
          }}
          transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: "linear" }}
          className="absolute flex items-center"
          style={{ left: `${15 + (i % 3) * 30}%`, top: `${20 + Math.floor(i / 3) * 40}%` }}
        >
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-sm border border-emerald-500" />
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-sm border border-emerald-500 -ml-1" />
        </motion.div>
      ))}
    </div>
  );

  const GiantIonicDrawing = () => (
    <div className="relative w-full h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-2">
      <div className="grid grid-cols-5 grid-rows-3 gap-1 h-full">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ x: [0, 1, -1, 0], y: [0, -1, 1, 0] }}
            transition={{ duration: 0.2, repeat: Infinity }}
            className={`w-full h-full rounded-full shadow-sm flex items-center justify-center text-[6px] font-bold text-white
              ${i % 2 === 0 ? 'bg-blue-500' : 'bg-rose-500'}
            `}
          >
            {i % 2 === 0 ? '+' : '-'}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const GiantMetallicDrawing = () => (
    <div className="relative w-full h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-2">
      <div className="grid grid-cols-5 grid-rows-3 gap-2 h-full relative z-10">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="w-full h-full bg-blue-500 rounded-full shadow-sm flex items-center justify-center text-[6px] font-bold text-white">
            +
          </div>
        ))}
      </div>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`e-${i}`}
          animate={{ 
            x: [Math.random() * 100, Math.random() * 100],
            y: [Math.random() * 80, Math.random() * 80]
          }}
          transition={{ duration: 1 + Math.random(), repeat: Infinity, ease: "linear" }}
          className="absolute w-1 h-1 bg-rose-500 rounded-full z-0"
        />
      ))}
    </div>
  );

  const GiantCovalentDrawing = () => (
    <div className="relative w-full h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-gray-400">
        {/* Simple tetrahedral representation */}
        <circle cx="50" cy="50" r="4" fill="currentColor" />
        <line x1="50" y1="50" x2="50" y2="20" stroke="currentColor" strokeWidth="2" />
        <line x1="50" y1="50" x2="20" y2="70" stroke="currentColor" strokeWidth="2" />
        <line x1="50" y1="50" x2="80" y2="70" stroke="currentColor" strokeWidth="2" />
        <line x1="50" y1="50" x2="65" y2="40" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="20" r="4" fill="currentColor" />
        <circle cx="20" cy="70" r="4" fill="currentColor" />
        <circle cx="80" cy="70" r="4" fill="currentColor" />
        <circle cx="65" cy="40" r="4" fill="currentColor" />
      </svg>
    </div>
  );

  const StatesOfMatterAnimation = () => {
    const [state, setState] = useState<'solid' | 'liquid' | 'gas'>('solid');
    
    return (
      <div className="space-y-4 mt-4">
        <div className="flex justify-center gap-2">
          {(['solid', 'liquid', 'gas'] as const).map(s => (
            <button
              key={s}
              onClick={() => setState(s)}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
                ${state === s ? 'bg-emerald-500 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}
              `}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative w-full h-32 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
          {state === 'solid' && (
            <div className="grid grid-cols-8 grid-rows-4 gap-1 p-2 h-full">
              {[...Array(32)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ x: [0, 0.5, -0.5, 0], y: [0, -0.5, 0.5, 0] }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                  className="w-full h-full bg-emerald-400/60 rounded-full"
                />
              ))}
            </div>
          )}
          {state === 'liquid' && (
            <div className="relative w-full h-full p-2">
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    x: [Math.random() * 5, -Math.random() * 5],
                    y: [Math.random() * 5, -Math.random() * 5]
                  }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                  className="absolute w-4 h-4 bg-blue-400/60 rounded-full shadow-sm"
                  style={{ left: `${(i % 6) * 15 + 5}%`, bottom: `${Math.floor(i / 6) * 15 + 5}%` }}
                />
              ))}
            </div>
          )}
          {state === 'gas' && (
            <div className="relative w-full h-full">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    x: [Math.random() * 280, Math.random() * 280],
                    y: [Math.random() * 100, Math.random() * 100]
                  }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                  className="absolute w-3 h-3 bg-orange-400/60 rounded-full shadow-sm"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const DiffusionAnimation = () => {
    const [isPartitionRemoved, setIsPartitionRemoved] = useState(false);
    
    return (
      <div className="space-y-4 mt-4">
        <div className="flex justify-center">
          <button
            onClick={() => setIsPartitionRemoved(!isPartitionRemoved)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2
              ${isPartitionRemoved 
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_2px_0_0_#059669]' 
                : 'bg-white text-emerald-500 border-emerald-100 hover:border-emerald-200 shadow-[0_2px_0_0_#ecfdf5]'
              }
            `}
          >
            {isPartitionRemoved ? 'Reset Partition' : 'Remove Partition'}
          </button>
        </div>
        <div className="relative w-full h-32 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-2">
          <AnimatePresence>
            {!isPartitionRemoved && (
              <motion.div 
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                className="absolute inset-y-0 left-1/2 w-1 bg-gray-300 z-20 origin-top"
              />
            )}
          </AnimatePresence>
          
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 40, 
                y: Math.random() * 100 
              }}
              animate={isPartitionRemoved ? { 
                x: [null, Math.random() * 280],
                y: [null, Math.random() * 100]
              } : {
                x: [null, Math.random() * 130],
                y: [null, Math.random() * 100]
              }}
              transition={{ 
                duration: 5 + Math.random() * 5, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "linear"
              }}
              className="absolute w-2 h-2 bg-emerald-500 rounded-full shadow-sm z-10"
            />
          ))}
          <div className="absolute top-2 left-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">High Conc.</div>
          <div className="absolute top-2 right-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">Low Conc.</div>
        </div>
      </div>
    );
  };

  const AtomicStructureDrawing = () => (
    <div className="relative w-full h-40 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center mt-4">
      {/* Nucleus */}
      <div className="relative w-8 h-8 flex items-center justify-center z-20">
        <div className="absolute w-4 h-4 bg-rose-500 rounded-full blur-[0.5px] shadow-sm" />
        <div className="absolute w-4 h-4 bg-slate-400 rounded-full translate-x-1 blur-[0.5px] shadow-sm" />
        <div className="absolute w-4 h-4 bg-rose-500 rounded-full -translate-y-1 blur-[0.5px] shadow-sm" />
      </div>
      
      {/* Shells */}
      <div className="absolute w-20 h-20 border border-blue-200 rounded-full z-10" />
      <div className="absolute w-32 h-32 border border-blue-100 rounded-full z-10" />
      
      {/* Electrons */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute w-20 h-20 z-30"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-sm" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-sm" />
      </motion.div>
      
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute w-32 h-32 z-30"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-sm" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-sm" />
      </motion.div>
    </div>
  );

  const IonicBondingAnimation = () => (
    <div className="relative w-full h-40 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-around p-4 mt-4">
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-16 h-16 border-2 border-rose-100 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-[10px] text-white font-black">Na</div>
          <motion.div
            animate={{ x: [0, 100], opacity: [1, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, times: [0, 0.8, 1] }}
            className="absolute top-0 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm"
          />
        </div>
        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Metal (Loses e⁻)</span>
      </div>
      
      <ArrowRight className="text-gray-300" />
      
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-16 h-16 border-2 border-blue-100 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white font-black">Cl</div>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: [-100, 0], opacity: [0, 1, 1] }}
            transition={{ duration: 2, repeat: Infinity, times: [0, 0.2, 1] }}
            className="absolute top-0 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm"
          />
        </div>
        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Non-metal (Gains e⁻)</span>
      </div>
    </div>
  );

  const CovalentBondingAnimation = () => (
    <div className="relative w-full h-40 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center p-4 mt-4">
      <div className="relative flex items-center">
        <div className="w-24 h-24 border-2 border-emerald-100 rounded-full flex items-center justify-start pl-4">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white font-black">H</div>
        </div>
        <div className="w-24 h-24 border-2 border-emerald-100 rounded-full -ml-8 flex items-center justify-end pr-4">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white font-black">H</div>
        </div>
        {/* Shared electrons */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col gap-1 z-10">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm" />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }} className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm" />
        </div>
      </div>
      <div className="absolute bottom-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">Shared Electron Pair</div>
    </div>
  );

  const DiffusionExperimentAnimation = () => {
    const [temp, setTemp] = useState(1); // 1: Low, 2: Medium, 3: High
    
    return (
      <div className="space-y-4 mt-4">
        <div className="flex justify-center gap-2">
          {[
            { val: 1, label: 'Low T', color: 'bg-blue-500' },
            { val: 2, label: 'Med T', color: 'bg-orange-500' },
            { val: 3, label: 'High T', color: 'bg-rose-500' }
          ].map((t) => (
            <button
              key={t.val}
              onClick={() => setTemp(t.val)}
              className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all border-2
                ${temp === t.val 
                  ? `${t.color} text-white border-transparent shadow-md` 
                  : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                }
              `}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative w-full h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-4 flex items-center">
          <div className="w-full h-8 bg-white border-2 border-gray-200 rounded-lg relative flex items-center">
            <div className="absolute left-2 w-4 h-4 bg-emerald-100 rounded-sm flex items-center justify-center text-[6px] font-black text-emerald-600">NH₃</div>
            <div className="absolute right-2 w-4 h-4 bg-rose-100 rounded-sm flex items-center justify-center text-[6px] font-black text-rose-600">HCl</div>
            
            {/* NH3 particles moving fast */}
            <motion.div
              key={`nh3-${temp}`}
              animate={{ x: [0, 160], opacity: [0, 1, 0] }}
              transition={{ duration: 2 / temp, repeat: Infinity, ease: "linear" }}
              className="absolute left-6 w-1.5 h-1.5 bg-emerald-400 rounded-full"
            />
            
            {/* HCl particles moving slow */}
            <motion.div
              key={`hcl-${temp}`}
              animate={{ x: [0, -60], opacity: [0, 1, 0] }}
              transition={{ duration: 4 / temp, repeat: Infinity, ease: "linear" }}
              className="absolute right-6 w-1.5 h-1.5 bg-rose-400 rounded-full"
            />
            
            {/* White ring formation */}
            <motion.div
              key={`ring-${temp}`}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2 / temp, repeat: Infinity, delay: 1.5 / temp }}
              className="absolute right-16 w-1 h-6 bg-white border border-gray-300 shadow-sm z-10"
            />
          </div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-black text-gray-400 uppercase tracking-widest">
            NH₃ diffuses faster than HCl
          </div>
        </div>
      </div>
    );
  };

  const AXZNotationDrawing = () => (
    <div className="relative w-full h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center mt-4">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-2xl font-black text-slate-500">12</span>
          <span className="text-2xl font-black text-rose-500">6</span>
        </div>
        <span className="text-6xl font-black text-gray-800">C</span>
        <div className="flex flex-col gap-1 text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-slate-500 rounded-full" />
            <span className="text-slate-500">Mass Number (A)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-500 rounded-full" />
            <span className="text-rose-500">Atomic Number (Z)</span>
          </div>
        </div>
      </div>
    </div>
  );

  const EquationBalancerAnimation = () => {
    const [h2, setH2] = useState(1);
    const [o2, setO2] = useState(1);
    const [h2o, setH2o] = useState(1);
    
    const isBalanced = h2 * 2 === h2o * 2 && o2 * 2 === h2o * 1;
    
    return (
      <div className="space-y-4 mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="flex items-center justify-center gap-4 text-xl font-black">
          <div className="flex flex-col items-center">
            <input type="number" min="1" max="5" value={h2} onChange={e => setH2(parseInt(e.target.value) || 1)} className="w-12 text-center border-2 border-blue-200 rounded-lg text-blue-600" />
            <span className="text-xs uppercase text-gray-400">H₂</span>
          </div>
          <span>+</span>
          <div className="flex flex-col items-center">
            <input type="number" min="1" max="5" value={o2} onChange={e => setO2(parseInt(e.target.value) || 1)} className="w-12 text-center border-2 border-rose-200 rounded-lg text-rose-600" />
            <span className="text-xs uppercase text-gray-400">O₂</span>
          </div>
          <span>→</span>
          <div className="flex flex-col items-center">
            <input type="number" min="1" max="5" value={h2o} onChange={e => setH2o(parseInt(e.target.value) || 1)} className="w-12 text-center border-2 border-emerald-200 rounded-lg text-emerald-600" />
            <span className="text-xs uppercase text-gray-400">H₂O</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg border-2 border-gray-100">
            <div className="text-[10px] font-black uppercase text-gray-400 mb-2">Reactants</div>
            <div className="flex flex-wrap gap-1">
              {[...Array(h2 * 2)].map((_, i) => <div key={`h-${i}`} className="w-3 h-3 bg-blue-400 rounded-full" />)}
              {[...Array(o2 * 2)].map((_, i) => <div key={`o-${i}`} className="w-3 h-3 bg-rose-400 rounded-full" />)}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border-2 border-gray-100">
            <div className="text-[10px] font-black uppercase text-gray-400 mb-2">Products</div>
            <div className="flex flex-wrap gap-1">
              {[...Array(h2o * 2)].map((_, i) => <div key={`ph-${i}`} className="w-3 h-3 bg-blue-400 rounded-full" />)}
              {[...Array(h2o * 1)].map((_, i) => <div key={`po-${i}`} className="w-3 h-3 bg-rose-400 rounded-full" />)}
            </div>
          </div>
        </div>
        
        {isBalanced ? (
          <div className="text-center text-emerald-500 font-black text-xs uppercase tracking-widest animate-bounce">✨ Equation Balanced! ✨</div>
        ) : (
          <div className="text-center text-gray-400 text-[10px] font-bold uppercase">Adjust coefficients to balance atoms</div>
        )}
      </div>
    );
  };

  const MolarVolumeAnimation = () => {
    const [gas, setGas] = useState<'He' | 'O2' | 'CO2'>('He');
    
    const gasData = {
      He: { color: 'bg-blue-400', size: 'w-2 h-2', label: 'Helium (Ar=4)' },
      O2: { color: 'bg-rose-400', size: 'w-4 h-4', label: 'Oxygen (Mr=32)' },
      CO2: { color: 'bg-slate-400', size: 'w-5 h-5', label: 'Carbon Dioxide (Mr=44)' }
    };

    return (
      <div className="space-y-4 mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="flex justify-center gap-2">
          {(['He', 'O2', 'CO2'] as const).map(g => (
            <button
              key={g}
              onClick={() => setGas(g)}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
                ${gas === g ? 'bg-indigo-500 text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100'}
              `}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="relative w-full h-32 bg-white border-2 border-dashed border-indigo-200 rounded-xl flex items-center justify-center">
          <div className="absolute inset-0 flex flex-wrap p-4 gap-4 items-center justify-center">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`${gas}-${i}`}
                animate={{ 
                  x: [Math.random() * 20, -Math.random() * 20],
                  y: [Math.random() * 20, -Math.random() * 20]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className={`${gasData[gas].size} ${gasData[gas].color} rounded-full shadow-sm`}
              />
            ))}
          </div>
          <div className="absolute bottom-2 bg-indigo-50 px-3 py-1 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest">
            Volume = 24 dm³ (1 mole at r.t.p.)
          </div>
        </div>
        <div className="text-center text-[10px] font-bold text-gray-400 uppercase">{gasData[gas].label}</div>
      </div>
    );
  };

  const InteractiveElectrolysisAnimation = () => {
    const [isOn, setIsOn] = useState(false);
    
    return (
      <div className="space-y-4 mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="flex justify-center">
          <button
            onClick={() => setIsOn(!isOn)}
            className={`px-6 py-2 rounded-full font-black uppercase tracking-widest transition-all border-2
              ${isOn 
                ? 'bg-yellow-400 text-gray-800 border-yellow-500 shadow-[0_4px_0_0_#ca8a04]' 
                : 'bg-white text-gray-400 border-gray-200 shadow-[0_4px_0_0_#e5e7eb]'
              }
            `}
          >
            Power: {isOn ? 'ON' : 'OFF'}
          </button>
        </div>
        
        <div className="relative w-full h-40 bg-white border-2 border-gray-200 rounded-xl overflow-hidden p-4">
          {/* Electrodes */}
          <div className="absolute top-0 left-1/4 w-4 h-32 bg-slate-700 rounded-b-lg shadow-md flex items-end justify-center pb-2">
            <span className="text-[8px] text-white font-black">+</span>
          </div>
          <div className="absolute top-0 right-1/4 w-4 h-32 bg-slate-700 rounded-b-lg shadow-md flex items-end justify-center pb-2">
            <span className="text-[8px] text-white font-black">-</span>
          </div>
          
          {/* Electrolyte */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-blue-100/50 border-t-2 border-blue-200" />
          
          {/* Ions */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={isOn ? {
                x: i % 2 === 0 ? [0, -40] : [0, 40],
                opacity: [1, 1, 0]
              } : {
                x: [0, Math.random() * 5, -Math.random() * 5, 0],
                y: [0, Math.random() * 5, -Math.random() * 5, 0]
              }}
              transition={{ 
                duration: isOn ? 2 : 1, 
                repeat: Infinity,
                delay: i * 0.2
              }}
              className={`absolute w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-sm
                ${i % 2 === 0 ? 'bg-rose-500 left-1/2' : 'bg-blue-500 right-1/2'}
              `}
              style={{ bottom: `${20 + (i % 4) * 15}%` }}
            >
              {i % 2 === 0 ? '-' : '+'}
            </motion.div>
          ))}
          
          {/* Bubbles at Anode */}
          {isOn && [...Array(5)].map((_, i) => (
            <motion.div
              key={`b-${i}`}
              animate={{ y: [0, -40], opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
              className="absolute left-[24%] bottom-24 w-2 h-2 border border-blue-300 rounded-full"
            />
          ))}
          
          <div className="absolute top-2 left-1/4 -translate-x-1/2 text-[8px] font-black text-rose-500 uppercase">Anode (+)</div>
          <div className="absolute top-2 right-1/4 translate-x-1/2 text-[8px] font-black text-blue-500 uppercase">Cathode (-)</div>
        </div>
      </div>
    );
  };

  const ElectroplatingAnimation = () => {
    const [isPlating, setIsPlating] = useState(false);
    
    return (
      <div className="space-y-4 mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="flex justify-center">
          <button
            onClick={() => setIsPlating(!isPlating)}
            className={`px-6 py-2 rounded-full font-black uppercase tracking-widest transition-all border-2
              ${isPlating 
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-[0_4px_0_0_#059669]' 
                : 'bg-white text-gray-400 border-gray-200 shadow-[0_4px_0_0_#e5e7eb]'
              }
            `}
          >
            {isPlating ? 'Stop Plating' : 'Start Electroplating'}
          </button>
        </div>
        
        <div className="relative w-full h-40 bg-white border-2 border-gray-200 rounded-xl overflow-hidden p-4">
          {/* Silver Anode */}
          <div className="absolute top-0 left-1/4 w-6 h-32 bg-slate-300 rounded-b-lg shadow-md flex items-end justify-center pb-2">
            <span className="text-[8px] text-gray-600 font-black">Ag</span>
          </div>
          
          {/* Object to plate (Key) */}
          <div className="absolute top-8 right-1/4 w-12 h-20 flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-amber-700 rounded-full" />
            <div className="w-2 h-12 bg-amber-700 -mt-1 relative">
              <div className="absolute bottom-0 right-0 w-4 h-1 bg-amber-700" />
              <div className="absolute bottom-3 right-0 w-4 h-1 bg-amber-700" />
              
              {/* Plating layer */}
              <motion.div
                animate={isPlating ? { opacity: 1 } : { opacity: 0 }}
                className="absolute inset-0 bg-slate-200 opacity-0 transition-opacity duration-5000"
              />
            </div>
          </div>
          
          {/* Electrolyte */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-sky-50/50 border-t-2 border-sky-100" />
          
          {/* Ag+ Ions */}
          {isPlating && [...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, 100],
                y: [0, Math.random() * 20 - 10],
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              className="absolute left-1/4 bottom-16 w-3 h-3 bg-slate-200 rounded-full border border-slate-300 flex items-center justify-center text-[6px] font-black text-slate-500"
            >
              +
            </motion.div>
          ))}
        </div>
        <div className="text-center text-[10px] font-bold text-gray-400 uppercase">Plating a Copper Key with Silver</div>
      </div>
    );
  };

  const ElectrolysisSimulator = ({ electrolyte, state }: { electrolyte: string; state: 'molten' | 'aqueous' }) => {
    const [isSimulating, setIsSimulating] = useState(false);
    
    const getElectrolyteData = (id: string) => {
      switch (id) {
        case 'Al2O3': return { 
          cations: [{ label: <span>Al<sup>3+</sup></span>, color: 'bg-blue-500', target: 'cathode' }],
          anions: [{ label: <span>O<sup>2-</sup></span>, color: 'bg-red-500', target: 'anode' }],
          cathodeProduct: { type: 'solid', color: 'bg-gray-400', label: 'Al' },
          anodeProduct: { type: 'bubbles', color: 'bg-blue-100', label: <span>O<sub>2</sub></span> }
        };
        case 'NaCl': return state === 'molten' ? {
          cations: [{ label: <span>Na<sup>+</sup></span>, color: 'bg-blue-500', target: 'cathode' }],
          anions: [{ label: <span>Cl<sup>-</sup></span>, color: 'bg-red-500', target: 'anode' }],
          cathodeProduct: { type: 'solid', color: 'bg-gray-300', label: 'Na' },
          anodeProduct: { type: 'bubbles', color: 'bg-green-100', label: <span>Cl<sub>2</sub></span> }
        } : {
          cations: [
            { label: <span>Na<sup>+</sup></span>, color: 'bg-blue-500', target: 'none' },
            { label: <span>H<sup>+</sup></span>, color: 'bg-blue-400', target: 'cathode' }
          ],
          anions: [
            { label: <span>Cl<sup>-</sup></span>, color: 'bg-red-500', target: electrolyte === 'conc NaCl' ? 'anode' : 'none' },
            { label: <span>OH<sup>-</sup></span>, color: 'bg-red-400', target: electrolyte === 'conc NaCl' ? 'none' : 'anode' }
          ],
          cathodeProduct: { type: 'bubbles', color: 'bg-blue-50', label: <span>H<sub>2</sub></span> },
          anodeProduct: electrolyte === 'conc NaCl' ? 
            { type: 'bubbles', color: 'bg-green-100', label: <span>Cl<sub>2</sub></span> } :
            { type: 'bubbles', color: 'bg-blue-50', label: <span>O<sub>2</sub></span> }
        };
        case 'conc NaCl': return getElectrolyteData('NaCl');
        case 'dilute NaCl': return getElectrolyteData('NaCl');
        case 'PbBr2': return {
          cations: [{ label: <span>Pb<sup>2+</sup></span>, color: 'bg-blue-500', target: 'cathode' }],
          anions: [{ label: <span>Br<sup>-</sup></span>, color: 'bg-red-500', target: 'anode' }],
          cathodeProduct: { type: 'solid', color: 'bg-gray-500', label: 'Pb' },
          anodeProduct: { type: 'bubbles', color: 'bg-orange-800', label: <span>Br<sub>2</sub></span> }
        };
        case 'dilute H2SO4': return {
          cations: [{ label: <span>H<sup>+</sup></span>, color: 'bg-blue-400', target: 'cathode' }],
          anions: [
            { label: <span>SO<sub>4</sub><sup>2-</sup></span>, color: 'bg-red-600', target: 'none' },
            { label: <span>OH<sup>-</sup></span>, color: 'bg-red-400', target: 'anode' }
          ],
          cathodeProduct: { type: 'bubbles', color: 'bg-blue-50', label: <span>H<sub>2</sub></span> },
          anodeProduct: { type: 'bubbles', color: 'bg-blue-50', label: <span>O<sub>2</sub></span> }
        };
        case 'dilute CuSO4': return {
          cations: [
            { label: <span>Cu<sup>2+</sup></span>, color: 'bg-blue-600', target: 'cathode' },
            { label: <span>H<sup>+</sup></span>, color: 'bg-blue-400', target: 'none' }
          ],
          anions: [
            { label: <span>SO<sub>4</sub><sup>2-</sup></span>, color: 'bg-red-600', target: 'none' },
            { label: <span>OH<sup>-</sup></span>, color: 'bg-red-400', target: 'anode' }
          ],
          cathodeProduct: { type: 'solid', color: 'bg-orange-700', label: 'Cu' },
          anodeProduct: { type: 'bubbles', color: 'bg-blue-50', label: <span>O<sub>2</sub></span> }
        };
        default: return null;
      }
    };

    const data = getElectrolyteData(electrolyte);
    if (!data) return null;

    return (
      <div className="space-y-4">
        <div className="relative w-full h-56 bg-blue-50/30 rounded-[2rem] border-2 border-gray-100 overflow-hidden p-4">
          {/* Electrodes */}
          <div className="absolute left-4 top-4 bottom-4 w-6 bg-gray-800 rounded-full shadow-lg flex flex-col items-center justify-between py-4 z-20">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-white -rotate-90">CATHODE (-)</span>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          </div>
          <div className="absolute right-4 top-4 bottom-4 w-6 bg-gray-800 rounded-full shadow-lg flex flex-col items-center justify-between py-4 z-20">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-white rotate-90">ANODE (+)</span>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          </div>

          {/* Ions */}
          <div className="relative w-full h-full">
            {[...data.cations, ...data.anions].map((ion, i) => {
              const isTargeted = ion.target !== 'none';
              return (
                <motion.div
                  key={`${ion.target}-${i}`}
                  initial={{ x: 100 + (i % 3) * 40, y: 40 + Math.floor(i / 3) * 40 }}
                  animate={isSimulating && isTargeted ? {
                    x: ion.target === 'cathode' ? 20 : 260,
                    opacity: [1, 1, 0]
                  } : {
                    x: [null, 100 + Math.random() * 80, 100 + Math.random() * 80],
                    y: [null, 40 + Math.random() * 60, 40 + Math.random() * 60]
                  }}
                  transition={{ 
                    duration: isSimulating && isTargeted ? 2 : 4, 
                    repeat: isSimulating && isTargeted ? 0 : Infinity,
                    repeatType: "reverse"
                  }}
                  className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-md border-2 border-white/20 ${ion.color}`}
                >
                  {ion.label}
                </motion.div>
              );
            })}
            
            {/* Products */}
            <AnimatePresence>
              {isSimulating && (
                <>
                  {/* Cathode Product */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                  >
                    {data.cathodeProduct.type === 'solid' ? (
                      <div className={`w-8 h-16 rounded-lg shadow-inner border-2 border-white/30 ${data.cathodeProduct.color}`} />
                    ) : (
                      <div className="flex flex-wrap w-8 gap-1 justify-center">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [-10, -100], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            className={`w-3 h-3 rounded-full border border-white/50 ${data.cathodeProduct.color}`}
                          />
                        ))}
                      </div>
                    )}
                    <span className="text-[10px] font-black text-gray-800 bg-white/80 px-2 py-0.5 rounded-full border border-gray-100">{data.cathodeProduct.label}</span>
                  </motion.div>

                  {/* Anode Product */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                  >
                    {data.anodeProduct.type === 'solid' ? (
                      <div className={`w-8 h-16 rounded-lg shadow-inner border-2 border-white/30 ${data.anodeProduct.color}`} />
                    ) : (
                      <div className="flex flex-wrap w-8 gap-1 justify-center">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [-10, -100], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            className={`w-3 h-3 rounded-full border border-white/50 ${data.anodeProduct.color}`}
                          />
                        ))}
                      </div>
                    )}
                    <span className="text-[10px] font-black text-gray-800 bg-white/80 px-2 py-0.5 rounded-full border border-gray-100">{data.anodeProduct.label}</span>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={`w-full py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all
            ${isSimulating ? 'bg-rose-500 text-white shadow-[0_4px_0_0_#be123c]' : 'bg-emerald-500 text-white shadow-[0_4px_0_0_#047857]'}
            active:translate-y-1 active:shadow-none
          `}
        >
          {isSimulating ? 'Reset Simulation' : 'Start Electrolysis'}
        </button>
      </div>
    );
  };

  const ElectrolyteDrawing = ({ state }: { state: 'solid' | 'molten' | 'aqueous' }) => {
    const ions = [...Array(12)].map((_, i) => ({
      id: i,
      type: i % 2 === 0 ? 'cation' : 'anion',
      label: i % 2 === 0 ? 'M⁺' : 'X⁻',
      color: i % 2 === 0 ? 'bg-blue-500' : 'bg-red-500'
    }));

    const waterIons = [...Array(8)].map((_, i) => ({
      id: `w-${i}`,
      type: i % 2 === 0 ? 'h' : 'oh',
      label: i % 2 === 0 ? 'H⁺' : 'OH⁻',
      color: i % 2 === 0 ? 'bg-blue-500' : 'bg-red-500'
    }));

    return (
      <div className="relative w-full h-56 bg-gray-50 rounded-3xl overflow-hidden border-2 border-gray-100 p-4">
        {state === 'aqueous' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-blue-100/30 z-0"
          />
        )}
        
        {/* Electrodes */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gray-800 z-20 flex flex-col items-center justify-center gap-4 shadow-lg">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-white -rotate-90 whitespace-nowrap tracking-widest">CATHODE (-)</span>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gray-800 z-20 flex flex-col items-center justify-center gap-4 shadow-lg">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-white rotate-90 whitespace-nowrap tracking-widest">ANODE (+)</span>
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
        </div>
        
        <div className="relative z-10 w-full h-full flex items-center justify-center px-10">
          {state === 'solid' ? (
            <div className="grid grid-cols-4 grid-rows-3 gap-2">
              {[...Array(12)].map((_, i) => {
                const row = Math.floor(i / 4);
                const col = i % 4;
                const isCation = (row + col) % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    animate={{ x: [0, 1, -1, 0], y: [0, -1, 1, 0] }}
                    transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.05 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white shadow-md border-2 border-white/20 ${isCation ? 'bg-blue-500' : 'bg-red-500'}`}
                  >
                    {isCation ? '+' : '-'}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="relative w-full h-full">
              {ions.map((ion, i) => (
                <motion.div
                  key={ion.id}
                  initial={{ x: 40 + Math.random() * 200, y: 20 + Math.random() * 140 }}
                  animate={{ 
                    x: ion.type === 'cation' ? [null, 10, 40 + Math.random() * 200] : [null, 280, 40 + Math.random() * 200],
                    opacity: [1, 1, 0.5, 1]
                  }}
                  transition={{ duration: state === 'molten' ? 3 : 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                  className={`absolute w-10 h-10 rounded-full flex flex-col items-center justify-center shadow-md border-2 border-white/20 ${ion.color}`}
                >
                  <span className="text-[10px] font-black text-white leading-none">{ion.label}</span>
                </motion.div>
              ))}
              {state === 'aqueous' && waterIons.map((ion, i) => (
                <motion.div
                  key={ion.id}
                  initial={{ x: 40 + Math.random() * 200, y: 20 + Math.random() * 140 }}
                  animate={{ 
                    x: ion.type === 'h' ? [null, 10, 40 + Math.random() * 200] : [null, 280, 40 + Math.random() * 200],
                    opacity: [1, 1, 0.5, 1]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                  className={`absolute w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-white/50 ${ion.color}`}
                >
                  <span className="text-[8px] font-black text-white leading-none">{ion.label}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        <div className="absolute bottom-2 right-4 flex flex-col items-end">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {state === 'solid' ? 'Lattice' : state === 'molten' ? 'Molten' : 'Aqueous'}
          </p>
        </div>
      </div>
    );
  };

  const TitrationCurve = () => {
    const [flaskType, setFlaskType] = useState<'acid' | 'base'>('base');
    const [volumeAdded, setVolumeAdded] = useState(0);
    const [isAdding, setIsAdding] = useState(false);
    const timerRef = useRef<any>(null);

    const calculatePH = (v: number, type: 'acid' | 'base') => {
      const c1 = 0.1; 
      const v1 = 25;  
      const c2 = 0.1; 
      
      const moles1 = (c1 * v1) / 1000;
      const moles2 = (c2 * v) / 1000;
      
      if (type === 'base') { 
        if (moles2 < moles1) {
          const remainingOH = moles1 - moles2;
          const totalV = (v1 + v) / 1000;
          const ohConc = remainingOH / totalV;
          return 14 + Math.log10(ohConc);
        } else if (Math.abs(moles2 - moles1) < 1e-9) {
          return 7;
        } else {
          const excessH = moles2 - moles1;
          const totalV = (v1 + v) / 1000;
          const hConc = excessH / totalV;
          return -Math.log10(hConc);
        }
      } else { 
        if (moles2 < moles1) {
          const remainingH = moles1 - moles2;
          const totalV = (v1 + v) / 1000;
          const hConc = remainingH / totalV;
          return -Math.log10(hConc);
        } else if (Math.abs(moles2 - moles1) < 1e-9) {
          return 7;
        } else {
          const excessOH = moles2 - moles1;
          const totalV = (v1 + v) / 1000;
          const ohConc = excessOH / totalV;
          return 14 + Math.log10(ohConc);
        }
      }
    };

    const chartData = useMemo(() => {
      const points = [];
      for (let i = 0; i <= 50; i += 0.5) {
        points.push({
          volume: i,
          ph: calculatePH(i, flaskType)
        });
      }
      return points;
    }, [flaskType]);

    const handleAddSolution = () => {
      if (isAdding) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsAdding(false);
      } else {
        setIsAdding(true);
        timerRef.current = setInterval(() => {
          setVolumeAdded(prev => {
            if (prev >= 50) {
              if (timerRef.current) clearInterval(timerRef.current);
              setIsAdding(false);
              return 50;
            }
            return prev + 0.5;
          });
        }, 50);
      }
    };

    const reset = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsAdding(false);
      setVolumeAdded(0);
    };

    useEffect(() => {
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, []);

    const currentPH = calculatePH(volumeAdded, flaskType);
    
    const getPHColor = (ph: number) => {
      if (ph < 6.5) return 'text-rose-500';
      if (ph > 7.5) return 'text-blue-500';
      return 'text-purple-500';
    };

    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const ph = payload[0].value;
        const vol = payload[0].payload.volume;
        let state = "Neutral";
        let color = "text-purple-500";
        if (ph < 6.5) { state = "Acidic"; color = "text-rose-500"; }
        else if (ph > 7.5) { state = "Basic"; color = "text-blue-500"; }
        
        return (
          <div className="bg-white p-3 border-2 border-gray-100 rounded-xl shadow-xl">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Volume: {vol} ml</p>
            <p className={`text-sm font-black ${color}`}>pH: {ph.toFixed(2)}</p>
            <p className={`text-[8px] font-black uppercase tracking-widest ${color}`}>{state}</p>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-1/3 flex flex-col items-center justify-center bg-gray-50 rounded-3xl p-6 border-2 border-gray-100 min-h-[400px]">
            <div className="relative w-32 h-80">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-48 border-2 border-gray-300 rounded-b-lg bg-white/50 overflow-hidden">
                <motion.div 
                  className={`absolute bottom-0 w-full ${flaskType === 'base' ? 'bg-rose-400/40' : 'bg-blue-400/40'}`}
                  animate={{ height: `${((50 - volumeAdded) / 50) * 100}%` }}
                />
                <div className="absolute inset-0 flex flex-col justify-between py-2 px-1 pointer-events-none">
                  {[0, 10, 20, 30, 40, 50].map(v => (
                    <div key={v} className="flex items-center justify-between">
                      <div className="w-2 h-[1px] bg-gray-400" />
                      <span className="text-[6px] font-bold text-gray-400">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="absolute top-48 left-1/2 -translate-x-1/2 w-4 h-8 bg-gray-400 rounded-sm">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-2 bg-gray-600 rounded-full transition-transform ${isAdding ? 'rotate-90' : 'rotate-0'}`} />
              </div>

              {isAdding && (
                <motion.div 
                  className={`absolute top-56 left-1/2 -translate-x-1/2 w-1 h-3 rounded-full ${flaskType === 'base' ? 'bg-rose-400' : 'bg-blue-400'}`}
                  animate={{ y: [0, 40], opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                />
              )}

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-24">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                  <defs>
                    <clipPath id="flask-clip">
                      <path d="M40 0 L60 0 L60 20 L90 90 L10 90 L40 20 Z" />
                    </clipPath>
                  </defs>
                  <path d="M40 0 L60 0 L60 20 L90 90 L10 90 L40 20 Z" fill="none" stroke="#d1d5db" strokeWidth="2" />
                  <motion.rect 
                    x="0" y="0" width="100" height="100"
                    fill={currentPH < 6.5 ? '#f43f5e' : currentPH > 7.5 ? '#3b82f6' : '#a855f7'}
                    fillOpacity="0.4"
                    clipPath="url(#flask-clip)"
                    animate={{ y: 90 - (25 + volumeAdded) * 0.8 }}
                  />
                </svg>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Flask Content</p>
              <p className={`text-sm font-black ${flaskType === 'acid' ? 'text-rose-500' : 'text-blue-500'}`}>
                {flaskType === 'acid' ? 'Acid (HCl)' : 'Base (NaOH)'}
              </p>
            </div>
          </div>

          <div className="flex-1 w-full space-y-6">
            <div className="bg-white p-4 rounded-3xl border-2 border-gray-100 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="volume" 
                    type="number" 
                    domain={[0, 50]} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 14]} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="ph" 
                    stroke="#8b5cf6" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Line 
                    data={[{ volume: volumeAdded, ph: currentPH }]} 
                    type="monotone" 
                    dataKey="ph" 
                    stroke="transparent"
                    dot={{ r: 6, fill: currentPH < 6.5 ? '#f43f5e' : currentPH > 7.5 ? '#3b82f6' : '#a855f7', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current pH</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black ${getPHColor(currentPH)}`}>{currentPH.toFixed(2)}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${getPHColor(currentPH)}`}>
                    {currentPH < 6.5 ? 'Acidic' : currentPH > 7.5 ? 'Basic' : 'Neutral'}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Volume Added</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-gray-800">{volumeAdded.toFixed(1)}</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ml</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddSolution}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black uppercase tracking-widest transition-all
                  ${isAdding 
                    ? 'bg-rose-500 text-white shadow-[0_6px_0_0_#be123c] active:shadow-none active:translate-y-1' 
                    : 'bg-emerald-500 text-white shadow-[0_6px_0_0_#047857] hover:bg-emerald-400 active:shadow-none active:translate-y-1'}
                `}
              >
                {isAdding ? <><XCircle size={18} /> Stop</> : <><RefreshCw size={18} /> Add Burette Solution</>}
              </button>
              <button
                onClick={reset}
                className="px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-600 hover:border-purple-400 shadow-[0_6px_0_0_#e5e7eb] active:shadow-none active:translate-y-1 transition-all"
              >
                Reset
              </button>
            </div>

            <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-100">
              <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3">Setup Configuration</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => { setFlaskType('base'); reset(); }}
                  className={`flex-1 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
                    ${flaskType === 'base' ? 'bg-purple-500 text-white shadow-md' : 'bg-white text-purple-400 border-2 border-purple-100'}
                  `}
                >
                  Acid in Burette / Base in Flask
                </button>
                <button
                  onClick={() => { setFlaskType('acid'); reset(); }}
                  className={`flex-1 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
                    ${flaskType === 'acid' ? 'bg-purple-500 text-white shadow-md' : 'bg-white text-purple-400 border-2 border-purple-100'}
                  `}
                >
                  Base in Burette / Acid in Flask
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FractionalDistillation = () => {
    const [isFurnaceOn, setIsFurnaceOn] = useState(false);
    const [activeTrend, setActiveTrend] = useState<string | null>('Boiling Point');
    const [showAllTrends, setShowAllTrends] = useState(false);

    const fractions = [
      { name: 'Refinery Gas', temp: '20°C', use: 'Bottled gas', color: 'bg-sky-100', textColor: 'text-sky-600', height: 0, bp: 1, visc: 1, vol: 8, flam: 8, col: 1 },
      { name: 'Gasoline/Petrol', temp: '70°C', use: 'Car fuel', color: 'bg-blue-100', textColor: 'text-blue-600', height: 12, bp: 2, visc: 2, vol: 7, flam: 7, col: 2 },
      { name: 'Naphtha', temp: '120°C', use: 'Chemicals', color: 'bg-indigo-100', textColor: 'text-indigo-600', height: 24, bp: 3, visc: 3, vol: 6, flam: 6, col: 3 },
      { name: 'Kerosene/Paraffin', temp: '170°C', use: 'Jet fuel', color: 'bg-violet-100', textColor: 'text-violet-600', height: 36, bp: 4, visc: 4, vol: 5, flam: 5, col: 4 },
      { name: 'Diesel/Gas Oil', temp: '270°C', use: 'Truck fuel', color: 'bg-purple-100', textColor: 'text-purple-600', height: 48, bp: 5, visc: 5, vol: 4, flam: 4, col: 5 },
      { name: 'Fuel Oil', temp: '350°C', use: 'Ship fuel', color: 'bg-fuchsia-100', textColor: 'text-fuchsia-600', height: 60, bp: 6, visc: 6, vol: 3, flam: 3, col: 6 },
      { name: 'Lubricating Oil', temp: '450°C', use: 'Waxes/Polishes', color: 'bg-pink-100', textColor: 'text-pink-600', height: 72, bp: 7, visc: 7, vol: 2, flam: 2, col: 7 },
      { name: 'Bitumen', temp: '500°C', use: 'Roads/Roofs', color: 'bg-gray-200', textColor: 'text-gray-600', height: 84, bp: 8, visc: 8, vol: 1, flam: 1, col: 8 },
    ];

    const chartData = fractions.map(f => ({
      name: f.name,
      'Boiling Point': f.bp,
      'Viscosity': f.visc,
      'Volatility': f.vol,
      'Flammability': f.flam,
      'Color': f.col,
    }));

    const molecules = [
      { id: 1, size: 2, color: 'bg-red-500', label: 'Ethane (C2H6)', stopAt: 0, name: 'Red', carbons: 2 },
      { id: 2, size: 4, color: 'bg-yellow-400', label: 'Octane (C8H18)', stopAt: 12, name: 'Yellow', carbons: 8 },
      { id: 3, size: 8, color: 'bg-blue-500', label: 'Icosane (C20H42)', stopAt: 48, name: 'Blue', carbons: 20 },
      { id: 4, size: 12, color: 'bg-green-500', label: 'Pentacontane (C50H102)', stopAt: 84, name: 'Green', carbons: 50 },
    ];

    const trends = [
      { label: 'Boiling Point', color: '#ef4444', bgColor: 'bg-red-50', icon: <Thermometer size={14} />, direction: 'down', desc: 'Temp where liquid turns to gas.' },
      { label: 'Viscosity', color: '#facc15', bgColor: 'bg-yellow-50', icon: <Droplets size={14} />, direction: 'down', desc: 'Resistance to flow (thickness).' },
      { label: 'Volatility', color: '#3b82f6', bgColor: 'bg-blue-50', icon: <Wind size={14} />, direction: 'up', desc: 'Ease of evaporation.' },
      { label: 'Flammability', color: '#22c55e', bgColor: 'bg-green-50', icon: <Flame size={14} />, direction: 'up', desc: 'Ease of catching fire.' },
      { label: 'Color', color: '#a855f7', bgColor: 'bg-purple-50', icon: <Palette size={14} />, direction: 'down', desc: 'Darkness of the fraction.' },
    ];

    const ViscosityVolatilitySim = () => {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Viscosity Sim */}
          <div className="bg-white rounded-[2rem] p-6 border-2 border-gray-100 shadow-sm">
            <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight mb-4 flex items-center gap-2">
              <Droplets className="text-yellow-500" size={16} />
              Viscosity Simulation
            </h4>
            <div className="flex gap-4 h-40">
              <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-between border border-gray-100">
                <span className="text-[8px] font-black text-gray-400 uppercase">Low Viscosity (Runny)</span>
                <div className="relative w-full flex-1 flex items-center justify-center">
                  <motion.div
                    animate={{ y: [0, 40, 0] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-blue-400"
                  >
                    <Droplets size={24} />
                  </motion.div>
                </div>
                <span className="text-[7px] font-bold text-gray-500">Small Molecules</span>
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-between border border-gray-100">
                <span className="text-[8px] font-black text-gray-400 uppercase">High Viscosity (Thick)</span>
                <div className="relative w-full flex-1 flex items-center justify-center">
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="text-orange-600"
                  >
                    <Droplets size={24} />
                  </motion.div>
                </div>
                <span className="text-[7px] font-bold text-gray-500">Large Molecules</span>
              </div>
            </div>
          </div>

          {/* Volatility Sim */}
          <div className="bg-white rounded-[2rem] p-6 border-2 border-gray-100 shadow-sm">
            <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight mb-4 flex items-center gap-2">
              <Wind className="text-blue-500" size={16} />
              Volatility Simulation
            </h4>
            <div className="flex gap-4 h-40">
              <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-between border border-gray-100">
                <span className="text-[8px] font-black text-gray-400 uppercase">High Volatility</span>
                <div className="relative w-full flex-1 overflow-hidden">
                  <div className="absolute bottom-0 w-full h-4 bg-blue-200" />
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: -20, opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="absolute left-1/2 -translate-x-1/2 text-blue-400"
                      style={{ left: `${20 + i * 15}%` }}
                    >
                      <Wind size={12} />
                    </motion.div>
                  ))}
                </div>
                <span className="text-[7px] font-bold text-gray-500">Easily Vaporizes</span>
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-between border border-gray-100">
                <span className="text-[8px] font-black text-gray-400 uppercase">Low Volatility</span>
                <div className="relative w-full flex-1 overflow-hidden">
                  <div className="absolute bottom-0 w-full h-4 bg-orange-200" />
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: -5, opacity: [0, 1, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute left-1/2 -translate-x-1/2 text-orange-400"
                  >
                    <Wind size={12} />
                  </motion.div>
                </div>
                <span className="text-[7px] font-bold text-gray-500">Hard to Vaporize</span>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const CondensedFormula = ({ carbons, color }: { carbons: number, color: string }) => {
      const textColor = color.replace('bg-', 'text-');
      if (carbons === 1) return <span className={textColor}>CH<sub>4</sub></span>;
      if (carbons === 2) return <span className={textColor}>CH<sub>3</sub>CH<sub>3</sub></span>;
      return (
        <span className={textColor}>
          CH<sub>3</sub>(CH<sub>2</sub>)<sub>{carbons - 2}</sub>CH<sub>3</sub>
        </span>
      );
    };

    return (
      <div className="space-y-8">
        <div className="bg-gray-50 rounded-3xl p-6 border-2 border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fractionating Column Simulator</p>
              <p className="text-[10px] font-bold text-orange-500">Molecules enter at the bottom and rise</p>
            </div>
            <button
              onClick={() => setIsFurnaceOn(!isFurnaceOn)}
              className={`px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
                ${isFurnaceOn ? 'bg-red-500 text-white shadow-[0_4px_0_0_#b91c1c]' : 'bg-orange-500 text-white shadow-[0_4px_0_0_#c2410c]'}
              `}
            >
              {isFurnaceOn ? 'Stop Furnace' : 'Start Furnace'}
            </button>
          </div>

          {/* Molecular Structure Bar */}
          <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {molecules.map(m => (
              <div key={m.id} className="bg-white p-4 rounded-[1.5rem] border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${m.color} shadow-inner`} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-800 uppercase leading-none mb-1">{m.name}</span>
                    <span className="text-[8px] font-bold text-gray-400 italic leading-none">{m.label}</span>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                  <CondensedFormula carbons={m.carbons} color={m.color} />
                </div>
              </div>
            ))}
          </div>

          <div className="relative h-[500px] sm:h-[600px] flex gap-2 sm:gap-4">
            {/* Furnace & Pipe */}
            <div className="relative w-24 sm:w-32 flex flex-col justify-end">
              <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-24 sm:h-32 bg-gray-800 rounded-t-3xl flex flex-col items-center justify-center border-t-4 border-orange-500 z-10">
                <div className="text-[8px] font-black text-white uppercase mb-2">Furnace</div>
                <div className="relative w-8 h-8 sm:w-12 sm:h-12">
                  {isFurnaceOn && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="absolute inset-0 bg-orange-500 rounded-full blur-xl"
                    />
                  )}
                  <Flame className={`w-8 h-8 sm:w-12 sm:h-12 transition-colors ${isFurnaceOn ? 'text-orange-500' : 'text-gray-600'}`} />
                </div>
              </div>
              {/* Pipe to column */}
              <div className="absolute bottom-10 left-16 sm:left-20 w-8 sm:w-12 h-6 sm:h-8 bg-gray-700 z-0" />
            </div>

            {/* Column */}
            <div className="flex-1 relative bg-white border-x-4 border-gray-200 rounded-t-[2rem] sm:rounded-t-[3rem] overflow-hidden shadow-inner">
              {/* Temperature Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-t from-orange-50 via-white to-sky-50 opacity-50" />
              
              {/* Fractions */}
              <div className="absolute inset-0 flex flex-col">
                {fractions.map((f, i) => (
                  <div 
                    key={f.name} 
                    className={`flex-1 border-b border-gray-100 flex items-center justify-between px-3 sm:px-6 relative z-10 ${f.color}/10`}
                  >
                    <div className="flex flex-col">
                      <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-tight ${f.textColor}`}>{f.name}</span>
                      <span className="text-[6px] sm:text-[8px] font-bold text-gray-400 leading-none">{f.use}</span>
                    </div>
                    <span className="text-[8px] sm:text-[10px] font-black text-gray-300">{f.temp}</span>
                  </div>
                ))}
              </div>

              {/* Molecules Animation */}
              <AnimatePresence>
                {isFurnaceOn && molecules.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ bottom: 40, left: -40, opacity: 0, scale: 0.5 }}
                    animate={{ 
                      left: ['-40px', '40px', '50%'],
                      bottom: ['40px', '40px', `${100 - m.stopAt - 6}%`],
                      opacity: [0, 1, 1],
                      x: ['0%', '0%', '-50%'],
                      scale: [0.5, 1, 1],
                      rotate: [0, 0, 0]
                    }}
                    transition={{ 
                      duration: 6 + m.id, 
                      ease: "easeInOut",
                      delay: m.id * 0.5,
                      times: [0, 0.2, 1]
                    }}
                    className={`absolute z-20 rounded-full shadow-lg flex items-center justify-center border-2 border-white/50 ${m.color}`}
                    style={{ width: m.size * 5, height: 12 }}
                  >
                    <div className="text-[6px] font-black text-white whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity absolute -top-4 bg-gray-800/80 px-1 rounded">
                      {m.label}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Temperature Labels */}
            <div className="w-16 flex flex-col justify-between py-8 text-[8px] font-black text-gray-400 uppercase tracking-widest text-center">
              <span>Cooler</span>
              <div className="h-full w-px bg-gradient-to-b from-sky-200 via-gray-200 to-orange-200 mx-auto my-2" />
              <span>Hotter</span>
            </div>
          </div>
        </div>

        {/* Interactive Trend Explorer */}
        <div className="bg-white rounded-[2.5rem] p-8 border-2 border-gray-100 shadow-[0_8px_0_0_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left: Buttons */}
            <div className="w-full lg:w-1/3 space-y-6">
              <div>
                <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                  <TrendingUp className="text-emerald-500" size={24} />
                  Trend Explorer
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Select a property to visualize</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => { setShowAllTrends(true); setActiveTrend(null); }}
                  className={`col-span-full flex flex-col items-start p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2
                    ${showAllTrends ? 'bg-emerald-50 text-emerald-600 border-emerald-600 shadow-sm' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'}
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <LayoutGrid size={14} />
                    Show All Trends
                  </div>
                  <span className="text-[8px] font-bold opacity-60 normal-case">Compare all properties at once</span>
                </button>

                {trends.map(t => (
                  <button
                    key={t.label}
                    onClick={() => { setActiveTrend(t.label); setShowAllTrends(false); }}
                    className={`flex flex-col items-start p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2
                      ${activeTrend === t.label ? `bg-white border-current shadow-sm` : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'}
                    `}
                    style={{ color: activeTrend === t.label ? t.color : undefined }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {t.icon}
                      {t.label}
                    </div>
                    <span className="text-[8px] font-bold opacity-60 normal-case leading-tight">{t.desc}</span>
                  </button>
                ))}
              </div>

              {activeTrend && (
                <div className={`p-6 rounded-3xl border-2 transition-all ${trends.find(t => t.label === activeTrend)?.bgColor} ${trends.find(t => t.label === activeTrend)?.color.replace('#', '')}`}>
                  <h4 className="font-black uppercase tracking-tight mb-2" style={{ color: trends.find(t => t.label === activeTrend)?.color }}>{activeTrend}</h4>
                  <p className="text-xs font-bold text-gray-600 leading-relaxed">
                    {activeTrend === 'Boiling Point' && "The temperature at which the fraction turns into a gas. Larger molecules have stronger forces and higher boiling points."}
                    {activeTrend === 'Viscosity' && "How 'thick' or 'runny' the liquid is. Larger molecules get tangled easily, making them more viscous (thicker)."}
                    {activeTrend === 'Volatility' && "How easily a liquid turns into a gas. Smaller molecules escape the liquid surface more easily."}
                    {activeTrend === 'Flammability' && "How easily the fraction catches fire. Smaller molecules mix better with oxygen and ignite more readily."}
                    {activeTrend === 'Color' && "The visual appearance. Heavier fractions contain more impurities and larger molecules that absorb more light."}
                  </p>
                </div>
              )}
            </div>

            {/* Right: Chart */}
            <div className="flex-1 bg-gray-50 rounded-[2rem] p-4 sm:p-6 border-2 border-gray-100 flex flex-col">
              <div className="w-full h-[300px] sm:h-[400px] lg:h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      interval={0} 
                      tick={{ fontSize: 9, fontWeight: 700, fill: '#6b7280' }} 
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: '#f3f4f6' }}
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Legend verticalAlign="top" height={36}/>
                    {showAllTrends ? (
                      trends.map(t => (
                        <Bar key={t.label} dataKey={t.label} fill={t.color} radius={[4, 4, 0, 0]} />
                      ))
                    ) : (
                      <Bar 
                        dataKey={activeTrend || 'Boiling Point'} 
                        fill={trends.find(t => t.label === activeTrend)?.color || '#ef4444'} 
                        radius={[8, 8, 0, 0]} 
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <ArrowRight size={14} className="rotate-90" />
                  Top of Column
                </div>
                <div className="flex items-center gap-2">
                  Bottom of Column
                  <ArrowRight size={14} className="-rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Viscosity & Volatility Simulation */}
          <ViscosityVolatilitySim />
        </div>

        <div className="bg-gray-800 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Factory size={120} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-tight mb-4 relative z-10">Key Concept</h3>
          <div className="space-y-4 relative z-10">
            <p className="text-xs font-medium text-gray-300 leading-relaxed">
              Crude oil is a <span className="text-orange-400 font-bold">mixture</span> of hydrocarbons. 
              It is heated in a <span className="text-orange-400 font-bold">furnace</span> until it vaporizes.
            </p>
            <p className="text-xs font-medium text-gray-300 leading-relaxed">
              The vapors rise up the column. As they cool, they <span className="text-sky-400 font-bold">condense</span> back into liquids at different heights based on their <span className="text-sky-400 font-bold">boiling points</span>.
            </p>
            <div className="pt-4 border-t border-gray-700">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Molecular Size Rule</p>
              <p className="text-xs font-bold text-white">
                Larger molecules = Stronger intermolecular forces = Higher Boiling Point = Condense at the bottom.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AdditionVsSubstitution = () => {
    const [type, setType] = useState<'substitution' | 'addition'>('substitution');
    const [isReacting, setIsReacting] = useState(false);
    const [hasReacted, setHasReacted] = useState(false);

    const reset = () => {
      setIsReacting(false);
      setHasReacted(false);
    };

    const startReaction = () => {
      setIsReacting(true);
      setTimeout(() => {
        setIsReacting(false);
        setHasReacted(true);
      }, 2000);
    };

    return (
      <div className="space-y-6">
        <div className="flex gap-4 bg-gray-100 p-2 rounded-2xl">
          <button
            onClick={() => { setType('substitution'); reset(); }}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
              ${type === 'substitution' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}
            `}
          >
            Alkane Substitution
          </button>
          <button
            onClick={() => { setType('addition'); reset(); }}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
              ${type === 'addition' ? 'bg-white text-emerald-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}
            `}
          >
            Alkene Addition
          </button>
        </div>

        <div className="bg-gray-50 rounded-[2rem] p-8 border-2 border-gray-100 min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden">
          {/* UV Light Indicator */}
          {type === 'substitution' && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-yellow-100 px-4 py-1 rounded-full border border-yellow-200 z-20"
            >
              <Zap size={14} className="text-yellow-600" />
              <span className="text-[10px] font-black text-yellow-700 uppercase tracking-widest">Requires UV Light</span>
            </motion.div>
          )}

          <div className="flex flex-col lg:flex-row items-center gap-16 w-full justify-center">
            {/* Hydrocarbon / Product */}
            <div className="relative">
              {/* C-C Bond */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-1 z-0">
                {type === 'addition' && !hasReacted ? (
                  <>
                    <div className="absolute -top-1 left-0 w-full h-1 bg-gray-300 rounded-full" />
                    <div className="absolute -bottom-1 left-0 w-full h-1 bg-gray-300 rounded-full" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-300 rounded-full" />
                )}
              </div>

              <div className="flex items-center gap-16 relative z-10">
                {/* Left Carbon Group */}
                <div className="relative flex items-center justify-center w-12 h-12">
                  <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-xs font-black text-white">C</div>
                  
                  {/* Top H */}
                  <div className="absolute -top-12 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-gray-500 flex items-center justify-center text-[10px] font-black text-white">H</div>
                    <div className="w-[2px] h-4 bg-gray-300" />
                  </div>
                  
                  {/* Bottom H */}
                  <div className="absolute -bottom-12 flex flex-col items-center">
                    <div className="w-[2px] h-4 bg-gray-300" />
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-gray-500 flex items-center justify-center text-[10px] font-black text-white">H</div>
                  </div>

                  {/* Left H or Cl */}
                  <div className="absolute -left-12 flex items-center">
                    <AnimatePresence mode="wait">
                      {hasReacted && type === 'addition' ? (
                        <motion.div key="cl-l" initial={{ scale: 0, x: 20 }} animate={{ scale: 1, x: 0 }} className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-400 border-2 border-emerald-500 flex items-center justify-center text-[10px] font-black text-white">Cl</div>
                          <div className="h-[2px] w-4 bg-gray-300" />
                        </motion.div>
                      ) : type === 'substitution' ? (
                        <div key="h-l" className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-gray-500 flex items-center justify-center text-[10px] font-black text-white">H</div>
                          <div className="h-[2px] w-4 bg-gray-300" />
                        </div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Right Carbon Group */}
                <div className="relative flex items-center justify-center w-12 h-12">
                  <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-xs font-black text-white">C</div>
                  
                  {/* Top H */}
                  <div className="absolute -top-12 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-gray-500 flex items-center justify-center text-[10px] font-black text-white">H</div>
                    <div className="w-[2px] h-4 bg-gray-300" />
                  </div>
                  
                  {/* Bottom H */}
                  <div className="absolute -bottom-12 flex flex-col items-center">
                    <div className="w-[2px] h-4 bg-gray-300" />
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-gray-500 flex items-center justify-center text-[10px] font-black text-white">H</div>
                  </div>

                  {/* Right H or Cl */}
                  <div className="absolute -right-12 flex items-center">
                    <div className="h-[2px] w-4 bg-gray-300" />
                    <AnimatePresence mode="wait">
                      {hasReacted ? (
                        <motion.div key="cl-r" initial={{ scale: 0, x: -20 }} animate={{ scale: 1, x: 0 }} className="w-8 h-8 rounded-full bg-emerald-400 border-2 border-emerald-500 flex items-center justify-center text-[10px] font-black text-white">Cl</motion.div>
                      ) : type === 'substitution' ? (
                        <motion.div key="h-r" exit={{ opacity: 0, x: 20 }} className="w-8 h-8 rounded-full bg-gray-400 border-2 border-gray-500 flex items-center justify-center text-[10px] font-black text-white">H</motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-center w-max">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  {hasReacted ? 'Product' : 'Reactant'}
                </p>
                <p className="text-sm font-black text-gray-800 uppercase">
                  {hasReacted 
                    ? (type === 'substitution' ? 'Chloroethane' : '1,2-dichloroethane')
                    : (type === 'substitution' ? 'Ethane' : 'Ethene')}
                </p>
              </div>
            </div>

            {/* Plus Sign */}
            {!hasReacted && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-black text-gray-300">+</motion.div>
            )}

            {/* Chlorine / HCl */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {!hasReacted ? (
                  <motion.div 
                    key="cl2"
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-400 border-2 border-emerald-500 flex items-center justify-center text-[10px] font-black text-white">Cl</div>
                    <div className="h-[2px] w-4 bg-gray-300" />
                    <div className="w-10 h-10 rounded-full bg-emerald-400 border-2 border-emerald-500 flex items-center justify-center text-[10px] font-black text-white">Cl</div>
                  </motion.div>
                ) : type === 'substitution' ? (
                  <motion.div 
                    key="hcl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-gray-500 flex items-center justify-center text-[10px] font-black text-white">H</div>
                    <div className="h-[2px] w-4 bg-gray-300" />
                    <div className="w-10 h-10 rounded-full bg-emerald-400 border-2 border-emerald-500 flex items-center justify-center text-[10px] font-black text-white">Cl</div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-center w-max">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  {hasReacted ? (type === 'substitution' ? 'Side Product' : '') : 'Reactant'}
                </p>
                <p className="text-sm font-black text-gray-800 uppercase">
                  {hasReacted 
                    ? (type === 'substitution' ? 'Hydrogen Chloride' : '')
                    : 'Chlorine'}
                </p>
              </div>
            </div>
          </div>

          {/* Animation Overlay */}
          <AnimatePresence>
            {isReacting && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center"
              >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="text-emerald-500 mb-4"
                >
                  <RefreshCw size={48} />
                </motion.div>
                <p className="text-sm font-black text-gray-800 uppercase tracking-widest">Reaction in Progress...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border-2 border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Reaction Type</p>
            <p className={`text-xl font-black uppercase tracking-tight ${type === 'substitution' ? 'text-orange-500' : 'text-emerald-500'}`}>
              {type === 'substitution' ? 'Substitution' : 'Addition'}
            </p>
            <p className="text-xs font-bold text-gray-500 mt-2">
              {type === 'substitution' 
                ? 'One hydrogen atom is replaced by a chlorine atom.' 
                : 'The double bond breaks and both chlorine atoms add to the carbons.'}
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border-2 border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Key Facts</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <div className={`w-2 h-2 rounded-full ${type === 'substitution' ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                {type === 'substitution' ? 'Produces 2 products' : 'Produces 1 product'}
              </li>
              <li className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <div className={`w-2 h-2 rounded-full ${type === 'substitution' ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                {type === 'substitution' ? 'Requires UV Light' : 'No UV Light needed'}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={startReaction}
            disabled={isReacting || hasReacted}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black uppercase tracking-widest transition-all
              ${isReacting || hasReacted
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-emerald-500 text-white shadow-[0_6px_0_0_#047857] hover:bg-emerald-400 active:shadow-none active:translate-y-1'}
            `}
          >
            {isReacting ? 'Reacting...' : hasReacted ? 'Reaction Complete' : 'Start Reaction'}
          </button>
          <button
            onClick={reset}
            className="px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-600 hover:border-purple-400 shadow-[0_6px_0_0_#e5e7eb] active:shadow-none active:translate-y-1 transition-all"
          >
            Reset
          </button>
        </div>
      </div>
    );
  };

  const EquilibriumProcesses = () => {
    const [process, setProcess] = useState<'haber' | 'contact'>('haber');
    const [temp, setTemp] = useState(450);
    const [pressure, setPressure] = useState(process === 'haber' ? 200 : 2);
    const [concA, setConcA] = useState(1.0); // N2 or SO2
    const [concB, setConcB] = useState(3.0); // H2 or O2
    const [concP, setConcP] = useState(0.0); // NH3 or SO3
    const [timeData, setTimeData] = useState<any[]>([]);
    
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const currentDataRef = useRef<any[]>([]);
    
    // Refs to track slider values for the interval without restarting it constantly
    const paramsRef = useRef({ temp, pressure, concA, concB, concP, process });

    useEffect(() => {
      paramsRef.current = { temp, pressure, concA, concB, concP, process };
    }, [temp, pressure, concA, concB, concP, process]);

    // Handle disturbance: when a slider moves, we inject the change into the simulation
    const lastValues = useRef({ concA, concB, concP, pressure });
    useEffect(() => {
      if (currentDataRef.current.length > 0) {
        const lastIdx = currentDataRef.current.length - 1;
        const lastPoint = currentDataRef.current[lastIdx];
        
        const pRatio = pressure / lastValues.current.pressure;
        const deltaA = concA - lastValues.current.concA;
        const deltaB = concB - lastValues.current.concB;
        const deltaP = concP - lastValues.current.concP;

        // Create a new array to avoid mutating state-linked objects
        const updatedData = [...currentDataRef.current];
        updatedData[lastIdx] = {
          ...lastPoint,
          A: Math.max(0, lastPoint.A * pRatio + deltaA),
          B: Math.max(0, lastPoint.B * pRatio + deltaB),
          P: Math.max(0, lastPoint.P * pRatio + deltaP),
        };
        currentDataRef.current = updatedData;
        setTimeData(updatedData);
      }
      lastValues.current = { concA, concB, concP, pressure };
    }, [concA, concB, concP, pressure]);

    useEffect(() => {
      // Initialize data
      const initialData = [];
      const startA = process === 'haber' ? 1.0 : 2.0;
      const startB = process === 'haber' ? 3.0 : 1.0;
      for (let i = 0; i < 60; i++) {
        initialData.push({ time: i, A: startA, B: startB, P: 0, isEquilibrium: true });
      }
      currentDataRef.current = initialData;
      setTimeData(initialData);
      lastValues.current = { concA: startA, concB: startB, concP: 0, pressure: process === 'haber' ? 200 : 2 };
      setConcA(startA);
      setConcB(startB);
      setConcP(0);
      setPressure(process === 'haber' ? 200 : 2);
      setTemp(450);

      let time = 60;
      timerRef.current = setInterval(() => {
        const { temp, pressure, process } = paramsRef.current;
        
        // Simplified equilibrium constant Kc simulation
        // Exothermic: K decreases as T increases
        const K_base = process === 'haber' ? 0.05 : 5.0;
        const K = K_base * Math.exp((450 - temp) / 60);
        
        const lastData = currentDataRef.current[currentDataRef.current.length - 1];
        
        // Stoichiometry
        const a = process === 'haber' ? 1 : 2;
        const b = process === 'haber' ? 3 : 1;
        const p = 2;

        // Reaction Quotient Q = [P]^p / ([A]^a * [B]^b)
        const Q = (Math.pow(lastData.P, p) + 1e-9) / (Math.pow(lastData.A, a) * Math.pow(lastData.B, b) + 1e-9);
        const targetQ = K;
        
        // The "force" is based on the difference between current Q and target K
        const force = Math.log(targetQ / Q);
        
        // Rate of reaction depends on T and P (collisions)
        const collisionFactor = (temp / 450) * Math.pow(pressure / (process === 'haber' ? 200 : 2), 0.5);
        let shift = force * 0.01 * collisionFactor;

        // Safety clamps to prevent overshooting or negative concentrations
        if (shift > 0) {
          shift = Math.min(shift, lastData.A / (a * 5), lastData.B / (b * 5));
        } else if (shift < 0) {
          shift = Math.max(shift, -lastData.P / (p * 5));
        }

        const nextA = Math.max(0, lastData.A - shift * a);
        const nextB = Math.max(0, lastData.B - shift * b);
        const nextP = Math.max(0, lastData.P + shift * p);

        // Equilibrium is reached when the shift becomes negligible
        const isEq = Math.abs(shift) < 0.001;

        const newData = [
          ...currentDataRef.current.slice(1),
          {
            time: time++,
            A: Number(nextA.toFixed(3)),
            B: Number(nextB.toFixed(3)),
            P: Number(nextP.toFixed(3)),
            isEquilibrium: isEq
          }
        ];
        currentDataRef.current = newData;
        setTimeData(newData);
      }, 100);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, [process]);

    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const isEq = payload[0].payload.isEquilibrium;
        return (
          <div className="bg-white border-2 border-gray-200 p-4 rounded-2xl shadow-xl">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Concentrations</p>
            <div className="space-y-1">
              {payload.map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold" style={{ color: entry.color }}>
                    {entry.name}:
                  </span>
                  <span className="text-xs font-black">{entry.value} mol/dm³</span>
                </div>
              ))}
            </div>
            <div className={`mt-3 pt-2 border-t border-gray-100 flex items-center gap-2`}>
              <div className={`w-2 h-2 rounded-full ${isEq ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${isEq ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isEq ? 'Equilibrium Reached' : 'Approaching Equilibrium'}
              </span>
            </div>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="space-y-8">
        {/* Comparison Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setProcess('haber');
              setPressure(200);
              setConcA(1.0);
              setConcB(3.0);
              setConcP(0.0);
              currentDataRef.current = []; // Reset simulation
            }}
            className={`p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group
              ${process === 'haber' ? 'bg-indigo-50 border-indigo-200 ring-4 ring-indigo-50' : 'bg-white border-gray-100 hover:border-indigo-100'}
            `}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl ${process === 'haber' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Zap size={20} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${process === 'haber' ? 'text-indigo-500' : 'text-gray-400'}`}>Haber Process</span>
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-1 whitespace-nowrap">N₂(g) + 3H₂(g) ⇌ 2NH₃(g)</h3>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-gray-400 uppercase">Temp</span>
                <span className="text-xs font-black text-gray-700">450°C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-gray-400 uppercase">Pressure</span>
                <span className="text-xs font-black text-gray-700">200 atm</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-gray-400 uppercase">Catalyst</span>
                <span className="text-xs font-black text-gray-700">Iron (Fe)</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              setProcess('contact');
              setPressure(2);
              setConcA(2.0);
              setConcB(1.0);
              setConcP(0.0);
              currentDataRef.current = []; // Reset simulation
            }}
            className={`p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group
              ${process === 'contact' ? 'bg-emerald-50 border-emerald-200 ring-4 ring-emerald-50' : 'bg-white border-gray-100 hover:border-emerald-100'}
            `}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl ${process === 'contact' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Flame size={20} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${process === 'contact' ? 'text-emerald-500' : 'text-gray-400'}`}>Contact Process</span>
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-1 whitespace-nowrap">2SO₂(g) + O₂(g) ⇌ 2SO₃(g)</h3>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-gray-400 uppercase">Temp</span>
                <span className="text-xs font-black text-gray-700">450°C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-gray-400 uppercase">Pressure</span>
                <span className="text-xs font-black text-gray-700">2 atm</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-gray-400 uppercase">Catalyst</span>
                <span className="text-xs font-black text-gray-700">V₂O₅</span>
              </div>
            </div>
          </button>
        </div>

        {/* Controls */}
        <div className="bg-gray-50 rounded-[2.5rem] p-6 border-2 border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Settings size={18} className="text-gray-400" />
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Simulation Parameters</h4>
            </div>
            <button 
              onClick={() => {
                const startA = process === 'haber' ? 1.0 : 2.0;
                const startB = process === 'haber' ? 3.0 : 1.0;
                setConcA(startA);
                setConcB(startB);
                setConcP(0);
                setTemp(450);
                setPressure(process === 'haber' ? 200 : 2);
                const resetData = currentDataRef.current.map(d => ({ ...d, A: startA, B: startB, P: 0 }));
                currentDataRef.current = resetData;
                setTimeData(resetData);
              }}
              className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-600 transition-colors"
            >
              Reset All
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Column 1: Concentration */}
            <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                <h5 className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Concentrations</h5>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                      {process === 'haber' ? 'N₂' : 'SO₂'}
                    </label>
                    <span className="text-[10px] font-black text-emerald-600">{concA.toFixed(1)} M</span>
                  </div>
                  <input 
                    type="range" min="0.1" max="5" step="0.1" value={concA}
                    onChange={(e) => setConcA(Number(e.target.value))}
                    className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                      {process === 'haber' ? 'H₂' : 'O₂'}
                    </label>
                    <span className="text-[10px] font-black text-emerald-600">{concB.toFixed(1)} M</span>
                  </div>
                  <input 
                    type="range" min="0.1" max="5" step="0.1" value={concB}
                    onChange={(e) => setConcB(Number(e.target.value))}
                    className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                      {process === 'haber' ? 'NH₃' : 'SO₃'}
                    </label>
                    <span className="text-[10px] font-black text-emerald-600">{concP.toFixed(1)} M</span>
                  </div>
                  <input 
                    type="range" min="0" max="5" step="0.1" value={concP}
                    onChange={(e) => setConcP(Number(e.target.value))}
                    className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Column 2: Pressure */}
            <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-3 bg-indigo-500 rounded-full" />
                <h5 className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Pressure</h5>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">System Pressure</label>
                    <span className="text-[10px] font-black text-indigo-600">{pressure} atm</span>
                  </div>
                  <input 
                    type="range" 
                    min={process === 'haber' ? 50 : 1} 
                    max={process === 'haber' ? 400 : 10} 
                    step={process === 'haber' ? 10 : 0.5} 
                    value={pressure}
                    onChange={(e) => setPressure(Number(e.target.value))}
                    className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
                <div className="pt-2 border-t border-gray-50">
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                     <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                       {process === 'haber' ? '4 mol → 2 mol' : '3 mol → 2 mol'}
                     </span>
                   </div>
                </div>
              </div>
            </div>

            {/* Column 3: Temperature */}
            <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-3 bg-rose-500 rounded-full" />
                <h5 className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Temperature</h5>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">System Temp</label>
                    <span className="text-[10px] font-black text-rose-600">{temp}°C</span>
                  </div>
                  <input 
                    type="range" min="300" max="600" step="10" value={temp}
                    onChange={(e) => setTemp(Number(e.target.value))}
                    className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>
                <div className="pt-2 border-t border-gray-50">
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                     <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                       Exothermic (ΔH &lt; 0)
                     </span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status Indicator */}
        {(() => {
          const isEq = timeData.length > 0 ? timeData[timeData.length - 1].isEquilibrium : true;
          return (
            <div className={`w-full py-6 rounded-[2rem] flex items-center justify-center gap-4 transition-all duration-500 border-4 shadow-sm ${isEq ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-600'}`}>
              <div className={`w-4 h-4 rounded-full ${isEq ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
              <span className="text-lg font-black uppercase tracking-[0.2em]">
                {isEq ? 'System at Equilibrium' : 'Equilibrium Shifting...'}
              </span>
            </div>
          );
        })()}

        {/* Graph */}
        <div className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-sky-100 p-3 rounded-2xl text-sky-600">
                <Activity size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Equilibrium Graph</h2>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{process === 'haber' ? 'N₂' : 'SO₂'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{process === 'haber' ? 'H₂' : 'O₂'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{process === 'haber' ? 'NH₃' : 'SO₃'}</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 'auto']} hide />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" dataKey="A" name={process === 'haber' ? 'N₂' : 'SO₂'} 
                  stroke="#ef4444" strokeWidth={4} dot={false} isAnimationActive={false}
                />
                <Line 
                  type="monotone" dataKey="B" name={process === 'haber' ? 'H₂' : 'O₂'} 
                  stroke="#3b82f6" strokeWidth={4} dot={false} isAnimationActive={false}
                />
                <Line 
                  type="monotone" dataKey="P" name={process === 'haber' ? 'NH₃' : 'SO₃'} 
                  stroke="#10b981" strokeWidth={4} dot={false} isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-8 border-t-2 border-gray-50 pt-8">
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Le Chatelier's Tip</p>
              <p className="text-xs font-bold text-gray-600">
                {temp > 450 ? "Higher temp shifts equilibrium LEFT (Exothermic)" : "Lower temp shifts equilibrium RIGHT"}
              </p>
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pressure Effect</p>
              <p className="text-xs font-bold text-gray-600">
                Higher pressure shifts equilibrium to the side with FEWER gas moles.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CommonChemicals = () => {
    const [mode, setMode] = useState<'facts' | 'flashcards'>('facts');
    const [flipped, setFlipped] = useState<{[key: number]: boolean}>({});

    const chemicals = [
      { name: 'Cu²⁺', color: 'Blue', test: 'Test with hydroxide', colorClass: 'bg-blue-500' },
      { name: 'Fe²⁺', color: 'Green', test: 'Test with hydroxide', colorClass: 'bg-emerald-500' },
      { name: 'Fe³⁺', color: 'Brown/Yellow', test: 'Test with hydroxide', colorClass: 'bg-amber-600' },
      { name: 'Cr³⁺', color: 'Green', test: 'Test with hydroxide', colorClass: 'bg-green-600' },
      { name: 'NO₂', color: 'Brown', test: 'Visual', colorClass: 'bg-orange-800' },
      { name: 'SO₂', color: 'Colorless', test: 'Decolorize KMnO₄', colorClass: 'bg-gray-100 border-2 border-gray-200' },
      { name: 'NH₃', color: 'Colorless', test: 'Turn damp red litmus blue', colorClass: 'bg-gray-100 border-2 border-gray-200' },
      { name: 'O₂', color: 'Colorless', test: 'Relights glowing splint', colorClass: 'bg-gray-100 border-2 border-gray-200' },
      { name: 'H₂', color: 'Colorless', test: 'Squeaky pop with burning splint', colorClass: 'bg-gray-100 border-2 border-gray-200' },
      { name: 'Most metals', color: 'Grey', test: 'Conductor, reacts with acids', colorClass: 'bg-gray-400' },
      { name: 'Cu', color: 'Brown/Pink', test: 'Visual', colorClass: 'bg-orange-300' },
    ];

    const duolingoColors = [
      'bg-[#58cc02]', // Green
      'bg-[#1cb0f6]', // Blue
      'bg-[#ff9600]', // Orange
      'bg-[#ff4b4b]', // Red
      'bg-[#ce82ff]', // Purple
      'bg-[#ffc800]', // Yellow
    ];

    const toggleFlip = (index: number) => {
      setFlipped(prev => ({
        ...prev,
        [index]: !prev[index]
      }));
    };

    return (
      <div className="space-y-6">
        <div className="flex gap-4 bg-gray-100 p-2 rounded-2xl">
          <button
            onClick={() => setMode('facts')}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
              ${mode === 'facts' ? 'bg-white text-emerald-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}
            `}
          >
            Facts Mode
          </button>
          <button
            onClick={() => setMode('flashcards')}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
              ${mode === 'flashcards' ? 'bg-white text-purple-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}
            `}
          >
            Flash Cards
          </button>
        </div>

        {mode === 'facts' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {chemicals.map((chem, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white p-4 rounded-3xl border-2 border-gray-100 flex flex-col items-center text-center gap-3 hover:border-emerald-200 transition-all group"
              >
                <div className={`w-12 h-12 rounded-2xl ${chem.colorClass} shadow-inner`} />
                <div>
                  <h3 className="text-lg font-black text-gray-800">{chem.name}</h3>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">{chem.color}</p>
                  <p className="text-[9px] font-bold text-gray-400 leading-tight">{chem.test}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {chemicals.map((chem, i) => (
              <div 
                key={i} 
                className="perspective-1000 h-40 cursor-pointer"
                onClick={() => toggleFlip(i)}
              >
                <motion.div
                  initial={false}
                  animate={{ rotateY: flipped[i] ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                  className="relative w-full h-full preserve-3d"
                >
                  {/* Front */}
                  <div className={`absolute inset-0 backface-hidden rounded-3xl flex flex-col items-center justify-center p-4 shadow-[0_8px_0_0_rgba(0,0,0,0.1)] border-2 border-white/20 ${duolingoColors[i % duolingoColors.length]}`}>
                    <span className="text-3xl font-black text-white drop-shadow-md">{chem.name}</span>
                    <span className="mt-2 text-[10px] font-black text-white/60 uppercase tracking-widest">Tap to flip</span>
                  </div>

                  {/* Back */}
                  <div 
                    className="absolute inset-0 backface-hidden rounded-3xl flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-100 shadow-[0_8px_0_0_rgba(0,0,0,0.05)] rotate-y-180"
                  >
                    <div className={`w-8 h-8 rounded-lg mb-3 ${chem.colorClass} shadow-inner`} />
                    <p className="text-sm font-black text-gray-800 uppercase tracking-tight mb-1">{chem.color}</p>
                    <p className="text-[10px] font-bold text-gray-500 text-center leading-tight">{chem.test}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const HomologousSeries = () => {
    const [selectedSeries, setSelectedSeries] = useState<'alkane' | 'alkene' | 'alcohol' | 'acid'>('alkane');
    const [carbons, setCarbons] = useState(1);

    const seriesData = {
      alkane: {
        name: 'Alkanes',
        formula: 'CₙH₂ₙ₊₂',
        functional: 'None',
        color: 'indigo',
        icon: <Atom size={20} />,
        desc: 'Saturated hydrocarbons with single C-C bonds.'
      },
      alkene: {
        name: 'Alkenes',
        formula: 'CₙH₂ₙ',
        functional: 'C=C Double Bond',
        color: 'emerald',
        icon: <Zap size={20} />,
        desc: 'Unsaturated hydrocarbons with at least one C=C bond.'
      },
      alcohol: {
        name: 'Alcohols',
        formula: 'CₙH₂ₙ₊₁OH',
        functional: '-OH Hydroxyl Group',
        color: 'sky',
        icon: <Droplets size={20} />,
        desc: 'Organic compounds containing a hydroxyl (-OH) group.'
      },
      acid: {
        name: 'Carboxylic Acids',
        formula: 'CₙH₂ₙ₊₁COOH',
        functional: '-COOH Carboxyl Group',
        color: 'rose',
        icon: <Flame size={20} />,
        desc: 'Organic acids containing a carboxyl (-COOH) group.'
      }
    };

    const getPrefix = (n: number) => {
      const prefixes = ['', 'meth', 'eth', 'prop', 'but', 'pent', 'hex'];
      return prefixes[n] || '';
    };

    const getCompoundName = (series: string, n: number) => {
      const prefix = getPrefix(n);
      if (series === 'alkane') return prefix + 'ane';
      if (series === 'alkene') return n < 2 ? 'N/A' : prefix + '-1-ene';
      if (series === 'alcohol') return prefix + 'an-1-ol';
      if (series === 'acid') return prefix + 'anoic acid';
      return '';
    };

    const sub = (num: number) => num.toString().split('').map(d => '₀₁₂₃₄₅₆₇₈₉'[parseInt(d)]).join('');

    const getMolecularFormula = (series: string, N: number) => {
      if (series === 'alkane') return `C${sub(N)}H${sub(2 * N + 2)}`;
      if (series === 'alkene') return N < 2 ? 'N/A' : `C${sub(N)}H${sub(2 * N)}`;
      if (series === 'alcohol') return `C${sub(N)}H${sub(2 * N + 1)}OH`;
      if (series === 'acid') {
        const n = N - 1;
        if (n === 0) return `HCOOH`;
        return `C${sub(n)}H${sub(2 * n + 1)}COOH`;
      }
      return '';
    };

    const getCondensedFormula = (series: string, N: number) => {
      if (series === 'alkane') {
        if (N === 1) return 'CH₄';
        if (N === 2) return 'CH₃CH₃';
        return 'CH₃' + '(CH₂)'.repeat(N - 2) + 'CH₃';
      }
      if (series === 'alkene') {
        if (N < 2) return 'N/A';
        if (N === 2) return 'CH₂=CH₂';
        if (N === 3) return 'CH₂=CHCH₃';
        return 'CH₂=CH' + '(CH₂)'.repeat(N - 3) + 'CH₃';
      }
      if (series === 'alcohol') {
        if (N === 1) return 'CH₃OH';
        if (N === 2) return 'CH₃CH₂OH';
        return 'CH₃' + '(CH₂)'.repeat(N - 1) + 'OH';
      }
      if (series === 'acid') {
        if (N === 1) return 'HCOOH';
        if (N === 2) return 'CH₃COOH';
        return 'CH₃' + '(CH₂)'.repeat(N - 2) + 'COOH';
      }
      return '';
    };

    const renderMolecule = () => {
      const spacing = 60;
      const startX = 60;
      const centerY = 100;
      const N = carbons;

      if (selectedSeries === 'alkene' && N < 2) {
        return (
          <div className="h-full flex items-center justify-center text-gray-400 font-bold italic">
            Alkenes require at least 2 carbon atoms.
          </div>
        );
      }

      const atoms: any[] = [];
      const bonds: any[] = [];

      for (let i = 0; i < N; i++) {
        const x = startX + i * spacing;
        atoms.push({ x, y: centerY, label: 'C', color: 'text-gray-800' });

        // Horizontal bonds
        if (i < N - 1) {
          const isDouble = selectedSeries === 'alkene' && i === 0;
          if (isDouble) {
            bonds.push({ x1: x + 12, y1: centerY - 3, x2: x + spacing - 12, y2: centerY - 3 });
            bonds.push({ x1: x + 12, y1: centerY + 3, x2: x + spacing - 12, y2: centerY + 3 });
          } else {
            bonds.push({ x1: x + 12, y1: centerY, x2: x + spacing - 12, y2: centerY });
          }
        }

        // Vertical bonds
        const isFunctionalCarbon = (selectedSeries === 'acid' && i === N - 1);
        
        if (!isFunctionalCarbon) {
          const isAlkeneC1 = selectedSeries === 'alkene' && i === 0;
          const isAlkeneC2 = selectedSeries === 'alkene' && i === 1;

          // Top H
          if (!isAlkeneC2) {
            bonds.push({ x1: x, y1: centerY - 12, x2: x, y2: centerY - 35 });
            atoms.push({ x, y: centerY - 45, label: 'H', color: 'text-gray-400' });
          }
          // Bottom H
          if (!isAlkeneC1) {
            bonds.push({ x1: x, y1: centerY + 12, x2: x, y2: centerY + 35 });
            atoms.push({ x, y: centerY + 45, label: 'H', color: 'text-gray-400' });
          }
        }

        // Left-most H
        if (i === 0) {
          bonds.push({ x1: x - 12, y1: centerY, x2: x - 35, y2: centerY });
          atoms.push({ x: x - 45, y: centerY, label: 'H', color: 'text-gray-400' });
        }

        // Right-most group
        if (i === N - 1) {
          if (selectedSeries === 'alkane' || selectedSeries === 'alkene') {
            bonds.push({ x1: x + 12, y1: centerY, x2: x + 35, y2: centerY });
            atoms.push({ x: x + 45, y: centerY, label: 'H', color: 'text-gray-400' });
          } else if (selectedSeries === 'alcohol') {
            bonds.push({ x1: x + 12, y1: centerY, x2: x + 35, y2: centerY });
            atoms.push({ x: x + 45, y: centerY, label: 'O', color: 'text-sky-500' });
            bonds.push({ x1: x + 57, y1: centerY, x2: x + 80, y2: centerY });
            atoms.push({ x: x + 90, y: centerY, label: 'H', color: 'text-gray-400' });
          } else if (selectedSeries === 'acid') {
            // C=O
            bonds.push({ x1: x + 8, y1: centerY - 8, x2: x + 25, y2: centerY - 25 });
            bonds.push({ x1: x + 12, y1: centerY - 4, x2: x + 29, y2: centerY - 21 });
            atoms.push({ x: x + 35, y: centerY - 35, label: 'O', color: 'text-rose-500' });
            // C-O-H
            bonds.push({ x1: x + 12, y1: centerY + 8, x2: x + 25, y2: centerY + 21 });
            atoms.push({ x: x + 35, y: centerY + 35, label: 'O', color: 'text-rose-500' });
            bonds.push({ x1: x + 47, y1: centerY + 35, x2: x + 70, y2: centerY + 35 });
            atoms.push({ x: x + 80, y: centerY + 35, label: 'H', color: 'text-gray-400' });
          }
        }
      }

      return (
        <svg viewBox={`0 0 ${startX + N * spacing + 100} 200`} className="w-full h-full">
          {bonds.map((b, i) => (
            <line key={i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          ))}
          {atoms.map((a, i) => (
            <g key={i}>
              <circle cx={a.x} cy={a.y} r="12" fill="white" stroke="#f1f5f9" strokeWidth="1" />
              <text 
                x={a.x} y={a.y} 
                textAnchor="middle" 
                dominantBaseline="central" 
                className={`text-xs font-black ${a.color}`}
                style={{ fontSize: '14px' }}
              >
                {a.label}
              </text>
            </g>
          ))}
        </svg>
      );
    };

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          {(Object.entries(seriesData) as [keyof typeof seriesData, any][]).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setSelectedSeries(key)}
              className={`p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group
                ${selectedSeries === key ? `bg-${data.color}-50 border-${data.color}-200 ring-4 ring-${data.color}-50` : 'bg-white border-gray-100 hover:border-gray-200'}
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl ${selectedSeries === key ? `bg-${data.color}-500 text-white` : 'bg-gray-100 text-gray-400'}`}>
                  {data.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${selectedSeries === key ? `text-${data.color}-500` : 'text-gray-400'}`}>
                  {data.name}
                </span>
              </div>
              <h3 className="text-xl font-black text-gray-800 mb-2">{data.formula}</h3>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Functional Group</p>
                <p className={`text-xs font-black ${selectedSeries === key ? `text-${data.color}-600` : 'text-gray-600'}`}>{data.functional}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-gray-50 rounded-[2.5rem] p-8 border-2 border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Eye size={20} className="text-gray-400" />
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Molecule Visualizer</h4>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Carbons: {carbons}</span>
              <input 
                type="range" min="1" max="6" step="1" value={carbons}
                onChange={(e) => setCarbons(parseInt(e.target.value))}
                className="w-32 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border-2 border-gray-100 p-8 shadow-sm overflow-hidden">
            <div className="h-48 mb-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200 relative">
              {renderMolecule()}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</p>
                <p className="text-sm font-black text-gray-800 capitalize">{getCompoundName(selectedSeries, carbons)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Molecular</p>
                <p className="text-sm font-black text-gray-800">{getMolecularFormula(selectedSeries, carbons)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Condensed</p>
                <p className="text-sm font-black text-gray-800">{getCondensedFormula(selectedSeries, carbons)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Series</p>
                <p className={`text-sm font-black text-${seriesData[selectedSeries].color}-600`}>{seriesData[selectedSeries].name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const QuickFacts = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hoveredRule, setHoveredRule] = useState<string | null>(null);
    const [hoveredApparatus, setHoveredApparatus] = useState<string | null>(null);
    const [hoveredMoleEq, setHoveredMoleEq] = useState<number | null>(null);
    const [hoveredMetalType, setHoveredMetalType] = useState<'transition' | 'main-group' | null>(null);
    const [hoveredOxideElement, setHoveredOxideElement] = useState<number | null>(null);
    const [hoveredOxideType, setHoveredOxideType] = useState<string | null>(null);
    const [beaker1Add, setBeaker1Add] = useState<'none' | 'acid' | 'base'>('none');
    const [beaker2Add, setBeaker2Add] = useState<'none' | 'acid' | 'base'>('none');
    const [beaker3Add, setBeaker3Add] = useState<'none' | 'acid' | 'base'>('none');
    const [revealedOxidation, setRevealedOxidation] = useState<number[]>([]);
    const [alExtractionActive, setAlExtractionActive] = useState(false);
    const [feExtractionActive, setFeExtractionActive] = useState(false);
    const [hoveredExtractionMetal, setHoveredExtractionMetal] = useState<string | null>(null);
    const [rateReaction, setRateReaction] = useState<'Mg' | 'CaCO3' | 'H2O2'>('Mg');
    const [rateParams, setRateParams] = useState({
      concentration: 2,
      temperature: 2,
      surfaceArea: 2,
      pressure: 2,
      catalyst: false
    });
    const [hoveredPhRegion, setHoveredPhRegion] = useState<'acid' | 'base' | null>(null);
    const [acidStrengthActive, setAcidStrengthActive] = useState(false);
    const [mgActiveStrong, setMgActiveStrong] = useState(false);
    const [mgActiveWeak, setMgActiveWeak] = useState(false);
    const [hoveredReactivity, setHoveredReactivity] = useState<number | null>(null);
    const [selectedSaltPrep, setSelectedSaltPrep] = useState<string | null>(null);
    const [ionicStep, setIonicStep] = useState(0); // 0: Molecular, 1: Complete Ionic, 2: Net Ionic
    const [ionicExampleIndex, setIonicExampleIndex] = useState(0);
    const [selectedBondingSubstance, setSelectedBondingSubstance] = useState<string | null>(null);
    const [selectedSolubilitySalt, setSelectedSolubilitySalt] = useState<string | null>(null);
    const [electrolyteState, setElectrolyteState] = useState<'solid' | 'molten' | 'aqueous'>('solid');
    const [selectedElectrolyte, setSelectedElectrolyte] = useState<string | null>(null);
    const [selectedReactivityOxide, setSelectedReactivityOxide] = useState<number>(7); // Iron
    const [selectedReactivityAcid, setSelectedReactivityAcid] = useState<number>(3); // Magnesium

    const saltPrepData = {
      'NaCl': { soluble: true, group1: true, method: 'Titration' },
      'CuSO4': { soluble: true, group1: false, method: 'Excess Solid' },
      'AgCl': { soluble: false, group1: false, method: 'Precipitation' }
    };

    const apparatusData = [
      { 
        id: 'burette', 
        name: 'Burette', 
        accuracy: 'Accurate', 
        volume: 'Variable',
        use: 'Accurate + Variable volume',
        svg: (
          <svg viewBox="0 0 40 100" className="w-full h-32 text-sky-500">
            <rect x="18" y="5" width="4" height="80" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {[...Array(15)].map((_, i) => (
              <line key={i} x1="18" y1={10 + i * 5} x2={i % 5 === 0 ? "22" : "20"} y2={10 + i * 5} stroke="currentColor" strokeWidth="0.5" />
            ))}
            <circle cx="20" cy="88" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="20" y1="91" x2="20" y2="100" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )
      },
      { 
        id: 'pipette', 
        name: 'Pipette', 
        accuracy: 'Accurate', 
        volume: 'Fixed',
        use: 'Accurate + Fixed volume',
        svg: (
          <svg viewBox="0 0 40 100" className="w-full h-32 text-emerald-500">
            <rect x="19" y="5" width="2" height="35" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="20" cy="55" rx="8" ry="15" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <rect x="19" y="75" width="2" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="18" y1="20" x2="22" y2="20" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )
      },
      { 
        id: 'cylinder', 
        name: 'Measuring Cylinder', 
        accuracy: 'Rough', 
        volume: 'Variable',
        use: 'Rough + Variable volume',
        svg: (
          <svg viewBox="0 0 40 100" className="w-full h-32 text-amber-500">
            <path d="M 12 10 L 12 90 Q 12 95 20 95 Q 28 95 28 90 L 28 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <rect x="8" y="95" width="24" height="3" rx="1.5" fill="currentColor" />
            {[...Array(8)].map((_, i) => (
              <line key={i} x1="12" y1={20 + i * 10} x2="18" y2={20 + i * 10} stroke="currentColor" strokeWidth="0.8" />
            ))}
          </svg>
        )
      }
    ];

    const reactivityElements = [
      { symbol: 'K', name: 'Potassium' },
      { symbol: 'Na', name: 'Sodium' },
      { symbol: 'Ca', name: 'Calcium' },
      { symbol: 'Mg', name: 'Magnesium' },
      { symbol: 'Al', name: 'Aluminium' },
      { symbol: 'C', name: 'Carbon', color: 'text-emerald-500' },
      { symbol: 'Zn', name: 'Zinc' },
      { symbol: 'Fe', name: 'Iron' },
      { symbol: 'Pb', name: 'Lead' },
      { symbol: 'H', name: 'Hydrogen', color: 'text-rose-500' },
      { symbol: 'Cu', name: 'Copper' },
      { symbol: 'Ag', name: 'Silver' },
      { symbol: 'Au', name: 'Gold' },
    ];

    const ParticleBox = ({ state }: { state: 'solid' | 'liquid' | 'gas' }) => {
      if (state === 'solid') {
        return (
          <div className="grid grid-cols-4 gap-1 p-2">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ x: [0, 1, -1, 0], y: [0, -1, 1, 0] }}
                transition={{ duration: 0.1, repeat: Infinity }}
                className="w-3 h-3 bg-gray-400 rounded-full"
              />
            ))}
          </div>
        );
      }
      if (state === 'liquid') {
        return (
          <div className="relative w-full h-full">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  x: [Math.random() * 40, Math.random() * 40], 
                  y: [Math.random() * 40, Math.random() * 40] 
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
                className="absolute w-3 h-3 bg-sky-400 rounded-full"
                style={{ left: `${(i % 4) * 20 + 10}%`, top: `${Math.floor(i / 4) * 20 + 10}%` }}
              />
            ))}
          </div>
        );
      }
      return (
        <div className="relative w-full h-full">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                x: [Math.random() * 60 - 30, Math.random() * 60 - 30], 
                y: [Math.random() * 60 - 30, Math.random() * 60 - 30] 
              }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
              className="absolute w-2 h-2 bg-orange-400 rounded-full"
              style={{ left: `${Math.random() * 60 + 20}%`, top: `${Math.random() * 60 + 20}%` }}
            />
          ))}
        </div>
      );
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gray-50 pb-32"
      >
        <header className="bg-white border-b-2 border-gray-200 p-6 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setMode('dashboard')}
                className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Quick Facts</h1>
                <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest">Essential Chemistry Knowledge</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all
                  ${isExpanded ? 'bg-emerald-500 text-white shadow-[0_4px_0_0_#059669]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                {isExpanded ? 'Collapse List' : 'Expand Card'}
              </button>
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl hidden sm:block">
                <BookOpen size={28} />
              </div>
            </div>
          </div>
        </header>

        <main className={`mx-auto p-6 transition-all duration-500 ${isExpanded ? 'max-w-7xl' : 'max-w-2xl'} space-y-8`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)] overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-12">
              <div className="bg-sky-100 p-3 rounded-2xl text-sky-600">
                <Thermometer size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">State Change</h2>
            </div>

            <div className="relative w-full max-w-2xl mx-auto mb-8 h-[300px]">
              <div className="absolute inset-0 flex items-center justify-between px-4">
                {/* SVG for arrows */}
                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 600 300">
                  <defs>
                    <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                    </marker>
                    <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                    </marker>
                  </defs>
                  
                  {/* Solid to Liquid (Melting) */}
                  <path d="M 140 130 Q 200 110 260 130" fill="none" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowhead-blue)" />
                  {/* Liquid to Solid (Freezing) */}
                  <path d="M 260 170 Q 200 190 140 170" fill="none" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowhead-red)" />
                  
                  {/* Liquid to Gas (Boiling) */}
                  <path d="M 340 130 Q 400 110 460 130" fill="none" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowhead-blue)" />
                  {/* Gas to Liquid (Condensing) */}
                  <path d="M 460 170 Q 400 190 340 170" fill="none" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowhead-red)" />
                  
                  {/* Solid to Gas (Sublimating) */}
                  <path d="M 100 100 Q 300 20 500 100" fill="none" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowhead-blue)" />
                  {/* Gas to Solid (Depositing) */}
                  <path d="M 500 200 Q 300 280 100 200" fill="none" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowhead-red)" />
                </svg>

                {/* Labels for transitions */}
                <div className="absolute top-[95px] left-[180px] text-[10px] font-black text-blue-500 uppercase">Melting</div>
                <div className="absolute top-[185px] left-[180px] text-[10px] font-black text-red-500 uppercase">Freezing</div>
                
                <div className="absolute top-[95px] right-[180px] text-[10px] font-black text-blue-500 uppercase">Boiling</div>
                <div className="absolute top-[185px] right-[180px] text-[10px] font-black text-red-500 uppercase">Condensing</div>
                
                <div className="absolute top-[35px] left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-500 uppercase">Sublimating</div>
                <div className="absolute bottom-[35px] left-1/2 -translate-x-1/2 text-[10px] font-black text-red-500 uppercase">Depositing</div>

                {/* States */}
                {/* Solid (Left) */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-24 h-24 bg-gray-50 rounded-2xl border-2 border-gray-100 flex items-center justify-center overflow-hidden relative">
                    <ParticleBox state="solid" />
                  </div>
                  <span className="mt-2 font-black text-gray-800 uppercase tracking-widest text-sm">Solid</span>
                </div>

                {/* Liquid (Middle) */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-24 h-24 bg-sky-50 rounded-2xl border-2 border-sky-100 flex items-center justify-center overflow-hidden relative">
                    <ParticleBox state="liquid" />
                  </div>
                  <span className="mt-2 font-black text-gray-800 uppercase tracking-widest text-sm">Liquid</span>
                </div>

                {/* Gas (Right) */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-24 h-24 bg-orange-50 rounded-2xl border-2 border-orange-100 flex items-center justify-center overflow-hidden relative">
                    <ParticleBox state="gas" />
                  </div>
                  <span className="mt-2 font-black text-gray-800 uppercase tracking-widest text-sm">Gas</span>
                </div>
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Endothermic</p>
                <p className="text-xs font-bold text-gray-600">Energy is absorbed (Melting, Boiling, Sublimating).</p>
              </div>
              <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-100">
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Exothermic</p>
                <p className="text-xs font-bold text-gray-600">Energy is released (Freezing, Condensing, Depositing).</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)] overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                <Droplets size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Solubility Rules</h2>
            </div>

            <div className="relative w-full aspect-square max-w-md mx-auto flex items-center justify-center">
              {/* Tooltip/Overlay for hovered rule */}
              <AnimatePresence>
                {hoveredRule && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="absolute top-0 left-0 right-0 z-50 bg-gray-800 text-white p-4 rounded-2xl text-center shadow-xl border-2 border-gray-700"
                  >
                    <p className="font-bold text-sm leading-tight">{hoveredRule}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Central Circle */}
              <motion.div 
                onMouseEnter={() => setHoveredRule("All Potassium (K⁺), Sodium (Na⁺), Ammonium (NH₄⁺), and Nitrate (NO₃⁻) salts are soluble.")}
                onMouseLeave={() => setHoveredRule(null)}
                whileHover={{ scale: 1.05 }}
                className={`relative z-20 w-48 h-48 rounded-full flex flex-col items-center justify-center p-6 text-center border-4 border-white shadow-xl cursor-help transition-all
                  ${(selectedSolubilitySalt === 'NaCl' || selectedSolubilitySalt === 'NH43PO4') ? 'bg-emerald-600 scale-105 ring-4 ring-emerald-200' : 'bg-emerald-500 hover:bg-emerald-600'}
                `}
              >
                <div className="text-white font-black text-lg flex flex-wrap justify-center gap-x-2 leading-none">
                  <span>K<sup>+</sup></span>
                  <span>Na<sup>+</sup></span>
                  <span>NH<sub>4</sub><sup>+</sup></span>
                  <span>NO<sub>3</sub><sup>-</sup></span>
                </div>
                <p className="text-white/80 font-bold text-[10px] uppercase mt-2 tracking-widest">Always Soluble</p>
              </motion.div>

              {/* Top Circle (Sulfates) */}
              <motion.div 
                onMouseEnter={() => setHoveredRule("Most sulfates are soluble except Barium Sulfate (BaSO₄) and Lead(II) Sulfate (PbSO₄).")}
                onMouseLeave={() => setHoveredRule(null)}
                whileHover={{ scale: 1.1, zIndex: 30 }}
                className={`absolute top-4 z-10 w-36 h-36 rounded-full flex items-center justify-center p-4 text-center border-2 cursor-help transition-all
                  ${(selectedSolubilitySalt === 'MgSO4' || selectedSolubilitySalt === 'BaSO4') ? 'bg-sky-300 border-sky-400 scale-110 z-30' : 'bg-sky-100 border-sky-200 hover:bg-sky-200'}
                `}
              >
                <p className="text-sky-800 font-black text-xl">SO<sub>4</sub><sup>2-</sup></p>
              </motion.div>

              {/* Bottom Circle (Halides) */}
              <motion.div 
                onMouseEnter={() => setHoveredRule("Most halides (Cl⁻, Br⁻, I⁻) are soluble except Silver Halides (AgX) and Lead(II) Halides (PbX₂).")}
                onMouseLeave={() => setHoveredRule(null)}
                whileHover={{ scale: 1.1, zIndex: 30 }}
                className={`absolute bottom-4 z-10 w-36 h-36 rounded-full flex items-center justify-center p-4 text-center border-2 cursor-help transition-all
                  ${(selectedSolubilitySalt === 'NaCl' || selectedSolubilitySalt === 'AgBr' || selectedSolubilitySalt === 'PbI2') ? 'bg-sky-300 border-sky-400 scale-110 z-30' : 'bg-sky-100 border-sky-200 hover:bg-sky-200'}
                `}
              >
                <p className="text-sky-800 font-black text-xl">X<sup>-</sup></p>
              </motion.div>

              {/* Left Circle (Hydroxides) */}
              <motion.div 
                onMouseEnter={() => setHoveredRule("Most hydroxides are insoluble except those of K⁺, Na⁺, and NH₄⁺.")}
                onMouseLeave={() => setHoveredRule(null)}
                whileHover={{ scale: 1.1, zIndex: 30 }}
                className={`absolute left-[-10px] z-10 w-36 h-36 rounded-full flex items-center justify-center p-4 text-center border-2 cursor-help transition-all
                  ${selectedSolubilitySalt === 'Fe(OH)2' ? 'bg-rose-300 border-rose-400 scale-110 z-30' : 'bg-rose-100 border-rose-200 hover:bg-rose-200'}
                `}
              >
                <p className="text-rose-800 font-black text-xl">OH<sup>-</sup></p>
              </motion.div>

              {/* Right Circle (Carbonates) */}
              <motion.div 
                onMouseEnter={() => setHoveredRule("Most carbonates are insoluble except those of K⁺, Na⁺, and NH₄⁺.")}
                onMouseLeave={() => setHoveredRule(null)}
                whileHover={{ scale: 1.1, zIndex: 30 }}
                className={`absolute right-[-10px] z-10 w-36 h-36 rounded-full flex items-center justify-center p-4 text-center border-2 cursor-help transition-all
                  ${selectedSolubilitySalt === 'CuCO3' ? 'bg-rose-300 border-rose-400 scale-110 z-30' : 'bg-rose-100 border-rose-200 hover:bg-rose-200'}
                `}
              >
                <p className="text-rose-800 font-black text-xl">CO<sub>3</sub><sup>2-</sup></p>
              </motion.div>
            </div>
            
            <div className="mt-8 grid grid-cols-4 gap-2">
              {[
                { id: 'NaCl', label: 'NaCl' },
                { id: 'MgSO4', label: 'MgSO₄' },
                { id: 'CuCO3', label: 'CuCO₃' },
                { id: 'Fe(OH)2', label: 'Fe(OH)₂' },
                { id: 'AgBr', label: 'AgBr' },
                { id: 'BaSO4', label: 'BaSO₄' },
                { id: 'PbI2', label: 'PbI₂' },
                { id: 'NH43PO4', label: '(NH₄)₃PO₄' }
              ].map((salt) => (
                <button
                  key={salt.id}
                  onClick={() => setSelectedSolubilitySalt(selectedSolubilitySalt === salt.id ? null : salt.id)}
                  className={`px-2 py-1.5 rounded-lg text-[9px] font-black tracking-tighter transition-all active:scale-95
                    ${selectedSolubilitySalt === salt.id 
                      ? 'bg-emerald-500 text-white shadow-[0_3px_0_0_#059669]' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                  `}
                >
                  {salt.label}
                </button>
              ))}
            </div>
            
            <p className="text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-6">Click a salt to see its rule</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
                <Zap size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Reactivity Series</h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Vertical Reactivity Bar */}
              <div className="w-full lg:w-72 bg-gray-50 rounded-[2.5rem] p-6 border-2 border-gray-100">
                <div className="flex flex-col items-center gap-2 mb-6">
                  <TrendingUp size={20} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">Reactivity Gradient</span>
                  <div className="w-full h-1 bg-gradient-to-r from-emerald-400 via-gray-300 to-rose-400 rounded-full mt-2" />
                </div>

                <div className="flex flex-col gap-3">
                  {reactivityElements.map((el, i) => (
                    <motion.button
                      key={el.symbol}
                      onMouseEnter={() => setHoveredReactivity(i)}
                      onMouseLeave={() => setHoveredReactivity(null)}
                      whileHover={{ x: 5 }}
                      className={`relative w-full group overflow-hidden rounded-2xl border-2 transition-all p-3 flex items-center justify-between
                        ${el.symbol === 'C' ? 'bg-emerald-50 border-emerald-200' : 
                          el.symbol === 'H' ? 'bg-rose-50 border-rose-200' : 
                          'bg-white border-white'}
                        ${i === selectedReactivityOxide ? 'ring-4 ring-emerald-500/20 border-emerald-500 z-10' : ''}
                        ${i === selectedReactivityAcid ? 'ring-4 ring-rose-500/20 border-rose-500 z-10' : ''}
                        hover:shadow-lg
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-sm border-2 
                          ${el.symbol === 'C' ? 'bg-emerald-500 text-white' : 
                            el.symbol === 'H' ? 'bg-rose-500 text-white' : 
                            'bg-gray-100 text-gray-700'}
                          ${el.color?.includes('emerald') ? 'bg-emerald-500 text-white' : ''}
                        `}>
                          {el.symbol}
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-gray-800 uppercase leading-none mb-1">{el.name}</p>
                          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                            {i < 5 ? 'Electrolysis' : i > 5 ? 'C Reduction' : 'Benchmark'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${i < 5 ? 'bg-blue-500' : i > 5 ? 'bg-orange-500' : 'bg-gray-300'}`} />
                        <div className={`w-1.5 h-1.5 rounded-full ${i < 9 ? 'bg-emerald-500' : i > 9 ? 'bg-rose-500' : 'bg-gray-300'}`} />
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-white rounded-2xl border-2 border-gray-100">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Key Info</h4>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded bg-blue-500" />
                         <span className="text-[10px] font-bold text-gray-600">Active Extraction</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded bg-orange-500" />
                         <span className="text-[10px] font-bold text-gray-600">Heat with Coke</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded bg-emerald-500" />
                         <span className="text-[10px] font-bold text-gray-600">Acid Reactive</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Main Display Area */}
              <div className="flex-1 space-y-8">
                {/* Information Callout */}
                <div className="bg-gray-50 rounded-[2.5rem] p-6 border-2 border-gray-100 min-h-[100px] flex items-center justify-center relative overflow-hidden group">
                  <AnimatePresence mode="wait">
                    {hoveredReactivity !== null ? (
                      <motion.div
                        key={hoveredReactivity}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-center"
                      >
                         <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-2">
                           {reactivityElements[hoveredReactivity].name} ({reactivityElements[hoveredReactivity].symbol})
                         </h3>
                         <div className="flex gap-4 justify-center">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${hoveredReactivity < 9 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                               {hoveredReactivity < 9 ? 'Reacts with Acid' : 'Unreactive with Acid'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${hoveredReactivity < 5 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                               {hoveredReactivity < 5 ? 'Electrolysis Only' : 'C Reduction Possible'}
                            </span>
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                        <Info className="text-gray-300 mb-2" size={32} />
                        <p className="text-xs font-bold text-gray-400 text-center uppercase tracking-[0.2em]">Select an element to simulate its reactions</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Stacked Simulators */}
                <div className="flex flex-col gap-8">
                  {/* Oxide Reduction Simulator */}
                  <div className="bg-gray-50 rounded-[2.5rem] p-8 border-2 border-gray-100 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-gray-200 pb-4 gap-4">
                      <div>
                        <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none mb-1">Metal Oxide Reduction</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Test if Carbon (C) can remove Oxygen from Metal Oxides</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {reactivityElements.filter(el => el.symbol !== 'C' && el.symbol !== 'H').map((el, i) => {
                          const elIdx = reactivityElements.findIndex(e => e.symbol === el.symbol);
                          return (
                            <button
                              key={el.symbol}
                              onClick={() => setSelectedReactivityOxide(elIdx)}
                              className={`w-10 h-10 rounded-xl text-xs font-black transition-all flex items-center justify-center
                                ${selectedReactivityOxide === elIdx ? 'bg-emerald-500 text-white shadow-xl scale-110 ring-4 ring-emerald-500/20' : 'bg-white text-gray-400 border-2 border-gray-100 hover:border-emerald-300 hover:text-emerald-500'}
                              `}
                            >
                              {el.symbol}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-[2rem] p-8 border-2 border-gray-100 shadow-inner overflow-hidden relative">
                       <div className="flex flex-col items-center justify-center space-y-8 h-full">
                          <div className="flex flex-col items-center gap-2">
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chemical Equation</span>
                             <div className="flex items-center gap-3 font-mono text-lg font-black text-gray-800 bg-gray-50 px-6 py-3 rounded-2xl border-2 border-gray-100 shadow-sm">
                                <span>{reactivityElements[selectedReactivityOxide].symbol}O</span>
                                <span className="text-gray-300">+</span>
                                <span className="text-emerald-600 bg-emerald-50 px-2 rounded-lg">C</span>
                                <span className="text-gray-300">→</span>
                                {selectedReactivityOxide > 5 ? (
                                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right duration-500">
                                    <span className="text-gray-900">{reactivityElements[selectedReactivityOxide].symbol}</span>
                                    <span className="text-gray-300">+</span>
                                    <span className="text-blue-600 font-black">CO₂</span>
                                  </div>
                                ) : (
                                  <span className="text-rose-500 font-black italic tracking-tighter opacity-50 px-4">No Reaction</span>
                                )}
                             </div>
                          </div>

                          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4 w-full">
                             <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                <Search size={20} />
                             </div>
                             <div>
                               <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Why?</p>
                               <p className="text-[11px] font-bold text-gray-600 leading-tight">
                                 {selectedReactivityOxide > 5 
                                   ? `Carbon is more reactive than ${reactivityElements[selectedReactivityOxide].name}, so it displaces it.` 
                                   : `${reactivityElements[selectedReactivityOxide].name} is too reactive for Carbon to displace.`}
                               </p>
                             </div>
                          </div>
                       </div>

                       <div className="h-64 flex flex-col items-center justify-center relative bg-gray-50 rounded-[2rem] border-2 border-gray-200/50 shadow-inner">
                          {/* Beaker / Crucible */}
                          <div className="relative w-48 h-32 bg-gray-200 rounded-xl border-b-8 border-x-4 border-gray-300 flex items-center justify-center">
                             {/* Carbon Mix */}
                             <div className="absolute inset-0 bg-black opacity-10 rounded-lg m-1" />
                             
                             {/* Heating Flame */}
                             <motion.div 
                               animate={{ 
                                 scaleY: [1, 1.3, 1], 
                                 scaleX: [1, 1.1, 1],
                                 opacity: [0.7, 1, 0.7],
                                 y: [0, -2, 0]
                               }}
                               transition={{ repeat: Infinity, duration: 0.4 }}
                               className="absolute -bottom-6 w-20 h-10 bg-gradient-to-t from-orange-600 via-orange-400 to-yellow-300 blur-md rounded-t-full z-0 translate-y-2"
                             />

                             <div className="relative z-10 flex flex-col items-center">
                               {selectedReactivityOxide > 5 ? (
                                  <div className="flex flex-col items-center">
                                     <motion.div 
                                       animate={{ 
                                         scale: [0.8, 1],
                                         rotate: [0, 5, -5, 0]
                                       }}
                                       className="w-20 h-8 bg-gray-500 rounded-lg shadow-2xl border-b-4 border-gray-600 flex items-center justify-center"
                                     >
                                        <span className="text-[8px] font-black text-white uppercase">{reactivityElements[selectedReactivityOxide].name}</span>
                                     </motion.div>
                                     <div className="flex gap-2 mt-4">
                                        {[...Array(5)].map((_, i) => (
                                          <motion.div 
                                            key={i}
                                            animate={{ 
                                              y: [-10, -80],
                                              x: [(i-2) * 20, (i-2) * 40],
                                              opacity: [0, 1, 0],
                                              scale: [0.5, 1.5, 0.5]
                                            }}
                                            transition={{ 
                                              duration: 1.5 + Math.random(), 
                                              repeat: Infinity, 
                                              delay: i * 0.2 
                                            }}
                                            className="w-4 h-4 rounded-full border border-blue-400 bg-blue-100/30 blur-[1px]"
                                          />
                                        ))}
                                     </div>
                                  </div>
                               ) : (
                                  <div className="flex flex-col items-center opacity-40">
                                     <div className="w-16 h-8 bg-orange-950 rounded-sm mb-2" />
                                     <span className="text-[9px] font-black text-gray-400 uppercase">Unchanged Mixture</span>
                                  </div>
                               )}
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Acid Reaction Simulator */}
                  <div className="bg-gray-50 rounded-[2.5rem] p-8 border-2 border-gray-100 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-gray-200 pb-4 gap-4">
                      <div>
                        <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none mb-1">Reaction with Dilute Acid</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Test Metal + 2HCl → Metal Chloride + H₂ (g)</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {reactivityElements.filter(el => el.symbol !== 'C' && el.symbol !== 'H').map((el, i) => {
                          const elIdx = reactivityElements.findIndex(e => e.symbol === el.symbol);
                          return (
                            <button
                              key={el.symbol}
                              onClick={() => setSelectedReactivityAcid(elIdx)}
                              className={`w-10 h-10 rounded-xl text-xs font-black transition-all flex items-center justify-center
                                ${selectedReactivityAcid === elIdx ? 'bg-rose-500 text-white shadow-xl scale-110 ring-4 ring-rose-500/20' : 'bg-white text-gray-400 border-2 border-gray-100 hover:border-rose-300 hover:text-rose-500'}
                              `}
                            >
                              {el.symbol}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-[2rem] p-8 border-2 border-gray-100 shadow-inner overflow-hidden relative">
                       <div className="flex flex-col items-center justify-center space-y-8 h-full order-last lg:order-first">
                          <div className="flex flex-col items-center gap-2">
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reaction Equation</span>
                             <div className="flex items-center gap-3 font-mono text-lg font-black text-gray-800 bg-gray-50 px-6 py-3 rounded-2xl border-2 border-gray-100 shadow-sm">
                                <span>{reactivityElements[selectedReactivityAcid].symbol}(s)</span>
                                <span className="text-gray-300">+</span>
                                <span className="text-rose-600 bg-rose-50 px-2 rounded-lg">2HCl</span>
                                <span className="text-gray-300">→</span>
                                {selectedReactivityAcid < 9 ? (
                                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right duration-500">
                                    <span className="text-emerald-600">{reactivityElements[selectedReactivityAcid].symbol}Cl₂</span>
                                    <span className="text-gray-300">+</span>
                                    <span className="text-emerald-700 font-black underline decoration-emerald-200 decoration-4 underline-offset-4">H₂(g)</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-300 font-black italic tracking-widest px-4">No Reaction</span>
                                )}
                             </div>
                          </div>

                          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center gap-4 w-full">
                             <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white">
                                <FlaskConical size={20} />
                             </div>
                             <div>
                               <p className="text-[10px] font-black text-rose-600 uppercase mb-1">Observation</p>
                               <p className="text-[11px] font-bold text-gray-600 leading-tight">
                                 {selectedReactivityAcid < 9 
                                   ? `Vigorous effervescence. ${reactivityElements[selectedReactivityAcid].name} displaces Hydrogen from the acid.` 
                                   : `The metal remains unchanged. ${reactivityElements[selectedReactivityAcid].name} is less reactive than Hydrogen.`}
                               </p>
                             </div>
                          </div>
                       </div>

                       <div className="h-80 flex flex-col items-center justify-center relative bg-gray-50 rounded-[2rem] border-2 border-gray-200/50 shadow-inner">
                          {/* Giant Test Tube */}
                          <div className="relative w-24 h-56 border-x-8 border-b-8 border-gray-200 rounded-b-[3rem] overflow-hidden shadow-2xl bg-white/50">
                             <div className="absolute top-0 w-full h-8 border-b-2 border-gray-200 bg-white/20" />
                             
                             {/* Acid Level */}
                             <motion.div 
                               animate={{ y: [0, -3, 0] }}
                               transition={{ repeat: Infinity, duration: 4 }}
                               className="absolute bottom-0 w-full h-[70%] bg-rose-100/40" 
                             />

                             {selectedReactivityAcid < 9 ? (
                               <div className="relative h-full w-full">
                                  {/* Metal Sample */}
                                  <motion.div 
                                    animate={{ 
                                      scale: [1, 0.95, 1.05, 1],
                                      rotate: [0, 2, -2, 0]
                                    }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-6 bg-gray-400 rounded-lg shadow-xl z-20"
                                  />
                                  
                                  {/* Effervescence Bubbles */}
                                  {[...Array(15)].map((_, i) => {
                                    const intensity = (10 - selectedReactivityAcid) * 0.5;
                                    const delay = Math.random() * 2;
                                    const duration = 0.5 + Math.random() * 1.5;

                                    return (
                                      <motion.div 
                                        key={i}
                                        initial={{ y: 200, x: 40, opacity: 0 }}
                                        animate={{ 
                                          y: -20, 
                                          x: 20 + Math.random() * 40,
                                          opacity: [0, 1, 1, 0],
                                          scale: [0.5, 1.5]
                                        }}
                                        transition={{ 
                                          duration, 
                                          repeat: Infinity, 
                                          delay,
                                          ease: "easeOut"
                                        }}
                                        className="absolute bottom-8 w-2 h-2 rounded-full border border-rose-300 bg-white shadow-[0_0_8px_white]"
                                      />
                                    );
                                  })}
                               </div>
                             ) : (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-6 bg-gray-300 rounded border-2 border-gray-400 opacity-60" />
                             )}
                          </div>
                          <div className="absolute top-8 right-8 flex flex-col items-center">
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black ${selectedReactivityAcid < 9 ? 'bg-emerald-500 text-white shadow-emerald-500/50' : 'bg-gray-200 text-gray-500'} shadow-lg mb-2`}>
                                {selectedReactivityAcid < 9 ? 'YES' : 'NO'}
                             </div>
                             <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Reaction?</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                <FlaskConical size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Salt Preparation</h2>
            </div>

            <div className="flex flex-col items-center space-y-4">
              {/* Question 1 */}
              <div className={`w-full max-w-sm p-4 rounded-2xl border-2 transition-all text-center
                ${selectedSaltPrep ? 'opacity-40' : 'opacity-100'}
                ${selectedSaltPrep && (selectedSaltPrep === 'AgCl' || selectedSaltPrep === 'NaCl' || selectedSaltPrep === 'CuSO4') ? 'opacity-100 border-indigo-400 bg-indigo-50' : 'border-gray-100 bg-gray-50'}
              `}>
                <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">Question 1</p>
                <p className="font-bold text-gray-700">Is the salt soluble?</p>
              </div>

              <div className="flex w-full max-w-md justify-between px-4">
                {/* No Path */}
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-0.5 h-8 transition-all ${selectedSaltPrep === 'AgCl' ? 'bg-rose-500' : 'bg-gray-200'}`} />
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all
                    ${selectedSaltPrep === 'AgCl' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-400'}
                  `}>No</div>
                  <div className={`w-0.5 h-8 transition-all ${selectedSaltPrep === 'AgCl' ? 'bg-rose-500' : 'bg-gray-200'}`} />
                  <div className={`p-4 rounded-2xl border-2 transition-all text-center w-full
                    ${selectedSaltPrep === 'AgCl' ? 'border-rose-500 bg-rose-50 text-rose-700 scale-105 shadow-md' : 'border-gray-100 bg-gray-50 text-gray-400 opacity-40'}
                  `}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Method</p>
                    <p className="font-bold">Precipitation</p>
                  </div>
                </div>

                <div className="w-12" />

                {/* Yes Path */}
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-0.5 h-8 transition-all ${selectedSaltPrep === 'NaCl' || selectedSaltPrep === 'CuSO4' ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all
                    ${selectedSaltPrep === 'NaCl' || selectedSaltPrep === 'CuSO4' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}
                  `}>Yes</div>
                  <div className={`w-0.5 h-8 transition-all ${selectedSaltPrep === 'NaCl' || selectedSaltPrep === 'CuSO4' ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                  
                  {/* Question 2 */}
                  <div className={`p-4 rounded-2xl border-2 transition-all text-center w-full
                    ${selectedSaltPrep === 'NaCl' || selectedSaltPrep === 'CuSO4' ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-100 bg-gray-50 text-gray-400 opacity-40'}
                  `}>
                    <p className="text-xs font-black uppercase tracking-widest mb-1">Question 2</p>
                    <p className="font-bold">Contains K⁺, Na⁺, or NH₄⁺?</p>
                  </div>

                  <div className="flex w-full justify-between mt-4">
                    {/* Yes Path Q2 */}
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-0.5 h-8 transition-all ${selectedSaltPrep === 'NaCl' ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all
                        ${selectedSaltPrep === 'NaCl' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}
                      `}>Yes</div>
                      <div className={`w-0.5 h-8 transition-all ${selectedSaltPrep === 'NaCl' ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                      <div className={`p-4 rounded-2xl border-2 transition-all text-center w-full
                        ${selectedSaltPrep === 'NaCl' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 scale-105 shadow-md' : 'border-gray-100 bg-gray-50 text-gray-400 opacity-40'}
                      `}>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1">Method</p>
                        <p className="font-bold">Titration</p>
                      </div>
                    </div>

                    <div className="w-4" />

                    {/* No Path Q2 */}
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-0.5 h-8 transition-all ${selectedSaltPrep === 'CuSO4' ? 'bg-rose-500' : 'bg-gray-200'}`} />
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all
                        ${selectedSaltPrep === 'CuSO4' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-400'}
                      `}>No</div>
                      <div className={`w-0.5 h-8 transition-all ${selectedSaltPrep === 'CuSO4' ? 'bg-rose-500' : 'bg-gray-200'}`} />
                      <div className={`p-4 rounded-2xl border-2 transition-all text-center w-full
                        ${selectedSaltPrep === 'CuSO4' ? 'border-orange-500 bg-orange-50 text-orange-700 scale-105 shadow-md' : 'border-gray-100 bg-gray-50 text-gray-400 opacity-40'}
                      `}>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1">Method</p>
                        <p className="font-bold leading-tight">Limiting Acid + Excess Solid</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-center gap-4">
              {['NaCl', 'CuSO4', 'AgCl'].map(salt => (
                <button
                  key={salt}
                  onClick={() => setSelectedSaltPrep(selectedSaltPrep === salt ? null : salt)}
                  className={`px-6 py-3 rounded-2xl font-black transition-all active:scale-95 border-2
                    ${selectedSaltPrep === salt ? 'bg-indigo-500 text-white border-indigo-600 shadow-lg' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}
                  `}
                >
                  {salt === 'NaCl' && <span>NaCl</span>}
                  {salt === 'CuSO4' && <span>CuSO<sub>4</sub></span>}
                  {salt === 'AgCl' && <span>AgCl</span>}
                </button>
              ))}
            </div>
            <p className="text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-4">Click a salt to trace its preparation path</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-sky-100 p-3 rounded-2xl text-sky-600">
                <Beaker size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Lab Apparatus</h2>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {apparatusData.map((item) => (
                <motion.div
                  key={item.id}
                  onMouseEnter={() => setHoveredApparatus(item.id)}
                  onMouseLeave={() => setHoveredApparatus(null)}
                  className="bg-gray-50 border-2 border-gray-100 rounded-3xl p-4 flex flex-col items-center cursor-help transition-all hover:border-sky-200 hover:bg-sky-50 group"
                >
                  <div className="mb-4 transition-transform group-hover:scale-110">
                    {item.svg}
                  </div>
                  <p className="text-[10px] font-black text-gray-800 uppercase tracking-tight text-center">{item.name}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center gap-12 mb-12 p-6 bg-gray-50 rounded-[2rem] border-2 border-gray-100">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Accuracy</span>
                <AnimatePresence mode="wait">
                  {hoveredApparatus ? (
                    <motion.span 
                      key="acc-val"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={`text-sm font-black uppercase ${apparatusData.find(a => a.id === hoveredApparatus)?.accuracy === 'Accurate' ? 'text-emerald-500' : 'text-amber-500'}`}
                    >
                      {apparatusData.find(a => a.id === hoveredApparatus)?.accuracy}
                    </motion.span>
                  ) : (
                    <motion.span key="acc-placeholder" className="text-sm font-black text-gray-300 uppercase">---</motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Volume</span>
                <AnimatePresence mode="wait">
                  {hoveredApparatus ? (
                    <motion.span 
                      key="vol-val"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-sm font-black text-sky-500 uppercase"
                    >
                      {apparatusData.find(a => a.id === hoveredApparatus)?.volume}
                    </motion.span>
                  ) : (
                    <motion.span key="vol-placeholder" className="text-sm font-black text-gray-300 uppercase">---</motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="border-t-2 border-gray-100 pt-8">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Miscellaneous Apparatus</h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { name: 'Conical Flask', svg: (
                    <svg viewBox="0 0 40 40" className="w-8 h-8">
                      <path d="M 16 5 L 24 5 L 24 15 L 35 35 L 5 35 L 16 15 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )},
                  { name: 'Volumetric Flask', svg: (
                    <svg viewBox="0 0 40 40" className="w-8 h-8">
                      <path d="M 18 5 L 22 5 L 22 20 Q 35 25 35 35 L 5 35 Q 5 25 18 20 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="18" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  )},
                  { name: 'Gas Syringe', svg: (
                    <svg viewBox="0 0 40 40" className="w-10 h-8">
                      <rect x="5" y="15" width="25" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="20" y="17" width="18" height="6" fill="currentColor" opacity="0.3" />
                      <line x1="38" y1="15" x2="38" y2="25" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="2" y1="20" x2="5" y2="20" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )},
                  { name: 'Beaker', svg: (
                    <svg viewBox="0 0 40 40" className="w-8 h-8">
                      <path d="M 10 5 L 10 35 L 30 35 L 30 5 M 30 5 L 33 3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )},
                  { name: 'Test Tube', svg: (
                    <svg viewBox="0 0 40 40" className="w-8 h-8">
                      <path d="M 17 5 L 17 30 Q 17 35 20 35 Q 23 35 23 30 L 23 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )},
                  { name: 'Boiling Tube', svg: (
                    <svg viewBox="0 0 40 40" className="w-8 h-8">
                      <path d="M 15 5 L 15 30 Q 15 35 20 35 Q 25 35 25 30 L 25 5" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  )},
                  { name: 'Evaporating Dish', svg: (
                    <svg viewBox="0 0 40 40" className="w-10 h-8">
                      <path d="M 5 15 Q 20 35 35 15 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )},
                  { name: 'Filter Funnel', svg: (
                    <svg viewBox="0 0 40 40" className="w-8 h-8">
                      <path d="M 5 5 L 35 5 L 22 20 L 22 35 L 18 35 L 18 20 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )},
                ].map((misc, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="text-gray-400 group-hover:text-sky-500 transition-colors">
                      {misc.svg}
                    </div>
                    <span className="text-[7px] font-black text-gray-400 uppercase tracking-tighter text-center leading-none">{misc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                <Droplets size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Acids and Bases</h2>
            </div>

            <div className="space-y-10">
              {/* pH Scale */}
              <div className="relative pt-8 pb-4">
                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  <span>Strong Acid</span>
                  <span>Neutral</span>
                  <span>Strong Base</span>
                </div>
                <div className="h-12 w-full flex rounded-2xl overflow-hidden border-2 border-gray-100 p-1 bg-gray-50">
                  <div 
                    onMouseEnter={() => setHoveredPhRegion('acid')}
                    onMouseLeave={() => setHoveredPhRegion(null)}
                    className="flex-[6] h-full flex gap-1"
                  >
                    {[1, 2, 3, 4, 5, 6].map(ph => (
                      <div 
                        key={ph} 
                        className={`flex-1 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${ph <= 3 ? 'bg-rose-500 text-white shadow-[0_2px_0_0_#be123c]' : 'bg-rose-300 text-rose-800 shadow-[0_2px_0_0_#fb7185]'}`}
                      >
                        {ph}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 h-full px-1">
                    <div className="w-full h-full bg-emerald-400 rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-[0_2px_0_0_#047857]">7</div>
                  </div>
                  <div 
                    onMouseEnter={() => setHoveredPhRegion('base')}
                    onMouseLeave={() => setHoveredPhRegion(null)}
                    className="flex-[7] h-full flex gap-1"
                  >
                    {[8, 9, 10, 11, 12, 13, 14].map(ph => (
                      <div 
                        key={ph} 
                        className={`flex-1 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${ph >= 11 ? 'bg-indigo-600 text-white shadow-[0_2px_0_0_#3730a3]' : 'bg-indigo-400 text-indigo-900 shadow-[0_2px_0_0_#818cf8]'}`}
                      >
                        {ph}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between mt-2 px-2">
                  <div className="text-[9px] font-bold text-rose-500 uppercase">Red (Acidic)</div>
                  <div className="text-[9px] font-bold text-emerald-500 uppercase">Green</div>
                  <div className="text-[9px] font-bold text-indigo-500 uppercase">Blue (Basic)</div>
                </div>
              </div>

              {/* Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { 
                    name: 'Methyl Orange', 
                    acid: 'bg-rose-500', 
                    base: 'bg-amber-400', 
                    acidText: 'Red', 
                    baseText: 'Yellow' 
                  },
                  { 
                    name: 'Thymolphthalein', 
                    acid: 'bg-gray-100 border-2 border-dashed border-gray-300', 
                    base: 'bg-indigo-600', 
                    acidText: 'Colorless', 
                    baseText: 'Blue' 
                  },
                  { 
                    name: 'Litmus', 
                    acid: 'bg-rose-500', 
                    base: 'bg-indigo-600', 
                    acidText: 'Red', 
                    baseText: 'Blue' 
                  },
                  { 
                    name: 'Universal Indicator', 
                    acid: 'bg-gradient-to-r from-rose-600 via-orange-500 to-yellow-400', 
                    base: 'bg-gradient-to-r from-blue-400 via-indigo-600 to-purple-800', 
                    acidText: 'Warmer', 
                    baseText: 'Cooler' 
                  }
                ].map((indicator) => (
                  <div key={indicator.name} className="bg-gray-50 border-2 border-gray-100 rounded-3xl p-5 flex flex-col gap-4">
                    <h4 className="text-[10px] font-black text-gray-800 uppercase tracking-widest">{indicator.name}</h4>
                    <div className="flex gap-2 h-8">
                      <div className={`flex-1 rounded-xl transition-all duration-500 ${hoveredPhRegion === 'acid' ? indicator.acid : 'bg-gray-200 grayscale opacity-30'}`}>
                        {hoveredPhRegion === 'acid' && (
                          <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-white uppercase tracking-tighter">
                            {indicator.acidText}
                          </div>
                        )}
                      </div>
                      <div className={`flex-1 rounded-xl transition-all duration-500 ${hoveredPhRegion === 'base' ? indicator.base : 'bg-gray-200 grayscale opacity-30'}`}>
                        {hoveredPhRegion === 'base' && (
                          <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-white uppercase tracking-tighter">
                            {indicator.baseText}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Definitions */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-gray-100">
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Acids</span>
                    <span className="text-xs font-bold text-rose-600">H⁺ Donor</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Bases</span>
                    <span className="text-xs font-bold text-indigo-600">H⁺ Acceptor</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Strong</span>
                    <span className="text-xs font-bold text-gray-800">Complete Dissociation</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Weak</span>
                    <span className="text-xs font-bold text-gray-800">Partial Dissociation</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-rose-100 p-3 rounded-2xl text-rose-600">
                  <Flame size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Strength of Acids</h2>
              </div>
              <button 
                onClick={() => {
                  setAcidStrengthActive(!acidStrengthActive);
                  if (acidStrengthActive) {
                    setMgActiveStrong(false);
                    setMgActiveWeak(false);
                  }
                }}
                className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2
                  ${acidStrengthActive ? 'bg-rose-500 text-white shadow-[0_4px_0_0_#be123c]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                `}
              >
                {acidStrengthActive ? <RefreshCw size={14} /> : <Zap size={14} />}
                {acidStrengthActive ? 'Reset' : 'Dissociate'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Strong Acid (HCl) */}
              <div className="bg-gray-50 rounded-[2rem] p-6 border-2 border-gray-100 flex flex-col items-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Strong Acid (HCl)</p>
                
                <div className="relative w-full h-48 border-x-2 border-b-2 border-gray-300 rounded-b-2xl bg-sky-50/30 mb-6 overflow-hidden">
                  {/* Water level */}
                  <div className="absolute bottom-0 w-full h-32 bg-sky-100/40 border-t-2 border-sky-200" />
                  
                  {/* Bubbles for Mg reaction */}
                  {mgActiveStrong && [...Array(15)].map((_, i) => (
                    <Bubble key={`bubble-strong-${i}`} i={i} rate={2} />
                  ))}

                  {/* Mg Ribbon */}
                  {mgActiveStrong && (
                    <motion.div 
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 120, opacity: 1 }}
                      className="absolute left-1/2 -translate-x-1/2 w-8 h-2 bg-gray-400 rounded-sm shadow-sm z-10 border border-gray-500"
                    />
                  )}
                  
                  {/* Molecules */}
                  {[...Array(5)].map((_, i) => (
                    <AcidMolecule key={`hcl-${i}`} i={i} active={acidStrengthActive} type="strong" />
                  ))}
                </div>

                <div className="w-full space-y-6">
                  <div className="text-center">
                    <p className="text-lg font-black text-gray-800">
                      HCl → <span className="text-rose-500">H<sup>+</sup></span> + Cl<sup>-</sup>
                    </p>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Complete Dissociation</p>
                  </div>

                  {/* Species Distribution Chart */}
                  <div className="bg-white/50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">Species in Solution</p>
                    <div className="flex gap-4 h-16 items-end justify-center">
                      <div className="flex flex-col items-center gap-1">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: acidStrengthActive ? 0 : 40 }}
                          className="w-6 bg-gray-200 rounded-t-lg"
                        />
                        <span className="text-[7px] font-bold text-gray-400">HCl</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: acidStrengthActive ? 40 : 0 }}
                          className="w-6 bg-rose-400 rounded-t-lg"
                        />
                        <span className="text-[7px] font-bold text-rose-400">H⁺ + Cl⁻</span>
                      </div>
                    </div>
                  </div>

                  {/* Properties Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">Physical</p>
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-gray-500 uppercase">pH</span>
                          <span className="text-[10px] font-black text-rose-600">Lower (1-2)</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-gray-500 uppercase">Conductivity</span>
                          <span className="text-[10px] font-black text-emerald-600">Higher</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">Chemical</p>
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-gray-500 uppercase">Reactivity (Mg)</span>
                          <span className="text-[10px] font-black text-rose-600">Higher Rate</span>
                        </div>
                        <button 
                          disabled={!acidStrengthActive}
                          onClick={() => setMgActiveStrong(!mgActiveStrong)}
                          className={`mt-1 px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all
                            ${!acidStrengthActive ? 'bg-gray-100 text-gray-300' : 
                              mgActiveStrong ? 'bg-rose-500 text-white' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}
                          `}
                        >
                          {mgActiveStrong ? 'Remove Mg' : 'Add Mg'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weak Acid (CH3COOH) */}
              <div className="bg-gray-50 rounded-[2rem] p-6 border-2 border-gray-100 flex flex-col items-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Weak Acid (CH₃COOH)</p>
                
                <div className="relative w-full h-48 border-x-2 border-b-2 border-gray-300 rounded-b-2xl bg-sky-50/30 mb-6 overflow-hidden">
                  {/* Water level */}
                  <div className="absolute bottom-0 w-full h-32 bg-sky-100/40 border-t-2 border-sky-200" />
                  
                  {/* Bubbles for Mg reaction */}
                  {mgActiveWeak && [...Array(5)].map((_, i) => (
                    <Bubble key={`bubble-weak-${i}`} i={i} rate={0.5} />
                  ))}

                  {/* Mg Ribbon */}
                  {mgActiveWeak && (
                    <motion.div 
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 120, opacity: 1 }}
                      className="absolute left-1/2 -translate-x-1/2 w-8 h-2 bg-gray-400 rounded-sm shadow-sm z-10 border border-gray-500"
                    />
                  )}
                  
                  {/* Molecules */}
                  {[...Array(5)].map((_, i) => (
                    <AcidMolecule key={`ch3cooh-${i}`} i={i} active={acidStrengthActive} type="weak" />
                  ))}
                </div>

                <div className="w-full space-y-6">
                  <div className="text-center">
                    <p className="text-lg font-black text-gray-800">
                      CH<sub>3</sub>COOH ⇌ CH<sub>3</sub>COO<sup>-</sup> + <span className="text-rose-500">H<sup>+</sup></span>
                    </p>
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-1">Partial Dissociation</p>
                  </div>

                  {/* Species Distribution Chart */}
                  <div className="bg-white/50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">Species in Solution</p>
                    <div className="flex gap-4 h-16 items-end justify-center">
                      <div className="flex flex-col items-center gap-1">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: acidStrengthActive ? 32 : 40 }}
                          className="w-6 bg-gray-200 rounded-t-lg"
                        />
                        <span className="text-[7px] font-bold text-gray-400">HA</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: acidStrengthActive ? 8 : 0 }}
                          className="w-6 bg-rose-400 rounded-t-lg"
                        />
                        <span className="text-[7px] font-bold text-rose-400">H⁺ + A⁻</span>
                      </div>
                    </div>
                  </div>

                  {/* Properties Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">Physical</p>
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-gray-500 uppercase">pH</span>
                          <span className="text-[10px] font-black text-amber-600">Higher (3-5)</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-gray-500 uppercase">Conductivity</span>
                          <span className="text-[10px] font-black text-amber-600">Lower</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">Chemical</p>
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-gray-500 uppercase">Reactivity (Mg)</span>
                          <span className="text-[10px] font-black text-amber-600">Lower Rate</span>
                        </div>
                        <button 
                          disabled={!acidStrengthActive}
                          onClick={() => setMgActiveWeak(!mgActiveWeak)}
                          className={`mt-1 px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all
                            ${!acidStrengthActive ? 'bg-gray-100 text-gray-300' : 
                              mgActiveWeak ? 'bg-rose-500 text-white' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}
                          `}
                        >
                          {mgActiveWeak ? 'Remove Mg' : 'Add Mg'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>



          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.49 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                  <Layers size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Bonding & Structure</h2>
              </div>
              <div className="flex gap-2">
                {[
                  { id: 'Na', label: 'Na' },
                  { id: 'He', label: 'He' },
                  { id: 'NaCl', label: 'NaCl' },
                  { id: 'Diamond', label: 'Diamond' },
                  { id: 'H2O', label: 'H₂O' }
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedBondingSubstance(selectedBondingSubstance === sub.id ? null : sub.id)}
                    className={`px-4 py-2 rounded-xl font-black text-[10px] tracking-widest transition-all active:scale-95
                      ${selectedBondingSubstance === sub.id 
                        ? 'bg-indigo-500 text-white shadow-[0_4px_0_0_#4338ca]' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                    `}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* Simple Substances */}
              <div className={`p-6 rounded-[2rem] border-2 transition-all duration-500 ${
                ['He', 'H2O'].includes(selectedBondingSubstance || '') 
                ? 'bg-sky-50 border-sky-200 shadow-lg scale-[1.01]' 
                : 'bg-gray-50 border-gray-100 opacity-60'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Simple Substances</h3>
                    <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">Low M.P. & B.P.</p>
                  </div>
                </div>
                
                <SimpleSubstanceDrawing />

                <div className="grid grid-cols-2 gap-6 mt-6">
                  {/* Simple Atoms */}
                  <div className={`p-6 rounded-2xl border-2 transition-all ${
                    selectedBondingSubstance === 'He' 
                    ? 'bg-white border-sky-400 shadow-md' 
                    : 'bg-gray-100/50 border-transparent'
                  }`}>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Simple Atoms</p>
                    <SimpleAtomDrawing />
                    <div className="mt-4 space-y-1">
                      <p className="text-[9px] font-black text-gray-800 uppercase">Gas (Low M.P.)</p>
                      <p className="text-[9px] font-black text-rose-500 uppercase">Insulator in all states</p>
                    </div>
                  </div>

                  {/* Simple Molecules */}
                  <div className={`p-6 rounded-2xl border-2 transition-all ${
                    selectedBondingSubstance === 'H2O' 
                    ? 'bg-white border-sky-400 shadow-md' 
                    : 'bg-gray-100/50 border-transparent'
                  }`}>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Simple Molecules</p>
                    <SimpleMoleculeDrawing />
                    <div className="mt-4 space-y-1">
                      <p className="text-[9px] font-black text-gray-800 uppercase">Mostly Gas/Liquid</p>
                      <p className="text-[9px] font-black text-rose-500 uppercase">Insulator in all states</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Giant Substances */}
              <div className={`p-6 rounded-[2rem] border-2 transition-all duration-500 ${
                ['Na', 'NaCl', 'Diamond'].includes(selectedBondingSubstance || '') 
                ? 'bg-rose-50 border-rose-200 shadow-lg scale-[1.01]' 
                : 'bg-gray-50 border-gray-100 opacity-60'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Giant Substances</h3>
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">High M.P. & B.P.</p>
                  </div>
                </div>

                <GiantSubstanceDrawing />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  {/* Giant Ionic */}
                  <div className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedBondingSubstance === 'NaCl' 
                    ? 'bg-white border-rose-400 shadow-md' 
                    : 'bg-gray-100/50 border-transparent'
                  }`}>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3">Giant Ionic</p>
                    <GiantIonicDrawing />
                    <div className="mt-3 space-y-1">
                      <p className="text-[8px] font-black text-gray-800 uppercase">Solid (Brittle)</p>
                      <p className="text-[8px] font-black text-amber-600 uppercase">Cond. (Molten/Aq)</p>
                    </div>
                  </div>

                  {/* Giant Metallic */}
                  <div className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedBondingSubstance === 'Na' 
                    ? 'bg-white border-rose-400 shadow-md' 
                    : 'bg-gray-100/50 border-transparent'
                  }`}>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3">Giant Metallic</p>
                    <GiantMetallicDrawing />
                    <div className="mt-3 space-y-1">
                      <p className="text-[8px] font-black text-gray-800 uppercase">Malleable/Ductile</p>
                      <p className="text-[8px] font-black text-emerald-600 uppercase">Conductor (All)</p>
                    </div>
                  </div>

                  {/* Giant Covalent */}
                  <div className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedBondingSubstance === 'Diamond' 
                    ? 'bg-white border-rose-400 shadow-md' 
                    : 'bg-gray-100/50 border-transparent'
                  }`}>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3">Giant Covalent</p>
                    <GiantCovalentDrawing />
                    <div className="mt-3 space-y-1">
                      <p className="text-[8px] font-black text-gray-800 uppercase">Hard (Diamond)</p>
                      <p className="text-[8px] font-black text-rose-500 uppercase">Insulator (D)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>



          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                  <Zap size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Electrolytes</h2>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => { setElectrolyteState('solid'); setSelectedElectrolyte(null); }}
                  className={`p-4 rounded-3xl border-2 transition-all text-left group
                    ${electrolyteState === 'solid' ? 'bg-gray-800 border-gray-900 shadow-[0_8px_0_0_#000000]' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}
                  `}
                >
                  <p className={`text-sm font-black uppercase tracking-tight mb-1 ${electrolyteState === 'solid' ? 'text-white' : 'text-gray-800'}`}>Solid</p>
                  <p className={`text-[10px] font-bold leading-tight ${electrolyteState === 'solid' ? 'text-gray-400' : 'text-gray-500'}`}>Ions in fixed lattice. No movement.</p>
                </button>
                <button
                  onClick={() => { setElectrolyteState('molten'); setSelectedElectrolyte(null); }}
                  className={`p-4 rounded-3xl border-2 transition-all text-left group
                    ${electrolyteState === 'molten' ? 'bg-orange-500 border-orange-600 shadow-[0_8px_0_0_#c2410c]' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}
                  `}
                >
                  <p className={`text-sm font-black uppercase tracking-tight mb-1 ${electrolyteState === 'molten' ? 'text-white' : 'text-gray-800'}`}>Molten</p>
                  <p className={`text-[10px] font-bold leading-tight ${electrolyteState === 'molten' ? 'text-orange-100' : 'text-gray-500'}`}>Melted by heat. Ions are free to move.</p>
                </button>
                <button
                  onClick={() => { setElectrolyteState('aqueous'); setSelectedElectrolyte(null); }}
                  className={`p-4 rounded-3xl border-2 transition-all text-left group
                    ${electrolyteState === 'aqueous' ? 'bg-blue-500 border-blue-600 shadow-[0_8px_0_0_#1d4ed8]' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}
                  `}
                >
                  <p className={`text-sm font-black uppercase tracking-tight mb-1 ${electrolyteState === 'aqueous' ? 'text-white' : 'text-gray-800'}`}>Aqueous</p>
                  <p className={`text-[10px] font-bold leading-tight ${electrolyteState === 'aqueous' ? 'text-blue-100' : 'text-gray-500'}`}>Dissolved in water. Ions are mobile.</p>
                </button>
              </div>

              <ElectrolyteDrawing state={electrolyteState} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border-2 transition-all ${electrolyteState === 'solid' ? 'bg-rose-50 border-rose-200' : 'bg-gray-50 border-gray-100 opacity-40'}`}>
                  <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Solid State</p>
                  <p className="text-xs font-bold text-gray-700">Ions are in fixed positions. They cannot move.</p>
                  <p className="text-[10px] font-black text-rose-500 uppercase mt-2">Insulator</p>
                </div>
                <div className={`p-4 rounded-2xl border-2 transition-all ${electrolyteState !== 'solid' ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100 opacity-40'}`}>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{electrolyteState === 'molten' ? 'Molten' : 'Aqueous'} State</p>
                  <p className="text-xs font-bold text-gray-700">Ions are mobile and free to move to electrodes.</p>
                  <p className="text-[10px] font-black text-emerald-500 uppercase mt-2">Conductor</p>
                </div>
              </div>

              {electrolyteState !== 'solid' && (
                <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Ions Present</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-xs font-bold text-gray-700">M⁺ (Cation)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-xs font-bold text-gray-700">X⁻ (Anion)</span>
                    </div>
                    {electrolyteState === 'aqueous' && (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full" />
                          <span className="text-xs font-bold text-gray-700">H⁺ (from water)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <span className="text-xs font-bold text-gray-700">OH⁻ (from water)</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {electrolyteState !== 'solid' && (
                <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Select Electrolyte</p>
                  <div className="flex flex-wrap gap-2">
                    {electrolyteState === 'molten' ? (
                      [
                        { id: 'Al2O3', label: <span>Al<sub>2</sub>O<sub>3</sub></span> },
                        { id: 'NaCl', label: 'NaCl' },
                        { id: 'PbBr2', label: <span>PbBr<sub>2</sub></span> }
                      ].map(e => (
                        <button
                          key={e.id}
                          onClick={() => setSelectedElectrolyte(e.id)}
                          className={`px-3 py-1.5 rounded-xl font-black text-[10px] uppercase transition-all border-2
                            ${selectedElectrolyte === e.id ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-white text-gray-600 border-gray-100 hover:border-orange-200'}
                          `}
                        >
                          {e.label}
                        </button>
                      ))
                    ) : (
                      [
                        { id: 'conc NaCl', label: 'Conc. NaCl' },
                        { id: 'dilute NaCl', label: 'Dilute NaCl' },
                        { id: 'dilute H2SO4', label: <span>Dilute H<sub>2</sub>SO<sub>4</sub></span> },
                        { id: 'dilute CuSO4', label: <span>Dilute CuSO<sub>4</sub></span> }
                      ].map(e => (
                        <button
                          key={e.id}
                          onClick={() => setSelectedElectrolyte(e.id)}
                          className={`px-3 py-1.5 rounded-xl font-black text-[10px] uppercase transition-all border-2
                            ${selectedElectrolyte === e.id ? 'bg-blue-500 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-100 hover:border-blue-200'}
                          `}
                        >
                          {e.label}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {electrolyteState !== 'solid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`bg-white p-5 rounded-3xl border-2 transition-all shadow-sm ${selectedElectrolyte ? 'border-blue-200 ring-2 ring-blue-100' : 'border-gray-100'}`}>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">At Cathode (-)</p>
                    {electrolyteState === 'molten' ? (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-700">
                          {selectedElectrolyte === 'Al2O3' ? <span>Al<sup>3+</sup> + 3e<sup>-</sup> → Al</span> :
                           selectedElectrolyte === 'NaCl' ? <span>Na<sup>+</sup> + e<sup>-</sup> → Na</span> :
                           selectedElectrolyte === 'PbBr2' ? <span>Pb<sup>2+</sup> + 2e<sup>-</sup> → Pb</span> :
                           <span>M<sup>n+</sup> + ne<sup>-</sup> → M</span>}
                        </p>
                        <p className="text-[9px] font-medium text-gray-400 italic">Reduction of metal cation</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className={`p-3 rounded-2xl border transition-all ${selectedElectrolyte && ['conc NaCl', 'dilute NaCl', 'dilute H2SO4'].includes(selectedElectrolyte) ? 'bg-blue-100 border-blue-300 shadow-inner' : 'bg-blue-50 border-blue-100'} ${selectedElectrolyte === 'dilute CuSO4' ? 'opacity-50' : ''}`}>
                          <p className="text-[9px] font-black text-blue-500 uppercase mb-1">If M &gt; H (Reactive)</p>
                          <p className="text-xs font-bold text-gray-700">2H<sup>+</sup> + 2e<sup>-</sup> → H<sub>2</sub></p>
                        </div>
                        <div className={`p-3 rounded-2xl border transition-all ${selectedElectrolyte === 'dilute CuSO4' ? 'bg-blue-100 border-blue-300 shadow-inner' : 'bg-gray-50 border-gray-100'} ${selectedElectrolyte && selectedElectrolyte !== 'dilute CuSO4' ? 'opacity-50' : ''}`}>
                          <p className="text-[9px] font-black text-gray-400 uppercase mb-1">If M &lt; H (Unreactive)</p>
                          <p className="text-xs font-bold text-gray-700">
                            {selectedElectrolyte === 'dilute CuSO4' ? <span>Cu<sup>2+</sup> + 2e<sup>-</sup> → Cu</span> : <span>M<sup>n+</sup> + ne<sup>-</sup> → M</span>}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={`bg-white p-5 rounded-3xl border-2 transition-all shadow-sm ${selectedElectrolyte ? 'border-red-200 ring-2 ring-red-100' : 'border-gray-100'}`}>
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-3">At Anode (+)</p>
                    {electrolyteState === 'molten' ? (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-700">
                          {selectedElectrolyte === 'Al2O3' ? <span>2O<sup>2-</sup> → O<sub>2</sub> + 4e<sup>-</sup></span> :
                           selectedElectrolyte === 'NaCl' ? <span>2Cl<sup>-</sup> → Cl<sub>2</sub> + 2e<sup>-</sup></span> :
                           selectedElectrolyte === 'PbBr2' ? <span>2Br<sup>-</sup> → Br<sub>2</sub> + 2e<sup>-</sup></span> :
                           <span>2X<sup>n-</sup> → X<sub>2</sub> + 2ne<sup>-</sup></span>}
                        </p>
                        <p className="text-[9px] font-medium text-gray-400 italic">Oxidation of non-metal anion</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className={`p-3 rounded-2xl border transition-all ${selectedElectrolyte === 'conc NaCl' ? 'bg-red-100 border-red-300 shadow-inner' : 'bg-red-50 border-red-100'} ${selectedElectrolyte && selectedElectrolyte !== 'conc NaCl' ? 'opacity-50' : ''}`}>
                          <p className="text-[9px] font-black text-red-500 uppercase mb-1">If X⁻ concentrated</p>
                          <p className="text-xs font-bold text-gray-700">
                            {selectedElectrolyte === 'conc NaCl' ? <span>2Cl<sup>-</sup> → Cl<sub>2</sub> + 2e<sup>-</sup></span> : <span>2X<sup>n-</sup> → X<sub>2</sub> + 2ne<sup>-</sup></span>}
                          </p>
                        </div>
                        <div className={`p-3 rounded-2xl border transition-all ${['dilute NaCl', 'dilute H2SO4', 'dilute CuSO4'].includes(selectedElectrolyte || '') ? 'bg-red-100 border-red-300 shadow-inner' : 'bg-gray-50 border-gray-100'} ${selectedElectrolyte === 'conc NaCl' ? 'opacity-50' : ''}`}>
                          <p className="text-[9px] font-black text-gray-400 uppercase mb-1">If X⁻ diluted / absent</p>
                          <p className="text-xs font-bold text-gray-700">4OH<sup>-</sup> → O<sub>2</sub> + 2H<sub>2</sub>O + 4e<sup>-</sup></p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {electrolyteState !== 'solid' && selectedElectrolyte && (
                <div className="mt-8">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Electrolysis Simulator</p>
                  <ElectrolysisSimulator electrolyte={selectedElectrolyte} state={electrolyteState} />
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                  <Factory size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Fractional Distillation</h2>
              </div>
            </div>

            <FractionalDistillation />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                  <ArrowRightLeft size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Addition VS Substitution</h2>
              </div>
            </div>

            <AdditionVsSubstitution />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-2xl text-purple-600">
                  <FlaskConical size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Titration Curve</h2>
              </div>
            </div>

            <TitrationCurve />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-rose-100 p-3 rounded-2xl text-rose-600">
                  <Atom size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Ionic Equation</h2>
              </div>
              <button 
                onClick={() => {
                  setIonicExampleIndex((prev) => (prev + 1) % 2);
                  setIonicStep(0);
                }}
                className="text-xs font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={14} />
                Switch Example
              </button>
            </div>

            <div className="bg-gray-50 rounded-[2rem] p-8 border-2 border-gray-100 relative overflow-hidden min-h-[350px] flex flex-col items-center justify-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 absolute top-6">
                {ionicStep === 0 ? "Molecular Equation" : ionicStep === 1 ? "Complete Ionic Equation" : "Net Ionic Equation"}
              </p>

              <div className="flex flex-col items-center gap-6 w-full">
                {/* Line 1: Reactants */}
                <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2 text-xl font-black">
                  {ionicStep === 0 ? (
                    <AnimatePresence mode="wait">
                      <motion.div key="r0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        {ionicExampleIndex === 0 ? (
                          <>
                            <span className="text-blue-500">AgNO<sub>3</sub>(aq)</span>
                            <span className="text-gray-300">+</span>
                            <span className="text-blue-500">KCl(aq)</span>
                          </>
                        ) : (
                          <>
                            <span className="text-blue-500">Ba(NO<sub>3</sub>)<sub>2</sub>(aq)</span>
                            <span className="text-gray-300">+</span>
                            <span className="text-blue-500">K<sub>2</sub>SO<sub>4</sub>(aq)</span>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div key="r1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2">
                        {ionicExampleIndex === 0 ? (
                          <>
                            <span className="text-blue-500">Ag<sup>+</sup></span>
                            <span className="text-gray-300">+</span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-blue-500 overflow-hidden whitespace-nowrap">NO<sub>3</sub><sup>-</sup></motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-gray-300 overflow-hidden whitespace-nowrap">+</motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-blue-500 overflow-hidden whitespace-nowrap">K<sup>+</sup></motion.span>
                            <span className="text-gray-300">+</span>
                            <span className="text-blue-500">Cl<sup>-</sup></span>
                          </>
                        ) : (
                          <>
                            <span className="text-blue-500">Ba<sup>2+</sup></span>
                            <span className="text-gray-300">+</span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-blue-500 overflow-hidden whitespace-nowrap">2NO<sub>3</sub><sup>-</sup></motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-gray-300 overflow-hidden whitespace-nowrap">+</motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-blue-500 overflow-hidden whitespace-nowrap">2K<sup>+</sup></motion.span>
                            <span className="text-gray-300">+</span>
                            <span className="text-blue-500">SO<sub>4</sub><sup>2-</sup></span>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>

                {/* Line 2: Arrow */}
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-orange-400 text-4xl"
                >
                  ↓
                </motion.div>

                {/* Line 3: Products */}
                <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2 text-xl font-black">
                  {ionicStep === 0 ? (
                    <AnimatePresence mode="wait">
                      <motion.div key="p0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        {ionicExampleIndex === 0 ? (
                          <>
                            <span className="text-rose-500">AgCl(s)</span>
                            <span className="text-gray-300">+</span>
                            <span className="text-blue-500">KNO<sub>3</sub>(aq)</span>
                          </>
                        ) : (
                          <>
                            <span className="text-rose-500">BaSO<sub>4</sub>(s)</span>
                            <span className="text-gray-300">+</span>
                            <span className="text-blue-500">2KNO<sub>3</sub>(aq)</span>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div key="p1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2">
                        {ionicExampleIndex === 0 ? (
                          <>
                            <span className="text-rose-500">AgCl(s)</span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-gray-300 overflow-hidden whitespace-nowrap">+</motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-blue-500 overflow-hidden whitespace-nowrap">K<sup>+</sup></motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-gray-300 overflow-hidden whitespace-nowrap">+</motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-blue-500 overflow-hidden whitespace-nowrap">NO<sub>3</sub><sup>-</sup></motion.span>
                          </>
                        ) : (
                          <>
                            <span className="text-rose-500">BaSO<sub>4</sub>(s)</span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-gray-300 overflow-hidden whitespace-nowrap">+</motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-blue-500 overflow-hidden whitespace-nowrap">2K<sup>+</sup></motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-gray-300 overflow-hidden whitespace-nowrap">+</motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-blue-500 overflow-hidden whitespace-nowrap">2NO<sub>3</sub><sup>-</sup></motion.span>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>

              {ionicStep === 1 && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-xs font-bold text-rose-500 uppercase tracking-widest text-center"
                >
                  Notice: {ionicExampleIndex === 0 ? "AgCl(s)" : "BaSO₄(s)"} is NOT split because it is insoluble!
                </motion.p>
              )}
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-2xl border-2 border-blue-100 text-blue-700 font-bold text-sm">
                <div className="shrink-0"><Info size={18} /></div>
                {ionicStep === 0 && "Step 1: Write the full molecular equation."}
                {ionicStep === 1 && "Step 2: Split soluble (aq) compounds into ions."}
                {ionicStep === 2 && "Step 3: Remove spectator ions to get the net equation."}
              </div>

              <div className="flex gap-4">
                {ionicStep < 2 ? (
                  <button
                    onClick={() => setIonicStep(ionicStep + 1)}
                    className="bg-rose-500 text-white font-black px-8 py-4 rounded-2xl shadow-[0_4px_0_0_#be123c] active:shadow-none active:translate-y-1 transition-all uppercase tracking-widest text-sm"
                  >
                    {ionicStep === 0 ? "Split into Ions" : "Remove Spectators"}
                  </button>
                ) : (
                  <button
                    onClick={() => setIonicStep(0)}
                    className="bg-gray-800 text-white font-black px-8 py-4 rounded-2xl shadow-[0_4px_0_0_#111827] active:shadow-none active:translate-y-1 transition-all uppercase tracking-widest text-sm flex items-center gap-2"
                  >
                    <RefreshCw size={18} />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                <Calculator size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Mole Calculation</h2>
            </div>

            <div className="space-y-6">
              {[
                { 
                  id: 1, 
                  eq: "n = m / Mᵣ", 
                  info: "m = mass (g) and Mᵣ = Molar mass (g/mol)",
                  desc: "Calculating moles from mass"
                },
                { 
                  id: 2, 
                  eq: "n = C × V", 
                  info: "C = concentration (mol/dm³) and V = volume (dm³)",
                  desc: "Calculating moles from concentration"
                },
                { 
                  id: 3, 
                  eq: "n = V of gas / 24", 
                  info: "V = volume of gas (dm³)",
                  desc: "Calculating moles from gas volume"
                }
              ].map((item) => (
                <motion.div
                  key={item.id}
                  onMouseEnter={() => setHoveredMoleEq(item.id)}
                  onMouseLeave={() => setHoveredMoleEq(null)}
                  className="relative bg-gray-50 border-2 border-gray-100 rounded-3xl p-6 cursor-help transition-all hover:border-orange-200 hover:bg-orange-50 group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-orange-400">{item.desc}</p>
                      <h3 className="text-2xl font-black text-gray-800 group-hover:text-orange-600">
                        {item.eq.split(' ').map((part, i) => (
                          <span key={i} className={part === '/' || part === '×' ? 'text-orange-400 mx-2' : ''}>
                            {part === 'Mᵣ' ? <span>M<sub>r</sub></span> : part}
                          </span>
                        ))}
                      </h3>
                    </div>
                    <div className="bg-white p-2 rounded-xl shadow-sm text-gray-400 group-hover:text-orange-500">
                      <Info size={20} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {hoveredMoleEq === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t-2 border-orange-100 overflow-hidden"
                      >
                        <p className="text-sm font-bold text-orange-600 leading-relaxed">
                          {item.info}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                  <Activity size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Equilibrium Processes</h2>
              </div>
            </div>

            <EquilibriumProcesses />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                  <Layers size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Homologous Series</h2>
              </div>
            </div>

            <HomologousSeries />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                  <Beaker size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Common Chemicals</h2>
              </div>
            </div>

            <CommonChemicals />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
                <LayoutGrid size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Transition vs Main Group Metals</h2>
            </div>

            <div className="space-y-8">
              {/* Periodic Table Section */}
              <div className="bg-gray-50 rounded-[2rem] p-6 border-2 border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Interactive Periodic Table</p>
                
                <div 
                  className="grid gap-1 max-w-3xl mx-auto overflow-x-auto no-scrollbar pb-4"
                  style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
                >
                  {/* Simplified Periodic Table Grid */}
                  {Array.from({ length: 7 * 18 }).map((_, i) => {
                    const row = Math.floor(i / 18) + 1;
                    const col = (i % 18) + 1;
                    
                    // Define which cells are metals
                    const isMainGroup = (
                      (col === 1 && row >= 2) || // Group 1 (Li-Fr)
                      (col === 2 && row >= 2) || // Group 2 (Be-Ra)
                      (col === 13 && row >= 3) || // Al, Ga, In, Tl
                      (col === 14 && row >= 5) || // Sn, Pb
                      (col === 15 && row >= 6) || // Bi
                      (col === 16 && row >= 6)    // Po
                    );
                    
                    const isTransition = (col >= 3 && col <= 12 && row >= 4 && row <= 6);
                    
                    if (isMainGroup || isTransition) {
                      return (
                        <motion.div
                          key={i}
                          onMouseEnter={() => setHoveredMetalType(isTransition ? 'transition' : 'main-group')}
                          onMouseLeave={() => setHoveredMetalType(null)}
                          whileHover={{ scale: 1.2, zIndex: 10 }}
                          className={`aspect-square rounded-sm border transition-all cursor-help
                            ${isTransition ? 'bg-emerald-500 border-emerald-600' : 'bg-orange-500 border-orange-600'}
                            ${hoveredMetalType && (isTransition ? hoveredMetalType !== 'transition' : hoveredMetalType !== 'main-group') ? 'opacity-20 grayscale' : 'opacity-100'}
                          `}
                        />
                      );
                    }
                    
                    // Non-metals or empty space
                    const isNonMetal = (
                      (col === 1 && row === 1) || // H
                      (col === 18) || // Noble gases
                      (col >= 13 && row <= 5) // B, C, N, O, F, etc.
                    );
                    
                    return (
                      <div 
                        key={i} 
                        className={`aspect-square rounded-sm ${isNonMetal ? 'bg-gray-200/50' : ''}`} 
                      />
                    );
                  })}
                </div>

                <div className="flex justify-center gap-8 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-sm" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Main Group Metals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded-sm" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Transition Metals</span>
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                  <div className="grid grid-cols-3 bg-gray-50 border-b-2 border-gray-100 p-4">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Property</div>
                    <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest text-center">Main Group</div>
                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest text-center">Transition</div>
                  </div>
                  
                  {[
                    { prop: "M.p. / B.p.", main: "Lower", trans: "Higher", type: "Physical" },
                    { prop: "Density", main: "Lower", trans: "Higher", type: "Physical" },
                    { prop: "Hardness", main: "Lower", trans: "Higher", type: "Physical" },
                    { prop: "Ion Color", main: "Colorless", trans: "Colored", type: "Physical" },
                    { prop: "Compound Color", main: "White", trans: "Colored", type: "Physical" },
                    { prop: "Catalysis", main: "No", trans: "Yes", type: "Chemical" },
                    { prop: "Oxidation States", main: "Fixed", trans: "Variable", type: "Chemical" }
                  ].map((row, idx) => (
                    <motion.div 
                      key={row.prop}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + idx * 0.05 }}
                      className={`grid grid-cols-3 p-4 items-center border-b border-gray-50 last:border-0 transition-colors
                        ${hoveredMetalType === 'main-group' ? 'bg-orange-50/30' : hoveredMetalType === 'transition' ? 'bg-emerald-50/30' : ''}
                      `}
                    >
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-tighter mb-0.5">{row.type}</span>
                        <span className="text-xs font-bold text-gray-700">{row.prop}</span>
                      </div>
                      <div className={`text-center text-sm font-black transition-all ${hoveredMetalType === 'main-group' ? 'text-orange-600 scale-110' : 'text-gray-400'}`}>
                        {row.main}
                      </div>
                      <div className={`text-center text-sm font-black transition-all ${hoveredMetalType === 'transition' ? 'text-emerald-600 scale-110' : 'text-gray-400'}`}>
                        {row.trans}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Interactive Overlay Info */}
              <AnimatePresence mode="wait">
                {hoveredMetalType && (
                  <motion.div
                    key={hoveredMetalType}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-6 rounded-3xl border-2 shadow-sm ${hoveredMetalType === 'transition' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-orange-50 border-orange-200 text-orange-900'}`}
                  >
                    <h4 className="font-black uppercase tracking-widest text-sm mb-2">
                      {hoveredMetalType === 'transition' ? 'Transition Metals' : 'Main Group Metals'}
                    </h4>
                    <p className="text-xs font-medium leading-relaxed">
                      {hoveredMetalType === 'transition' 
                        ? "Found in the middle block of the periodic table. They have high melting points, high densities, and form colored compounds. They are also excellent catalysts."
                        : "Found in Groups 1, 2, and the right side of the table. They typically have lower melting points and densities compared to transition metals, and form white compounds."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-sky-100 p-3 rounded-2xl text-sky-600">
                <Droplets size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Types of Oxide</h2>
            </div>

            <div className="space-y-10">
              {/* Classification Legend */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { type: 'Basic', color: 'bg-blue-500', text: 'Metal oxides (mostly)', desc: <span>MgO, CuO</span> },
                  { type: 'Acidic', color: 'bg-red-500', text: 'Non-metal oxides', desc: <span>CO<sub>2</sub>, SO<sub>2</sub></span> },
                  { type: 'Amphoteric', color: 'bg-purple-500', text: 'Al and Zn oxides', desc: <span>Al<sub>2</sub>O<sub>3</sub>, ZnO</span> },
                  { type: 'Neutral', color: 'bg-emerald-500', text: 'Few non-metals', desc: <span>H<sub>2</sub>O, CO, N<sub>2</sub>O</span> }
                ].map((item) => (
                  <motion.div 
                    key={item.type} 
                    onMouseEnter={() => setHoveredOxideType(item.type)}
                    onMouseLeave={() => setHoveredOxideType(null)}
                    whileHover={{ scale: 1.02 }}
                    className={`bg-gray-50 p-5 rounded-3xl border-2 transition-all cursor-help
                      ${hoveredOxideType === item.type ? 'border-gray-300 shadow-md bg-white' : 'border-gray-100'}
                    `}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-4 h-4 rounded-full ${item.color} shadow-sm`} />
                      <span className="text-xs font-black uppercase tracking-widest text-gray-800">{item.type}</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-500 leading-tight">{item.text}</p>
                    <div className="text-[9px] font-black text-gray-400 mt-2 bg-white/50 px-2 py-1 rounded-lg inline-block">{item.desc}</div>
                  </motion.div>
                ))}
              </div>

              {/* Periodic Table for Oxides */}
              <div className="bg-gray-50 rounded-[2rem] p-6 border-2 border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Oxide Classification Table</p>
                <div 
                  className="grid gap-1 max-w-3xl mx-auto overflow-x-auto no-scrollbar pb-4"
                  style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
                >
                  {Array.from({ length: 7 * 18 }).map((_, i) => {
                    const row = Math.floor(i / 18) + 1;
                    const col = (i % 18) + 1;
                    
                    const isAmphoteric = (col === 13 && row === 3) || (col === 12 && row === 4); // Al, Zn
                    const isNonMetal = (col === 1 && row === 1) || (col >= 14 && row <= 5) || (col >= 15 && row <= 6) || (col === 13 && row === 2) || (col === 17);
                    const isMetal = (col <= 12 && row >= 2) || (col === 13 && row >= 4) || (col === 14 && row >= 5);
                    const isNoble = col === 18;

                    let colorClass = "bg-gray-200/30";
                    let type = "";

                    if (isAmphoteric) {
                      colorClass = "bg-purple-500 border-purple-600";
                      type = "Amphoteric";
                    } else if (isNonMetal && !isNoble) {
                      if ((col === 1 && row === 1) || (col === 14 && row === 2) || (col === 15 && row === 2)) {
                        colorClass = "bg-emerald-500 border-emerald-600"; // H, C, N (Neutral examples)
                        type = "Neutral";
                      } else {
                        colorClass = "bg-red-500 border-red-600";
                        type = "Acidic";
                      }
                    } else if (isMetal && !isAmphoteric) {
                      colorClass = "bg-blue-500 border-blue-600";
                      type = "Basic";
                    }

                    if (isNoble || (row === 1 && col > 1 && col < 18)) return <div key={i} className="aspect-square" />;

                    // Determine if this element should be highlighted based on hoveredOxideType
                    const isHighlighted = !hoveredOxideType || 
                      (hoveredOxideType === 'Basic' && type === 'Basic') ||
                      (hoveredOxideType === 'Acidic' && type === 'Acidic') ||
                      (hoveredOxideType === 'Amphoteric' && type === 'Amphoteric') ||
                      (hoveredOxideType === 'Neutral' && type === 'Neutral');

                    return (
                      <motion.div
                        key={i}
                        onMouseEnter={() => setHoveredOxideElement(i)}
                        onMouseLeave={() => setHoveredOxideElement(null)}
                        whileHover={{ scale: 1.2, zIndex: 10 }}
                        className={`aspect-square rounded-sm border transition-all cursor-help ${colorClass}
                          ${!isHighlighted ? 'opacity-10 grayscale' : 'opacity-100'}
                          ${hoveredOxideElement !== null && hoveredOxideElement !== i ? 'opacity-30' : ''}
                        `}
                      />
                    );
                  })}
                </div>
                <div className="mt-4 text-center">
                  <AnimatePresence mode="wait">
                    {hoveredOxideElement !== null ? (
                      <motion.p 
                        key="oxide-info"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-[10px] font-black text-gray-600 uppercase tracking-widest"
                      >
                        This element forms a 
                        <span className="mx-1 text-gray-800">
                          {(() => {
                            const row = Math.floor(hoveredOxideElement / 18) + 1;
                            const col = (hoveredOxideElement % 18) + 1;
                            if ((col === 13 && row === 3) || (col === 12 && row === 4)) return "Amphoteric";
                            if ((col === 1 && row === 1) || (col === 14 && row === 2) || (col === 15 && row === 2)) return "Neutral or Acidic";
                            if ((col >= 14 && row <= 5) || (col >= 15 && row <= 6) || (col === 13 && row === 2) || (col === 17)) return "Acidic";
                            return "Basic";
                          })()}
                        </span>
                        oxide
                      </motion.p>
                    ) : (
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Hover elements to see oxide type</p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Reaction Table */}
              <div className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-3 bg-gray-50 border-b-2 border-gray-100 p-4">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Oxide Type</div>
                  <div className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center">Reacts with Acid?</div>
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest text-center">Reacts with Base?</div>
                </div>
                {[
                  { type: 'Basic', acid: 'Yes', base: 'No', color: 'text-blue-600' },
                  { type: 'Acidic', acid: 'No', base: 'Yes', color: 'text-red-600' },
                  { type: 'Amphoteric', acid: 'Yes', base: 'Yes', color: 'text-purple-600' },
                  { type: 'Neutral', acid: 'No', base: 'No', color: 'text-emerald-600' }
                ].map((row) => (
                  <div key={row.type} className="grid grid-cols-3 p-4 border-b border-gray-50 last:border-0">
                    <div className={`text-xs font-black uppercase tracking-widest ${row.color}`}>{row.type}</div>
                    <div className={`text-center text-xs font-bold ${row.acid === 'Yes' ? 'text-emerald-500' : 'text-rose-400'}`}>{row.acid}</div>
                    <div className={`text-center text-xs font-bold ${row.base === 'Yes' ? 'text-emerald-500' : 'text-rose-400'}`}>{row.base}</div>
                  </div>
                ))}
              </div>

              {/* Beaker Simulation */}
              <div className="space-y-6">
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => { setBeaker1Add('none'); setBeaker2Add('none'); setBeaker3Add('none'); }}
                    className="px-4 py-2 rounded-xl bg-gray-800 text-white font-black text-[10px] uppercase tracking-widest shadow-[0_4px_0_0_#000000] active:shadow-none active:translate-y-1 transition-all"
                  >
                    Reset All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Beaker 1: P4O10 (Acidic) */}
                  <div className="bg-gray-50 rounded-[2rem] p-6 border-2 border-gray-100 flex flex-col items-center">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4">P<sub>4</sub>O<sub>10</sub> (Acidic)</p>
                    <div className="relative w-24 h-32 border-x-2 border-b-2 border-gray-300 rounded-b-2xl bg-white/50 overflow-hidden mb-4 shadow-inner">
                      <motion.div 
                        animate={{ 
                          height: beaker1Add !== 'none' ? '75%' : '45%',
                          backgroundColor: beaker1Add === 'acid' ? '#fee2e2' : beaker1Add === 'base' ? '#dbeafe' : '#f3f4f6'
                        }}
                        className="absolute bottom-0 w-full transition-colors duration-500"
                      />
                      <AnimatePresence>
                        {beaker1Add !== 'base' && (
                          <motion.div 
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ 
                              scale: beaker1Add === 'base' ? 0 : 1,
                              opacity: beaker1Add === 'base' ? 0 : 1
                            }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-gray-200 rounded-lg shadow-sm border border-gray-300 z-10"
                          />
                        )}
                      </AnimatePresence>
                      {/* Liquid surface line */}
                      <div className="absolute w-full h-[2px] bg-white/30 bottom-[45%] z-0" />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <button 
                        onClick={() => setBeaker1Add('acid')} 
                        className="flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500 text-white font-black text-[9px] uppercase tracking-widest shadow-[0_3px_0_0_#b91c1c] active:shadow-none active:translate-y-1 transition-all"
                      >
                        <Zap size={10} /> Add Acid
                      </button>
                      <button 
                        onClick={() => setBeaker1Add('base')} 
                        className="flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-500 text-white font-black text-[9px] uppercase tracking-widest shadow-[0_3px_0_0_#1d4ed8] active:shadow-none active:translate-y-1 transition-all"
                      >
                        <Droplets size={10} /> Add Base
                      </button>
                    </div>
                    <p className="mt-3 text-[8px] font-black text-gray-400 uppercase text-center">
                      {beaker1Add === 'none' ? "Experiment" : beaker1Add === 'acid' ? "No Reaction" : "Dissolves!"}
                    </p>
                  </div>

                  {/* Beaker 2: MgO (Basic) */}
                  <div className="bg-gray-50 rounded-[2rem] p-6 border-2 border-gray-100 flex flex-col items-center">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">MgO (Basic)</p>
                    <div className="relative w-24 h-32 border-x-2 border-b-2 border-gray-300 rounded-b-2xl bg-white/50 overflow-hidden mb-4 shadow-inner">
                      <motion.div 
                        animate={{ 
                          height: beaker2Add !== 'none' ? '75%' : '45%',
                          backgroundColor: beaker2Add === 'acid' ? '#fee2e2' : beaker2Add === 'base' ? '#dbeafe' : '#f3f4f6'
                        }}
                        className="absolute bottom-0 w-full transition-colors duration-500"
                      />
                      <AnimatePresence>
                        {beaker2Add !== 'acid' && (
                          <motion.div 
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ 
                              scale: beaker2Add === 'acid' ? 0 : 1,
                              opacity: beaker2Add === 'acid' ? 0 : 1
                            }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-gray-200 rounded-lg shadow-sm border border-gray-300 z-10"
                          />
                        )}
                      </AnimatePresence>
                      <div className="absolute w-full h-[2px] bg-white/30 bottom-[45%] z-0" />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <button 
                        onClick={() => setBeaker2Add('acid')} 
                        className="flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500 text-white font-black text-[9px] uppercase tracking-widest shadow-[0_3px_0_0_#b91c1c] active:shadow-none active:translate-y-1 transition-all"
                      >
                        <Zap size={10} /> Add Acid
                      </button>
                      <button 
                        onClick={() => setBeaker2Add('base')} 
                        className="flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-500 text-white font-black text-[9px] uppercase tracking-widest shadow-[0_3px_0_0_#1d4ed8] active:shadow-none active:translate-y-1 transition-all"
                      >
                        <Droplets size={10} /> Add Base
                      </button>
                    </div>
                    <p className="mt-3 text-[8px] font-black text-gray-400 uppercase text-center">
                      {beaker2Add === 'none' ? "Experiment" : beaker2Add === 'base' ? "No Reaction" : "Dissolves!"}
                    </p>
                  </div>

                  {/* Beaker 3: Al2O3 (Amphoteric) */}
                  <div className="bg-gray-50 rounded-[2rem] p-6 border-2 border-gray-100 flex flex-col items-center">
                    <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-4">Al<sub>2</sub>O<sub>3</sub> (Amphoteric)</p>
                    <div className="relative w-24 h-32 border-x-2 border-b-2 border-gray-300 rounded-b-2xl bg-white/50 overflow-hidden mb-4 shadow-inner">
                      <motion.div 
                        animate={{ 
                          height: beaker3Add !== 'none' ? '75%' : '45%',
                          backgroundColor: beaker3Add === 'acid' ? '#fee2e2' : beaker3Add === 'base' ? '#dbeafe' : '#f3f4f6'
                        }}
                        className="absolute bottom-0 w-full transition-colors duration-500"
                      />
                      <AnimatePresence>
                        {beaker3Add === 'none' && (
                          <motion.div 
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ 
                              scale: beaker3Add !== 'none' ? 0 : 1,
                              opacity: beaker3Add !== 'none' ? 0 : 1
                            }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-gray-200 rounded-lg shadow-sm border border-gray-300 z-10"
                          />
                        )}
                      </AnimatePresence>
                      <div className="absolute w-full h-[2px] bg-white/30 bottom-[45%] z-0" />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <button 
                        onClick={() => setBeaker3Add('acid')} 
                        className="flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500 text-white font-black text-[9px] uppercase tracking-widest shadow-[0_3px_0_0_#b91c1c] active:shadow-none active:translate-y-1 transition-all"
                      >
                        <Zap size={10} /> Add Acid
                      </button>
                      <button 
                        onClick={() => setBeaker3Add('base')} 
                        className="flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-500 text-white font-black text-[9px] uppercase tracking-widest shadow-[0_3px_0_0_#1d4ed8] active:shadow-none active:translate-y-1 transition-all"
                      >
                        <Droplets size={10} /> Add Base
                      </button>
                    </div>
                    <p className="mt-3 text-[8px] font-black text-gray-400 uppercase text-center">
                      {beaker3Add === 'none' ? "Experiment" : "Dissolves!"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                <Hash size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Oxidation Number</h2>
            </div>

            <div className="space-y-10">
              {/* Rules Legend */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { rule: 'Rule 1', title: 'Elements', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100', desc: 'Oxidation number = 0' },
                  { rule: 'Rule 2', title: 'Compounds', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', desc: 'Sum of all atoms = 0' },
                  { rule: 'Rule 3', title: 'Ions', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', desc: 'Sum = Ion Charge' }
                ].map((item) => (
                  <div key={item.rule} className={`${item.bg} p-5 rounded-3xl border-2 ${item.border}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.rule}</span>
                    </div>
                    <h3 className="text-sm font-black text-gray-800 uppercase mb-1">{item.title}</h3>
                    <p className="text-[10px] font-bold text-gray-500 leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Preferred Values */}
              <div className="bg-gray-50 p-6 rounded-3xl border-2 border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Common Oxidation States</p>
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-gray-700">H =</span>
                    <span className="px-2 py-1 bg-white rounded-lg border border-gray-200 text-xs font-black text-emerald-500">+1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-gray-700">O =</span>
                    <span className="px-2 py-1 bg-white rounded-lg border border-gray-200 text-xs font-black text-red-500">-2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-gray-700">Halogens (F, Cl, Br, I) =</span>
                    <span className="px-2 py-1 bg-white rounded-lg border border-gray-200 text-xs font-black text-purple-500">-1</span>
                  </div>
                </div>
              </div>

              {/* Interactive Examples */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Click to reveal oxidation number of colored atom</p>
                  <button 
                    onClick={() => setRevealedOxidation([])}
                    className="text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:underline"
                  >
                    Reset All
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    // Elements
                    { id: 1, rule: 1, formula: <span><span className="text-orange-500">O</span><sub>2</sub></span>, ans: "0" },
                    { id: 2, rule: 1, formula: <span className="text-orange-500">Fe</span>, ans: "0" },
                    { id: 3, rule: 1, formula: <span><span className="text-orange-500">Cl</span><sub>2</sub></span>, ans: "0" },
                    { id: 4, rule: 1, formula: <span className="text-orange-500">Na</span>, ans: "0" },
                    // Compounds
                    { id: 5, rule: 2, formula: <span><span className="text-emerald-500">C</span>H<sub>4</sub></span>, ans: "-4" },
                    { id: 6, rule: 2, formula: <span><span className="text-emerald-500">C</span>O<sub>2</sub></span>, ans: "+4" },
                    { id: 7, rule: 2, formula: <span><span className="text-emerald-500">C</span><sub>2</sub>H<sub>5</sub>OH</span>, ans: "-2" },
                    { id: 8, rule: 2, formula: <span><span className="text-emerald-500">Si</span>O<sub>2</sub></span>, ans: "+4" },
                    { id: 9, rule: 2, formula: <span><span className="text-emerald-500">Al</span><sub>2</sub>O<sub>3</sub></span>, ans: "+3" },
                    { id: 10, rule: 2, formula: <span><span className="text-emerald-500">Fe</span><sub>2</sub>O<sub>3</sub></span>, ans: "+3" },
                    // Ions
                    { id: 11, rule: 3, formula: <span><span className="text-blue-500">C</span>O<sub>3</sub><sup>2-</sup></span>, ans: "+4" },
                    { id: 12, rule: 3, formula: <span><span className="text-blue-500">P</span>O<sub>4</sub><sup>3-</sup></span>, ans: "+5" },
                    { id: 13, rule: 3, formula: <span><span className="text-blue-500">Mn</span>O<sub>4</sub><sup>-</sup></span>, ans: "+7" },
                    { id: 14, rule: 3, formula: <span><span className="text-blue-500">Cr</span><sub>2</sub>O<sub>7</sub><sup>2-</sup></span>, ans: "+6" },
                  ].map((ex) => (
                    <motion.button
                      key={ex.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (revealedOxidation.includes(ex.id)) {
                          setRevealedOxidation(revealedOxidation.filter(id => id !== ex.id));
                        } else {
                          setRevealedOxidation([...revealedOxidation, ex.id]);
                        }
                      }}
                      className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all
                        ${revealedOxidation.includes(ex.id) 
                          ? 'bg-white border-gray-300 shadow-inner' 
                          : 'bg-gray-50 border-gray-100 hover:border-gray-200 shadow-sm'}
                      `}
                    >
                      <div className="text-lg font-bold text-gray-800">{ex.formula}</div>
                      <AnimatePresence mode="wait">
                        {revealedOxidation.includes(ex.id) ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className={`text-sm font-black ${ex.rule === 1 ? 'text-orange-500' : ex.rule === 2 ? 'text-emerald-500' : 'text-blue-500'}`}
                          >
                            {ex.ans}
                          </motion.div>
                        ) : (
                          <div className="w-6 h-1 bg-gray-200 rounded-full" />
                        )}
                      </AnimatePresence>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-rose-100 p-3 rounded-2xl text-rose-600">
                <Flame size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Metal Extraction</h2>
            </div>

            <div className="space-y-10">
              {/* Common Ores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: 'Bauxite', formula: <span>Al<sub>2</sub>O<sub>3</sub></span>, color: 'bg-[#b45f06]', border: 'border-[#8e4b05]', text: 'Reddish-Brown' },
                  { name: 'Haematite', formula: <span>Fe<sub>2</sub>O<sub>3</sub></span>, color: 'bg-[#444444]', border: 'border-[#222222]', text: 'Dark Grey/Red' },
                  { name: 'Zinc Blende', formula: <span>ZnS</span>, color: 'bg-[#783f04]', border: 'border-[#5b3003]', text: 'Yellow-Brown' }
                ].map((ore) => (
                  <div key={ore.name} className="bg-gray-50 p-5 rounded-3xl border-2 border-gray-100 flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-2xl ${ore.color} border-4 ${ore.border} shadow-inner mb-3 rotate-12`} />
                    <h3 className="text-xs font-black text-gray-800 uppercase mb-1">{ore.name}</h3>
                    <div className="text-[10px] font-bold text-gray-500">{ore.formula}</div>
                    <p className="text-[8px] font-black text-gray-400 uppercase mt-2">{ore.text}</p>
                  </div>
                ))}
              </div>

              {/* Reactivity & Methods */}
              <div className="bg-gray-50 rounded-[2rem] p-8 border-2 border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 text-center">Extraction Methods vs Reactivity</p>
                
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Vertical Reactivity Series */}
                  <div className="flex flex-col gap-1 w-full md:w-24">
                    {['K', 'Na', 'Ca', 'Mg', 'Al', 'C', 'Zn', 'Fe', 'Pb', 'H', 'Cu', 'Ag', 'Au'].map((m) => {
                      const isAboveC = ['K', 'Na', 'Ca', 'Mg', 'Al'].includes(m);
                      const isBelowC = ['Zn', 'Fe', 'Pb', 'Cu'].includes(m);
                      const isNative = ['Ag', 'Au'].includes(m);
                      const isC = m === 'C';
                      
                      return (
                        <motion.div
                          key={m}
                          onMouseEnter={() => setHoveredExtractionMetal(m)}
                          onMouseLeave={() => setHoveredExtractionMetal(null)}
                          className={`px-3 py-1.5 rounded-xl border-2 font-black text-xs transition-all cursor-help text-center
                            ${isC ? 'bg-gray-800 text-white border-black' : 
                              isAboveC ? 'bg-blue-100 text-blue-600 border-blue-200' :
                              isBelowC ? 'bg-orange-100 text-orange-600 border-orange-200' :
                              isNative ? 'bg-yellow-100 text-yellow-600 border-yellow-200' :
                              'bg-gray-100 text-gray-400 border-gray-200'}
                            ${hoveredExtractionMetal && hoveredExtractionMetal !== m ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}
                          `}
                        >
                          {m}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Method Buttons/Cards on the right */}
                  <div className="flex-1 grid grid-cols-1 gap-4 w-full">
                    <div className={`p-6 rounded-[2rem] border-2 transition-all flex items-center gap-6 ${hoveredExtractionMetal && ['K', 'Na', 'Ca', 'Mg', 'Al'].includes(hoveredExtractionMetal) ? 'bg-blue-50 border-blue-200 shadow-xl scale-[1.02]' : 'bg-white border-gray-100 opacity-50'}`}>
                      <div className="bg-blue-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">E</div>
                      <div>
                        <h4 className="text-sm font-black text-blue-600 uppercase mb-1">Electrolysis</h4>
                        <p className="text-xs font-bold text-gray-500">Required for metals MORE reactive than Carbon. High energy cost.</p>
                      </div>
                    </div>
                    <div className={`p-6 rounded-[2rem] border-2 transition-all flex items-center gap-6 ${hoveredExtractionMetal && ['Zn', 'Fe', 'Pb', 'Cu'].includes(hoveredExtractionMetal) ? 'bg-orange-50 border-orange-200 shadow-xl scale-[1.02]' : 'bg-white border-gray-100 opacity-50'}`}>
                      <div className="bg-orange-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">R</div>
                      <div>
                        <h4 className="text-sm font-black text-orange-600 uppercase mb-1">Reduction with Carbon</h4>
                        <p className="text-xs font-bold text-gray-500">For metals LESS reactive than Carbon. Cheaper method.</p>
                      </div>
                    </div>
                    <div className={`p-6 rounded-[2rem] border-2 transition-all flex items-center gap-6 ${hoveredExtractionMetal && ['Ag', 'Au'].includes(hoveredExtractionMetal) ? 'bg-yellow-50 border-yellow-200 shadow-xl scale-[1.02]' : 'bg-white border-gray-100 opacity-50'}`}>
                      <div className="bg-yellow-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">N</div>
                      <div>
                        <h4 className="text-sm font-black text-yellow-600 uppercase mb-1">Native State</h4>
                        <p className="text-xs font-bold text-gray-500">Found as pure metal. No chemical extraction needed.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extraction Simulations - Stacked */}
              <div className="space-y-12">
                {/* Al Extraction Simulation */}
                <div className="bg-gray-50 rounded-[2.5rem] p-8 border-2 border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Al Extraction (Electrolysis)</h3>
                    <button 
                      onClick={() => setAlExtractionActive(!alExtractionActive)}
                      className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
                        ${alExtractionActive ? 'bg-rose-500 text-white shadow-[0_4px_0_0_#9f1239]' : 'bg-emerald-500 text-white shadow-[0_4px_0_0_#065f46]'}
                        active:shadow-none active:translate-y-1
                      `}
                    >
                      {alExtractionActive ? 'Stop' : 'Start'}
                    </button>
                  </div>

                  <div className="relative h-64 bg-white rounded-3xl border-2 border-gray-200 overflow-hidden mb-6">
                    {/* Steel Cathode Container */}
                    <div className="absolute inset-x-4 bottom-4 top-12 border-x-8 border-b-8 border-gray-400 rounded-b-3xl z-0" />
                    
                    {/* Molten Electrolyte */}
                    <motion.div 
                      animate={{ 
                        backgroundColor: alExtractionActive ? '#fff7ed' : '#f3f4f6',
                        opacity: alExtractionActive ? [0.8, 1, 0.8] : 1
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-x-6 bottom-6 top-14 bg-orange-50 rounded-b-2xl z-10"
                    />

                    {/* Graphite Anodes */}
                    <div className="absolute inset-x-12 top-0 flex justify-around z-30">
                      {[1, 2, 3].map((i) => (
                        <motion.div 
                          key={i}
                          animate={{ 
                            height: alExtractionActive ? 80 : 100,
                            width: alExtractionActive ? 12 : 16
                          }}
                          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
                          className="w-4 bg-gray-700 rounded-b-lg shadow-md relative"
                        >
                          {/* Bubbles (CO2) */}
                          {alExtractionActive && (
                            <motion.div 
                              animate={{ y: [-20, -60], opacity: [1, 0], scale: [0.5, 1.2] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                              className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-gray-400"
                            >
                              CO₂
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Ions Animation */}
                    {alExtractionActive && (
                      <>
                        {/* O2- ions migrating to Anode */}
                        {Array.from({ length: 6 }).map((_, i) => (
                          <motion.div
                            key={`o-${i}`}
                            initial={{ x: 40 + Math.random() * 120, y: 180 }}
                            animate={{ 
                              y: [180, 80],
                              opacity: [0, 1, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            className="absolute w-4 h-4 bg-red-400 rounded-full flex items-center justify-center text-[6px] font-black text-white z-20"
                          >
                            O²⁻
                          </motion.div>
                        ))}
                        {/* Al3+ ions migrating to Cathode */}
                        {Array.from({ length: 6 }).map((_, i) => (
                          <motion.div
                            key={`al-${i}`}
                            initial={{ x: 40 + Math.random() * 120, y: 100 }}
                            animate={{ 
                              y: [100, 220],
                              opacity: [0, 1, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            className="absolute w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center text-[6px] font-black text-white z-20"
                          >
                            Al³⁺
                          </motion.div>
                        ))}
                        {/* Molten Al collecting at bottom */}
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: 15 }}
                          className="absolute inset-x-6 bottom-6 bg-gray-300 rounded-b-xl z-15 border-t-2 border-white/50"
                        />
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-2xl border border-gray-100">
                      <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Anode (+)</p>
                      <p className="text-[10px] font-bold text-gray-700">2O²⁻ → O₂ + 4e⁻</p>
                      <p className="text-[7px] font-medium text-gray-400 mt-1">O₂ reacts with graphite → CO₂</p>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-gray-100">
                      <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Cathode (-)</p>
                      <p className="text-[10px] font-bold text-gray-700">Al³⁺ + 3e⁻ → Al</p>
                      <p className="text-[7px] font-medium text-gray-400 mt-1">Molten Al sinks to bottom</p>
                    </div>
                  </div>
                </div>

                {/* Fe Extraction Simulation */}
                <div className="bg-gray-50 rounded-[2.5rem] p-8 border-2 border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Fe Extraction (Blast Furnace)</h3>
                      <p className="text-[10px] font-bold text-gray-400 mt-1">Raw Materials: Haematite (Fe₂O₃), Coke (C), Limestone (CaCO₃)</p>
                    </div>
                    <button 
                      onClick={() => setFeExtractionActive(!feExtractionActive)}
                      className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
                        ${feExtractionActive ? 'bg-rose-500 text-white shadow-[0_4px_0_0_#9f1239]' : 'bg-orange-500 text-white shadow-[0_4px_0_0_#9a3412]'}
                        active:shadow-none active:translate-y-1
                      `}
                    >
                      {feExtractionActive ? 'Stop' : 'Start'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative h-80 bg-white rounded-3xl border-2 border-gray-200 overflow-hidden">
                      {/* Blast Furnace Shape */}
                      <div className="absolute inset-x-12 bottom-4 top-4 bg-gray-100 border-x-4 border-gray-300 rounded-t-[4rem] z-0" />
                      
                      {/* Heat Glow */}
                      <motion.div 
                        animate={{ 
                          opacity: feExtractionActive ? [0.3, 0.6, 0.3] : 0.1,
                          scale: feExtractionActive ? [1, 1.05, 1] : 1
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-400 blur-3xl rounded-full z-10"
                      />

                      {/* Raw Materials Falling */}
                      {feExtractionActive && (
                        <>
                          {Array.from({ length: 8 }).map((_, i) => (
                            <motion.div
                              key={`ore-${i}`}
                              initial={{ y: 20, x: 80 + Math.random() * 40 }}
                              animate={{ y: [20, 250], opacity: [1, 0] }}
                              transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                              className={`absolute w-3 h-3 rounded-sm z-20 ${i % 3 === 0 ? 'bg-[#444444]' : i % 3 === 1 ? 'bg-gray-800' : 'bg-gray-300'}`}
                            />
                          ))}
                          {/* Gas Rising */}
                          {Array.from({ length: 6 }).map((_, i) => (
                            <motion.div
                              key={`gas-${i}`}
                              initial={{ y: 250, x: 80 + Math.random() * 40 }}
                              animate={{ y: [250, 40], opacity: [0, 1, 0] }}
                              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                              className="absolute text-[8px] font-black text-gray-400 z-20"
                            >
                              {i % 2 === 0 ? 'CO' : 'CO₂'}
                            </motion.div>
                          ))}
                          {/* Molten Iron and Slag */}
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: 25 }}
                            className="absolute inset-x-14 bottom-4 bg-[#555555] rounded-b-lg z-25 border-t-2 border-orange-500/50"
                          />
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: 10 }}
                            className="absolute inset-x-14 bottom-[29px] bg-gray-400/80 rounded-t-sm z-24"
                          />
                        </>
                      )}
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Step-by-Step Reactions</p>
                      {[
                        { step: 1, title: 'Combustion of Coke', eq: <span>C + O<sub>2</sub> → CO<sub>2</sub></span> },
                        { step: 2, title: 'Thermal Decomposition', eq: <span>CaCO<sub>3</sub> → CaO + CO<sub>2</sub></span> },
                        { step: 3, title: 'Formation of Reducing Agent', eq: <span>C + CO<sub>2</sub> → 2CO</span> },
                        { step: 4, title: 'Reduction of Haematite', eq: <span>3CO + Fe<sub>2</sub>O<sub>3</sub> → 2Fe + 3CO<sub>2</sub></span> },
                        { step: 5, title: 'Removal of Impurities', eq: <span>CaO + SiO<sub>2</sub> → CaSiO<sub>3</sub></span> }
                      ].map((s) => (
                        <motion.div 
                          key={s.step}
                          animate={{ 
                            opacity: feExtractionActive ? 1 : 0.5,
                            x: feExtractionActive ? 0 : -10
                          }}
                          transition={{ delay: s.step * 0.2 }}
                          className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-orange-100 text-orange-600 text-[8px] font-black px-1.5 py-0.5 rounded-full">STEP {s.step}</span>
                            <span className="text-[9px] font-black text-gray-800 uppercase">{s.title}</span>
                          </div>
                          <p className="text-xs font-bold text-gray-700 font-mono">{s.eq}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                <TrendingUp size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Rate & Equilibrium Yield</h2>
            </div>

            <div className="space-y-10">
              {/* Definitions & Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-100">
                    <h3 className="text-sm font-black text-emerald-600 uppercase mb-2">Rate (How Fast)</h3>
                    <p className="text-xs font-bold text-gray-600">The speed at which reactants are converted into products.</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100">
                    <h3 className="text-sm font-black text-blue-600 uppercase mb-2">Yield (How Much)</h3>
                    <p className="text-xs font-bold text-gray-600">The amount of product obtained from a reaction.</p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl border-2 border-gray-100">
                  <table className="w-full text-left text-[10px]">
                    <thead className="bg-gray-50 border-b-2 border-gray-100">
                      <tr>
                        <th className="p-3 font-black text-gray-400 uppercase">Factor</th>
                        <th className="p-3 font-black text-emerald-500 uppercase">Affects Rate?</th>
                        <th className="p-3 font-black text-blue-500 uppercase">Affects Yield?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { f: 'Concentration', r: true, y: true },
                        { f: 'Pressure', r: true, y: true },
                        { f: 'Temperature', r: true, y: true },
                        { f: 'Surface Area', r: true, y: false },
                        { f: 'Catalyst', r: true, y: false }
                      ].map((row) => (
                        <tr key={row.f} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3 font-bold text-gray-700">{row.f}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-black uppercase text-[8px] ${row.r ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                              {row.r ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-black uppercase text-[8px] ${row.y ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                              {row.y ? 'Yes' : 'No'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Simulator */}
              <div className="bg-gray-50 rounded-[2.5rem] p-8 border-2 border-gray-100">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Controls */}
                  <div className="w-full md:w-72 space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Select Reaction</label>
                      <div className="space-y-3">
                        {[
                          { id: 'Mg', label: 'Mg + 2HCl → MgCl₂ + H₂', sub: 'Formation of H₂ Gas', color: 'border-blue-200' },
                          { id: 'CaCO3', label: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂', sub: 'Formation of CO₂ Gas', color: 'border-amber-200' },
                          { id: 'H2O2', label: '2H₂O₂ → 2H₂O + O₂', sub: 'Catalytic Decomposition (MnO₂)', color: 'border-emerald-200' }
                        ].map((r) => (
                          <button
                            key={r.id}
                            onClick={() => setRateReaction(r.id as any)}
                            className={`w-full p-4 rounded-3xl border-2 text-left transition-all relative overflow-hidden group
                              ${rateReaction === r.id ? 'bg-white border-emerald-500 shadow-xl ring-4 ring-emerald-50' : 'bg-gray-100 border-transparent opacity-60 hover:opacity-100 hover:bg-white'}
                            `}
                          >
                            <div className="relative z-10">
                              <div className="text-[11px] font-black text-gray-800 font-mono mb-1">{r.label}</div>
                              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{r.sub}</div>
                            </div>
                            {rateReaction === r.id && (
                              <motion.div 
                                layoutId="active-reaction-glow"
                                className="absolute top-0 right-0 w-2 h-full bg-emerald-500"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { id: 'concentration', label: 'Concentration', min: 1, max: 5, step: 1, disabled: false },
                        { id: 'temperature', label: 'Temperature', min: 1, max: 5, step: 1, disabled: false },
                        { id: 'surfaceArea', label: 'Surface Area', min: 1, max: 5, step: 1, disabled: rateReaction === 'H2O2' },
                        { id: 'pressure', label: 'Pressure', min: 1, max: 5, step: 1, disabled: true },
                      ].map((ctrl) => (
                        <div key={ctrl.id} className={ctrl.disabled ? 'opacity-30 grayscale pointer-events-none' : ''}>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[9px] font-black text-gray-500 uppercase">{ctrl.label}</label>
                            <span className="text-[9px] font-black text-emerald-500">LVL {(rateParams as any)[ctrl.id]}</span>
                          </div>
                          <input 
                            type="range"
                            min={ctrl.min}
                            max={ctrl.max}
                            step={ctrl.step}
                            value={(rateParams as any)[ctrl.id]}
                            onChange={(e) => setRateParams({...rateParams, [ctrl.id]: parseInt(e.target.value)})}
                            className="w-full accent-emerald-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      ))}

                      <div>
                        <button
                          onClick={() => setRateParams({...rateParams, catalyst: !rateParams.catalyst})}
                          className={`w-full p-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all
                            ${rateParams.catalyst ? 'bg-emerald-500 text-white border-emerald-600 shadow-[0_4px_0_0_#059669]' : 'bg-white text-gray-400 border-gray-200'}
                          `}
                        >
                          {rateReaction === 'H2O2' ? 'MnO₂ Catalyst' : 'Catalyst (General)'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Graph */}
                  <div className="flex-1 bg-white rounded-[2rem] p-6 border-2 border-gray-100 shadow-inner min-h-[300px]">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Volume of {rateReaction === 'Mg' ? 'H₂' : rateReaction === 'CaCO3' ? 'CO₂' : 'O₂'} vs Time
                      </h4>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[8px] font-black text-gray-400 uppercase">Product Volume</span>
                        </div>
                      </div>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={useMemo(() => {
                          const data = [];
                          // Rate Constant k
                          let k = 0.05 * rateParams.concentration * (1 + (rateParams.temperature - 1) * 0.4);
                          if (rateReaction !== 'H2O2') {
                            k *= (1 + (rateParams.surfaceArea - 1) * 0.3);
                          }
                          if (rateParams.catalyst) k *= 2.5;

                          // Final Yield (constant for these reactions as they go to completion)
                          let Vmax = 100;

                          for (let t = 0; t <= 100; t += 5) {
                            const v = Vmax * (1 - Math.exp(-k * t / 10));
                            data.push({ time: t, volume: parseFloat(v.toFixed(1)) });
                          }
                          return data;
                        }, [rateParams, rateReaction])}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="time" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 8, fontWeight: 800, fill: '#94a3b8' }} 
                            label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fontSize: 8, fontWeight: 800, fill: '#94a3b8' }}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 8, fontWeight: 800, fill: '#94a3b8' }}
                            label={{ value: 'Volume (cm³)', angle: -90, position: 'insideLeft', fontSize: 8, fontWeight: 800, fill: '#94a3b8' }}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="volume" 
                            stroke="#10b981" 
                            strokeWidth={4} 
                            dot={false} 
                            animationDuration={1000}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-6">
                      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                        <p className="text-[8px] font-black text-emerald-600 uppercase mb-1">Rate Analysis</p>
                        <p className="text-[10px] font-bold text-gray-700">
                          Steepest at t=0. The initial gradient represents the initial rate.
                          {rateParams.catalyst ? " The catalyst lowers activation energy, significantly increasing the rate." : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reaction Visualizer */}
                <div className="mt-8 pt-8 border-t-2 border-gray-100">
                   <div className="bg-white rounded-[2rem] p-6 border-2 border-gray-100 overflow-hidden relative min-h-[160px] flex flex-col items-center justify-center">
                      <div className="absolute top-4 left-6">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reaction Chamber</span>
                      </div>
                      
                      {/* Beaker Container */}
                      <div className="relative w-48 h-32 border-x-4 border-b-4 border-gray-200 rounded-b-3xl mt-4 bg-blue-50/30 overflow-hidden">
                        {/* Liquid Level */}
                        <div className="absolute bottom-0 w-full h-[70%] bg-blue-200 opacity-40" />
                        
                        {/* Bubbles */}
                        {[...Array(20)].map((_, i) => {
                          // Rate of bubble evolution based on params
                          let rateFactor = rateParams.concentration * (1 + rateParams.temperature * 0.5);
                          if (rateParams.catalyst) rateFactor *= 2;
                          const duration = Math.max(0.5, 4 / (rateFactor / 2));
                          
                          return (
                            <motion.div
                              key={i}
                              initial={{ y: 100, x: 20 + Math.random() * 160 }}
                              animate={{ y: -20 }}
                              transition={{ 
                                duration, 
                                repeat: Infinity, 
                                delay: Math.random() * duration,
                                ease: "linear"
                              }}
                              className="absolute w-2 h-2 rounded-full border border-gray-400/30 bg-white/40"
                              style={{ left: `${10 + Math.random() * 80}%` }}
                            />
                          );
                        })}

                        {/* Solid Reactant (for Mg and CaCO3) */}
                        {(rateReaction === 'Mg' || rateReaction === 'CaCO3') && (
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-4 flex gap-1 items-end justify-center">
                             {[...Array(rateReaction === 'Mg' ? 1 : 4)].map((_, i) => (
                               <motion.div 
                                 key={i}
                                 animate={rateParams.surfaceArea > 3 ? { scale: [1, 0.9, 1] } : {}}
                                 className={`${rateReaction === 'Mg' ? 'w-16 h-2 bg-gray-400' : 'w-4 h-4 bg-gray-300'} rounded-sm`} 
                               />
                             ))}
                          </div>
                        )}

                        {/* Catalyst Particles (for H2O2) */}
                        {(rateReaction === 'H2O2' && rateParams.catalyst) && (
                          <div className="absolute bottom-2 left-0 w-full flex justify-center gap-1">
                            {[...Array(10)].map((_, i) => (
                              <div key={i} className="w-1.5 h-1.5 bg-gray-800 rounded-full opacity-60" />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Rate: {
                            (rateParams.concentration * rateParams.temperature * (rateParams.catalyst ? 2 : 1) > 20) ? 'Very High' : 
                            (rateParams.concentration * rateParams.temperature * (rateParams.catalyst ? 2 : 1) > 10) ? 'High' : 'Moderate'
                          }</span>
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase italic">
                          {rateReaction === 'Mg' ? 'Effervescence: Hydrogen Gas' : rateReaction === 'CaCO3' ? 'Effervescence: Carbon Dioxide' : 'Effervescence: Oxygen Gas'}
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </motion.div>
    );
  };

  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AnimatePresence>
        {isY11Open && <Y11Splash onClose={() => setIsY11Open(false)} />}
      </AnimatePresence>

      <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
        <div className={`transition-all duration-300 ${columns === 1 ? 'max-w-2xl' : columns === 2 ? 'max-w-4xl' : 'max-w-7xl'} mx-auto flex justify-between items-center`}>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-emerald-500 tracking-tight leading-none">IGCSE CIE Chemistry</h1>
            <p className="text-[10px] font-bold text-black uppercase tracking-widest mt-1">An App by Toman</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleColumns}
              className="bg-gray-100 text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-all"
              title="Toggle Layout"
            >
              {columns === 1 ? <List size={20} /> : columns === 2 ? <LayoutGrid size={20} /> : <Layers size={20} />}
            </button>
            <button 
              onClick={() => setIsQRModalOpen(true)}
              className="bg-gray-100 text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-all"
              title="App QR Code"
            >
              <QrCode size={20} />
            </button>
            <button 
              onClick={() => setIsY11Open(true)}
              className="bg-orange-500 text-white px-4 py-1.5 rounded-full font-black text-sm uppercase tracking-widest shadow-[0_4px_0_0_#c2410c] active:shadow-none active:translate-y-1 transition-all"
            >
              Y11
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isQRModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center relative"
            >
              <button 
                onClick={() => setIsQRModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
              <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight mb-2">App QR Code</h3>
              <p className="text-gray-500 font-medium mb-6">Scan to open the revision app on your mobile device!</p>
              <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100 flex justify-center mb-6">
                <QRCodeSVG value="https://y11-rev.vercel.app/" size={200} level="H" includeMargin={true} />
              </div>
              <p className="text-emerald-500 font-black text-sm uppercase tracking-widest">y11-rev.vercel.app</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className={`transition-all duration-300 ${columns === 1 ? 'max-w-2xl' : columns === 2 ? 'max-w-4xl' : 'max-w-7xl'} mx-auto p-4 space-y-6 mt-4`}>
        <div className="bg-emerald-100 border-2 border-emerald-200 rounded-2xl p-6 flex items-center gap-6">
          <div className="bg-emerald-500 p-4 rounded-full text-white">
            <GraduationCap size={40} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-emerald-900 uppercase tracking-tight">Did you know?</h2>
              <motion.button
                whileHover={{ rotate: 180 }}
                whileTap={{ scale: 0.8 }}
                onClick={refreshConcept}
                className="text-emerald-600 hover:text-emerald-800 p-1 rounded-full hover:bg-emerald-200 transition-colors"
              >
                <RefreshCw size={20} />
              </motion.button>
            </div>
            <p className="text-emerald-700 font-medium leading-tight mt-1">
              <HighlightedText text={randomConcept} />
            </p>
          </div>
        </div>

        <div className={`grid gap-4 ${columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-3' : 'grid-cols-1'}`}>
          {units.map((unit) => (
            <motion.div 
              key={unit.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-[0_4px_0_0_rgba(0,0,0,0.05)] hover:border-emerald-400 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${unit.color} rounded-xl flex items-center justify-center text-white font-bold text-xl`}>
                    {unit.id}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800 text-lg uppercase tracking-wide">{unit.title}</h3>
                    <p className="text-gray-500 text-sm">{unit.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => startQuiz(unit)}
                  className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-emerald-50 text-emerald-600 border-2 border-emerald-100 hover:bg-emerald-100 transition-colors"
                >
                  <CheckCircle2 size={24} />
                  <span className="text-xs font-bold uppercase">Quiz</span>
                </button>
                <button 
                  onClick={() => startRevision(unit)}
                  className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-blue-50 text-blue-600 border-2 border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  <BookOpen size={24} />
                  <span className="text-xs font-bold uppercase">Notes</span>
                </button>
                <button 
                  onClick={() => startVocab(unit)}
                  className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-purple-50 text-purple-600 border-2 border-purple-100 hover:bg-purple-100 transition-colors"
                >
                  <Languages size={24} />
                  <span className="text-xs font-bold uppercase">Vocab</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );

  const QuizSelectView = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tight mb-2">Choose Your Challenge</h2>
          <p className="text-gray-500 font-medium">{selectedUnit?.title}</p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => startQuizWithMode(selectedUnit!, 'quick')}
            className="bg-white border-2 border-gray-200 p-6 rounded-3xl flex items-center gap-6 hover:border-emerald-400 transition-all group shadow-[0_4px_0_0_#e5e7eb] hover:shadow-[0_4px_0_0_#34d399]"
          >
            <div className="bg-emerald-100 text-emerald-600 p-4 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <CheckCircle2 size={32} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-xl text-gray-800 uppercase">Quick Mode</h3>
              <p className="text-gray-500 text-sm">10 random questions to test your knowledge.</p>
            </div>
          </button>

          <button
            onClick={() => startQuizWithMode(selectedUnit!, 'time-attack')}
            className="bg-white border-2 border-gray-200 p-6 rounded-3xl flex items-center gap-6 hover:border-orange-400 transition-all group shadow-[0_4px_0_0_#e5e7eb] hover:shadow-[0_4px_0_0_#fb923c]"
          >
            <div className="bg-orange-100 text-orange-600 p-4 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <Trophy size={32} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-xl text-gray-800 uppercase">Time Attack</h3>
              <p className="text-gray-500 text-sm">Race against the clock! 30 seconds to answer as many as you can.</p>
            </div>
          </button>

          <button
            onClick={() => startQuizWithMode(selectedUnit!, 'marathon')}
            className="bg-white border-2 border-gray-200 p-6 rounded-3xl flex items-center gap-6 hover:border-blue-400 transition-all group shadow-[0_4px_0_0_#e5e7eb] hover:shadow-[0_4px_0_0_#60a5fa]"
          >
            <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <BookOpen size={32} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-xl text-gray-800 uppercase">Marathon</h3>
              <p className="text-gray-500 text-sm">All questions in random order. No time limit.</p>
            </div>
          </button>
        </div>

        <button
          onClick={() => setMode('dashboard')}
          className="w-full mt-8 text-gray-400 font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  const QuizView = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="p-4 flex items-center gap-4 max-w-4xl mx-auto w-full">
          <button onClick={() => setMode('dashboard')} className="text-gray-400 hover:text-gray-600">
            <XCircle size={32} />
          </button>
          
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {quizSubMode === 'time-attack' ? 'Time Attack' : quizSubMode === 'marathon' ? 'Marathon' : 'Quick Mode'}
                </span>
              </div>
              {(quizSubMode === 'quick' || quizSubMode === 'marathon') && (
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  Question {currentQuestionIndex + 1}
                </span>
              )}
              {quizSubMode === 'time-attack' && (
                <span className={`text-sm font-black uppercase tracking-widest ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-orange-500'}`}>
                  {timeLeft}s
                </span>
              )}
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: quizSubMode === 'time-attack' ? `${(timeLeft / 30) * 100}%` : `${quizProgress}%` }}
                className={`h-full rounded-full transition-all ${quizSubMode === 'time-attack' ? (timeLeft <= 5 ? 'bg-red-500' : 'bg-orange-500') : 'bg-emerald-500'}`}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 text-red-500 font-bold">
            <Heart size={20} fill={hearts > 0 ? "currentColor" : "none"} />
            <span>{hearts}</span>
          </div>
        </header>

        <main className="flex-1 max-w-2xl mx-auto w-full p-6 flex flex-col transition-all duration-300">
          <div className="grid grid-cols-1 mb-8">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">English</p>
              <h2 className="text-2xl font-black text-gray-800">
                <HighlightedText text={currentQuestion.text} />
              </h2>
            </div>
          </div>
          
          <div className="space-y-4 flex-1">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={option}
                disabled={isAnswerChecked}
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-4 text-left rounded-2xl border-2 transition-all font-bold text-lg
                  ${selectedOption === option 
                    ? 'border-blue-400 bg-blue-50 text-blue-600 shadow-[0_4px_0_0_#60a5fa]' 
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700 shadow-[0_4px_0_0_#e5e7eb]'
                  }
                  ${isAnswerChecked && option === currentQuestion.correctAnswer ? 'border-emerald-400 bg-emerald-50 text-emerald-600 shadow-[0_4px_0_0_#34d399]' : ''}
                  ${isAnswerChecked && selectedOption === option && !isCorrect ? 'border-red-400 bg-red-50 text-red-600 shadow-[0_4px_0_0_#f87171]' : ''}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-1 w-full">
                    <HighlightedText text={option} />
                  </div>
                  {isAnswerChecked && option === currentQuestion.correctAnswer && <CheckCircle2 size={24} className="shrink-0 ml-4" />}
                  {isAnswerChecked && selectedOption === option && !isCorrect && <XCircle size={24} className="shrink-0 ml-4" />}
                </div>
              </button>
            ))}
          </div>
        </main>

        <footer className={`p-6 border-t-2 transition-colors ${isAnswerChecked ? (isCorrect ? 'bg-emerald-100 border-emerald-200' : 'bg-red-100 border-red-200') : 'bg-white border-gray-100'}`}>
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            {isAnswerChecked ? (
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isCorrect ? 'bg-white text-emerald-500' : 'bg-white text-red-500'}`}>
                  {isCorrect ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                </div>
                <div>
                  <h3 className={`font-black text-xl ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                    {isCorrect ? 'Excellent!' : 'Correct answer:'}
                  </h3>
                  {!isCorrect && <p className="text-red-600 font-bold">{currentQuestion.correctAnswer}</p>}
                </div>
              </div>
            ) : (
              <div />
            )}
            
            <button
              onClick={isAnswerChecked ? nextQuestion : checkAnswer}
              disabled={!selectedOption}
              className={`px-10 py-3 rounded-2xl font-black text-lg uppercase tracking-wider transition-all
                ${!selectedOption 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : isAnswerChecked 
                    ? (isCorrect ? 'bg-emerald-500 text-white shadow-[0_4px_0_0_#059669]' : 'bg-red-500 text-white shadow-[0_4px_0_0_#dc2626]')
                    : 'bg-emerald-500 text-white shadow-[0_4px_0_0_#059669]'
                }
              `}
            >
              {isAnswerChecked ? 'Continue' : 'Check'}
            </button>
          </div>
        </footer>
      </div>
    );
  };

  const ResultView = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-yellow-100 p-8 rounded-full text-yellow-500 mb-8"
      >
        <Trophy size={100} />
      </motion.div>
      <h2 className="text-4xl font-black text-gray-800 mb-2">
        {hearts > 0 ? (quizSubMode === 'time-attack' ? 'Time Up!' : 'Unit Complete!') : 'Out of Hearts!'}
      </h2>
      <p className="text-gray-500 text-xl mb-8">
        {hearts > 0 
          ? (quizSubMode === 'time-attack' ? `Great effort in Time Attack!` : `You've mastered some ${selectedUnit?.title} concepts!`)
          : `Don't give up! Review the notes and try again.`}
      </p>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4">
          <p className="text-orange-400 font-bold uppercase text-xs">Score</p>
          <p className="text-orange-600 font-black text-2xl">
            {quizSubMode === 'time-attack' ? score : `${score} / ${quizQuestions.length}`}
          </p>
        </div>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
          <p className="text-blue-400 font-bold uppercase text-xs">Accuracy</p>
          <p className="text-blue-600 font-black text-2xl">
            {score > 0 ? Math.round((score / (currentQuestionIndex + (isAnswerChecked ? 1 : 0))) * 100) : 0}%
          </p>
        </div>
      </div>

      <button
        onClick={() => setMode('dashboard')}
        className="w-full max-w-sm bg-emerald-500 text-white py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all"
      >
        Finish
      </button>
    </div>
  );

  const RevisionView = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMode('dashboard')} className="text-gray-400 hover:text-gray-600">
              <ChevronLeft size={32} />
            </button>
            <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight">{selectedUnit?.title} Notes</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAssistMode(!isAssistMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all border-2
                ${isAssistMode 
                  ? 'bg-indigo-500 text-white border-indigo-500 shadow-[0_4px_0_0_#4338ca]' 
                  : 'bg-white text-indigo-500 border-indigo-100 hover:border-indigo-200 shadow-[0_4px_0_0_#e0e7ff]'
                }
              `}
            >
              <Languages size={14} />
              Assist Mode: {isAssistMode ? 'ON' : 'OFF'}
            </button>
            {isAssistMode && (
              <button
                onClick={() => setIsSimplified(!isSimplified)}
                className="bg-white text-indigo-500 border-2 border-indigo-100 px-3 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:border-indigo-200 shadow-[0_4px_0_0_#e0e7ff] active:shadow-none active:translate-y-1 transition-all"
              >
                {isSimplified ? 'Traditional' : 'Simplified'}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className={`${isAssistMode ? 'max-w-6xl' : 'max-w-2xl'} mx-auto p-6 space-y-6 transition-all duration-300`}>
        <div className={`${selectedUnit?.color} rounded-3xl p-8 text-white shadow-lg`}>
          <div className={`grid ${isAssistMode ? 'grid-cols-2 gap-8' : 'grid-cols-1'}`}>
            <div>
              <h2 className="text-3xl font-black mb-2">{selectedUnit?.title}</h2>
              <p className="text-white/90 text-lg">{selectedUnit?.description}</p>
            </div>
            {isAssistMode && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-3xl font-black mb-2">
                  {isSimplified ? (selectedUnit?.titleZhSimp || selectedUnit?.title) : (selectedUnit?.titleZh || selectedUnit?.title)}
                </h2>
                <p className="text-white/90 text-lg">
                  {isSimplified ? (selectedUnit?.descriptionZhSimp || selectedUnit?.description) : (selectedUnit?.descriptionZh || selectedUnit?.description)}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest">Key Concepts</h3>
          {selectedUnit?.concepts.map((concept, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-[0_4px_0_0_rgba(0,0,0,0.05)]"
            >
              <div className={`grid ${isAssistMode ? 'grid-cols-2 gap-8' : 'grid-cols-1'}`}>
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mt-1 shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="text-gray-700 text-lg font-medium leading-relaxed">
                    <HighlightedText text={concept} />
                  </p>
                </div>
                {isAssistMode && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4 items-start border-l-2 border-indigo-50 pl-8">
                    <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mt-1 shrink-0">
                      <Languages size={20} />
                    </div>
                    <p className="text-gray-700 text-lg font-medium leading-relaxed">
                      <HighlightedText text={(isSimplified ? selectedUnit?.conceptsZhSimp?.[i] : selectedUnit?.conceptsZh?.[i]) || concept} />
                    </p>
                  </motion.div>
                )}
              </div>
              
              {/* Relevant Graphics/Animations */}
              {selectedUnit?.id === 1 && i === 1 && <StatesOfMatterAnimation />}
              {selectedUnit?.id === 1 && i === 9 && <DiffusionAnimation />}
              {selectedUnit?.id === 1 && i === 11 && <DiffusionExperimentAnimation />}
              
              {selectedUnit?.id === 2 && i === 2 && <AtomicStructureDrawing />}
              {selectedUnit?.id === 2 && i === 6 && <AXZNotationDrawing />}
              {selectedUnit?.id === 2 && i === 13 && <IonicBondingAnimation />}
              {selectedUnit?.id === 2 && i === 14 && <GiantIonicDrawing />}
              {selectedUnit?.id === 2 && i === 15 && <CovalentBondingAnimation />}
              {selectedUnit?.id === 2 && i === 17 && <GiantCovalentDrawing />}
              {selectedUnit?.id === 2 && i === 18 && <GiantMetallicDrawing />}

              {selectedUnit?.id === 3 && i === 5 && <EquationBalancerAnimation />}
              {selectedUnit?.id === 3 && i === 10 && <MolarVolumeAnimation />}

              {selectedUnit?.id === 4 && i === 0 && <InteractiveElectrolysisAnimation />}
              {selectedUnit?.id === 4 && i === 4 && <ElectroplatingAnimation />}
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => startQuiz(selectedUnit!)}
          className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3"
        >
          Take the Quiz <ArrowRight size={24} />
        </button>
      </main>
    </div>
  );

  const VocabView = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [masteredIndices, setMasteredIndices] = useState<number[]>([]);
    const [remainingIndices, setRemainingIndices] = useState<number[]>([]);
    const [isSimplified, setIsSimplified] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [colorIndex, setColorIndex] = useState(0);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [reviewView, setReviewView] = useState<'cards' | 'list'>('cards');

    const duolingoColors = [
      'bg-[#58cc02]', // Green
      'bg-[#1cb0f6]', // Blue
      'bg-[#ff9600]', // Orange
      'bg-[#ff4b4b]', // Red
      'bg-[#ce82ff]', // Purple
    ];

    const duolingoShadows = [
      'shadow-[0_8px_0_0_#46a302]',
      'shadow-[0_8px_0_0_#1899d6]',
      'shadow-[0_8px_0_0_#e68700]',
      'shadow-[0_8px_0_0_#e64444]',
      'shadow-[0_8px_0_0_#b975e6]',
    ];

    useEffect(() => {
      if (selectedUnit) {
        const stats = sessionStats[selectedUnit.id] || { attemptedQuestions: [], masteredVocab: [] };
        const alreadyMasteredIndices = selectedUnit.vocab
          .map((v, i) => stats.masteredVocab.includes(v.term) ? i : -1)
          .filter(i => i !== -1);
        
        setMasteredIndices(alreadyMasteredIndices);

        // Only show cards NOT yet mastered in this session's initial queue
        const indices = selectedUnit.vocab
          .map((_, i) => i)
          .filter(i => !alreadyMasteredIndices.includes(i));

        // Shuffle indices for random order
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        setRemainingIndices(indices);
        setIsCompleted(indices.length === 0);
      }
    }, [selectedUnit]);

    const handleSwipe = (direction: 'left' | 'right') => {
      if (remainingIndices.length === 0) return;
      
      const currentVocabIdx = remainingIndices[0];
      const currentVocab = selectedUnit?.vocab[currentVocabIdx];
      
      if (!currentVocab) return;

      setIsFlipped(false);
      setColorIndex((prev) => (prev + 1) % duolingoColors.length);

      if (direction === 'right') {
        // Mastered
        setMasteredIndices(prev => [...prev, currentVocabIdx]);

        // Track mastered vocab in session stats
        setSessionStats(prev => {
          const unitStats = prev[selectedUnit!.id] || { attemptedQuestions: [], masteredVocab: [] };
          if (!unitStats.masteredVocab.includes(currentVocab.term)) {
            return {
              ...prev,
              [selectedUnit!.id]: {
                ...unitStats,
                masteredVocab: [...unitStats.masteredVocab, currentVocab.term]
              }
            };
          }
          return prev;
        });
        
        setRemainingIndices(prev => {
          const next = prev.slice(1);
          if (next.length === 0) {
            setIsCompleted(true);
          }
          return next;
        });
      } else {
        // Revise Later (Left) - Move to end of queue
        setRemainingIndices(prev => {
          if (prev.length <= 1) return prev;
          return [...prev.slice(1), prev[0]];
        });
      }
    };

    if (isCompleted) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="bg-white p-12 rounded-full shadow-2xl mb-8"
          >
            <Trophy size={120} className="text-yellow-400" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black text-gray-800 mb-4 uppercase tracking-tight"
          >
            All mastered! Good job!
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 text-xl mb-12"
          >
            You've learned all the key terms for this unit.
          </motion.p>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => {
                setIsCompleted(false);
                setIsReviewMode(true);
              }}
              className="bg-white text-emerald-500 border-2 border-emerald-500 px-12 py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_0_#10b981] active:shadow-none active:translate-y-1 transition-all"
            >
              Review All
            </motion.button>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => setMode('dashboard')}
              className="bg-emerald-500 text-white px-12 py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all"
            >
              Back to Dashboard
            </motion.button>
          </div>
        </div>
      );
    }

    const currentVocab = selectedUnit?.vocab[remainingIndices[0]];

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
        <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
          <div className={`${isReviewMode ? 'max-w-6xl' : 'max-w-2xl'} mx-auto flex items-center justify-between transition-all duration-300`}>
            <div className="flex items-center gap-4">
              <button onClick={() => setMode('dashboard')} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={32} />
              </button>
              <div>
                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Vocab</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedUnit?.title}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right mr-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</p>
                <p className="text-sm font-black text-emerald-500">
                  {masteredIndices.length} / {selectedUnit?.vocab.length}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSimplified(!isSimplified)}
                className="bg-purple-100 text-purple-600 px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider border-2 border-purple-200 flex items-center gap-2"
              >
                <Languages size={16} />
                {isSimplified ? 'Simplified' : 'Traditional'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsReviewMode(!isReviewMode)}
                className={`${isReviewMode ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'} px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider border-2 flex items-center gap-2`}
              >
                {isReviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
                {isReviewMode ? 'Study' : 'Review'}
              </motion.button>
            </div>
          </div>
        </header>

        {isReviewMode ? (
          <main className={`flex-1 overflow-y-auto p-4 ${isReviewMode ? 'max-w-6xl' : 'max-w-2xl'} mx-auto w-full transition-all duration-300`}>
            <div className="flex justify-center mb-6 gap-2">
              <button
                onClick={() => setReviewView('cards')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${reviewView === 'cards' ? 'bg-emerald-500 text-white shadow-[0_4px_0_0_#059669]' : 'bg-white text-gray-400 border-2 border-gray-200 hover:bg-gray-50'}`}
              >
                <LayoutGrid size={16} />
                Cards
              </button>
              <button
                onClick={() => setReviewView('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${reviewView === 'list' ? 'bg-emerald-500 text-white shadow-[0_4px_0_0_#059669]' : 'bg-white text-gray-400 border-2 border-gray-200 hover:bg-gray-50'}`}
              >
                <List size={16} />
                List
              </button>
            </div>

            {reviewView === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedUnit?.vocab.map((v, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={idx}
                    className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-[0_4px_0_0_rgba(0,0,0,0.05)]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Term</span>
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">{v.term}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Chinese</span>
                        <p className="text-lg font-black text-emerald-500">{isSimplified ? v.simplified : v.traditional}</p>
                      </div>
                    </div>
                    <div className="h-px bg-gray-100 w-full mb-4" />
                    <div>
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Definition</span>
                      <p className="text-gray-600 text-sm font-medium leading-relaxed">{v.definition}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-[0_4px_0_0_rgba(0,0,0,0.05)]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vocabulary</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Definition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUnit?.vocab.map((v, idx) => (
                      <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <p className="font-black text-gray-800 uppercase tracking-tight leading-tight">{v.term}</p>
                          <p className="text-emerald-500 font-black text-xs mt-1">{isSimplified ? v.simplified : v.traditional}</p>
                        </td>
                        <td className="p-4 text-sm text-gray-600 font-medium leading-relaxed">
                          {v.definition}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        ) : (
          <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
          <div className="w-full max-w-sm aspect-[3/4] relative perspective-1000 mb-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={remainingIndices[0]}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 100) handleSwipe('right');
                  else if (info.offset.x < -100) handleSwipe('left');
                }}
                animate={{ 
                  rotateY: isFlipped ? 180 : 0,
                  x: 0,
                  opacity: 1,
                  scale: 1
                }}
                exit={{ 
                  x: 0,
                  opacity: 0,
                  scale: 0.8
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-full cursor-pointer preserve-3d relative transition-shadow duration-300"
              >
                {/* Front */}
                <div 
                  className={`absolute inset-0 backface-hidden rounded-3xl flex flex-col items-center justify-center p-8 text-center ${duolingoColors[colorIndex]} ${duolingoShadows[colorIndex]}`}
                >
                  <span className="text-white/50 text-xs font-black uppercase tracking-[0.2em] mb-4">English Term</span>
                  <h2 className="text-white text-4xl font-black uppercase tracking-tight leading-tight">
                    {currentVocab?.term}
                  </h2>
                  <div className="absolute bottom-8 flex items-center gap-2 text-white/60 font-bold text-sm uppercase tracking-widest">
                    <ArrowRight size={16} className="animate-pulse" /> Tap to flip
                  </div>
                </div>

                {/* Back */}
                <div 
                  className="absolute inset-0 backface-hidden rounded-3xl bg-white flex flex-col items-center justify-center p-8 text-center rotate-y-180 border-4 border-gray-100 shadow-[0_8px_0_0_#e5e5e5]"
                >
                  <div className="space-y-8 w-full">
                    <div>
                      <span className="text-gray-300 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">Translation</span>
                      <h3 className="text-gray-800 text-3xl font-black">
                        {isSimplified ? currentVocab?.simplified : currentVocab?.traditional}
                      </h3>
                    </div>
                    
                    <div className="h-px bg-gray-100 w-full" />
                    
                    <div>
                      <span className="text-gray-300 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">Definition</span>
                      <p className="text-gray-600 text-lg font-medium leading-relaxed">
                        {currentVocab?.definition}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Swipe Indicators - Moved to normal flow to avoid overlapping */}
          <div className="w-full max-w-sm flex justify-between px-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-red-100 border-2 border-red-200 flex items-center justify-center text-red-500 shadow-[0_4px_0_0_#fecaca]">
                <XCircle size={28} />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revise Later</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-emerald-500 shadow-[0_4px_0_0_#a7f3d0]">
                <CheckCircle2 size={28} />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mastered</span>
            </div>
          </div>
        </main>
      )}

      {!isReviewMode && (
        <footer className="p-6 text-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Swipe left to revise • Swipe right to master
          </p>
        </footer>
      )}

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

    const VirtualCalculator = ({ onClose }: { onClose: () => void }) => {
      const [display, setDisplay] = useState('0');
      const [prevValue, setPrevValue] = useState<number | null>(null);
      const [operator, setOperator] = useState<string | null>(null);
      const [waitingForOperand, setWaitingForOperand] = useState(false);

      const inputDigit = (digit: string) => {
        if (waitingForOperand) {
          setDisplay(digit);
          setWaitingForOperand(false);
        } else {
          setDisplay(display === '0' ? digit : display + digit);
        }
      };

      const inputDot = () => {
        if (waitingForOperand) {
          setDisplay('0.');
          setWaitingForOperand(false);
        } else if (display.indexOf('.') === -1) {
          setDisplay(display + '.');
        }
      };

      const clearDisplay = () => {
        setDisplay('0');
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(false);
      };

      const performOperation = (nextOperator: string) => {
        const inputValue = parseFloat(display);

        if (prevValue === null) {
          setPrevValue(inputValue);
        } else if (operator) {
          const currentValue = prevValue || 0;
          let newValue = currentValue;

          if (operator === '+') newValue = currentValue + inputValue;
          else if (operator === '-') newValue = currentValue - inputValue;
          else if (operator === '×') newValue = currentValue * inputValue;
          else if (operator === '÷') newValue = currentValue / inputValue;

          setPrevValue(newValue);
          setDisplay(String(newValue));
        }

        setWaitingForOperand(true);
        setOperator(nextOperator);
      };

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-24 right-6 z-50 bg-gray-800 p-4 rounded-3xl shadow-2xl border-4 border-gray-700 w-64"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Calculator</span>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <XCircle size={20} />
            </button>
          </div>
          <div className="bg-gray-900 p-4 rounded-2xl mb-4 text-right overflow-hidden">
            <div className="text-gray-500 text-[10px] font-mono h-4">
              {prevValue !== null && `${prevValue} ${operator || ''}`}
            </div>
            <div className="text-white text-2xl font-mono truncate">{display}</div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['C', '÷', '×', '-'].map(btn => (
              <button
                key={btn}
                onClick={() => btn === 'C' ? clearDisplay() : performOperation(btn)}
                className="p-3 rounded-xl bg-gray-700 text-orange-400 font-black hover:bg-gray-600 transition-colors"
              >
                {btn}
              </button>
            ))}
            {[7, 8, 9, '+'].map(btn => (
              <button
                key={btn}
                onClick={() => typeof btn === 'number' ? inputDigit(String(btn)) : performOperation(btn)}
                className={`p-3 rounded-xl font-black transition-colors ${typeof btn === 'number' ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-700 text-orange-400 hover:bg-gray-600'}`}
              >
                {btn}
              </button>
            ))}
            {[4, 5, 6, '='].map(btn => (
              <button
                key={btn}
                onClick={() => typeof btn === 'number' ? inputDigit(String(btn)) : performOperation(btn === '=' ? '=' : btn)}
                className={`p-3 rounded-xl font-black transition-colors ${typeof btn === 'number' ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-700 text-emerald-400 hover:bg-gray-600'}`}
              >
                {btn}
              </button>
            ))}
            {[1, 2, 3, '0'].map(btn => (
              <button
                key={btn}
                onClick={() => inputDigit(String(btn))}
                className="p-3 rounded-xl bg-gray-600 text-white font-black hover:bg-gray-500 transition-colors"
              >
                {btn}
              </button>
            ))}
            <button
              onClick={inputDot}
              className="p-3 rounded-xl bg-gray-600 text-white font-black hover:bg-gray-500 transition-colors col-span-4"
            >
              .
            </button>
          </div>
        </motion.div>
      );
    };

    const MoleCalculationPlayground = () => {
      const [calcMode, setCalcMode] = useState<'mass' | 'conc' | 'gas' | 'dimensional'>('mass');
      const [showCalculator, setShowCalculator] = useState(false);
      const [examples, setExamples] = useState<any[]>([]);
      const [userAnswers, setUserAnswers] = useState<string[]>(['', '', '', '', '', '']);
      const [isChecked, setIsChecked] = useState(false);

      const formatFormula = (formula: string) => {
        return formula.split(/(\d+)/).map((part, i) => 
          /\d+/.test(part) ? <sub key={i} className="text-[0.7em]">{part}</sub> : part
        );
      };

      const generateExamples = useCallback(() => {
        const massList = [
          { formula: "H2", mr: 2, mass: 4 },
          { formula: "CH4", mr: 16, mass: 3.2 },
          { formula: "CO2", mr: 44, mass: 11 },
          { formula: "NH3", mr: 17, mass: 3.4 },
          { formula: "O2", mr: 32, mass: 1.6 },
          { formula: "N2", mr: 28, mass: 14 },
          { formula: "NaCl", mr: 58.5, mass: 11.7 },
          { formula: "MgO", mr: 40, mass: 8 },
          { formula: "H2O", mr: 18, mass: 3.6 },
          { formula: "HCl", mr: 36.5, mass: 7.3 }
        ];

        const concList = [
          { name: "NaOH", conc: 0.1, vol: 250 },
          { name: "HCl", conc: 2.0, vol: 50 },
          { name: "H2SO4", conc: 0.5, vol: 100 },
          { name: "NaCl", conc: 1.0, vol: 500 },
          { name: "KOH", conc: 0.2, vol: 25 },
          { name: "HNO3", conc: 1.5, vol: 200 }
        ];

        const gasList = [
          { name: "H2", vol: 2400 },
          { name: "O2", vol: 12000 },
          { name: "CO2", vol: 480 },
          { name: "N2", vol: 6000 },
          { name: "CH4", vol: 120 },
          { name: "NH3", vol: 240 }
        ];

        let selected: any[] = [];
        if (calcMode === 'mass') {
          selected = [...massList].sort(() => Math.random() - 0.5).slice(0, 6).map(ex => ({ ...ex, answer: (ex.mass / ex.mr).toFixed(2) }));
        } else if (calcMode === 'conc') {
          selected = [...concList].sort(() => Math.random() - 0.5).slice(0, 6).map(ex => ({ ...ex, answer: (ex.conc * (ex.vol / 1000)).toFixed(3) }));
        } else if (calcMode === 'gas') {
          selected = [...gasList].sort(() => Math.random() - 0.5).slice(0, 6).map(ex => ({ ...ex, answer: (ex.vol / 24000).toFixed(3) }));
        } else if (calcMode === 'dimensional') {
          selected = [
            { type: 'mass', formula: "H2", mr: 2, mass: 4, answer: "2.00" },
            { type: 'conc', name: "NaOH", conc: 0.1, vol: 500, answer: "0.050" },
            { type: 'gas', name: "H2", vol: 480, answer: "0.020" },
            ...massList.sort(() => Math.random() - 0.5).slice(0, 3).map(ex => ({ ...ex, type: 'mass', answer: (ex.mass / ex.mr).toFixed(2) }))
          ];
        }

        setExamples(selected);
        setUserAnswers(['', '', '', '', '', '']);
        setIsChecked(false);
      }, [calcMode]);

      useEffect(() => {
        generateExamples();
      }, [generateExamples]);

      const checkAnswers = () => {
        setIsChecked(true);
      };

      const DimensionalAnalysisView = () => {
        const [activeExampleIndex, setActiveExampleIndex] = useState(0);
        const [placedBlocks, setPlacedBlocks] = useState<any[]>([]);
        const [isDimChecked, setIsDimChecked] = useState(false);
        const [isDimCorrect, setIsDimCorrect] = useState(false);
        
        const ex = examples[activeExampleIndex];
        if (!ex) return null;

        const blocks = [
          { id: 'b1', top: `1 mol`, bottom: `${ex.mr || '2'} g`, val: 1 / (ex.mr || 2) },
          { id: 'b2', top: `1 dm³`, bottom: `1000 cm³`, val: 1 / 1000 },
          { id: 'b3', top: `1 mol`, bottom: `24 dm³`, val: 1 / 24 },
          { id: 'b4', top: `${ex.conc || '0.1'} mol`, bottom: `1 dm³`, val: ex.conc || 0.1 }
        ];

        const [availableBlocks, setAvailableBlocks] = useState(blocks.map(b => ({ ...b, inverted: false })));

        useEffect(() => {
          setAvailableBlocks(blocks.map(b => ({ ...b, inverted: false })));
        }, [activeExampleIndex, examples]);

        const toggleInvert = (id: string, isPlaced: boolean, index?: number) => {
          if (isPlaced && index !== undefined) {
            const newPlaced = [...placedBlocks];
            newPlaced[index] = { ...newPlaced[index], inverted: !newPlaced[index].inverted };
            setPlacedBlocks(newPlaced);
          } else {
            setAvailableBlocks(availableBlocks.map(b => b.id === id ? { ...b, inverted: !b.inverted } : b));
          }
          setIsDimChecked(false);
        };

        const addBlock = (block: any) => {
          setPlacedBlocks([...placedBlocks, { ...block, instanceId: Math.random() }]);
          setIsDimChecked(false);
        };

        const removeBlock = (index: number) => {
          const newPlaced = [...placedBlocks];
          newPlaced.splice(index, 1);
          setPlacedBlocks(newPlaced);
          setIsDimChecked(false);
        };

        const checkDimResult = () => {
          let currentVal = ex.mass || ex.vol || 0;
          placedBlocks.forEach(b => {
            const multiplier = b.inverted ? (1 / b.val) : b.val;
            currentVal *= multiplier;
          });
          
          const diff = Math.abs(currentVal - parseFloat(ex.answer));
          setIsDimCorrect(diff < 0.005);
          setIsDimChecked(true);
        };

        return (
          <div className="space-y-6">
            <div className="bg-purple-50 border-2 border-purple-100 p-6 rounded-3xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-purple-600 font-black text-lg uppercase tracking-tight">Dimensional Analysis</h3>
                {isDimChecked && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2
                      ${isDimCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}
                    `}
                  >
                    {isDimCorrect ? <><CheckCircle2 size={14} /> Correct!</> : <><XCircle size={14} /> Incorrect</>}
                  </motion.div>
                )}
              </div>
              
              <div className="flex items-center gap-4 flex-wrap min-h-[100px]">
                <div className="bg-white px-4 py-3 rounded-xl border-2 border-purple-200 font-black text-gray-700 shadow-sm">
                  {ex.mass ? `${ex.mass} g ` : ex.vol ? `${ex.vol} cm³ ` : ''}
                  {formatFormula(ex.formula || ex.name)}
                </div>
                
                {placedBlocks.map((b, i) => (
                  <React.Fragment key={b.instanceId}>
                    <span className="text-2xl font-black text-purple-400">×</span>
                    <div className="relative group">
                      <motion.div 
                        layoutId={b.instanceId}
                        onClick={() => toggleInvert(b.id, true, i)}
                        className="bg-purple-600 p-3 rounded-xl flex flex-col items-center justify-center min-w-[100px] cursor-pointer border-2 border-purple-400 shadow-lg hover:bg-purple-500 transition-colors"
                      >
                        <div className="text-white text-[10px] font-black uppercase tracking-widest">{b.inverted ? b.bottom : b.top}</div>
                        <div className="w-full h-[2px] bg-white my-1" />
                        <div className="text-white text-[10px] font-black uppercase tracking-widest">{b.inverted ? b.top : b.bottom}</div>
                      </motion.div>
                      <button 
                        onClick={() => removeBlock(i)}
                        className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XCircle size={14} />
                      </button>
                    </div>
                  </React.Fragment>
                ))}
                
                {placedBlocks.length > 0 && (
                  <>
                    <span className="text-2xl font-black text-purple-400">=</span>
                    <div className="bg-emerald-100 px-4 py-3 rounded-xl border-2 border-emerald-200 font-black text-emerald-700 shadow-sm">
                      {isDimChecked && isDimCorrect ? `${ex.answer} mol` : '? mol'}
                    </div>
                  </>
                )}
              </div>
              
              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mt-6 bg-white/50 p-2 rounded-lg inline-block">
                💡 Click blocks to invert. Click available blocks below to add them.
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-3xl">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Available Blocks</p>
              <div className="flex gap-4 flex-wrap">
                {availableBlocks.map((b) => (
                  <motion.div 
                    key={b.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addBlock(b)}
                    className="bg-purple-600 p-3 rounded-xl flex flex-col items-center justify-center min-w-[110px] cursor-pointer border-2 border-purple-400 shadow-lg hover:bg-purple-500 transition-colors"
                  >
                    <div className="text-white text-[10px] font-black uppercase tracking-widest">{b.inverted ? b.bottom : b.top}</div>
                    <div className="w-full h-[2px] bg-white my-1" />
                    <div className="text-white text-[10px] font-black uppercase tracking-widest">{b.inverted ? b.top : b.bottom}</div>
                  </motion.div>
                ))}
                <button
                  onClick={() => setAvailableBlocks(availableBlocks.map(b => ({ ...b, inverted: !b.inverted })))}
                  className="p-3 rounded-xl border-2 border-dashed border-purple-300 text-purple-400 font-black text-[10px] uppercase tracking-widest hover:bg-purple-50 transition-colors"
                >
                  Invert All
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex gap-2 bg-white p-2 rounded-2xl border-2 border-gray-100">
                {examples.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveExampleIndex(i); setPlacedBlocks([]); setIsDimChecked(false); }}
                    className={`w-10 h-10 rounded-xl font-black text-sm transition-all
                      ${activeExampleIndex === i ? 'bg-purple-500 text-white shadow-md scale-110' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}
                    `}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={checkDimResult}
                  disabled={placedBlocks.length === 0}
                  className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_6px_0_0_#059669] active:scale-95 transition-all
                    ${placedBlocks.length === 0 ? 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed' : 'bg-emerald-500 text-white'}
                  `}
                >
                  Check Setup
                </button>
              </div>
            </div>
          </div>
        );
      };

      return (
        <div className="space-y-8">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl overflow-x-auto">
            {(['mass', 'conc', 'gas', 'dimensional'] as const).map(m => (
              <button
                key={m}
                onClick={() => setCalcMode(m)}
                className={`flex-1 min-w-[100px] py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
                  ${calcMode === m ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}
                `}
              >
                {m === 'mass' ? 'From Mass' : m === 'conc' ? 'From Conc/Vol' : m === 'gas' ? 'From Gas Vol' : 'Dimensional Analysis'}
              </button>
            ))}
          </div>

          {calcMode !== 'dimensional' ? (
            <>
              <div className="bg-orange-50 border-2 border-orange-100 p-6 rounded-3xl">
                <h3 className="text-orange-600 font-black text-lg uppercase tracking-tight mb-2">Formula</h3>
                <div className="text-2xl font-black text-gray-800 font-mono">
                  {calcMode === 'mass' && <span>n = m / M<sub>r</sub></span>}
                  {calcMode === 'conc' && <span>n = C × V</span>}
                  {calcMode === 'gas' && <span>n = V / 24</span>}
                </div>
                <p className="text-gray-500 text-xs font-bold mt-2 uppercase tracking-widest">
                  {calcMode === 'mass' && "m = mass (g), Mr = molar mass (g/mol)"}
                  {calcMode === 'conc' && "C = conc (mol/dm³), V = volume (dm³)"}
                  {calcMode === 'gas' && "V = gas volume (dm³), 24 dm³/mol = molar volume"}
                </p>
                {(calcMode === 'conc' || calcMode === 'gas') && (
                  <div className="mt-4 p-3 bg-amber-100/50 rounded-xl border border-amber-200">
                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest leading-tight">
                      ⚠️ Reminder: Convert cm³ to dm³ first (divide by 1000)
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {examples.map((ex, i) => (
                  <div key={i} className={`bg-white border-2 p-4 rounded-2xl shadow-sm transition-all ${isChecked ? (Math.abs(parseFloat(userAnswers[i]) - parseFloat(ex.answer)) < 0.05 ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50') : 'border-gray-100'}`}>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{formatFormula(ex.formula || ex.name)}</p>
                    <div className="space-y-1 mb-4">
                      {ex.mass && <p className="text-xs font-bold text-gray-700">m = <span className="text-orange-500">{ex.mass} g</span></p>}
                      {ex.mr && <p className="text-xs font-bold text-gray-700">M<sub>r</sub> = <span className="text-blue-500">{ex.mr}</span></p>}
                      {ex.conc && <p className="text-xs font-bold text-gray-700">C = <span className="text-orange-500">{ex.conc} mol/dm³</span></p>}
                      {ex.vol && <p className="text-xs font-bold text-gray-700">V = <span className="text-blue-500">{ex.vol} cm³</span></p>}
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={userAnswers[i]}
                        onChange={(e) => {
                          const newAns = [...userAnswers];
                          newAns[i] = e.target.value;
                          setUserAnswers(newAns);
                        }}
                        placeholder="0.00"
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-orange-400 transition-all"
                      />
                      {isChecked && (
                        <div className="absolute -top-2 -right-2">
                          {Math.abs(parseFloat(userAnswers[i]) - parseFloat(ex.answer)) < 0.05 ? (
                            <CheckCircle2 className="text-emerald-500" size={20} />
                          ) : (
                            <XCircle className="text-rose-500" size={20} />
                          )}
                        </div>
                      )}
                    </div>
                    {isChecked && Math.abs(parseFloat(userAnswers[i]) - parseFloat(ex.answer)) >= 0.05 && (
                      <p className="text-[10px] font-black text-rose-500 mt-2 uppercase">Ans: {ex.answer}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={checkAnswers}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-[0_6px_0_0_#059669] active:scale-95 transition-all"
                >
                  <CheckCircle2 size={20} />
                  Check Answers
                </button>
                <button
                  onClick={generateExamples}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-gray-200 text-gray-600 rounded-2xl font-black uppercase tracking-widest shadow-[0_6px_0_0_#e5e7eb] hover:border-orange-400 active:scale-95 transition-all"
                >
                  <RefreshCw size={20} />
                  More Questions
                </button>
              </div>
            </>
          ) : (
            <DimensionalAnalysisView />
          )}

          <div className="flex justify-center">
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95
                ${showCalculator ? 'bg-gray-800 text-white shadow-[0_6px_0_0_#000000]' : 'bg-white border-2 border-gray-200 text-gray-600 shadow-[0_6px_0_0_#e5e7eb] hover:border-orange-400'}
              `}
            >
              <Calculator size={20} />
              {showCalculator ? 'Hide Calculator' : 'Show Calculator'}
            </button>
          </div>

          <AnimatePresence>
            {showCalculator && <VirtualCalculator onClose={() => setShowCalculator(false)} />}
          </AnimatePresence>
        </div>
      );
    };

    const SolubilityPlayground = () => {
      const salts = [
        { name: 'Potassium Nitrate', formula: 'KNO₃', soluble: true, rule: 'All K⁺ and NO₃⁻ salts are soluble.' },
        { name: 'Sodium Chloride', formula: 'NaCl', soluble: true, rule: 'All Na⁺ salts are soluble.' },
        { name: 'Ammonium Sulfate', formula: ' (NH₄)₂SO₄', soluble: true, rule: 'All NH₄⁺ salts are soluble.' },
        { name: 'Barium Sulfate', formula: 'BaSO₄', soluble: false, rule: 'Most sulfates are soluble except BaSO₄ and PbSO₄.' },
        { name: 'Silver Chloride', formula: 'AgCl', soluble: false, rule: 'Most halides are soluble except AgX and PbX₂.' },
        { name: 'Lead(II) Iodide', formula: 'PbI₂', soluble: false, rule: 'Most halides are soluble except AgX and PbX₂.' },
        { name: 'Calcium Carbonate', formula: 'CaCO₃', soluble: false, rule: 'Most carbonates are insoluble except those of K⁺/Na⁺/NH₄⁺.' },
        { name: 'Copper(II) Hydroxide', formula: 'Cu(OH)₂', soluble: false, rule: 'Most hydroxides are insoluble except those of K⁺/Na⁺/NH₄⁺.' },
        { name: 'Magnesium Sulfate', formula: 'MgSO₄', soluble: true, rule: 'Most sulfates are soluble.' },
        { name: 'Iron(II) Chloride', formula: 'FeCl₂', soluble: true, rule: 'Most halides are soluble.' },
        { name: 'Sodium Carbonate', formula: 'Na₂CO₃', soluble: true, rule: 'Carbonates of Na⁺ are soluble.' },
        { name: 'Potassium Hydroxide', formula: 'KOH', soluble: true, rule: 'Hydroxides of K⁺ are soluble.' },
      ];

      const [currentIndex, setCurrentIndex] = useState(0);
      const [score, setScore] = useState(0);
      const [showResult, setShowResult] = useState(false);
      const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

      const currentSalt = salts[currentIndex];

      const handleAnswer = (answer: boolean) => {
        if (answer === currentSalt.soluble) {
          setScore(score + 1);
          setFeedback('correct');
        } else {
          setFeedback('wrong');
        }

        setTimeout(() => {
          setFeedback(null);
          if (currentIndex < salts.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            setShowResult(true);
          }
        }, 1500);
      };

      const reset = () => {
        setCurrentIndex(0);
        setScore(0);
        setShowResult(false);
        setFeedback(null);
      };

      if (showResult) {
        return (
          <main className="max-w-2xl mx-auto p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-12 text-center shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
            >
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy size={48} />
              </div>
              <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tight mb-2">Revision Complete!</h2>
              <p className="text-gray-500 font-bold mb-8">You identified {score} out of {salts.length} salts correctly.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                  <p className="text-2xl font-black text-emerald-500">{Math.round((score / salts.length) * 100)}%</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accuracy</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                  <p className="text-2xl font-black text-blue-500">{score}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Correct</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="w-full bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-[0_4px_0_0_#059669] uppercase tracking-widest"
              >
                Try Again
              </motion.button>
            </motion.div>
          </main>
        );
      }

      return (
        <main className="max-w-2xl mx-auto p-6">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Question {currentIndex + 1} of {salts.length}</p>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Is it Soluble?</h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Score</p>
              <p className="text-xl font-black text-emerald-500">{score}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-12 text-center shadow-[0_8px_0_0_rgba(0,0,0,0.05)] relative overflow-hidden"
            >
              <div className="mb-8">
                <h3 className="text-4xl font-black text-gray-800 mb-2">{currentSalt.formula}</h3>
                <p className="text-lg font-bold text-gray-400 uppercase tracking-widest">{currentSalt.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={feedback !== null}
                  onClick={() => handleAnswer(true)}
                  className="bg-emerald-50 border-2 border-emerald-200 p-8 rounded-3xl group hover:bg-emerald-500 transition-colors"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-500 group-hover:text-emerald-600">
                    <CheckCircle2 size={32} />
                  </div>
                  <span className="font-black text-emerald-600 uppercase tracking-widest group-hover:text-white">Soluble</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={feedback !== null}
                  onClick={() => handleAnswer(false)}
                  className="bg-rose-50 border-2 border-rose-200 p-8 rounded-3xl group hover:bg-rose-500 transition-colors"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-500 group-hover:text-rose-600">
                    <XCircle size={32} />
                  </div>
                  <span className="font-black text-rose-600 uppercase tracking-widest group-hover:text-white">Insoluble</span>
                </motion.button>
              </div>

              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`absolute inset-0 flex items-center justify-center p-8 z-30 ${
                      feedback === 'correct' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  >
                    <div className="text-white text-center">
                      <div className="mb-4 flex justify-center">
                        {feedback === 'correct' ? <CheckCircle2 size={64} /> : <XCircle size={64} />}
                      </div>
                      <h4 className="text-2xl font-black uppercase tracking-tight mb-2">
                        {feedback === 'correct' ? 'Correct!' : 'Incorrect'}
                      </h4>
                      <p className="font-bold text-white/90">{currentSalt.rule}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 bg-white border-2 border-gray-200 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Info className="text-blue-500" size={20} />
              <h4 className="font-black text-gray-800 uppercase tracking-tight">Solubility Rules Reminder</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <p className="text-sm font-bold text-gray-600">
                  All <span className="text-emerald-600">K<sup>+</sup></span>, <span className="text-emerald-600">Na<sup>+</sup></span>, <span className="text-emerald-600">NH<sub>4</sub><sup>+</sup></span>, and <span className="text-emerald-600">NO<sub>3</sub><sup>-</sup></span> salts are <span className="text-emerald-600">SOLUBLE</span>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                <p className="text-sm font-bold text-gray-600">
                  Most <span className="text-sky-600">Sulfates (SO<sub>4</sub><sup>2-</sup>)</span> are soluble except <span className="text-rose-500">BaSO<sub>4</sub></span> and <span className="text-rose-500">PbSO<sub>4</sub></span>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                <p className="text-sm font-bold text-gray-600">
                  Most <span className="text-sky-600">Halides (Cl<sup>-</sup>, Br<sup>-</sup>, I<sup>-</sup>)</span> are soluble except <span className="text-rose-500">AgX</span> and <span className="text-rose-500">PbX<sub>2</sub></span>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <p className="text-sm font-bold text-gray-600">
                  Most <span className="text-rose-600">Hydroxides (OH<sup>-</sup>)</span> and <span className="text-rose-600">Carbonates (CO<sub>3</sub><sup>2-</sup>)</span> are <span className="text-rose-600">INSOLUBLE</span> except those of K<sup>+</sup>, Na<sup>+</sup>, and NH<sub>4</sub><sup>+</sup>.
                </p>
              </div>
            </div>
          </div>
        </main>
      );
    };

  const PlaygroundView = () => {
    const [subMode, setSubMode] = useState<'select' | 'equations' | 'chemicals' | 'graphs' | 'simulations' | 'solubility' | 'mole' | 'mole-calc' | 'ionic'>('select');
    const [selectedEquation, setSelectedEquation] = useState<any>(null);
    const [equationSubject, setEquationSubject] = useState<string>('');
    const [isPracticeMode, setIsPracticeMode] = useState(false);
    const [practiceQuestion, setPracticeQuestion] = useState<any>(null);
    const [practiceAnswer, setPracticeAnswer] = useState<string | null>(null);
    const [isPracticeChecked, setIsPracticeChecked] = useState(false);
    const [selectedChemical, setSelectedChemical] = useState<any>(null);
    const [selectedGraph, setSelectedGraph] = useState<string | null>(null);
    const [graphSpeed1, setGraphSpeed1] = useState(5);
    const [graphSpeed2, setGraphSpeed2] = useState(10);

    const MolePlayground = () => {
      const moleQuestions = [
        {
          equation: "N₂ + 3H₂ → 2NH₃",
          parts: [
            { formula: "N₂", ratio: 1, mr: 28 },
            { formula: "H₂", ratio: 3, mr: 2 },
            { formula: "NH₃", ratio: 2, mr: 17 }
          ],
          known: { index: 0, type: 'mass', value: 28, unit: 'g' },
          unknown: { index: 2, type: 'mass', label: 'mass', unit: 'g' },
          steps: [
            { text: "28 g / 28 g/mol = 1 mol", val: 1 },
            { text: "1 mol × 2 = 2 mol", val: 2 },
            { text: "2 mol × 17 g/mol = 34 g", val: 34 }
          ]
        },
        {
          equation: "2Mg + O₂ → 2MgO",
          parts: [
            { formula: "Mg", ratio: 2, mr: 24 },
            { formula: "O₂", ratio: 1, mr: 32 },
            { formula: "MgO", ratio: 2, mr: 40 }
          ],
          known: { index: 0, type: 'mass', value: 4.8, unit: 'g' },
          unknown: { index: 2, type: 'mass', label: 'mass', unit: 'g' },
          steps: [
            { text: "4.8 g / 24 g/mol = 0.2 mol", val: 0.2 },
            { text: "0.2 mol × (2/2) = 0.2 mol", val: 0.2 },
            { text: "0.2 mol × 40 g/mol = 8 g", val: 8 }
          ]
        },
        {
          equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
          parts: [
            { formula: "CH₄", ratio: 1, mr: 16 },
            { formula: "O₂", ratio: 2, mr: 32 },
            { formula: "CO₂", ratio: 1, mr: 44 },
            { formula: "H₂O", ratio: 2, mr: 18 }
          ],
          known: { index: 0, type: 'mass', value: 1.6, unit: 'g' },
          unknown: { index: 2, type: 'mass', label: 'mass', unit: 'g' },
          steps: [
            { text: "1.6 g / 16 g/mol = 0.1 mol", val: 0.1 },
            { text: "0.1 mol × 1 = 0.1 mol", val: 0.1 },
            { text: "0.1 mol × 44 g/mol = 4.4 g", val: 4.4 }
          ]
        },
        {
          equation: "CaCO₃ → CaO + CO₂",
          parts: [
            { formula: "CaCO₃", ratio: 1, mr: 100 },
            { formula: "CaO", ratio: 1, mr: 56 },
            { formula: "CO₂", ratio: 1, mr: 44 }
          ],
          known: { index: 0, type: 'mass', value: 20, unit: 'g' },
          unknown: { index: 2, type: 'volume', label: 'volume', unit: 'dm³' },
          steps: [
            { text: "20 g / 100 g/mol = 0.2 mol", val: 0.2 },
            { text: "0.2 mol × 1 = 0.2 mol", val: 0.2 },
            { text: "0.2 mol × 24 dm³/mol = 4.8 dm³", val: 4.8 }
          ]
        },
        {
          equation: "2Na + Cl₂ → 2NaCl",
          parts: [
            { formula: "Na", ratio: 2, mr: 23 },
            { formula: "Cl₂", ratio: 1, mr: 71 },
            { formula: "NaCl", ratio: 2, mr: 58.5 }
          ],
          known: { index: 1, type: 'volume', value: 12, unit: 'dm³' },
          unknown: { index: 2, type: 'mass', label: 'mass', unit: 'g' },
          steps: [
            { text: "12 dm³ / 24 dm³/mol = 0.5 mol", val: 0.5 },
            { text: "0.5 mol × 2 = 1 mol", val: 1 },
            { text: "1 mol × 58.5 g/mol = 58.5 g", val: 58.5 }
          ]
        },
        {
          equation: "Mg + 2HCl → MgCl₂ + H₂",
          parts: [
            { formula: "Mg", ratio: 1, mr: 24 },
            { formula: "HCl", ratio: 2, mr: 36.5 },
            { formula: "MgCl₂", ratio: 1, mr: 95 },
            { formula: "H₂", ratio: 1, mr: 2 }
          ],
          known: { index: 0, type: 'mass', value: 1.2, unit: 'g' },
          unknown: { index: 3, type: 'volume', label: 'volume', unit: 'dm³' },
          steps: [
            { text: "1.2 g / 24 g/mol = 0.05 mol", val: 0.05 },
            { text: "0.05 mol × 1 = 0.05 mol", val: 0.05 },
            { text: "0.05 mol × 24 dm³/mol = 1.2 dm³", val: 1.2 }
          ]
        },
        {
          equation: "2H₂ + O₂ → 2H₂O",
          parts: [
            { formula: "H₂", ratio: 2, mr: 2 },
            { formula: "O₂", ratio: 1, mr: 32 },
            { formula: "H₂O", ratio: 2, mr: 18 }
          ],
          known: { index: 0, type: 'mass', value: 4, unit: 'g' },
          unknown: { index: 2, type: 'mass', label: 'mass', unit: 'g' },
          steps: [
            { text: "4 g / 2 g/mol = 2 mol", val: 2 },
            { text: "2 mol × (2/2) = 2 mol", val: 2 },
            { text: "2 mol × 18 g/mol = 36 g", val: 36 }
          ]
        },
        {
          equation: "S + O₂ → SO₂",
          parts: [
            { formula: "S", ratio: 1, mr: 32 },
            { formula: "O₂", ratio: 1, mr: 32 },
            { formula: "SO₂", ratio: 1, mr: 64 }
          ],
          known: { index: 0, type: 'mass', value: 3.2, unit: 'g' },
          unknown: { index: 2, type: 'volume', label: 'volume', unit: 'dm³' },
          steps: [
            { text: "3.2 g / 32 g/mol = 0.1 mol", val: 0.1 },
            { text: "0.1 mol × 1 = 0.1 mol", val: 0.1 },
            { text: "0.1 mol × 24 dm³/mol = 2.4 dm³", val: 2.4 }
          ]
        }
      ];

      const [qIndex, setQIndex] = useState(0);
      const [step, setStep] = useState(0); // 0: known, 1: known mole, 2: unknown mole, 3: unknown quantity
      const [mode, setMode] = useState<'example' | 'practice'>('example');
      const [practiceInput, setPracticeInput] = useState("");
      const [practiceFeedback, setPracticeFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
      const [showCalculator, setShowCalculator] = useState(false);
      const [calcDisplay, setCalcDisplay] = useState("0");

      const currentQ = moleQuestions[qIndex];

      const nextQ = () => {
        setQIndex((qIndex + 1) % moleQuestions.length);
        setStep(0);
        setPracticeInput("");
        setPracticeFeedback('none');
      };

      const handleStepClick = (clickedStep: number) => {
        if (mode === 'example' && step === clickedStep) {
          setStep(step + 1);
        }
      };

      const checkPracticeAnswer = () => {
        const expected = currentQ.steps[step - 1].val;
        const userVal = parseFloat(practiceInput);
        
        if (Math.abs(userVal - expected) < 0.01) {
          setPracticeFeedback('correct');
          setTimeout(() => {
            setStep(step + 1);
            setPracticeInput("");
            setPracticeFeedback('none');
          }, 1000);
        } else {
          setPracticeFeedback('wrong');
          setTimeout(() => setPracticeFeedback('none'), 1500);
        }
      };

      const VirtualCalculator = () => {
        const buttons = [
          '7', '8', '9', '/',
          '4', '5', '6', '*',
          '1', '2', '3', '-',
          '0', '.', '=', '+',
          'C'
        ];

        const handleCalc = (btn: string) => {
          if (btn === 'C') setCalcDisplay("0");
          else if (btn === '=') {
            try {
              // Using Function constructor as a simple math evaluator for this educational context
              // In a real app, a proper math parser library would be safer
              const result = new Function(`return ${calcDisplay}`)();
              setCalcDisplay(String(Number(result).toFixed(3).replace(/\.?0+$/, "")));
            } catch {
              setCalcDisplay("Error");
            }
          } else {
            setCalcDisplay(prev => prev === "0" || prev === "Error" ? btn : prev + btn);
          }
        };

        return (
          <motion.div 
            drag
            dragMomentum={false}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed bottom-8 right-8 w-64 bg-gray-900 rounded-3xl p-4 shadow-2xl z-50 cursor-move"
          >
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Calculator</span>
              <button onClick={() => setShowCalculator(false)} className="text-gray-500 hover:text-white">
                <XCircle size={16} />
              </button>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 mb-4 text-right">
              <p className="text-white font-mono text-2xl truncate">{calcDisplay}</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {buttons.map(btn => (
                <button
                  key={btn}
                  onClick={() => handleCalc(btn)}
                  className={`h-12 rounded-xl font-black transition-all active:scale-95 ${
                    btn === '=' ? 'bg-orange-500 text-white col-span-1' : 
                    btn === 'C' ? 'bg-rose-500 text-white' :
                    ['/', '*', '-', '+'].includes(btn) ? 'bg-gray-700 text-orange-400' : 'bg-gray-700 text-white'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </motion.div>
        );
      };

      return (
        <div className="space-y-8">
          <div className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Mole Playground</p>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Interactive Stoichiometry</h2>
              </div>
              <div className="flex items-center gap-4">
                {/* Mode Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-2xl border-2 border-gray-200">
                  <button
                    onClick={() => { setMode('example'); setStep(0); }}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'example' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}
                  >
                    Example
                  </button>
                  <button
                    onClick={() => { setMode('practice'); setStep(0); }}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                  >
                    Practice
                  </button>
                </div>

                <button
                  onClick={() => setShowCalculator(!showCalculator)}
                  className={`p-3 rounded-2xl border-2 transition-all ${showCalculator ? 'bg-gray-800 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}
                >
                  <Calculator size={20} />
                </button>

                <button
                  onClick={nextQ}
                  className="bg-orange-500 text-white font-black px-6 py-2 rounded-2xl shadow-[0_4px_0_0_#c2410c] active:shadow-none active:translate-y-1 transition-all uppercase tracking-widest text-xs"
                >
                  Next Example
                </button>
              </div>
            </div>

            <div className="relative min-h-[550px] flex flex-col items-center">
              {/* Equation Header */}
              <div className="flex items-center justify-center gap-8 mb-16 bg-gray-50 px-12 py-6 rounded-[2rem] border-2 border-gray-100">
                {currentQ.equation.split(' ').map((part, i) => {
                  const formulaOnly = part.replace(/^\d+/, '');
                  const coefficient = part.slice(0, part.length - formulaOnly.length);
                  const partIndex = currentQ.parts.findIndex(p => p.formula === formulaOnly);
                  const isKnown = partIndex === currentQ.known.index;
                  const isUnknown = partIndex === currentQ.unknown.index;

                  return (
                    <div key={i} className="relative flex flex-col items-center">
                      <span className={`text-3xl font-black ${part === '→' || part === '+' ? 'text-orange-300' : 'text-gray-800'}`}>
                        {part === '→' || part === '+' ? (
                          part
                        ) : (
                          <>
                            {coefficient && <span className="text-orange-500">{coefficient}</span>}
                            {formulaOnly.split('').map((char, j) => (
                              <span key={j}>{char.match(/\d/) ? <sub>{char}</sub> : char}</span>
                            ))}
                          </>
                        )}
                      </span>
                      
                      {/* Column for this chemical */}
                      <div className="absolute top-12 w-48 flex flex-col items-center pt-4">
                        {/* Row 1: Known Box or Final Box */}
                        <div className="h-28 w-full flex items-center justify-center">
                          {isKnown && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              onClick={() => handleStepClick(0)}
                              className={`w-full p-4 rounded-2xl border-2 text-center cursor-pointer transition-all shadow-sm
                                ${step >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-50 border-gray-100 text-gray-400'}
                                ${step === 0 ? 'ring-4 ring-emerald-100 scale-105' : 'hover:scale-102'}
                              `}
                            >
                              <p className="text-[10px] font-black uppercase tracking-widest mb-1">Known Quantity</p>
                              <p className="text-xl font-black">{currentQ.known.value} {currentQ.known.unit}</p>
                            </motion.div>
                          )}
                          {isUnknown && step >= 3 && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="w-full p-4 bg-rose-500 text-white rounded-2xl text-center shadow-lg border-2 border-rose-400"
                            >
                              <p className="text-[10px] font-black text-rose-100 uppercase tracking-widest mb-1">Final {currentQ.unknown.label}</p>
                              {mode === 'example' || step > 3 ? (
                                <>
                                  <p className="text-sm font-bold mb-1">{currentQ.steps[2].text}</p>
                                  <p className="text-xl font-black">{currentQ.steps[2].val} {currentQ.unknown.unit}</p>
                                </>
                              ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <input 
                                    type="number" 
                                    value={practiceInput}
                                    onChange={(e) => setPracticeInput(e.target.value)}
                                    placeholder={`Enter ${currentQ.unknown.unit}`}
                                    className="w-full text-center text-sm font-bold bg-rose-400 border-2 border-rose-300 rounded-xl p-1 focus:outline-none placeholder:text-rose-200"
                                  />
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>

                        {/* Row 2: Vertical Link */}
                        <div className="h-10 w-full flex items-center justify-center">
                          {isKnown && step >= 1 && (
                            <motion.div 
                              initial={{ height: 0 }} 
                              animate={{ height: 40 }} 
                              className="w-0.5 bg-emerald-200 relative"
                            >
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-200 rounded-full" />
                            </motion.div>
                          )}
                          {isUnknown && step >= 3 && (
                            <motion.div 
                              initial={{ height: 0 }} 
                              animate={{ height: 40 }} 
                              className="w-0.5 bg-rose-200 relative"
                            >
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-rose-200 rounded-full" />
                            </motion.div>
                          )}
                        </div>

                        {/* Row 3: Mole Box */}
                        <div className="h-24 w-full flex items-center justify-center">
                          {isKnown && step >= 1 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              onClick={() => handleStepClick(1)}
                              className={`w-full p-4 bg-white border-2 border-emerald-100 rounded-2xl text-center shadow-sm cursor-pointer hover:scale-102 transition-all
                                ${step === 1 ? 'ring-4 ring-emerald-50' : ''}
                              `}
                            >
                              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Moles of {formulaOnly}</p>
                              {mode === 'example' || step > 1 ? (
                                <p className="text-sm font-bold text-emerald-600">{currentQ.steps[0].text}</p>
                              ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <input 
                                    type="number" 
                                    value={practiceInput}
                                    onChange={(e) => setPracticeInput(e.target.value)}
                                    placeholder="Enter mol"
                                    className="w-full text-center text-sm font-bold bg-emerald-50 border-2 border-emerald-200 rounded-xl p-1 focus:outline-none focus:ring-2 ring-emerald-300"
                                  />
                                </div>
                              )}
                            </motion.div>
                          )}
                          {isUnknown && step >= 2 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              onClick={() => handleStepClick(2)}
                              className={`w-full p-4 rounded-2xl border-2 text-center cursor-pointer transition-all shadow-sm
                                ${step >= 2 ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-gray-50 border-gray-100 text-gray-400'}
                                ${step === 2 ? 'ring-4 ring-rose-100 scale-105' : 'hover:scale-102'}
                              `}
                            >
                              <p className="text-[10px] font-black uppercase tracking-widest mb-1">Moles of {formulaOnly}</p>
                              {mode === 'example' || step > 2 ? (
                                <p className="text-sm font-bold">{currentQ.steps[1].text}</p>
                              ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <input 
                                    type="number" 
                                    value={practiceInput}
                                    onChange={(e) => setPracticeInput(e.target.value)}
                                    placeholder="Enter mol"
                                    className="w-full text-center text-sm font-bold bg-rose-100 border-2 border-rose-200 rounded-xl p-1 focus:outline-none focus:ring-2 ring-rose-300"
                                  />
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Horizontal Link between Moles */}
              {step >= 2 && (
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '40%', opacity: 1 }}
                  className="absolute top-[264px] left-1/2 -translate-x-1/2 h-0.5 bg-orange-200 flex items-center justify-center z-0"
                >
                  <div className="bg-white px-3 py-1 border-2 border-orange-100 rounded-full text-[10px] font-black text-orange-400 uppercase tracking-widest shadow-sm">
                    Mole Ratio
                  </div>
                  <div className="absolute right-0 w-2 h-2 bg-orange-200 rounded-full" />
                  <div className="absolute left-0 w-2 h-2 bg-orange-200 rounded-full" />
                </motion.div>
              )}

              {/* Instructions & Next Step Button */}
              <div className="mt-auto text-center flex flex-col items-center gap-4">
                <div className="inline-flex items-center gap-3 bg-orange-50 px-6 py-3 rounded-2xl border-2 border-orange-100 text-orange-700 font-bold">
                  <Info size={18} />
                  {step === 0 && "Click the known quantity to calculate its moles"}
                  {step === 1 && "Moles calculated! Now find the ratio to the unknown"}
                  {step === 2 && "Click the unknown moles to find the final quantity"}
                  {step === 3 && "Calculation complete! Click Next for another example"}
                  {step > 3 && "Great job! Try another one."}
                </div>

                {step < 3 && (
                  <button
                    onClick={mode === 'practice' && step > 0 ? checkPracticeAnswer : () => setStep(step + 1)}
                    className={`group flex items-center gap-2 font-black px-8 py-4 rounded-2xl transition-all uppercase tracking-widest shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[4px]
                      ${mode === 'practice' && step > 0 ? 'bg-emerald-500 text-white shadow-[#059669]' : 'bg-emerald-500 text-white shadow-[#059669]'}
                    `}
                  >
                    {mode === 'practice' && step > 0 ? 'Check Answer' : 'Next Step'}
                    <motion.div
                      animate={practiceFeedback === 'correct' ? { scale: [1, 1.2, 1] } : practiceFeedback === 'wrong' ? { x: [-5, 5, -5, 5, 0] } : { x: [0, 5, 0] }}
                      transition={{ repeat: practiceFeedback === 'none' ? Infinity : 0, duration: 0.5 }}
                    >
                      {practiceFeedback === 'correct' ? <CheckCircle2 size={20} /> : 
                       practiceFeedback === 'wrong' ? <XCircle size={20} /> : 
                       <RefreshCw size={20} className="rotate-90" />}
                    </motion.div>
                  </button>
                )}
              </div>
            </div>

            {showCalculator && <VirtualCalculator />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={16} className="text-blue-500" />
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Atomic Masses</p>
                </div>
                <p className="text-xs font-bold text-gray-600">H=1, C=12, N=14, O=16, Na=23, Mg=24, Cl=35.5, Ca=40</p>
              </div>
              <div className="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wind size={16} className="text-emerald-500" />
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Gas Volume</p>
                </div>
                <p className="text-xs font-bold text-gray-600">1 mole of any gas occupies 24 dm³ at RTP.</p>
              </div>
            </div>
          </div>
        </div>
      );
    };


    const equations = [
      {
        id: 'ram',
        name: 'Relative Atomic Mass (RAM)',
        formula: 'RAM = Σ (% abundance × mass number)',
        unit: '',
        variables: [
          { symbol: 'RAM', name: 'Relative Atomic Mass', unit: '' },
          { symbol: '%', name: 'Abundance', unit: '%' },
          { symbol: 'Ar', name: 'Mass Number', unit: '' }
        ]
      },
      {
        id: 'particles',
        name: 'Number of Particles',
        formula: 'N = n × L',
        unit: '',
        variables: [
          { symbol: 'N', name: 'Number of particles', unit: '' },
          { symbol: 'n', name: 'Moles', unit: 'mol' },
          { symbol: 'L', name: "Avogadro's constant", unit: 'mol⁻¹' }
        ]
      },
      {
        id: 'mole_mass',
        name: 'Mole (Mass)',
        formula: 'n = m / M',
        unit: 'mol',
        variables: [
          { symbol: 'n', name: 'Moles', unit: 'mol' },
          { symbol: 'm', name: 'Mass', unit: 'g' },
          { symbol: 'M', name: 'Molar Mass', unit: 'g/mol' }
        ]
      },
      {
        id: 'mole_conc',
        name: 'Mole (Concentration)',
        formula: 'n = C × V',
        unit: 'mol',
        variables: [
          { symbol: 'n', name: 'Moles', unit: 'mol' },
          { symbol: 'C', name: 'Concentration', unit: 'mol/dm³' },
          { symbol: 'V', name: 'Volume', unit: 'dm³' }
        ]
      },
      {
        id: 'mole_gas',
        name: 'Mole (Gas Volume)',
        formula: 'n = V / Vm',
        unit: 'mol',
        variables: [
          { symbol: 'n', name: 'Moles', unit: 'mol' },
          { symbol: 'V', name: 'Gas Volume', unit: 'dm³' },
          { symbol: 'Vm', name: 'Molar Volume', unit: '24 dm³/mol' }
        ]
      },
      {
        id: 'yield',
        name: 'Percentage Yield',
        formula: '% = (Actual / Theoretical) × 100',
        unit: '%',
        variables: [
          { symbol: '%', name: 'Percentage Yield', unit: '%' },
          { symbol: 'Actual', name: 'Actual Yield', unit: 'g' },
          { symbol: 'Theoretical', name: 'Theoretical Yield', unit: 'g' }
        ]
      },
      {
        id: 'enthalpy',
        name: 'Enthalpy Change (ΔH)',
        formula: 'ΔH = Σ(Reactant Bonds) - Σ(Product Bonds)',
        unit: 'kJ/mol',
        variables: [
          { symbol: 'ΔH', name: 'Enthalpy Change', unit: 'kJ/mol' },
          { symbol: 'R', name: 'Reactant Bonds', unit: 'kJ/mol' },
          { symbol: 'P', name: 'Product Bonds', unit: 'kJ/mol' }
        ]
      }
    ];

    const equationRearrangements: Record<string, Record<string, string>> = {
      ram: { 'RAM': 'RAM = % × Ar', '%': '% = RAM / Ar', 'Ar': 'Ar = RAM / %' },
      particles: { 'N': 'N = n × L', 'n': 'n = N / L', 'L': 'L = N / n' },
      mole_mass: { 'n': 'n = m / M', 'm': 'm = n × M', 'M': 'M = m / n' },
      mole_conc: { 'n': 'n = C × V', 'C': 'C = n / V', 'V': 'V = n / C' },
      mole_gas: { 'n': 'n = V / Vm', 'V': 'V = n × Vm', 'Vm': 'Vm = V / n' },
      yield: { '%': '% = (Actual / Theoretical) × 100', 'Actual': 'Actual = (% × Theoretical) / 100', 'Theoretical': 'Theoretical = (Actual / %) × 100' },
      enthalpy: { 'ΔH': 'ΔH = R - P', 'R': 'R = ΔH + P', 'P': 'P = R - ΔH' }
    };

    const chemicals = [
      { 
        name: 'Hydrogen', 
        formula: 'H₂', 
        details: 'The simplest and most abundant chemical substance in the universe.', 
        icon: <Wind size={32} />, 
        color: 'bg-gray-400',
        state: 'gas',
        composition: [{ type: 'H', count: 2, color: 'bg-white border-blue-200 text-blue-500' }],
        lewis: 'H : H'
      },
      { 
        name: 'Chlorine', 
        formula: 'Cl₂', 
        details: 'A yellow-green gas with a choking smell, used to disinfect water.', 
        icon: <Wind size={32} />, 
        color: 'bg-yellow-400',
        state: 'gas',
        composition: [{ type: 'Cl', count: 2, color: 'bg-green-500 text-white' }],
        lewis: '..    ..\n:Cl : Cl:\n ˙˙    ˙˙'
      },
      { 
        name: 'Water', 
        formula: 'H₂O', 
        details: 'A vital compound for all known forms of life.', 
        icon: <Droplets size={32} />, 
        color: 'bg-blue-500',
        state: 'liquid',
        composition: [
          { type: 'H', count: 2, color: 'bg-white border-blue-200 text-blue-500' },
          { type: 'O', count: 1, color: 'bg-red-500 text-white' }
        ],
        lewis: '  .. \nH:O:H\n  ˙˙ '
      },
      { 
        name: 'Methane', 
        formula: 'CH₄', 
        details: 'A potent greenhouse gas and the primary component of natural gas.', 
        icon: <Flame size={32} />, 
        color: 'bg-orange-500',
        state: 'gas',
        composition: [
          { type: 'C', count: 1, color: 'bg-gray-800 text-white' },
          { type: 'H', count: 4, color: 'bg-white border-blue-200 text-blue-500' }
        ],
        lewis: '  H  \n  :  \nH:C:H\n  :  \n  H  '
      },
      { 
        name: 'Ammonia', 
        formula: 'NH₃', 
        details: 'A colorless gas with a characteristic pungent smell, used in fertilizers.', 
        icon: <Atom size={32} />, 
        color: 'bg-purple-500',
        state: 'gas',
        composition: [
          { type: 'N', count: 1, color: 'bg-blue-600 text-white' },
          { type: 'H', count: 3, color: 'bg-white border-blue-200 text-blue-500' }
        ],
        lewis: '  .. \nH:N:H\n  :  \n  H  '
      },
      { 
        name: 'Hydrogen Chloride', 
        formula: 'HCl', 
        details: 'A colorless gas that forms hydrochloric acid when dissolved in water.', 
        icon: <Wind size={32} />, 
        color: 'bg-gray-300',
        state: 'gas',
        composition: [
          { type: 'H', count: 1, color: 'bg-white border-blue-200 text-blue-500' },
          { type: 'Cl', count: 1, color: 'bg-green-500 text-white' }
        ],
        lewis: '    ..\nH : Cl:\n    ˙˙ '
      },
      { 
        name: 'Methanol', 
        formula: 'CH₃OH', 
        details: 'The simplest alcohol, used as a solvent and fuel.', 
        icon: <Droplets size={32} />, 
        color: 'bg-blue-600',
        state: 'liquid',
        composition: [
          { type: 'C', count: 1, color: 'bg-gray-800 text-white' },
          { type: 'H', count: 4, color: 'bg-white border-blue-200 text-blue-500' },
          { type: 'O', count: 1, color: 'bg-red-500 text-white' }
        ],
        lewis: '  H  .. \n  :  :  \nH:C:O:H\n  :  ˙˙ \n  H    '
      },
      { 
        name: 'Ethene', 
        formula: 'C₂H₄', 
        details: 'A hydrocarbon with a double bond, used to make plastics.', 
        icon: <Flame size={32} />, 
        color: 'bg-orange-400',
        state: 'gas',
        composition: [
          { type: 'C', count: 2, color: 'bg-gray-800 text-white' },
          { type: 'H', count: 4, color: 'bg-white border-blue-200 text-blue-500' }
        ],
        lewis: 'H   H\n : : \nC::C\n : : \nH   H'
      },
      { 
        name: 'Oxygen', 
        formula: 'O₂', 
        details: 'Essential for respiration in most living organisms.', 
        icon: <Wind size={32} />, 
        color: 'bg-blue-400',
        state: 'gas',
        composition: [
          { type: 'O', count: 2, color: 'bg-red-500 text-white' }
        ],
        lewis: '..  ..\nO::O\n˙˙  ˙˙'
      },
      { 
        name: 'Carbon Dioxide', 
        formula: 'CO₂', 
        details: 'A greenhouse gas essential for photosynthesis.', 
        icon: <Wind size={32} />, 
        color: 'bg-gray-500',
        state: 'gas',
        composition: [
          { type: 'C', count: 1, color: 'bg-gray-800 text-white' },
          { type: 'O', count: 2, color: 'bg-red-500 text-white' }
        ],
        lewis: '..     ..\nO::C::O\n˙˙     ˙˙'
      },
      { 
        name: 'Nitrogen', 
        formula: 'N₂', 
        details: 'Makes up about 78% of Earth\'s atmosphere.', 
        icon: <Wind size={32} />, 
        color: 'bg-blue-300',
        state: 'gas',
        composition: [
          { type: 'N', count: 2, color: 'bg-blue-600 text-white' }
        ],
        lewis: ':N:::N:'
      }
    ];

    const MolecularAnimation = ({ state, formula, color }: { state: 'gas' | 'liquid' | 'solid', formula: string, color: string }) => {
      const moleculeCount = state === 'gas' ? 6 : 15;
      const molecules = Array.from({ length: moleculeCount });

      return (
        <div className="relative w-full h-48 bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-800">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
          {molecules.map((_, i) => (
            <motion.div
              key={i}
              className={`absolute flex items-center justify-center rounded-full text-[10px] font-bold text-white shadow-lg ${color}`}
              style={{
                width: 32,
                height: 32,
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
              }}
              animate={state === 'gas' ? {
                x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
                rotate: [0, 360],
              } : {
                x: [0, Math.random() * 20 - 10, Math.random() * 20 - 10, 0],
                y: [0, Math.random() * 10 - 5, Math.random() * 10 - 5, 0],
              }}
              transition={{
                duration: state === 'gas' ? 2 + Math.random() * 2 : 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {formula}
            </motion.div>
          ))}
          <div className="absolute bottom-2 right-3">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
              State: {state === 'gas' ? 'Gas (g)' : 'Liquid (l)'}
            </span>
          </div>
        </div>
      );
    };

    const NetIonicPlayground = () => {
      const [exampleIndex, setExampleIndex] = useState(0);
      const [step, setStep] = useState(0); // 0: Molecular, 1: Complete Ionic, 2: Net Ionic
      const [removedIons, setRemovedIons] = useState<string[]>([]);
      const [practiceMode, setPracticeMode] = useState(false);
      const [practiceQuestion, setPracticeQuestion] = useState<any>(null);
      const [practiceAnswer, setPracticeAnswer] = useState<string[]>([]);
      const [practiceFeedback, setPracticeFeedback] = useState<string | null>(null);

      const examples = [
        {
          name: "Silver Nitrate + Potassium Chloride",
          molecular: {
            reactants: ["AgNO3(aq)", "KCl(aq)"],
            products: ["AgCl(s)", "KNO3(aq)"]
          },
          ionic: {
            reactants: ["Ag+(aq)", "NO3-(aq)", "K+(aq)", "Cl-(aq)"],
            products: ["AgCl(s)", "K+(aq)", "NO3-(aq)"]
          },
          spectators: ["K+(aq)", "NO3-(aq)"],
          net: {
            reactants: ["Ag+(aq)", "Cl-(aq)"],
            products: ["AgCl(s)"]
          }
        },
        {
          name: "Barium Nitrate + Sodium Sulfate",
          molecular: {
            reactants: ["Ba(NO3)2(aq)", "Na2SO4(aq)"],
            products: ["BaSO4(s)", "2NaNO3(aq)"]
          },
          ionic: {
            reactants: ["Ba2+(aq)", "2NO3-(aq)", "2Na+(aq)", "SO42-(aq)"],
            products: ["BaSO4(s)", "2Na+(aq)", "2NO3-(aq)"]
          },
          spectators: ["2Na+(aq)", "2NO3-(aq)"],
          net: {
            reactants: ["Ba2+(aq)", "SO42-(aq)"],
            products: ["BaSO4(s)"]
          }
        },
        {
          name: "Lead(II) Nitrate + Potassium Iodide",
          molecular: {
            reactants: ["Pb(NO3)2(aq)", "2KI(aq)"],
            products: ["PbI2(s)", "2KNO3(aq)"]
          },
          ionic: {
            reactants: ["Pb2+(aq)", "2NO3-(aq)", "2K+(aq)", "2I-(aq)"],
            products: ["PbI2(s)", "2K+(aq)", "2NO3-(aq)"]
          },
          spectators: ["2K+(aq)", "2NO3-(aq)"],
          net: {
            reactants: ["Pb2+(aq)", "2I-(aq)"],
            products: ["PbI2(s)"]
          }
        },
        {
          name: "Calcium Chloride + Sodium Carbonate",
          molecular: {
            reactants: ["CaCl2(aq)", "Na2CO3(aq)"],
            products: ["CaCO3(s)", "2NaCl(aq)"]
          },
          ionic: {
            reactants: ["Ca2+(aq)", "2Cl-(aq)", "2Na+(aq)", "CO32-(aq)"],
            products: ["CaCO3(s)", "2Na+(aq)", "2Cl-(aq)"]
          },
          spectators: ["2Na+(aq)", "2Cl-(aq)"],
          net: {
            reactants: ["Ca2+(aq)", "CO32-(aq)"],
            products: ["CaCO3(s)"]
          }
        }
      ];

      const current = examples[exampleIndex];

      const generatePractice = () => {
        const ex = examples[Math.floor(Math.random() * examples.length)];
        setPracticeQuestion(ex);
        setPracticeAnswer([]);
        setPracticeFeedback(null);
        setPracticeMode(true);
      };

      const togglePracticeIon = (ion: string) => {
        if (practiceAnswer.includes(ion)) {
          setPracticeAnswer(practiceAnswer.filter(i => i !== ion));
        } else {
          setPracticeAnswer([...practiceAnswer, ion]);
        }
      };

      const checkPractice = () => {
        const correctSpectators = practiceQuestion.spectators;
        const isCorrect = practiceAnswer.length === correctSpectators.length && 
                          practiceAnswer.every(ion => correctSpectators.includes(ion));
        
        setPracticeFeedback(isCorrect ? 'correct' : 'incorrect');
      };

      const renderEquation = (parts: string[], isRed?: (p: string) => boolean) => (
        <div className="flex flex-wrap items-center justify-center gap-2 text-lg font-bold">
          {parts.map((p, i) => (
            <React.Fragment key={i}>
              <span 
                className={isRed?.(p) ? 'text-rose-500' : 'text-blue-600'}
                dangerouslySetInnerHTML={{ __html: p.replace(/(\d+[\+\-])/g, '<sup>$1</sup>').replace(/([\+\-])/g, '<sup>$1</sup>').replace(/(\d+)/g, '<sub>$1</sub>') }}
              />
              {i < parts.length - 1 && <span className="text-gray-400">+</span>}
            </React.Fragment>
          ))}
        </div>
      );

      return (
        <div className="space-y-8">
          {!practiceMode ? (
            <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Net Ionic Explorer</h3>
                  <p className="text-blue-500 font-black text-xl uppercase tracking-widest text-xs">Step-by-Step Dissociation</p>
                </div>
                <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl">
                  <Droplets size={32} />
                </div>
              </div>

              <div className="space-y-12">
                {/* Example Selector */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {examples.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => { setExampleIndex(i); setStep(0); setRemovedIons([]); }}
                      className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all border-2 ${exampleIndex === i ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'}`}
                    >
                      {ex.name}
                    </button>
                  ))}
                </div>

                {/* Equation Display */}
                <div className="bg-gray-50 p-8 rounded-3xl border-2 border-gray-100 space-y-6 text-center">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                      {step === 0 ? "Molecular Equation" : step === 1 ? "Complete Ionic Equation" : "Net Ionic Equation"}
                    </p>
                    
                    <div className="space-y-4">
                      {/* Reactants */}
                      {step === 0 ? renderEquation(current.molecular.reactants) : 
                       step === 1 ? renderEquation(current.ionic.reactants) : 
                       renderEquation(current.net.reactants)}

                      <div className="flex justify-center">
                        <ArrowDown className="text-gray-300" size={32} />
                      </div>

                      {/* Products */}
                      {step === 0 ? renderEquation(current.molecular.products, p => p.includes('(s)')) : 
                       step === 1 ? renderEquation(current.ionic.products, p => p.includes('(s)')) : 
                       renderEquation(current.net.products, p => p.includes('(s)'))}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-6">
                  <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 w-full text-center">
                    <p className="text-blue-700 font-bold text-sm">
                      {step === 0 && "Soluble salts (aq) dissociate into ions in water. Insoluble salts (s) stay together."}
                      {step === 1 && "Spectator ions appear on both sides of the equation. They don't participate in the reaction."}
                      {step === 2 && "The net ionic equation shows only the species that change state."}
                    </p>
                  </div>

                  <div className="flex gap-4 w-full">
                    {step < 2 && (
                      <button
                        onClick={() => setStep(step + 1)}
                        className="flex-1 bg-blue-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#1d4ed8] hover:shadow-none hover:translate-y-1 transition-all"
                      >
                        {step === 0 ? "Dissociate Ions" : "Remove Spectators"}
                      </button>
                    )}
                    {step > 0 && (
                      <button
                        onClick={() => setStep(0)}
                        className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <button
                    onClick={generatePractice}
                    className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#059669] hover:shadow-none hover:translate-y-1 transition-all flex items-center justify-center gap-3"
                  >
                    <Zap size={24} />
                    Practice Mode
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Practice Challenge</h3>
                  <p className="text-emerald-500 font-black text-xl uppercase tracking-widest text-xs">Identify Spectator Ions</p>
                </div>
                <button onClick={() => setPracticeMode(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle size={32} />
                </button>
              </div>

              <div className="space-y-8">
                <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100 text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Complete Ionic Equation</p>
                  <div className="space-y-4">
                    {renderEquation(practiceQuestion.ionic.reactants)}
                    <div className="flex justify-center"><ArrowDown className="text-gray-300" size={24} /></div>
                    {renderEquation(practiceQuestion.ionic.products, p => p.includes('(s)'))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-center font-black text-gray-700 uppercase text-sm">Select the Spectator Ions:</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {Array.from(new Set([...practiceQuestion.ionic.reactants, ...practiceQuestion.ionic.products])).map((ion, i) => (
                      <button
                        key={i}
                        onClick={() => togglePracticeIon(ion)}
                        disabled={practiceFeedback !== null}
                        className={`px-4 py-3 rounded-xl font-bold border-2 transition-all ${practiceAnswer.includes(ion) ? 'bg-emerald-500 text-white border-emerald-600 shadow-[0_4px_0_0_#059669]' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`}
                        dangerouslySetInnerHTML={{ __html: ion.replace(/(\d+)/g, '<sub>$1</sub>').replace(/(\^[\+\-\d]+)/g, (m) => `<sup>${m.slice(1)}</sup>`) }}
                      />
                    ))}
                  </div>
                </div>

                {practiceFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl text-center font-bold ${practiceFeedback === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {practiceFeedback === 'correct' ? "Correct! Spectator ions appear unchanged on both sides." : "Not quite. Spectator ions are the ones that are exactly the same on both sides."}
                  </motion.div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={checkPractice}
                    disabled={practiceAnswer.length === 0 || practiceFeedback !== null}
                    className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#059669] disabled:opacity-50 transition-all"
                  >
                    Check Answer
                  </button>
                  <button
                    onClick={generatePractice}
                    className="flex-1 bg-white border-2 border-gray-200 text-gray-500 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                  >
                    Next Challenge
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

    const SimulationPlayground = () => {
      const [selectedSim, setSelectedSim] = useState<string | null>(null);
      
      // Diffusion State
      const [redLeft, setRedLeft] = useState(20);
      const [blueLeft, setBlueLeft] = useState(5);
      const [redRight, setRedRight] = useState(5);
      const [blueRight, setBlueRight] = useState(20);
      const [isPartitionRemoved, setIsPartitionRemoved] = useState(false);
      const [particles, setParticles] = useState<any[]>([]);
      const [diffusionTemp, setDiffusionTemp] = useState(25);
      const [diffusionPractice, setDiffusionPractice] = useState<any>(null);
      const [diffusionAnswer, setDiffusionAnswer] = useState<string | null>(null);
      const [diffusionFeedback, setDiffusionFeedback] = useState<string | null>(null);
      
      // AXZ State
      const [axzProtons, setAxzProtons] = useState(6);
      const [axzNeutrons, setAxzNeutrons] = useState(6);
      const [axzElectrons, setAxzElectrons] = useState(6);
      const [axzPractice, setAxzPractice] = useState<any>(null);
      const [axzAnswer, setAxzAnswer] = useState<any>({ p: '', n: '', e: '' });
      const [axzFeedback, setAxzFeedback] = useState<string | null>(null);

      const simRef = useRef<HTMLDivElement>(null);

      // Shells State
      const [shellZ, setShellZ] = useState(1);
      const [shellPractice, setShellPractice] = useState<any>(null);
      const [shellAnswer, setShellAnswer] = useState('');
      const [shellFeedback, setShellFeedback] = useState<string | null>(null);

      // Balancing Equations State
      const [balancingIndex, setBalancingIndex] = useState(0);
      const [coefficients, setCoefficients] = useState<number[]>([]);
      const [isBalanced, setIsBalanced] = useState(false);

      const equations = [
        { reactants: [{ s: 'H2', atoms: { H: 2 } }, { s: 'O2', atoms: { O: 2 } }], products: [{ s: 'H2O', atoms: { H: 2, O: 1 } }] },
        { reactants: [{ s: 'N2', atoms: { N: 2 } }, { s: 'H2', atoms: { H: 2 } }], products: [{ s: 'NH3', atoms: { N: 1, H: 3 } }] },
        { reactants: [{ s: 'CH4', atoms: { C: 1, H: 4 } }, { s: 'O2', atoms: { O: 2 } }], products: [{ s: 'CO2', atoms: { C: 1, O: 2 } }, { s: 'H2O', atoms: { H: 2, O: 1 } }] },
        { reactants: [{ s: 'Mg', atoms: { Mg: 1 } }, { s: 'O2', atoms: { O: 2 } }], products: [{ s: 'MgO', atoms: { Mg: 1, O: 1 } }] },
        { reactants: [{ s: 'Al', atoms: { Al: 1 } }, { s: 'O2', atoms: { O: 2 } }], products: [{ s: 'Al2O3', atoms: { Al: 2, O: 3 } }] },
        { reactants: [{ s: 'Na', atoms: { Na: 1 } }, { s: 'Cl2', atoms: { Cl: 2 } }], products: [{ s: 'NaCl', atoms: { Na: 1, Cl: 1 } }] },
        { reactants: [{ s: 'Fe', atoms: { Fe: 1 } }, { s: 'O2', atoms: { O: 2 } }], products: [{ s: 'Fe2O3', atoms: { Fe: 2, O: 3 } }] },
        { reactants: [{ s: 'H2', atoms: { H: 2 } }, { s: 'Cl2', atoms: { Cl: 2 } }], products: [{ s: 'HCl', atoms: { H: 1, Cl: 1 } }] },
        { reactants: [{ s: 'P', atoms: { P: 1 } }, { s: 'O2', atoms: { O: 2 } }], products: [{ s: 'P4O10', atoms: { P: 4, O: 10 } }] },
        { reactants: [{ s: 'KClO3', atoms: { K: 1, Cl: 1, O: 3 } }], products: [{ s: 'KCl', atoms: { K: 1, Cl: 1 } }, { s: 'O2', atoms: { O: 2 } }] },
        { reactants: [{ s: 'C3H8', atoms: { C: 3, H: 8 } }, { s: 'O2', atoms: { O: 2 } }], products: [{ s: 'CO2', atoms: { C: 1, O: 2 } }, { s: 'H2O', atoms: { H: 2, O: 1 } }] },
        { reactants: [{ s: 'C2H6', atoms: { C: 2, H: 6 } }, { s: 'O2', atoms: { O: 2 } }], products: [{ s: 'CO2', atoms: { C: 1, O: 2 } }, { s: 'H2O', atoms: { H: 2, O: 1 } }] },
        { reactants: [{ s: 'Cu', atoms: { Cu: 1 } }, { s: 'AgNO3', atoms: { Ag: 1, N: 1, O: 3 } }], products: [{ s: 'Cu(NO3)2', atoms: { Cu: 1, N: 2, O: 6 } }, { s: 'Ag', atoms: { Ag: 1 } }] },
        { reactants: [{ s: 'Zn', atoms: { Zn: 1 } }, { s: 'HCl', atoms: { H: 1, Cl: 1 } }], products: [{ s: 'ZnCl2', atoms: { Zn: 1, Cl: 2 } }, { s: 'H2', atoms: { H: 2 } }] },
        { reactants: [{ s: 'NaOH', atoms: { Na: 1, O: 1, H: 1 } }, { s: 'H2SO4', atoms: { H: 2, S: 1, O: 4 } }], products: [{ s: 'Na2SO4', atoms: { Na: 2, S: 1, O: 4 } }, { s: 'H2O', atoms: { H: 2, O: 1 } }] },
        { reactants: [{ s: 'CaCO3', atoms: { Ca: 1, C: 1, O: 3 } }, { s: 'HCl', atoms: { H: 1, Cl: 1 } }], products: [{ s: 'CaCl2', atoms: { Ca: 1, Cl: 2 } }, { s: 'CO2', atoms: { C: 1, O: 2 } }, { s: 'H2O', atoms: { H: 2, O: 1 } }] },
        { reactants: [{ s: 'Pb(NO3)2', atoms: { Pb: 1, N: 2, O: 6 } }, { s: 'KI', atoms: { K: 1, I: 1 } }], products: [{ s: 'PbI2', atoms: { Pb: 1, I: 2 } }, { s: 'KNO3', atoms: { K: 1, N: 1, O: 3 } }] },
        { reactants: [{ s: 'Al', atoms: { Al: 1 } }, { s: 'HCl', atoms: { H: 1, Cl: 1 } }], products: [{ s: 'AlCl3', atoms: { Al: 1, Cl: 3 } }, { s: 'H2', atoms: { H: 2 } }] },
        { reactants: [{ s: 'C2H4', atoms: { C: 2, H: 4 } }, { s: 'O2', atoms: { O: 2 } }], products: [{ s: 'CO2', atoms: { C: 1, O: 2 } }, { s: 'H2O', atoms: { H: 2, O: 1 } }] },
        { reactants: [{ s: 'Fe', atoms: { Fe: 1 } }, { s: 'H2O', atoms: { H: 2, O: 1 } }], products: [{ s: 'Fe3O4', atoms: { Fe: 3, O: 4 } }, { s: 'H2', atoms: { H: 2 } }] },
      ];

      useEffect(() => {
        if (selectedSim === 'balancing') {
          const eq = equations[balancingIndex];
          setCoefficients(new Array(eq.reactants.length + eq.products.length).fill(1));
        }
      }, [selectedSim, balancingIndex]);

      const getAtomCounts = () => {
        if (!selectedSim || selectedSim !== 'balancing' || !coefficients.length) return { reactantAtoms: {}, productAtoms: {} };
        const eq = equations[balancingIndex];
        const reactantAtoms: any = {};
        const productAtoms: any = {};

        eq.reactants.forEach((r, i) => {
          const coeff = coefficients[i] || 1;
          Object.entries(r.atoms).forEach(([atom, count]) => {
            reactantAtoms[atom] = (reactantAtoms[atom] || 0) + (count as number) * coeff;
          });
        });

        eq.products.forEach((p, i) => {
          const coeff = coefficients[eq.reactants.length + i] || 1;
          Object.entries(p.atoms).forEach(([atom, count]) => {
            productAtoms[atom] = (productAtoms[atom] || 0) + (count as number) * coeff;
          });
        });

        return { reactantAtoms, productAtoms };
      };

      const checkBalancing = () => {
        const { reactantAtoms, productAtoms } = getAtomCounts();
        const atoms = Array.from(new Set([...Object.keys(reactantAtoms), ...Object.keys(productAtoms)]));
        const balanced = atoms.length > 0 && atoms.every(atom => reactantAtoms[atom] === productAtoms[atom]);
        setIsBalanced(balanced);
      };

      useEffect(() => {
        if (selectedSim === 'balancing') {
          checkBalancing();
        }
      }, [coefficients]);

      // States of Matter State
      const [matterTemp, setMatterTemp] = useState(25);
      const [selectedMatter, setSelectedMatter] = useState('Water');
      const [matterPractice, setMatterPractice] = useState<any>(null);
      const [matterAnswer, setMatterAnswer] = useState('');
      const [matterFeedback, setMatterFeedback] = useState<string | null>(null);

      const chemicals = [
        { name: 'Water', mp: 0, bp: 100, color: 'text-blue-400', bg: 'bg-blue-400' },
        { name: 'Ethanol', mp: -114, bp: 78, color: 'text-orange-400', bg: 'bg-orange-400' },
        { name: 'Iron', mp: 1538, bp: 2862, color: 'text-gray-400', bg: 'bg-gray-400' },
        { name: 'Oxygen', mp: -218, bp: -183, color: 'text-sky-300', bg: 'bg-sky-300' },
        { name: 'Mercury', mp: -39, bp: 357, color: 'text-slate-300', bg: 'bg-slate-300' },
        { name: 'Ammonia', mp: -78, bp: -33, color: 'text-emerald-300', bg: 'bg-emerald-300' },
      ];

      const getMatterState = (temp: number, chemical: any) => {
        if (temp <= chemical.mp) return 'Solid';
        if (temp >= chemical.bp) return 'Gas';
        return 'Liquid';
      };

      const generateMatterPractice = () => {
        const chem = chemicals[Math.floor(Math.random() * chemicals.length)];
        const states = ['Solid', 'Liquid', 'Gas'];
        const targetState = states[Math.floor(Math.random() * states.length)];
        
        let temp = 0;
        if (targetState === 'Solid') {
          temp = chem.mp - Math.floor(Math.random() * 50) - 10;
        } else if (targetState === 'Gas') {
          temp = chem.bp + Math.floor(Math.random() * 50) + 10;
        } else {
          temp = Math.floor((chem.mp + chem.bp) / 2);
        }

        setMatterPractice({ chem, temp, targetState });
        setMatterAnswer('');
        setMatterFeedback(null);
      };

      const elements = [
        { z: 1, symbol: 'H', name: 'Hydrogen', mass: 1, shells: [1] },
        { z: 2, symbol: 'He', name: 'Helium', mass: 4, shells: [2] },
        { z: 3, symbol: 'Li', name: 'Lithium', mass: 7, shells: [2, 1] },
        { z: 4, symbol: 'Be', name: 'Beryllium', mass: 9, shells: [2, 2] },
        { z: 5, symbol: 'B', name: 'Boron', mass: 11, shells: [2, 3] },
        { z: 6, symbol: 'C', name: 'Carbon', mass: 12, shells: [2, 4] },
        { z: 7, symbol: 'N', name: 'Nitrogen', mass: 14, shells: [2, 5] },
        { z: 8, symbol: 'O', name: 'Oxygen', mass: 16, shells: [2, 6] },
        { z: 9, symbol: 'F', name: 'Fluorine', mass: 19, shells: [2, 7] },
        { z: 10, symbol: 'Ne', name: 'Neon', mass: 20, shells: [2, 8] },
        { z: 11, symbol: 'Na', name: 'Sodium', mass: 23, shells: [2, 8, 1] },
        { z: 12, symbol: 'Mg', name: 'Magnesium', mass: 24, shells: [2, 8, 2] },
        { z: 13, symbol: 'Al', name: 'Aluminium', mass: 27, shells: [2, 8, 3] },
        { z: 14, symbol: 'Si', name: 'Silicon', mass: 28, shells: [2, 8, 4] },
        { z: 15, symbol: 'P', name: 'Phosphorus', mass: 31, shells: [2, 8, 5] },
        { z: 16, symbol: 'S', name: 'Sulfur', mass: 32, shells: [2, 8, 6] },
        { z: 17, symbol: 'Cl', name: 'Chlorine', mass: 35, shells: [2, 8, 7] },
        { z: 18, symbol: 'Ar', name: 'Argon', mass: 40, shells: [2, 8, 8] },
        { z: 19, symbol: 'K', name: 'Potassium', mass: 39, shells: [2, 8, 8, 1] },
        { z: 20, symbol: 'Ca', name: 'Calcium', mass: 40, shells: [2, 8, 8, 2] },
      ];

      const getElementByZ = (z: number) => elements.find(e => e.z === z) || elements[0];

      const generateAxzPractice = () => {
        const el = elements[Math.floor(Math.random() * elements.length)];
        let charge = 0;
        const rand = Math.random();
        if (rand < 0.3 && [1, 3, 11, 12, 13, 19, 20].includes(el.z)) {
          // Cation
          charge = el.z <= 3 || el.z === 11 || el.z === 19 ? 1 : (el.z === 12 || el.z === 20 ? 2 : 3);
        } else if (rand < 0.6 && [7, 8, 9, 15, 16, 17].includes(el.z)) {
          // Anion
          charge = el.z === 9 || el.z === 17 ? -1 : (el.z === 8 || el.z === 16 ? -2 : -3);
        }
        
        setAxzPractice({
          ...el,
          charge,
          p: el.z,
          n: el.mass - el.z,
          e: el.z - charge
        });
        setAxzAnswer({ p: '', n: '', e: '' });
        setAxzFeedback(null);
      };

      const checkAxzPractice = () => {
        if (parseInt(axzAnswer.p) === axzPractice.p && 
            parseInt(axzAnswer.n) === axzPractice.n && 
            parseInt(axzAnswer.e) === axzPractice.e) {
          setAxzFeedback('correct');
        } else {
          setAxzFeedback('incorrect');
        }
      };

      const generateShellPractice = () => {
        const el = elements[Math.floor(Math.random() * elements.length)];
        setShellPractice(el);
        setShellAnswer('');
        setShellFeedback(null);
      };

      const checkShellPractice = () => {
        if (shellAnswer.replace(/\s/g, '') === shellPractice.shells.join(',')) {
          setShellFeedback('correct');
        } else {
          setShellFeedback('incorrect');
        }
      };

      const generateDiffusionPractice = () => {
        const types = ['red', 'blue'];
        const type = types[Math.floor(Math.random() * types.length)];
        const l = Math.floor(Math.random() * 40) + 5;
        const r = Math.floor(Math.random() * 40) + 5;
        
        let correctAnswer = '';
        if (l > r + 5) correctAnswer = 'Left to Right';
        else if (r > l + 5) correctAnswer = 'Right to Left';
        else correctAnswer = 'No Net Movement';

        setDiffusionPractice({
          type,
          l,
          r,
          correctAnswer,
          options: ['Left to Right', 'Right to Left', 'No Net Movement']
        });
        setDiffusionAnswer(null);
        setDiffusionFeedback(null);
        
        // Set the simulation to match the practice question
        if (type === 'red') {
          setRedLeft(l);
          setRedRight(r);
          setBlueLeft(10);
          setBlueRight(10);
        } else {
          setBlueLeft(l);
          setBlueRight(r);
          setRedLeft(10);
          setRedRight(10);
        }
        setIsPartitionRemoved(false);
      };

      const checkDiffusionPractice = () => {
        if (diffusionAnswer === diffusionPractice.correctAnswer) {
          setDiffusionFeedback('correct');
        } else {
          setDiffusionFeedback('incorrect');
        }
      };

      const initParticles = () => {
        const newParticles = [];
        // Left side
        for (let i = 0; i < redLeft; i++) newParticles.push({ id: `rl-${i}`, type: 'red', x: Math.random() * 45, y: Math.random() * 90, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2 });
        for (let i = 0; i < blueLeft; i++) newParticles.push({ id: `bl-${i}`, type: 'blue', x: Math.random() * 45, y: Math.random() * 90, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2 });
        // Right side
        for (let i = 0; i < redRight; i++) newParticles.push({ id: `rr-${i}`, type: 'red', x: 55 + Math.random() * 40, y: Math.random() * 90, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2 });
        for (let i = 0; i < blueRight; i++) newParticles.push({ id: `br-${i}`, type: 'blue', x: 55 + Math.random() * 40, y: Math.random() * 90, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2 });
        setParticles(newParticles);
      };

      useEffect(() => {
        if (selectedSim === 'diffusion') initParticles();
      }, [selectedSim, redLeft, blueLeft, redRight, blueRight]);

      useEffect(() => {
        if (!isPartitionRemoved || selectedSim !== 'diffusion') return;

        const interval = setInterval(() => {
          const speedFactor = (diffusionTemp + 273) / 298; // Simple speed scaling based on Kelvin
          setParticles(prev => prev.map(p => {
            let nx = p.x + p.vx * speedFactor;
            let ny = p.y + p.vy * speedFactor;
            let nvx = p.vx;
            let nvy = p.vy;

            if (nx < 0 || nx > 98) nvx *= -1;
            if (ny < 0 || ny > 98) nvy *= -1;

            return { ...p, x: nx, y: ny, vx: nvx, vy: nvy };
          }));
        }, 30);

        return () => clearInterval(interval);
      }, [isPartitionRemoved, selectedSim]);

      const counts = useMemo(() => {
        const left = particles.filter(p => p.x < 50);
        const right = particles.filter(p => p.x >= 50);
        return {
          leftRed: left.filter(p => p.type === 'red').length,
          leftBlue: left.filter(p => p.type === 'blue').length,
          rightRed: right.filter(p => p.type === 'red').length,
          rightBlue: right.filter(p => p.type === 'blue').length,
        };
      }, [particles]);

      const netDiffusion = useMemo(() => {
        if (!isPartitionRemoved) return null;
        const redDiff = counts.leftRed - counts.rightRed;
        const blueDiff = counts.leftBlue - counts.rightBlue;
        
        if (Math.abs(redDiff) < 2 && Math.abs(blueDiff) < 2) return 'equilibrium';
        
        let msg = '';
        if (Math.abs(redDiff) >= 2) msg += `Red diffusing ${redDiff > 0 ? 'Right' : 'Left'}. `;
        if (Math.abs(blueDiff) >= 2) msg += `Blue diffusing ${blueDiff > 0 ? 'Right' : 'Left'}.`;
        return msg;
      }, [counts, isPartitionRemoved]);

      return (
        <div className="space-y-8">
          {!selectedSim ? (
            <div className="grid grid-cols-1 gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSim('axz')}
                className="bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-blue-400 transition-all group"
              >
                <div className="bg-blue-100 text-blue-600 p-5 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Atom size={40} />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">AXZ Notation</h3>
                  <p className="text-gray-500 font-medium">Learn about Mass Number, Atomic Number and Charge.</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSim('shells')}
                className="bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-emerald-400 transition-all group"
              >
                <div className="bg-emerald-100 text-emerald-600 p-5 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Zap size={40} />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Electron Shells</h3>
                  <p className="text-gray-500 font-medium">Visualize electronic arrangements up to Calcium (Z=20).</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSim('matter')}
                className="bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-sky-400 transition-all group"
              >
                <div className="bg-sky-100 text-sky-600 p-5 rounded-2xl group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <Thermometer size={40} />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">States of Matter</h3>
                  <p className="text-gray-500 font-medium">Explore how temperature affects particle arrangements.</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSim('diffusion')}
                className="bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-orange-400 transition-all group"
              >
                <div className="bg-orange-100 text-orange-600 p-5 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <ArrowRightLeft size={40} />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Diffusion Chamber</h3>
                  <p className="text-gray-500 font-medium">Visualize net movement of particles across a gradient.</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSim('balancing')}
                className="bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-violet-400 transition-all group"
              >
                <div className="bg-violet-100 text-violet-600 p-5 rounded-2xl group-hover:bg-violet-500 group-hover:text-white transition-colors">
                  <Calculator size={40} />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Balancing Equations</h3>
                  <p className="text-gray-500 font-medium">Master the law of conservation of mass through balancing.</p>
                </div>
              </motion.button>


            </div>
          ) : (
            <div className="space-y-6">
              {selectedSim === 'axz' && (
                <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">AXZ Notation</h3>
                      <p className="text-blue-500 font-black text-xl uppercase tracking-widest text-xs">Atomic Structure & Isotopes</p>
                    </div>
                    <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl">
                      <Atom size={32} />
                    </div>
                  </div>

                  <div className="space-y-8 mb-8">
                    <div className="flex flex-col items-center gap-8">
                      <div className="bg-gray-50 p-10 rounded-3xl border-2 border-gray-100 flex items-center justify-center w-full">
                        <div className="relative text-8xl font-black text-gray-800 flex items-center">
                          <div className="flex flex-col text-4xl mr-3 text-right">
                            <span className="leading-none text-gray-400">{axzProtons + axzNeutrons}</span>
                            <span className="leading-none text-blue-500">{axzProtons}</span>
                          </div>
                          <span className="leading-none">{getElementByZ(axzProtons).symbol}</span>
                          {axzProtons !== axzElectrons && (
                            <span className="text-4xl align-top ml-2 leading-none text-orange-500 font-black">
                              {Math.abs(axzProtons - axzElectrons) === 1 ? '' : Math.abs(axzProtons - axzElectrons)}{axzProtons > axzElectrons ? '+' : '-'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-100 space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-black text-red-600 uppercase tracking-widest">Protons (Z)</label>
                            <span className="text-xl font-black text-red-600">{axzProtons}</span>
                          </div>
                          <input type="range" min="1" max="20" value={axzProtons} onChange={e => setAxzProtons(parseInt(e.target.value))} className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-500" />
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-black text-gray-600 uppercase tracking-widest">Neutrons</label>
                            <span className="text-xl font-black text-gray-600">{axzNeutrons}</span>
                          </div>
                          <input type="range" min="0" max="25" value={axzNeutrons} onChange={e => setAxzNeutrons(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-500" />
                        </div>
                        <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100 space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-black text-blue-600 uppercase tracking-widest">Electrons</label>
                            <span className="text-xl font-black text-blue-600">{axzElectrons}</span>
                          </div>
                          <input type="range" min="0" max="20" value={axzElectrons} onChange={e => setAxzElectrons(parseInt(e.target.value))} className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t-2 border-gray-100">
                    <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest">Practice Mode</h4>
                        {axzPractice && (
                          <button onClick={() => setAxzPractice(null)} className="text-blue-400 hover:text-blue-600 font-bold text-xs uppercase">Close</button>
                        )}
                      </div>
                      {!axzPractice ? (
                        <button onClick={generateAxzPractice} className="w-full bg-blue-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#1d4ed8] hover:shadow-none hover:translate-y-1 transition-all">
                          Start Practice Challenge
                        </button>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                          <div className="text-center p-6 bg-white rounded-2xl border-2 border-blue-200">
                            <div className="relative text-5xl font-black text-gray-800 inline-flex items-center">
                              <div className="flex flex-col text-2xl mr-1 text-right">
                                <span className="leading-none">{axzPractice.mass}</span>
                                <span className="leading-none">{axzPractice.z}</span>
                              </div>
                              <span className="leading-none">{axzPractice.symbol}</span>
                              {axzPractice.charge !== 0 && (
                                <span className="text-2xl align-top ml-1 leading-none">
                                  {Math.abs(axzPractice.charge) === 1 ? '' : Math.abs(axzPractice.charge)}{axzPractice.charge > 0 ? '+' : '-'}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase text-center">Protons</label>
                                <input type="number" placeholder="P" value={axzAnswer.p} onChange={e => setAxzAnswer({...axzAnswer, p: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-xl text-center font-black text-xl focus:border-blue-500 outline-none transition-colors" />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase text-center">Neutrons</label>
                                <input type="number" placeholder="N" value={axzAnswer.n} onChange={e => setAxzAnswer({...axzAnswer, n: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-xl text-center font-black text-xl focus:border-blue-500 outline-none transition-colors" />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase text-center">Electrons</label>
                                <input type="number" placeholder="E" value={axzAnswer.e} onChange={e => setAxzAnswer({...axzAnswer, e: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-xl text-center font-black text-xl focus:border-blue-500 outline-none transition-colors" />
                              </div>
                            </div>
                            <button onClick={checkAxzPractice} className="w-full bg-blue-500 text-white py-3 rounded-xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#1d4ed8] active:shadow-none active:translate-y-1 transition-all">
                              Check Answer
                            </button>
                            {axzFeedback && (
                              <div className={`p-3 rounded-xl text-center font-bold ${axzFeedback === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {axzFeedback === 'correct' ? 'Correct! Well done.' : 'Try again! Check your math.'}
                              </div>
                            )}
                            <button onClick={generateAxzPractice} className="w-full text-blue-500 font-bold uppercase text-xs hover:underline">Next Question</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button onClick={() => setSelectedSim(null)} className="w-full bg-gray-200 text-gray-500 py-4 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-gray-300 transition-all">
                    Back to Selection
                  </button>
                </div>
              )}

              {selectedSim === 'shells' && (
                <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Electron Shells</h3>
                      <p className="text-emerald-500 font-black text-xl uppercase tracking-widest text-xs">Atomic Structure & Periodic Trends</p>
                    </div>
                    <div className="bg-emerald-100 text-emerald-600 p-4 rounded-2xl">
                      <Zap size={32} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Panel: Controls & Periodic Table */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="bg-gray-50 p-6 rounded-3xl border-2 border-gray-100 shadow-inner">
                        <div className="flex justify-between items-end mb-6">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Current Element</p>
                            <h4 className="text-3xl font-black text-gray-800 uppercase tracking-tight">
                              {getElementByZ(shellZ).name}
                            </h4>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Arrangement</p>
                            <p className="text-xl font-black text-emerald-600 tracking-widest">
                              {getElementByZ(shellZ).shells.join(', ')}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-white p-5 rounded-2xl border-2 border-gray-200">
                            <div className="flex justify-between items-center mb-3">
                              <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Atomic Number (Z)</label>
                              <span className="text-3xl font-black text-emerald-600">{shellZ}</span>
                            </div>
                            <input 
                              type="range" 
                              min="1" 
                              max="20" 
                              value={shellZ} 
                              onChange={e => setShellZ(parseInt(e.target.value))} 
                              className="w-full h-3 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                            />
                          </div>

                          {/* Mini Periodic Table */}
                          <div className="bg-white p-4 rounded-2xl border-2 border-gray-200">
                            <div className="grid grid-cols-8 gap-1">
                              {(() => {
                                const pt = [
                                  [ { z: 1, s: 'H' }, null, null, null, null, null, null, { z: 2, s: 'He' } ],
                                  [ { z: 3, s: 'Li' }, { z: 4, s: 'Be' }, { z: 5, s: 'B' }, { z: 6, s: 'C' }, { z: 7, s: 'N' }, { z: 8, s: 'O' }, { z: 9, s: 'F' }, { z: 10, s: 'Ne' } ],
                                  [ { z: 11, s: 'Na' }, { z: 12, s: 'Mg' }, { z: 13, s: 'Al' }, { z: 14, s: 'Si' }, { z: 15, s: 'P' }, { z: 16, s: 'S' }, { z: 17, s: 'Cl' }, { z: 18, s: 'Ar' } ],
                                  [ { z: 19, s: 'K' }, { z: 20, s: 'Ca' }, null, null, null, null, null, null ]
                                ];
                                return pt.map((row, rIdx) => (
                                  row.map((el, cIdx) => (
                                    <div 
                                      key={`${rIdx}-${cIdx}`}
                                      className={`aspect-square flex flex-col items-center justify-center rounded-md text-[9px] font-black transition-all border ${
                                        !el ? 'opacity-0' : 
                                        el.z === shellZ ? 'bg-emerald-500 text-white border-emerald-600 scale-105 z-10 shadow-md' : 
                                        'bg-gray-50 text-gray-400 border-gray-200'
                                      }`}
                                    >
                                      {el && (
                                        <>
                                          <span className="text-[7px] opacity-60 leading-none">{el.z}</span>
                                          <span className="leading-none">{el.s}</span>
                                        </>
                                      )}
                                    </div>
                                  ))
                                ));
                              })()}
                            </div>
                            <div className="mt-3 flex justify-center gap-4 text-[9px] font-black uppercase tracking-widest">
                              <span className="text-emerald-600">Period: {Math.ceil(shellZ <= 2 ? 1 : shellZ <= 10 ? 2 : shellZ <= 18 ? 3 : 4)}</span>
                              <span className="text-blue-600">Group: {(() => {
                                if (shellZ === 1) return 'I';
                                if (shellZ === 2) return 'VIII';
                                const mod = (shellZ - 2) % 8;
                                const groups = ['VIII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
                                if (shellZ > 2 && shellZ <= 10) return groups[mod];
                                if (shellZ > 10 && shellZ <= 18) return groups[(shellZ - 10) % 8];
                                if (shellZ === 19) return 'I';
                                if (shellZ === 20) return 'II';
                                return '-';
                              })()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-100">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-black text-emerald-600 uppercase tracking-tight">Practice Challenge</h4>
                          {shellPractice && (
                            <button onClick={() => setShellPractice(null)} className="text-emerald-400 hover:text-emerald-600 font-bold text-[10px] uppercase">Exit</button>
                          )}
                        </div>
                        {!shellPractice ? (
                          <button onClick={generateShellPractice} className="w-full bg-emerald-500 text-white py-3 rounded-xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#059669] hover:shadow-none hover:translate-y-1 transition-all">
                            Start Practice
                          </button>
                        ) : (
                          <div className="space-y-4">
                            <div className="text-center">
                              <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Electronic Arrangement for:</p>
                              <p className="text-xl font-black text-gray-800">{shellPractice.name} (Z={shellPractice.z})</p>
                            </div>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                placeholder="e.g. 2,8,3" 
                                value={shellAnswer} 
                                onChange={e => setShellAnswer(e.target.value)}
                                className="flex-1 p-3 border-2 border-emerald-200 rounded-xl text-center font-black text-lg focus:border-emerald-500 outline-none transition-all"
                              />
                              <button onClick={checkShellPractice} className="bg-emerald-500 text-white px-6 rounded-xl font-black uppercase shadow-[0_4px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all">
                                Check
                              </button>
                            </div>
                            {shellFeedback && (
                              <div className={`p-3 rounded-xl text-center font-bold text-xs ${shellFeedback === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {shellFeedback === 'correct' ? 'Correct! Well done.' : 'Try again! Remember shell limits (2, 8, 8).'}
                              </div>
                            )}
                            <button onClick={generateShellPractice} className="w-full text-emerald-500 font-bold uppercase text-[10px] hover:underline">Next Element</button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Panel: 2D Atom Diagram */}
                    <div className="lg:col-span-7 bg-gray-900 rounded-[2.5rem] flex items-center justify-center overflow-hidden border-8 border-gray-200 shadow-2xl min-h-[500px] relative">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 to-transparent" />
                      
                      {/* Nucleus */}
                      <div className="w-24 h-24 bg-red-500 rounded-full shadow-[0_0_40px_rgba(239,68,68,0.6)] z-10 flex flex-col items-center justify-center text-white font-black border-4 border-red-400">
                        <span className="text-3xl leading-none">{shellZ}</span>
                        <span className="text-[10px] uppercase tracking-widest opacity-80">Protons</span>
                      </div>
                      
                      {/* Shells */}
                      {getElementByZ(shellZ).shells.map((count, shellIdx) => {
                        const radius = 80 + shellIdx * 55;
                        return (
                          <div key={shellIdx} className="absolute flex items-center justify-center">
                            {/* Shell Circle */}
                            <div 
                              className="absolute border-2 border-white/20 rounded-full"
                              style={{ width: radius * 2, height: radius * 2 }}
                            />
                            {/* Electrons */}
                            {[...Array(count)].map((_, eIdx) => {
                              const angle = (eIdx * 2 * Math.PI) / count - Math.PI / 2;
                              const x = radius * Math.cos(angle);
                              const y = radius * Math.sin(angle);
                              return (
                                <div
                                  key={eIdx}
                                  className="absolute w-7 h-7 bg-blue-400 rounded-full shadow-[0_0_15px_rgba(96,165,250,0.8)] border-2 border-blue-200 flex items-center justify-center z-20"
                                  style={{ 
                                    transform: `translate(${x}px, ${y}px)`,
                                  }}
                                >
                                  <span className="text-[10px] font-black text-blue-900">e⁻</span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                      
                      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        <span>Shell 1: max 2</span>
                        <span>Shell 2: max 8</span>
                        <span>Shell 3: max 8</span>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => setSelectedSim(null)} className="w-full mt-8 bg-gray-100 text-gray-400 py-4 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-gray-200 transition-all">
                    Back to Selection
                  </button>
                </div>
              )}

              {selectedSim === 'balancing' && (
                <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Balancing Equations</h3>
                      <p className="text-violet-500 font-black text-xl uppercase tracking-widest text-xs">Conservation of Mass</p>
                    </div>
                    <div className="bg-violet-100 text-violet-600 p-4 rounded-2xl">
                      <Calculator size={32} />
                    </div>
                  </div>

                  <div className="space-y-12">
                    {/* Equation Display */}
                    <div className="bg-gray-50 p-10 rounded-[3rem] border-2 border-gray-100 shadow-inner flex flex-wrap items-center justify-center gap-4 text-4xl font-black text-gray-800">
                      {equations[balancingIndex].reactants.map((r, i) => (
                        <React.Fragment key={`r-${i}`}>
                          <div className="flex items-center gap-3">
                            <input 
                              type="number" 
                              min="1" 
                              max="10" 
                              value={coefficients[i] || 1} 
                              onChange={e => {
                                const newCoeffs = [...coefficients];
                                newCoeffs[i] = parseInt(e.target.value) || 1;
                                setCoefficients(newCoeffs);
                              }}
                              className="w-16 h-16 bg-white border-4 border-violet-200 rounded-2xl text-center text-2xl text-violet-600 outline-none focus:border-violet-500 transition-all"
                            />
                            <span dangerouslySetInnerHTML={{ __html: r.s.replace(/(\d+)/g, '<sub>$1</sub>') }} />
                          </div>
                          {i < equations[balancingIndex].reactants.length - 1 && <span className="text-gray-300">+</span>}
                        </React.Fragment>
                      ))}
                      
                      <ArrowRight className="text-violet-400 mx-4" size={48} />

                      {equations[balancingIndex].products.map((p, i) => (
                        <React.Fragment key={`p-${i}`}>
                          <div className="flex items-center gap-3">
                            <input 
                              type="number" 
                              min="1" 
                              max="10" 
                              value={coefficients[equations[balancingIndex].reactants.length + i] || 1} 
                              onChange={e => {
                                const newCoeffs = [...coefficients];
                                newCoeffs[equations[balancingIndex].reactants.length + i] = parseInt(e.target.value) || 1;
                                setCoefficients(newCoeffs);
                              }}
                              className="w-16 h-16 bg-white border-4 border-violet-200 rounded-2xl text-center text-2xl text-violet-600 outline-none focus:border-violet-500 transition-all"
                            />
                            <span dangerouslySetInnerHTML={{ __html: p.s.replace(/(\d+)/g, '<sub>$1</sub>') }} />
                          </div>
                          {i < equations[balancingIndex].products.length - 1 && <span className="text-gray-300">+</span>}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Atom Counts Comparison */}
                    {(() => {
                      const { reactantAtoms, productAtoms } = getAtomCounts();
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="bg-blue-50 p-8 rounded-3xl border-2 border-blue-100">
                            <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-6 text-center">Reactant Atoms</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {Object.entries(reactantAtoms).map(([atom, count]: [string, any]) => (
                                <div key={atom} className="bg-white p-4 rounded-2xl border-2 border-blue-200 flex justify-between items-center">
                                  <span className="font-black text-gray-700">{atom}</span>
                                  <span className="text-2xl font-black text-blue-600">{count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-emerald-50 p-8 rounded-3xl border-2 border-emerald-100">
                            <h4 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-6 text-center">Product Atoms</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {Object.entries(productAtoms).map(([atom, count]: [string, any]) => (
                                <div key={atom} className="bg-white p-4 rounded-2xl border-2 border-emerald-200 flex justify-between items-center">
                                  <span className="font-black text-gray-700">{atom}</span>
                                  <span className="text-2xl font-black text-emerald-600">{count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Feedback & Navigation */}
                    <div className="flex flex-col items-center gap-6">
                      <AnimatePresence>
                        {isBalanced && (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black text-xl uppercase tracking-widest flex items-center gap-3 shadow-lg"
                          >
                            <CheckCircle2 size={32} />
                            Equation Balanced!
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex gap-4 w-full">
                        <button 
                          onClick={() => {
                            setBalancingIndex(prev => (prev - 1 + equations.length) % equations.length);
                            setIsBalanced(false);
                          }}
                          className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                          Previous
                        </button>
                        <button 
                          onClick={() => {
                            setBalancingIndex(prev => (prev + 1) % equations.length);
                            setIsBalanced(false);
                          }}
                          className="flex-1 bg-violet-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#7c3aed] hover:shadow-none hover:translate-y-1 transition-all"
                        >
                          Next Equation
                        </button>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => setSelectedSim(null)} className="w-full mt-12 bg-gray-100 text-gray-400 py-4 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-gray-200 transition-all">
                    Back to Selection
                  </button>
                </div>
              )}
              {selectedSim === 'matter' && (
                <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">States of Matter</h3>
                      <p className="text-sky-500 font-black text-xl uppercase tracking-widest text-xs">Particle Arrangement & Kinetic Theory</p>
                    </div>
                    <div className="bg-sky-100 text-sky-600 p-4 rounded-2xl">
                      <Thermometer size={32} />
                    </div>
                  </div>

                  <div className="space-y-8 mb-8">
                    <div className="flex flex-col gap-8">
                      {/* Top Controls: Chemical Selection */}
                      <div className="bg-gray-50 p-6 rounded-3xl border-2 border-gray-100">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">Select Substance</p>
                        <div className="flex flex-wrap justify-center gap-3">
                          {chemicals.map(c => (
                            <button
                              key={c.name}
                              onClick={() => setSelectedMatter(c.name)}
                              className={`px-6 py-3 rounded-2xl font-black text-sm transition-all border-2 ${selectedMatter === c.name ? 'bg-sky-500 text-white border-sky-600 shadow-[0_4px_0_0_#0369a1]' : 'bg-white text-gray-600 border-gray-200 hover:border-sky-300 shadow-[0_2px_0_0_#e5e7eb]'}`}
                            >
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Main Simulation Area */}
                      <div className="space-y-6">
                        {(() => {
                          const chem = chemicals.find(c => c.name === selectedMatter)!;
                          const state = getMatterState(matterTemp, chem);
                          
                          const stateData = {
                            Solid: {
                              movement: "Vibrating about fixed positions",
                              arrangement: "Regular lattice / Closely packed",
                              volume: "Fixed",
                              shape: "Fixed"
                            },
                            Liquid: {
                              movement: "Able to slide past each other",
                              arrangement: "Irregular / Closely packed",
                              volume: "Fixed",
                              shape: "Variable (takes shape of container)"
                            },
                            Gas: {
                              movement: "Rapid random motion in all directions",
                              arrangement: "Irregular / Far apart",
                              volume: "Variable (expands to fill container)",
                              shape: "Variable (takes shape of container)"
                            }
                          }[state as 'Solid' | 'Liquid' | 'Gas'];

                          return (
                            <div className="space-y-8">
                              <div className="relative h-96 bg-gray-900 rounded-[2.5rem] overflow-hidden border-4 border-gray-200 shadow-2xl group">
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-500/10 to-transparent" />
                                
                                {/* State Badge */}
                                <div className="absolute top-6 left-6 z-20">
                                  <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-xl">
                                    <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">Current State</p>
                                    <h4 className={`text-3xl font-black uppercase tracking-tight ${state === 'Solid' ? 'text-blue-400' : state === 'Liquid' ? 'text-sky-400' : 'text-orange-400'}`}>
                                      {state}
                                    </h4>
                                  </div>
                                </div>

                                {/* Temp Badge */}
                                <div className="absolute top-6 right-6 z-20">
                                  <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-xl text-right">
                                    <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">Temperature</p>
                                    <h4 className="text-3xl font-black text-white tracking-tight">{matterTemp}°C</h4>
                                  </div>
                                </div>

                                {/* Particles */}
                                {[...Array(48)].map((_, i) => {
                                  const row = Math.floor(i / 8);
                                  const col = i % 8;
                                  const solidX = 30 + col * 6;
                                  const solidY = 40 + row * 6;
                                  const liquidX = 20 + Math.random() * 60;
                                  const liquidY = 65 + Math.random() * 25;
                                  const gasX = Math.random() * 90;
                                  const gasY = Math.random() * 90;

                                  return (
                                    <motion.div
                                      key={`${selectedMatter}-${state}-${i}`}
                                      className={`absolute w-6 h-6 rounded-full ${chem.bg} shadow-lg border border-white/20`}
                                      initial={state === 'Solid' ? { left: `${solidX}%`, top: `${solidY}%` } : 
                                               state === 'Liquid' ? { left: `${liquidX}%`, top: `${liquidY}%` } : 
                                               { left: `${gasX}%`, top: `${gasY}%` }}
                                      animate={state === 'Solid' ? {
                                        x: [0, 1, -1, 0],
                                        y: [0, -1, 1, 0],
                                      } : state === 'Liquid' ? {
                                        x: [0, Math.random() * 20 - 10, Math.random() * 20 - 10, 0],
                                        y: [0, Math.random() * 10 - 5, Math.random() * 10 - 5, 0],
                                        left: [`${liquidX}%`, `${(liquidX + 5) % 100}%`, `${liquidX}%`]
                                      } : {
                                        left: [`${gasX}%`, `${Math.random() * 90}%`, `${Math.random() * 90}%`, `${gasX}%`],
                                        top: [`${gasY}%`, `${Math.random() * 90}%`, `${Math.random() * 90}%`, `${gasY}%`],
                                      }}
                                      transition={{
                                        duration: state === 'Solid' ? 0.15 : state === 'Liquid' ? 2.5 : 4,
                                        repeat: Infinity,
                                        ease: "linear"
                                      }}
                                    />
                                  );
                                })}
                                
                                {/* Bottom Info Bar */}
                                <div className="absolute bottom-0 inset-x-0 bg-black/40 backdrop-blur-md p-4 border-t border-white/10 flex justify-around">
                                  <div className="text-center">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Melting Point</p>
                                    <p className="text-white font-bold">{chem.mp}°C</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Boiling Point</p>
                                    <p className="text-white font-bold">{chem.bp}°C</p>
                                  </div>
                                </div>
                              </div>

                              {/* Temperature Slider */}
                              <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="bg-sky-100 text-sky-600 p-2 rounded-xl">
                                      <Thermometer size={20} />
                                    </div>
                                    <h5 className="font-black text-gray-800 uppercase tracking-tight">Adjust Temperature</h5>
                                  </div>
                                  <span className="text-2xl font-black text-sky-600">{matterTemp}°C</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="-273" 
                                  max="3000" 
                                  value={matterTemp} 
                                  onChange={e => setMatterTemp(parseInt(e.target.value))} 
                                  className="w-full h-4 bg-gray-200 rounded-xl appearance-none cursor-pointer accent-sky-500" 
                                />
                                <div className="flex justify-between mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                  <span>Absolute Zero (-273°C)</span>
                                  <span>Extreme Heat (3000°C)</span>
                                </div>
                              </div>

                              {/* State Properties Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Arrangement</p>
                                  <p className="text-sm font-bold text-gray-800 leading-tight">{stateData.arrangement}</p>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Movement</p>
                                  <p className="text-sm font-bold text-gray-800 leading-tight">{stateData.movement}</p>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Volume</p>
                                  <p className="text-sm font-bold text-gray-800 leading-tight">{stateData.volume}</p>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Shape</p>
                                  <p className="text-sm font-bold text-gray-800 leading-tight">{stateData.shape}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t-2 border-gray-100">
                    <div className="bg-sky-50 p-6 rounded-3xl border-2 border-sky-100">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-black text-sky-600 uppercase tracking-widest">Practice Mode</h4>
                        {matterPractice && (
                          <button onClick={() => setMatterPractice(null)} className="text-sky-400 hover:text-sky-600 font-bold text-xs uppercase">Close</button>
                        )}
                      </div>
                      {!matterPractice ? (
                        <button onClick={generateMatterPractice} className="w-full bg-sky-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#0369a1] hover:shadow-none hover:translate-y-1 transition-all">
                          Start State Challenge
                        </button>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                          <div className="text-center p-6 bg-white rounded-2xl border-2 border-sky-200">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">What is the state of</p>
                            <h5 className="text-3xl font-black text-gray-800 uppercase tracking-tight">{matterPractice.chem.name}</h5>
                            <p className="text-sky-500 font-black text-2xl">at {matterPractice.temp}°C?</p>
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                              {['Solid', 'Liquid', 'Gas'].map(s => (
                                <button
                                  key={s}
                                  onClick={() => setMatterAnswer(s)}
                                  className={`py-4 rounded-2xl font-black uppercase tracking-widest border-2 transition-all ${matterAnswer === s ? 'bg-sky-500 text-white border-sky-600 shadow-[0_4px_0_0_#0369a1]' : 'bg-white text-gray-500 border-gray-200 hover:border-sky-300'}`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                            <button onClick={() => {
                              if (matterAnswer === matterPractice.targetState) setMatterFeedback('correct');
                              else setMatterFeedback('incorrect');
                            }} className="w-full bg-sky-500 text-white py-3 rounded-xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#0369a1] active:shadow-none active:translate-y-1 transition-all">
                              Check Answer
                            </button>
                            {matterFeedback && (
                              <div className={`p-3 rounded-xl text-center font-bold ${matterFeedback === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {matterFeedback === 'correct' ? 'Correct! You understand state changes.' : `Incorrect. At ${matterPractice.temp}°C, ${matterPractice.chem.name} is a ${matterPractice.targetState}.`}
                              </div>
                            )}
                            <button onClick={generateMatterPractice} className="w-full text-sky-500 font-bold uppercase text-xs hover:underline">Next Question</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button onClick={() => setSelectedSim(null)} className="w-full bg-gray-200 text-gray-500 py-4 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-gray-300 transition-all">
                    Back to Selection
                  </button>
                </div>
              )}

              {selectedSim === 'diffusion' && (
                <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Diffusion Chamber</h3>
                      <p className="text-orange-500 font-black text-xl uppercase tracking-widest text-xs">Concentration Gradient & Kinetic Theory</p>
                    </div>
                    <div className="bg-orange-100 text-orange-600 p-4 rounded-2xl">
                      <ArrowRightLeft size={32} />
                    </div>
                  </div>

                  <div className="space-y-8 mb-8">
                    <div className="flex flex-col gap-8">
                      {/* Main Simulation Area */}
                      <div className="relative h-[500px] bg-gray-900 rounded-[2.5rem] overflow-hidden border-4 border-gray-200 shadow-2xl" ref={simRef}>
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/20 to-transparent" />
                        
                        {/* Partition */}
                        {!isPartitionRemoved && (
                          <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-gray-400/50 backdrop-blur-sm z-10 shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
                        )}

                        {/* Particles */}
                        {particles.map(p => (
                          <motion.div
                            key={p.id}
                            className={`absolute w-4 h-4 rounded-full shadow-lg border border-white/20 ${p.type === 'red' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}
                            style={{ left: `${p.x}%`, top: `${p.y}%` }}
                            animate={{
                              x: [0, Math.random() * 10 - 5, Math.random() * 10 - 5, 0],
                              y: [0, Math.random() * 10 - 5, Math.random() * 10 - 5, 0],
                            }}
                            transition={{
                              duration: 0.5 / (diffusionTemp / 50 + 0.1),
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          />
                        ))}

                        {/* Labels */}
                        {!isPartitionRemoved && (
                          <>
                            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 text-center z-20">
                              <p className="text-4xl font-black text-red-400/20 uppercase tracking-widest">High Concentration</p>
                            </div>
                            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 text-center z-20">
                              <p className="text-4xl font-black text-blue-400/20 uppercase tracking-widest">Low Concentration</p>
                            </div>
                          </>
                        )}

                        {/* Particle Counts Overlay */}
                        <div className="absolute bottom-6 inset-x-6 flex justify-between gap-6 pointer-events-none">
                          <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex gap-8">
                            <div className="text-center">
                              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Left Red</p>
                              <p className="text-2xl font-black text-white">{counts.leftRed}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Left Blue</p>
                              <p className="text-2xl font-black text-white">{counts.leftBlue}</p>
                            </div>
                          </div>
                          <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex gap-8">
                            <div className="text-center">
                              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Right Red</p>
                              <p className="text-2xl font-black text-white">{counts.rightRed}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Right Blue</p>
                              <p className="text-2xl font-black text-white">{counts.rightBlue}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Controls Area */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
                              <RefreshCw size={20} />
                            </div>
                            <h5 className="font-black text-gray-800 uppercase tracking-tight">Initial Setup</h5>
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-red-500 uppercase tracking-widest">Left Red: {redLeft}</label>
                                <input type="range" min="0" max="50" value={redLeft} onChange={e => setRedLeft(parseInt(e.target.value))} disabled={isPartitionRemoved} className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-500" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Left Blue: {blueLeft}</label>
                                <input type="range" min="0" max="50" value={blueLeft} onChange={e => setBlueLeft(parseInt(e.target.value))} disabled={isPartitionRemoved} className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <button 
                                onClick={() => {
                                  setIsPartitionRemoved(false);
                                  initParticles();
                                }} 
                                className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all border-2 border-transparent active:scale-95"
                              >
                                Reset
                              </button>
                              <button 
                                onClick={() => setIsPartitionRemoved(true)} 
                                disabled={isPartitionRemoved}
                                className="px-6 py-4 bg-orange-600 text-white rounded-2xl font-black text-sm hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 disabled:opacity-50 active:scale-95"
                              >
                                Open Partition
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm space-y-6">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
                                <Thermometer size={20} />
                              </div>
                              <h5 className="font-black text-gray-800 uppercase tracking-tight">Temperature</h5>
                            </div>
                            <span className="text-2xl font-black text-orange-600">{diffusionTemp}°C</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={diffusionTemp} 
                            onChange={e => setDiffusionTemp(parseInt(e.target.value))} 
                            className="w-full h-4 bg-gray-200 rounded-xl appearance-none cursor-pointer accent-orange-500" 
                          />
                          <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span>Cold (0°C)</span>
                            <span>Hot (100°C)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isPartitionRemoved && (
                    <div className={`p-4 rounded-2xl mb-8 text-center font-black uppercase tracking-tight ${netDiffusion === 'equilibrium' ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200' : 'bg-orange-100 text-orange-700 border-2 border-orange-200'}`}>
                      {netDiffusion === 'equilibrium' ? (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle2 size={20} />
                          Dynamic Equilibrium Reached: No Net Diffusion
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw size={20} className="animate-spin" />
                          {netDiffusion}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Practice Mode Section */}
                  <div className="mt-12 pt-8 border-t-2 border-gray-100">
                    <div className="bg-orange-50/50 rounded-3xl p-8 border-2 border-orange-100">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm font-black text-orange-600 uppercase tracking-widest">Practice Mode</h4>
                        {diffusionPractice && (
                          <button onClick={() => setDiffusionPractice(null)} className="text-orange-400 hover:text-orange-600 font-bold text-xs uppercase">Close</button>
                        )}
                      </div>

                      {!diffusionPractice ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-6 font-medium">Test your understanding of concentration gradients and net movement.</p>
                          <button onClick={generateDiffusionPractice} className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#c2410c] hover:shadow-none hover:translate-y-1 transition-all">
                            Start Practice Challenge
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          <div className="bg-white p-6 rounded-2xl border-2 border-orange-100 shadow-sm">
                            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-2">Question</p>
                            <h5 className="text-xl font-black text-gray-800 uppercase tracking-tight">
                              Predict the net movement of <span className={diffusionPractice.type === 'red' ? 'text-red-500' : 'text-blue-500'}>{diffusionPractice.type.toUpperCase()}</span> particles when the partition is removed.
                            </h5>
                            <div className="mt-4 flex gap-4">
                              <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Left Chamber</span>
                                <span className="font-black text-gray-700">{diffusionPractice.l} particles</span>
                              </div>
                              <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Right Chamber</span>
                                <span className="font-black text-gray-700">{diffusionPractice.r} particles</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {diffusionPractice.options.map((option: string) => (
                              <button
                                key={option}
                                onClick={() => setDiffusionAnswer(option)}
                                disabled={diffusionFeedback !== null}
                                className={`p-4 rounded-xl font-black uppercase tracking-widest border-2 transition-all ${
                                  diffusionAnswer === option
                                    ? 'bg-orange-500 text-white border-orange-600 shadow-[0_4px_0_0_#c2410c]'
                                    : 'bg-white text-gray-600 border-gray-100 hover:border-orange-200'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>

                          {diffusionAnswer && !diffusionFeedback && (
                            <button onClick={checkDiffusionPractice} className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#c2410c] active:shadow-none active:translate-y-1 transition-all">
                              Check Answer
                            </button>
                          )}

                          {diffusionFeedback && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`p-6 rounded-2xl text-center ${
                                diffusionFeedback === 'correct' ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200' : 'bg-red-100 text-red-700 border-2 border-red-200'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-2 mb-2">
                                {diffusionFeedback === 'correct' ? <CheckCircle2 size={24} /> : <ArrowRightLeft size={24} />}
                                <p className="text-xl font-black uppercase tracking-tight">
                                  {diffusionFeedback === 'correct' ? 'Correct!' : 'Try Again!'}
                                </p>
                              </div>
                              <p className="font-bold">
                                {diffusionFeedback === 'correct' 
                                  ? `Particles move from high concentration (${Math.max(diffusionPractice.l, diffusionPractice.r)}) to low concentration (${Math.min(diffusionPractice.l, diffusionPractice.r)}).` 
                                  : `Remember: Net movement is always from high concentration to low concentration.`}
                              </p>
                              <div className="mt-4 flex gap-4">
                                <button onClick={generateDiffusionPractice} className="flex-1 bg-white/50 hover:bg-white/80 py-2 rounded-xl font-bold uppercase text-xs transition-all">Next Question</button>
                                <button onClick={() => { setIsPartitionRemoved(true); setDiffusionFeedback(null); }} className="flex-1 bg-white/50 hover:bg-white/80 py-2 rounded-xl font-bold uppercase text-xs transition-all">Watch Simulation</button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedSim(null)}
                className="w-full bg-gray-200 text-gray-500 py-4 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-gray-300 transition-all"
              >
                Back to Simulations
              </button>
            </div>
          )}
        </div>
      );
    };

    const GraphPlayground = () => {
      const [isPractice, setIsPractice] = useState(false);
      const [practiceData, setPracticeData] = useState<any>(null);
      const [userAnswer, setUserAnswer] = useState('');
      const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

      const generatePractice = () => {
        const speed = Math.floor(Math.random() * 10) + 1;
        const data = [];
        for (let t = 0; t <= 10; t++) {
          data.push({ time: t, distance: speed * t });
        }
        setPracticeData({ speed, data });
        setUserAnswer('');
        setFeedback(null);
      };

      const checkAnswer = () => {
        if (parseInt(userAnswer) === practiceData.speed) {
          setFeedback('correct');
        } else {
          setFeedback('incorrect');
        }
      };

      const generateData = () => {
        const data = [];
        for (let t = 0; t <= 10; t++) {
          data.push({
            time: t,
            obj1: graphSpeed1 * t,
            obj2: graphSpeed2 * t
          });
        }
        return data;
      };

      const data = generateData();

      const ObjectAnimation = ({ speed, color }: { speed: number; color: string }) => {
        const duration = 10 / speed;
        return (
          <div className="relative h-12 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mt-2">
            <motion.div
              key={speed}
              animate={{ left: ['0%', '100%'], x: ['0%', '-100%'] }}
              transition={{ duration, repeat: Infinity, ease: 'linear' }}
              className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full ${color} shadow-lg`}
            />
            <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none opacity-20">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-px h-4 bg-gray-400" />
              ))}
            </div>
          </div>
        );
      };

      return (
        <div className="space-y-8">
          {!selectedGraph ? (
            <div className="grid grid-cols-1 gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedGraph('speed')}
                className="bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-indigo-400 transition-all group"
              >
                <div className="bg-indigo-100 text-indigo-600 p-5 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <TrendingUp size={40} />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Speed: Distance-time graph</h3>
                  <p className="text-gray-500 font-medium">Visualize how speed affects distance over time.</p>
                </div>
              </motion.button>
            </div>
          ) : isPractice ? (
            <div className="space-y-6">
              <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Practice: Calculate Speed</h3>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Find the slope (v = d / t)</p>
                  </div>
                  <button 
                    onClick={() => setIsPractice(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle size={32} />
                  </button>
                </div>

                {!practiceData ? (
                  <div className="text-center py-12">
                    <button
                      onClick={generatePractice}
                      className="bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_0_#4338ca] active:shadow-none active:translate-y-1 transition-all"
                    >
                      Start Practice
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={practiceData.data}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="time" 
                            label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fontSize: 10, fontWeight: 'bold' }} 
                            tick={{ fontSize: 10, fontWeight: 'bold' }}
                          />
                          <YAxis 
                            label={{ value: 'Distance (m)', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 'bold' }} 
                            tick={{ fontSize: 10, fontWeight: 'bold' }}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="distance" 
                            stroke="#6366f1" 
                            strokeWidth={4} 
                            dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100">
                      <p className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4">What is the speed of this object?</p>
                      <div className="flex gap-4">
                        <input
                          type="number"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Enter speed..."
                          className="flex-1 bg-white border-2 border-gray-200 p-4 rounded-xl font-black text-xl focus:border-indigo-500 outline-none transition-all"
                        />
                        <div className="flex items-center text-gray-400 font-black text-xl">m/s</div>
                      </div>

                      {feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
                            feedback === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {feedback === 'correct' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                          <span className="font-black uppercase tracking-tight">
                            {feedback === 'correct' ? 'Correct! Well done!' : 'Not quite. Try again!'}
                          </span>
                        </motion.div>
                      )}

                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <button
                          onClick={checkAnswer}
                          className="bg-indigo-500 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#4338ca] active:shadow-none active:translate-y-1 transition-all"
                        >
                          Check
                        </button>
                        <button
                          onClick={generatePractice}
                          className="bg-white border-2 border-gray-200 text-gray-500 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                        >
                          Next Graph
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Distance-Time Graph</h3>
                    <p className="text-indigo-500 font-black text-xl">v = d / t</p>
                  </div>
                  <div className="bg-indigo-100 text-indigo-600 p-4 rounded-2xl">
                    <TrendingUp size={32} />
                  </div>
                </div>

                <div className="h-64 w-full mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="time" 
                        label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fontSize: 10, fontWeight: 'bold' }} 
                        tick={{ fontSize: 10, fontWeight: 'bold' }}
                      />
                      <YAxis 
                        label={{ value: 'Distance (m)', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 'bold' }} 
                        tick={{ fontSize: 10, fontWeight: 'bold' }}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        labelStyle={{ fontWeight: 'bold' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="obj1" 
                        name="Object 1"
                        stroke="#3b82f6" 
                        strokeWidth={4} 
                        dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="obj2" 
                        name="Object 2"
                        stroke="#ef4444" 
                        strokeWidth={4} 
                        dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-black text-blue-500 uppercase tracking-widest">Object 1 Speed: {graphSpeed1} m/s</label>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      value={graphSpeed1} 
                      onChange={(e) => setGraphSpeed1(parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <ObjectAnimation speed={graphSpeed1} color="bg-blue-500" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-black text-red-500 uppercase tracking-widest">Object 2 Speed: {graphSpeed2} m/s</label>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      value={graphSpeed2} 
                      onChange={(e) => setGraphSpeed2(parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                    <ObjectAnimation speed={graphSpeed2} color="bg-red-500" />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsPractice(true);
                    generatePractice();
                  }}
                  className="w-full mt-8 bg-emerald-500 text-white py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  <Zap size={24} />
                  Practice Mode
                </button>
              </div>

              <button
                onClick={() => setSelectedGraph(null)}
                className="w-full bg-gray-200 text-gray-500 py-4 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-gray-300 transition-all"
              >
                Back to Graphs
              </button>
            </div>
          )}
        </div>
      );
    };

    const generatePracticeQuestion = (equation: any) => {
      const v1 = Math.floor(Math.random() * 10) + 1;
      const v2 = Math.floor(Math.random() * 10) + 1;
      let questionText = '';
      let correctAnswer = 0;
      let unit = '';

      if (equation.id === 'ram') {
        questionText = `If an element has an isotope with 75% abundance and mass number 35, and another with 25% abundance and mass number 37, what is the RAM?`;
        correctAnswer = 35.5;
        unit = '';
      } else if (equation.id === 'particles') {
        questionText = `If you have ${v1} moles of particles, how many particles are there? (L = 6.02 × 10²³)`;
        correctAnswer = v1 * 6.02;
        unit = '× 10²³';
      } else if (equation.id === 'mole_mass') {
        questionText = `If the mass is ${v1 * v2}g and the Molar Mass is ${v2}g/mol, how many moles are there?`;
        correctAnswer = v1;
        unit = 'mol';
      } else if (equation.id === 'mole_conc') {
        questionText = `If the concentration is ${v1}mol/dm³ and the volume is ${v2}dm³, how many moles are there?`;
        correctAnswer = v1 * v2;
        unit = 'mol';
      } else if (equation.id === 'mole_gas') {
        questionText = `If the gas volume is ${v1 * 24}dm³, how many moles are there? (Molar volume = 24 dm³/mol)`;
        correctAnswer = v1;
        unit = 'mol';
      } else if (equation.id === 'yield') {
        questionText = `If the actual yield is ${v1}g and the theoretical yield is ${v1 * 2}g, what is the percentage yield?`;
        correctAnswer = 50;
        unit = '%';
      } else if (equation.id === 'enthalpy') {
        questionText = `If the bond enthalpies of reactants is ${v1 + v2}kJ/mol and products is ${v2}kJ/mol, what is ΔH?`;
        correctAnswer = v1;
        unit = 'kJ/mol';
      } else {
        questionText = `If Part is ${v1} and Whole is ${v1 * 10}, what is the Percentage?`;
        correctAnswer = 10;
        unit = '%';
      }

      const options = [
        correctAnswer.toString(),
        (correctAnswer + 2).toString(),
        (correctAnswer * 2).toString(),
        (Math.max(1, correctAnswer - 1)).toString()
      ].sort(() => Math.random() - 0.5);

      setPracticeQuestion({ text: questionText, correctAnswer: correctAnswer.toString(), options, unit });
      setPracticeAnswer(null);
      setIsPracticeChecked(false);
    };

    if (subMode === 'select') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <header className="bg-white border-b-2 border-gray-200 p-6 sticky top-0 z-10">
            <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Playground</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Interactive Learning</p>
          </header>
          <main className="max-w-2xl mx-auto p-6 space-y-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubMode('equations')}
              className="w-full bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-blue-400 hover:shadow-[0_6px_0_0_#60a5fa] transition-all group"
            >
              <div className="bg-blue-100 text-blue-600 p-5 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Calculator size={40} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Equation Playground</h2>
                <p className="text-gray-500 font-medium">Rearrange and practice key scientific formulas.</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubMode('chemicals')}
              className="w-full bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-emerald-400 hover:shadow-[0_6px_0_0_#34d399] transition-all group"
            >
              <div className="bg-emerald-100 text-emerald-600 p-5 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Atom size={40} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Chemical Playground</h2>
                <p className="text-gray-500 font-medium">Explore common chemicals and their properties.</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubMode('graphs')}
              className="w-full bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-indigo-400 hover:shadow-[0_6px_0_0_#818cf8] transition-all group"
            >
              <div className="bg-indigo-100 text-indigo-600 p-5 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <TrendingUp size={40} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Graph Playground</h2>
                <p className="text-gray-500 font-medium">Experiment with dynamic scientific graphs.</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubMode('simulations')}
              className="w-full bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-orange-400 hover:shadow-[0_6px_0_0_#fb923c] transition-all group"
            >
              <div className="bg-orange-100 text-orange-600 p-5 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <ArrowRightLeft size={40} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Simulation Playground</h2>
                <p className="text-gray-500 font-medium">Interactive simulations for complex scientific concepts.</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubMode('solubility')}
              className="w-full bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-emerald-400 hover:shadow-[0_6px_0_0_#34d399] transition-all group"
            >
              <div className="bg-emerald-100 text-emerald-600 p-5 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Droplets size={40} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Solubility Playground</h2>
                <p className="text-gray-500 font-medium">Test your knowledge of salt solubility rules.</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubMode('mole-calc')}
              className="w-full bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-orange-400 hover:shadow-[0_6px_0_0_#fb923c] transition-all group"
            >
              <div className="bg-orange-100 text-orange-600 p-5 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Variable size={40} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Mole Calculation Playground</h2>
                <p className="text-gray-500 font-medium">Calculate moles from mass, concentration, and volume.</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubMode('mole')}
              className="w-full bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-orange-400 hover:shadow-[0_6px_0_0_#fb923c] transition-all group"
            >
              <div className="bg-orange-100 text-orange-600 p-5 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Calculator size={40} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Mole Playground</h2>
                <p className="text-gray-500 font-medium">Practice stoichiometry and mole calculations.</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubMode('ionic')}
              className="w-full bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-blue-400 hover:shadow-[0_6px_0_0_#60a5fa] transition-all group"
            >
              <div className="bg-blue-100 text-blue-600 p-5 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Droplets size={40} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Net Ionic Playground</h2>
                <p className="text-gray-500 font-medium">Master the art of simplifying ionic equations.</p>
              </div>
            </motion.button>
          </main>
        </div>
      );
    }

    if (subMode === 'ionic') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <button onClick={() => setSubMode('select')} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={32} />
              </button>
              <div>
                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Net Ionic Playground</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Equation Simplification</p>
              </div>
            </div>
          </header>
          <main className="max-w-2xl mx-auto p-6">
            <NetIonicPlayground />
          </main>
        </div>
      );
    }

    if (subMode === 'mole-calc') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <button onClick={() => setSubMode('select')} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={32} />
              </button>
              <div>
                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Mole Calculation Playground</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Formula Practice</p>
              </div>
            </div>
          </header>
          <main className="max-w-2xl mx-auto p-6">
            <MoleCalculationPlayground />
          </main>
        </div>
      );
    }

    if (subMode === 'mole') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <button onClick={() => setSubMode('select')} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={32} />
              </button>
              <div>
                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Mole Playground</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stoichiometry Practice</p>
              </div>
            </div>
          </header>
          <main className="max-w-2xl mx-auto p-6">
            <MolePlayground />
          </main>
        </div>
      );
    }

    if (subMode === 'solubility') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <button onClick={() => setSubMode('select')} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={32} />
              </button>
              <div>
                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Solubility Playground</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Salt Solubility Revision</p>
              </div>
            </div>
          </header>
          <SolubilityPlayground />
        </div>
      );
    }

    if (subMode === 'simulations') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <button onClick={() => setSubMode('select')} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={32} />
              </button>
              <div>
                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Simulation Playground</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Interactive Simulations</p>
              </div>
            </div>
          </header>

          <main className="max-w-2xl mx-auto p-6">
            <SimulationPlayground />
          </main>
        </div>
      );
    }

    if (subMode === 'equations') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <button onClick={() => {
                if (isPracticeMode) setIsPracticeMode(false);
                else if (selectedEquation) setSelectedEquation(null);
                else setSubMode('select');
              }} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={32} />
              </button>
              <div>
                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Equations</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {selectedEquation ? selectedEquation.name : 'Select a formula'}
                </p>
              </div>
            </div>
          </header>

          <main className="max-w-2xl mx-auto p-6">
            {isPracticeMode ? (
              <div className="space-y-8">
                <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                  <h2 className="text-2xl font-black text-gray-800 mb-6">{practiceQuestion.text}</h2>
                  <div className="grid gap-4">
                    {practiceQuestion.options.map((option: string) => (
                      <button
                        key={option}
                        disabled={isPracticeChecked}
                        onClick={() => setPracticeAnswer(option)}
                        className={`w-full p-4 text-left rounded-2xl border-2 transition-all font-bold text-lg
                          ${practiceAnswer === option 
                            ? 'border-blue-400 bg-blue-50 text-blue-600 shadow-[0_4px_0_0_#60a5fa]' 
                            : 'border-gray-200 hover:bg-gray-50 text-gray-700 shadow-[0_4px_0_0_#e5e7eb]'
                          }
                          ${isPracticeChecked && option === practiceQuestion.correctAnswer ? 'border-emerald-400 bg-emerald-50 text-emerald-600 shadow-[0_4px_0_0_#34d399]' : ''}
                          ${isPracticeChecked && practiceAnswer === option && practiceAnswer !== practiceQuestion.correctAnswer ? 'border-red-400 bg-red-50 text-red-600 shadow-[0_4px_0_0_#f87171]' : ''}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option} {practiceQuestion.unit}</span>
                          {isPracticeChecked && option === practiceQuestion.correctAnswer && <CheckCircle2 size={24} />}
                          {isPracticeChecked && practiceAnswer === option && practiceAnswer !== practiceQuestion.correctAnswer && <XCircle size={24} />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (isPracticeChecked) generatePracticeQuestion(selectedEquation);
                    else setIsPracticeChecked(true);
                  }}
                  disabled={!practiceAnswer}
                  className={`w-full py-4 rounded-2xl font-black text-xl uppercase tracking-widest transition-all
                    ${!practiceAnswer ? 'bg-gray-200 text-gray-400' : 'bg-emerald-500 text-white shadow-[0_6px_0_0_#059669] active:shadow-none active:translate-y-1'}
                  `}
                >
                  {isPracticeChecked ? 'Next Question' : 'Check Answer'}
                </button>
              </div>
            ) : selectedEquation ? (
              <div className="space-y-8">
                <div className="bg-white border-2 border-gray-200 p-12 rounded-3xl shadow-[0_8px_0_0_#e5e7eb] text-center">
                  <span className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] block mb-4">Rearrange the formula</span>
                  <div className="text-5xl font-black text-gray-800 mb-8 flex items-center justify-center gap-4 flex-wrap">
                    {equationRearrangements[selectedEquation.id][equationSubject || selectedEquation.variables[0].symbol].split(' ').map((part, i) => (
                      <span key={i} className={selectedEquation.variables.some((v: any) => v.symbol === part) ? 'text-blue-500' : ''}>
                        {part}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedEquation.variables.map((v: any) => (
                      <button
                        key={v.symbol}
                        onClick={() => setEquationSubject(v.symbol)}
                        className={`p-4 rounded-2xl border-2 font-black text-xl transition-all
                          ${(equationSubject || selectedEquation.variables[0].symbol) === v.symbol 
                            ? 'bg-blue-500 text-white border-blue-600 shadow-[0_4px_0_0_#1e40af]' 
                            : 'bg-white text-gray-400 border-gray-200 hover:border-blue-300 shadow-[0_4px_0_0_#e5e7eb]'
                          }
                        `}
                      >
                        {v.symbol}
                      </button>
                    ))}
                  </div>
                  <p className="mt-8 text-gray-400 font-bold text-sm uppercase tracking-widest">Click a variable to make it the subject</p>
                </div>

                <div className="grid gap-4">
                  {selectedEquation.variables.map((v: any) => (
                    <div key={v.symbol} className="bg-white border-2 border-gray-200 p-4 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center font-black">
                          {v.symbol}
                        </div>
                        <div>
                          <p className="font-black text-gray-800 uppercase text-sm">{v.name}</p>
                          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Unit: {v.unit || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setIsPracticeMode(true);
                    generatePracticeQuestion(selectedEquation);
                  }}
                  className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  <Zap size={24} />
                  Practice Mode
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {equations.map((eq) => (
                  <motion.button
                    key={eq.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedEquation(eq);
                      setEquationSubject(eq.variables[0].symbol);
                    }}
                    className="w-full bg-white border-2 border-gray-200 p-6 rounded-3xl flex items-center justify-between shadow-[0_4px_0_0_#e5e7eb] hover:border-blue-400 transition-all"
                  >
                    <div className="text-left">
                      <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">{eq.name}</h3>
                      <p className="text-blue-500 font-black text-lg">{eq.formula}</p>
                    </div>
                    <div className="bg-gray-100 text-gray-400 p-2 rounded-xl">
                      <ArrowRight size={24} />
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </main>
        </div>
      );
    }

    if (subMode === 'chemicals') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <button onClick={() => {
                if (selectedChemical) setSelectedChemical(null);
                else setSubMode('select');
              }} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={32} />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Chemicals</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {selectedChemical ? selectedChemical.name : 'Explore common compounds'}
                </p>
              </div>
            </div>
          </header>

          <main className="max-w-2xl mx-auto p-6">
            {selectedChemical ? (
              <div className="space-y-8">
                <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h2 className="text-4xl font-black text-gray-800 uppercase tracking-tight">{selectedChemical.name}</h2>
                      <p className="text-emerald-500 font-black text-2xl">{selectedChemical.formula}</p>
                    </div>
                    <div className={`${selectedChemical.color} text-white p-6 rounded-3xl shadow-xl`}>
                      {selectedChemical.icon}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Composition</h3>
                      <div className="flex flex-wrap gap-4">
                        {selectedChemical.composition.map((comp: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border-2 border-gray-100">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black border-2 ${comp.color}`}>
                              {comp.type}
                            </div>
                            <div>
                              <p className="font-black text-gray-800 text-xl">× {comp.count}</p>
                              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Atoms</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4">
                        <p className="text-gray-600 font-medium leading-relaxed">
                          {selectedChemical.details}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Lewis Structure</h3>
                      <div className="bg-gray-900 p-6 rounded-2xl border-2 border-gray-800 flex items-center justify-center min-h-[120px]">
                        <pre className="text-emerald-400 font-mono text-xl leading-tight whitespace-pre">
                          {selectedChemical.lewis}
                        </pre>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                        Visual representation of valence electrons
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Molecular View</h3>
                      <MolecularAnimation 
                        state={selectedChemical.state} 
                        formula={selectedChemical.formula} 
                        color={selectedChemical.color} 
                      />
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                        {selectedChemical.state === 'gas' 
                          ? 'Molecules move rapidly and are far apart' 
                          : 'Molecules slide past each other and are close together'}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedChemical(null)}
                  className="w-full bg-gray-200 text-gray-500 py-4 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-gray-300 transition-all"
                >
                  Back to List
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {chemicals.map((chem, idx) => (
                  <motion.div
                    key={chem.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setSelectedChemical(chem)}
                    className={`cursor-pointer bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-[0_6px_0_0_#e5e7eb] transition-all relative overflow-hidden group hover:border-emerald-400`}
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150 ${chem.color}`} />
                    
                    <div className="relative z-10">
                      <div className={`${chem.color} text-white p-4 rounded-2xl w-fit mb-4 shadow-lg`}>
                        {chem.icon}
                      </div>
                      <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight leading-none mb-1">{chem.name}</h3>
                      <p className="text-emerald-500 font-black text-xl">{chem.formula}</p>
                      <p className="text-gray-300 text-[10px] font-black uppercase tracking-widest mt-4">Tap to explore</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        </div>
      );
    }

    if (subMode === 'graphs') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <button onClick={() => {
                if (selectedGraph) setSelectedGraph(null);
                else setSubMode('select');
              }} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={32} />
              </button>
              <div>
                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Graph Playground</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {selectedGraph ? 'Speed: Distance-time' : 'Experiment with parameters'}
                </p>
              </div>
            </div>
          </header>

          <main className="max-w-2xl mx-auto p-6">
            <GraphPlayground />
          </main>
        </div>
      );
    }

    return null;
  };

  const UserDashboardView = () => {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <header className="bg-white border-b-2 border-gray-200 p-6 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Dashboard</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Session Statistics</p>
          </div>
        </header>

        <main className="max-w-2xl mx-auto p-4 space-y-6 mt-4">
          {units.map((unit) => {
            const stats = sessionStats[unit.id] || { attemptedQuestions: [], masteredVocab: [] };
            const attemptedCount = stats.attemptedQuestions.length;
            const totalQuestions = unit.questions.length;
            const notAttemptedCount = totalQuestions - attemptedCount;
            const masteredCount = stats.masteredVocab.length;
            const totalVocab = unit.vocab.length;
            const totalNotes = unit.concepts.length;

            return (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden shadow-[0_4px_0_0_rgba(0,0,0,0.05)]"
              >
                <div className={`${unit.color} p-4 text-white flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                      <BookOpen size={20} />
                    </div>
                    <h3 className="font-black uppercase tracking-wide">{unit.title}</h3>
                  </div>
                  <span className="text-xs font-black bg-black/10 px-3 py-1 rounded-full uppercase tracking-widest">Unit {unit.id}</span>
                </div>

                <div className="p-6 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-blue-500 mb-1">
                      <CheckCircle2 size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Quiz Attempted</span>
                    </div>
                    <p className="text-2xl font-black text-blue-700">{attemptedCount}</p>
                    <p className="text-[10px] text-blue-400 font-bold uppercase">Questions</p>
                  </div>

                  <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-orange-500 mb-1">
                      <XCircle size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Not Attempted</span>
                    </div>
                    <p className="text-2xl font-black text-orange-700">{notAttemptedCount}</p>
                    <p className="text-[10px] text-orange-400 font-bold uppercase">Questions</p>
                  </div>

                  <div className="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-emerald-500 mb-1">
                      <GraduationCap size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Vocab Mastered</span>
                    </div>
                    <p className="text-2xl font-black text-emerald-700">{masteredCount} / {totalVocab}</p>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase">Items</p>
                  </div>

                  <div className="bg-purple-50 border-2 border-purple-100 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-purple-500 mb-1">
                      <Languages size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Total Notes</span>
                    </div>
                    <p className="text-2xl font-black text-purple-700">{totalNotes}</p>
                    <p className="text-[10px] text-purple-400 font-bold uppercase">Concepts</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </main>
      </div>
    );
  };

  const AboutView = () => {
    const revisionNumber = "2.0.0";
    
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <header className="bg-white border-b-2 border-gray-200 p-6 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">About</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">App Information</p>
          </div>
        </header>

        <main className="max-w-2xl mx-auto p-4 space-y-6 mt-4">
          {/* Creator Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden shadow-[0_4px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="bg-emerald-500 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                  <GraduationCap size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">Creator</h3>
                  <p className="text-emerald-100 font-bold text-sm uppercase tracking-widest opacity-90">Mr. LAM</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="relative pl-6 border-l-2 border-emerald-100 space-y-1">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                <p className="text-gray-800 font-black text-sm uppercase tracking-tight">
                  Bachelor of Science
                </p>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-wider">
                  Biochemistry major, Psychology Minor
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                    University of Hong Kong
                  </span>
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                    2013
                  </span>
                </div>
              </div>

              <div className="relative pl-6 border-l-2 border-emerald-100 space-y-1">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                <p className="text-gray-800 font-black text-sm uppercase tracking-tight">
                  Post Graduate Certificate in Education
                </p>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-wider">
                  Secondary Education
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                    University of Sunderland
                  </span>
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                    2025
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* GitHub Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-[0_4px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gray-100 p-3 rounded-2xl text-gray-800">
                <Github size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Repository</h3>
            </div>
            <a 
              href="https://github.com/Tomanlam/Y11-rev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-gray-900 text-white p-4 rounded-2xl hover:bg-gray-800 transition-colors group"
            >
              <span className="font-bold text-sm truncate mr-2">github.com/Tomanlam/Y11-rev</span>
              <ExternalLink size={18} className="flex-shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </motion.div>

          {/* Tech Stack Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-[0_4px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Tech Stack</h3>
            </div>
            <div className="bg-orange-50 border-2 border-orange-100 p-4 rounded-2xl text-center">
              <p className="text-xl font-black text-orange-700">Powered by React + Vite</p>
              <p className="text-orange-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Modern Web Technologies</p>
            </div>
          </motion.div>

          {/* Revision Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-[0_4px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                <RefreshCw size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Version</h3>
            </div>
            <div className="bg-blue-50 border-2 border-blue-100 p-4 rounded-2xl text-center">
              <p className="text-3xl font-black text-blue-700">v{revisionNumber}</p>
              <p className="text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Revision Number</p>
            </div>
          </motion.div>
        </main>
      </div>
    );
  };

  return (
    <div className="font-sans selection:bg-emerald-200">
      <AnimatePresence mode="wait">
        {mode === 'splash' && <SplashScreen key="splash" />}
        {mode === 'dashboard' && <Dashboard key="dashboard" />}
        {mode === 'facts' && <QuickFacts key="facts" />}
        {mode === 'quiz-select' && <QuizSelectView key="quiz-select" />}
        {mode === 'quiz' && <QuizView key="quiz" />}
        {mode === 'result' && <ResultView key="result" />}
        {mode === 'revision' && <RevisionView key="revision" />}
        {mode === 'vocab' && <VocabView key="vocab" />}
        {mode === 'user-stats' && <UserDashboardView key="user-stats" />}
        {mode === 'about' && <AboutView key="about" />}
        {mode === 'playground' && <PlaygroundView key="playground" />}
      </AnimatePresence>

      {/* Bottom Nav for Dashboard, User Stats, and About */}
      {['dashboard', 'facts', 'playground', 'user-stats', 'about'].includes(mode) && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 z-20">
          <div className="max-w-2xl mx-auto flex justify-around items-center">
            <button 
              onClick={() => setMode('dashboard')}
              className={`flex flex-col items-center gap-1 transition-colors ${mode === 'dashboard' ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-400'}`}
            >
              <Home size={28} fill={mode === 'dashboard' ? "currentColor" : "none"} />
              <span className="text-[10px] font-black uppercase">Home</span>
            </button>
            <button 
              onClick={() => setMode('facts')}
              className={`flex flex-col items-center gap-1 transition-colors ${mode === 'facts' ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-400'}`}
            >
              <BookOpen size={28} fill={mode === 'facts' ? "currentColor" : "none"} />
              <span className="text-[10px] font-black uppercase">Quick Facts</span>
            </button>
            <button 
              onClick={() => setMode('playground')}
              className={`flex flex-col items-center gap-1 transition-colors ${mode === 'playground' ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-400'}`}
            >
              <FlaskConical size={28} fill={mode === 'playground' ? "currentColor" : "none"} />
              <span className="text-[10px] font-black uppercase">Playground</span>
            </button>
            <button 
              onClick={() => setMode('user-stats')}
              className={`flex flex-col items-center gap-1 transition-colors ${mode === 'user-stats' ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-400'}`}
            >
              <Trophy size={28} fill={mode === 'user-stats' ? "currentColor" : "none"} />
              <span className="text-[10px] font-black uppercase">Dashboard</span>
            </button>
            <button 
              onClick={() => setMode('about')}
              className={`flex flex-col items-center gap-1 transition-colors ${mode === 'about' ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-400'}`}
            >
              <Info size={28} fill={mode === 'about' ? "currentColor" : "none"} />
              <span className="text-[10px] font-black uppercase">About</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
