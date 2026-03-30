/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Calculator,
  Atom,
  Variable,
  Dna,
  Beaker,
  Wind,
  Droplets,
  Flame,
  TrendingUp,
  QrCode
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { units, Unit, Question, Vocab } from './data';

type AppMode = 'splash' | 'dashboard' | 'quiz' | 'quiz-select' | 'revision' | 'vocab' | 'result' | 'user-stats' | 'about' | 'playground';
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

  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AnimatePresence>
        {isY11Open && <Y11Splash onClose={() => setIsY11Open(false)} />}
      </AnimatePresence>

      <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black text-emerald-500 tracking-tight">IGCSE CIE Chemistry</h1>
          <div className="flex items-center gap-2">
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
                <QRCodeSVG value="https://y8rev.vercel.app" size={200} level="H" includeMargin={true} />
              </div>
              <p className="text-emerald-500 font-black text-sm uppercase tracking-widest">y8rev.vercel.app</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="max-w-2xl mx-auto p-4 space-y-6 mt-4">
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
              {randomConcept.includes(': ') ? (
                <>
                  <span className="font-bold">{randomConcept.split(': ')[0]}:</span>
                  {randomConcept.substring(randomConcept.indexOf(': ') + 1)}
                </>
              ) : (
                randomConcept
              )}
            </p>
          </div>
        </div>

        <div className="grid gap-4">
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
        <header className="p-4 flex items-center gap-4 max-w-2xl mx-auto w-full">
          <button onClick={() => setMode('dashboard')} className="text-gray-400 hover:text-gray-600">
            <XCircle size={32} />
          </button>
          
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {quizSubMode === 'time-attack' ? 'Time Attack' : quizSubMode === 'marathon' ? 'Marathon' : 'Quick Mode'}
              </span>
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

        <main className="flex-1 max-w-2xl mx-auto w-full p-6 flex flex-col">
          <h2 className="text-2xl font-black text-gray-800 mb-8">{currentQuestion.text}</h2>
          
          <div className="space-y-4 flex-1">
            {currentQuestion.options.map((option) => (
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
                  <span>{option}</span>
                  {isAnswerChecked && option === currentQuestion.correctAnswer && <CheckCircle2 size={24} />}
                  {isAnswerChecked && selectedOption === option && !isCorrect && <XCircle size={24} />}
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
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={() => setMode('dashboard')} className="text-gray-400 hover:text-gray-600">
            <ChevronLeft size={32} />
          </button>
          <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight">{selectedUnit?.title} Notes</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6 space-y-6">
        <div className={`${selectedUnit?.color} rounded-3xl p-8 text-white shadow-lg`}>
          <h2 className="text-3xl font-black mb-2">{selectedUnit?.title}</h2>
          <p className="text-white/90 text-lg">{selectedUnit?.description}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest">Key Concepts</h3>
          {selectedUnit?.concepts.map((concept, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white border-2 border-gray-200 rounded-2xl p-5 flex gap-4 items-start shadow-[0_4px_0_0_rgba(0,0,0,0.05)]"
            >
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mt-1">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-gray-700 text-lg font-medium leading-relaxed">
                {concept.includes(': ') ? (
                  <>
                    <span className="font-black text-gray-900">{concept.split(': ')[0]}:</span>
                    {concept.substring(concept.indexOf(': ') + 1)}
                  </>
                ) : (
                  concept
                )}
              </p>
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

  const PlaygroundView = () => {
    const [subMode, setSubMode] = useState<'select' | 'equations' | 'chemicals' | 'graphs' | 'simulations'>('select');
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

    const SimulationPlayground = () => {
      const [selectedSim, setSelectedSim] = useState<string | null>(null);
      
      // Diffusion State
      const [redLeft, setRedLeft] = useState(20);
      const [blueLeft, setBlueLeft] = useState(5);
      const [redRight, setRedRight] = useState(5);
      const [blueRight, setBlueRight] = useState(20);
      const [isPartitionRemoved, setIsPartitionRemoved] = useState(false);
      const [particles, setParticles] = useState<any[]>([]);
      
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
          setParticles(prev => prev.map(p => {
            let nx = p.x + p.vx;
            let ny = p.y + p.vy;
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


            </div>
          ) : (
            <div className="space-y-6">
              {selectedSim === 'axz' && (
                <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">AXZ Notation</h3>
                      <p className="text-blue-500 font-black text-xl uppercase tracking-widest text-xs">Atomic Structure</p>
                    </div>
                    <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl">
                      <Atom size={32} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-red-500 uppercase">Protons (Z): {axzProtons}</label>
                        <input type="range" min="1" max="20" value={axzProtons} onChange={e => setAxzProtons(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase">Neutrons: {axzNeutrons}</label>
                        <input type="range" min="0" max="25" value={axzNeutrons} onChange={e => setAxzNeutrons(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-blue-500 uppercase">Electrons: {axzElectrons}</label>
                        <input type="range" min="0" max="20" value={axzElectrons} onChange={e => setAxzElectrons(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                      </div>

                      <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100 flex items-center justify-center">
                        <div className="relative text-6xl font-black text-gray-800 flex items-center">
                          <div className="flex flex-col text-2xl mr-2">
                            <span>{axzProtons + axzNeutrons}</span>
                            <span>{axzProtons}</span>
                          </div>
                          <span>{getElementByZ(axzProtons).symbol}</span>
                          {axzProtons !== axzElectrons && (
                            <span className="text-2xl align-top ml-1">
                              {Math.abs(axzProtons - axzElectrons)}{axzProtons > axzElectrons ? '+' : '-'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100">
                        <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4">Practice Mode</h4>
                        {!axzPractice ? (
                          <button onClick={generateAxzPractice} className="w-full bg-blue-500 text-white py-3 rounded-xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#1d4ed8]">
                            Start Practice
                          </button>
                        ) : (
                          <div className="space-y-4">
                            <div className="text-center p-4 bg-white rounded-xl border-2 border-blue-200">
                              <div className="relative text-4xl font-black text-gray-800 inline-flex items-center">
                                <div className="flex flex-col text-xl mr-1">
                                  <span>{axzPractice.mass}</span>
                                  <span>{axzPractice.z}</span>
                                </div>
                                <span>{axzPractice.symbol}</span>
                                {axzPractice.charge !== 0 && (
                                  <span className="text-xl align-top ml-1">
                                    {Math.abs(axzPractice.charge) === 1 ? '' : Math.abs(axzPractice.charge)}{axzPractice.charge > 0 ? '+' : '-'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <input type="number" placeholder="P" value={axzAnswer.p} onChange={e => setAxzAnswer({...axzAnswer, p: e.target.value})} className="w-full p-2 border-2 border-gray-200 rounded-lg text-center font-bold" />
                              <input type="number" placeholder="N" value={axzAnswer.n} onChange={e => setAxzAnswer({...axzAnswer, n: e.target.value})} className="w-full p-2 border-2 border-gray-200 rounded-lg text-center font-bold" />
                              <input type="number" placeholder="E" value={axzAnswer.e} onChange={e => setAxzAnswer({...axzAnswer, e: e.target.value})} className="w-full p-2 border-2 border-gray-200 rounded-lg text-center font-bold" />
                            </div>
                            <button onClick={checkAxzPractice} className="w-full bg-blue-500 text-white py-3 rounded-xl font-black uppercase tracking-widest">
                              Check Answer
                            </button>
                            {axzFeedback && (
                              <div className={`p-3 rounded-xl text-center font-bold ${axzFeedback === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {axzFeedback === 'correct' ? 'Correct! Well done.' : 'Try again! Check your math.'}
                              </div>
                            )}
                            <button onClick={generateAxzPractice} className="w-full text-blue-500 font-bold uppercase text-xs">Next Question</button>
                          </div>
                        )}
                      </div>
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
                      <p className="text-emerald-500 font-black text-xl uppercase tracking-widest text-xs">Electronic Arrangement</p>
                    </div>
                    <div className="bg-emerald-100 text-emerald-600 p-4 rounded-2xl">
                      <Zap size={32} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-emerald-500 uppercase">Atomic Number (Z): {shellZ}</label>
                        <input type="range" min="1" max="20" value={shellZ} onChange={e => setShellZ(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                      </div>

                      <div className="text-center">
                        <h4 className="text-2xl font-black text-gray-800 uppercase tracking-tight">{getElementByZ(shellZ).name}</h4>
                        <p className="text-emerald-500 font-black text-xl">{getElementByZ(shellZ).shells.join(', ')}</p>
                      </div>

                      <div className="relative h-80 bg-gray-900 rounded-2xl flex items-center justify-center overflow-hidden border-4 border-gray-200">
                        {/* Nucleus */}
                        <div className="w-8 h-8 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)] z-10 flex items-center justify-center text-[10px] text-white font-bold">
                          {shellZ}+
                        </div>
                        
                        {/* Shells */}
                        {getElementByZ(shellZ).shells.map((count, shellIdx) => {
                          const radius = 40 + shellIdx * 30;
                          return (
                            <React.Fragment key={shellIdx}>
                              <div 
                                className="absolute border border-white/20 rounded-full"
                                style={{ width: radius * 2, height: radius * 2 }}
                              />
                              {[...Array(count)].map((_, eIdx) => (
                                <motion.div
                                  key={`${shellIdx}-${eIdx}`}
                                  className="absolute w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]"
                                  animate={{
                                    rotate: 360
                                  }}
                                  transition={{
                                    duration: 3 + shellIdx * 2,
                                    repeat: Infinity,
                                    ease: "linear"
                                  }}
                                  style={{
                                    originX: "50%",
                                    originY: "50%",
                                    x: radius * Math.cos((eIdx * 2 * Math.PI) / count),
                                    y: radius * Math.sin((eIdx * 2 * Math.PI) / count),
                                    marginTop: -6,
                                    marginLeft: -6
                                  }}
                                />
                              ))}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-100">
                        <h4 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-4">Practice Mode</h4>
                        {!shellPractice ? (
                          <button onClick={generateShellPractice} className="w-full bg-emerald-500 text-white py-3 rounded-xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#059669]">
                            Start Practice
                          </button>
                        ) : (
                          <div className="space-y-4">
                            <div className="text-center p-4 bg-white rounded-xl border-2 border-emerald-200">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">What is the electronic arrangement of</p>
                              <h5 className="text-3xl font-black text-gray-800 uppercase tracking-tight">{shellPractice.name}?</h5>
                            </div>
                            <input 
                              type="text" 
                              placeholder="e.g. 2,8,3" 
                              value={shellAnswer} 
                              onChange={e => setShellAnswer(e.target.value)}
                              className="w-full p-3 border-2 border-gray-200 rounded-xl text-center font-black text-xl"
                            />
                            <button onClick={checkShellPractice} className="w-full bg-emerald-500 text-white py-3 rounded-xl font-black uppercase tracking-widest">
                              Check Answer
                            </button>
                            {shellFeedback && (
                              <div className={`p-3 rounded-xl text-center font-bold ${shellFeedback === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {shellFeedback === 'correct' ? 'Correct! Perfect arrangement.' : 'Try again! Remember the 2,8,8 rule.'}
                              </div>
                            )}
                            <button onClick={generateShellPractice} className="w-full text-emerald-500 font-bold uppercase text-xs">Next Question</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button onClick={() => setSelectedSim(null)} className="w-full bg-gray-200 text-gray-500 py-4 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-gray-300 transition-all">
                    Back to Selection
                  </button>
                </div>
              )}

              {selectedSim === 'matter' && (
                <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">States of Matter</h3>
                      <p className="text-sky-500 font-black text-xl uppercase tracking-widest text-xs">Particle Theory</p>
                    </div>
                    <div className="bg-sky-100 text-sky-600 p-4 rounded-2xl">
                      <Thermometer size={32} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-gray-500 uppercase">Substance</label>
                          <select 
                            value={selectedMatter} 
                            onChange={e => setSelectedMatter(e.target.value)}
                            className="w-full p-3 border-2 border-gray-200 rounded-xl font-bold bg-white"
                          >
                            {chemicals.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-sky-500 uppercase">Temperature: {matterTemp}°C</label>
                          <input 
                            type="range" 
                            min="-273" 
                            max="3000" 
                            value={matterTemp} 
                            onChange={e => setMatterTemp(parseInt(e.target.value))} 
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-500" 
                          />
                        </div>
                      </div>

                      {(() => {
                        const chem = chemicals.find(c => c.name === selectedMatter)!;
                        const state = getMatterState(matterTemp, chem);
                        return (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                              <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current State</p>
                                <h4 className={`text-3xl font-black uppercase tracking-tight ${state === 'Solid' ? 'text-blue-600' : state === 'Liquid' ? 'text-sky-500' : 'text-orange-500'}`}>
                                  {state}
                                </h4>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Melting: {chem.mp}°C</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Boiling: {chem.bp}°C</p>
                              </div>
                            </div>

                            <div className="relative h-64 bg-gray-900 rounded-2xl overflow-hidden border-4 border-gray-200">
                              {[...Array(36)].map((_, i) => {
                                const row = Math.floor(i / 6);
                                const col = i % 6;
                                
                                // Base positions for Solid (centered grid)
                                const solidX = 30 + col * 8;
                                const solidY = 30 + row * 8;
                                
                                // Base positions for Liquid (bottom cluster)
                                const liquidX = 20 + Math.random() * 60;
                                const liquidY = 60 + Math.random() * 30;
                                
                                // Base positions for Gas (anywhere)
                                const gasX = Math.random() * 90;
                                const gasY = Math.random() * 90;

                                return (
                                  <motion.div
                                    key={`${selectedMatter}-${state}-${i}`}
                                    className={`absolute w-4 h-4 rounded-full ${chem.bg} shadow-lg`}
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
                                      duration: state === 'Solid' ? 0.2 : state === 'Liquid' ? 3 : 5,
                                      repeat: Infinity,
                                      ease: "linear"
                                    }}
                                  />
                                );
                              })}
                              {state === 'Gas' && (
                                <div className="absolute inset-0 pointer-events-none bg-white/5" />
                              )}
                            </div>

                            <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-100 italic text-sm text-sky-800">
                              {state === 'Solid' && "Particles are closely packed in a regular arrangement, vibrating about fixed positions."}
                              {state === 'Liquid' && "Particles are closely packed but in an irregular arrangement, able to slide past each other."}
                              {state === 'Gas' && "Particles are far apart and move rapidly in random directions."}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="space-y-6">
                      <div className="bg-sky-50 p-6 rounded-2xl border-2 border-sky-100">
                        <h4 className="text-sm font-black text-sky-600 uppercase tracking-widest mb-4">Practice Mode</h4>
                        {!matterPractice ? (
                          <button onClick={generateMatterPractice} className="w-full bg-sky-500 text-white py-3 rounded-xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#0369a1]">
                            Start Practice
                          </button>
                        ) : (
                          <div className="space-y-4">
                            <div className="text-center p-4 bg-white rounded-xl border-2 border-sky-200">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">What is the state of</p>
                              <h5 className="text-2xl font-black text-gray-800 uppercase tracking-tight">{matterPractice.chem.name}</h5>
                              <p className="text-sky-500 font-black text-xl">at {matterPractice.temp}°C?</p>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {['Solid', 'Liquid', 'Gas'].map(s => (
                                <button
                                  key={s}
                                  onClick={() => setMatterAnswer(s)}
                                  className={`py-3 rounded-xl font-black uppercase tracking-widest border-2 transition-all ${matterAnswer === s ? 'bg-sky-500 text-white border-sky-600' : 'bg-white text-gray-500 border-gray-200 hover:border-sky-300'}`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                            <button 
                              onClick={() => {
                                if (matterAnswer === matterPractice.targetState) {
                                  setMatterFeedback('correct');
                                } else {
                                  setMatterFeedback('incorrect');
                                }
                              }} 
                              className="w-full bg-sky-500 text-white py-3 rounded-xl font-black uppercase tracking-widest"
                            >
                              Check Answer
                            </button>
                            {matterFeedback && (
                              <div className={`p-3 rounded-xl text-center font-bold ${matterFeedback === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {matterFeedback === 'correct' ? 'Correct! You understand state changes.' : `Incorrect. At ${matterPractice.temp}°C, ${matterPractice.chem.name} is a ${matterPractice.targetState}.`}
                              </div>
                            )}
                            <button onClick={generateMatterPractice} className="w-full text-sky-500 font-bold uppercase text-xs">Next Question</button>
                          </div>
                        )}
                      </div>
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
                      <p className="text-orange-500 font-black text-xl uppercase tracking-widest text-xs">Concentration Gradient</p>
                    </div>
                    <div className="bg-orange-100 text-orange-600 p-4 rounded-2xl">
                      <ArrowRightLeft size={32} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Left Side Setup</h4>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-red-500 uppercase">Red Particles: {redLeft}</label>
                        <input type="range" min="0" max="50" value={redLeft} onChange={e => setRedLeft(parseInt(e.target.value))} disabled={isPartitionRemoved} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-blue-500 uppercase">Blue Particles: {blueLeft}</label>
                        <input type="range" min="0" max="50" value={blueLeft} onChange={e => setBlueLeft(parseInt(e.target.value))} disabled={isPartitionRemoved} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Right Side Setup</h4>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-red-500 uppercase">Red Particles: {redRight}</label>
                        <input type="range" min="0" max="50" value={redRight} onChange={e => setRedRight(parseInt(e.target.value))} disabled={isPartitionRemoved} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-blue-500 uppercase">Blue Particles: {blueRight}</label>
                        <input type="range" min="0" max="50" value={blueRight} onChange={e => setBlueRight(parseInt(e.target.value))} disabled={isPartitionRemoved} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                      </div>
                    </div>
                  </div>

                  <div className="relative h-64 bg-gray-900 rounded-2xl overflow-hidden border-4 border-gray-200 mb-8" ref={simRef}>
                    {particles.map(p => (
                      <motion.div
                        key={p.id}
                        className={`absolute w-3 h-3 rounded-full ${p.type === 'red' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]'}`}
                        style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      />
                    ))}
                    {!isPartitionRemoved && (
                      <div className="absolute inset-y-0 left-1/2 w-1 bg-white/30 backdrop-blur-sm -translate-x-1/2 z-10" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-100 text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Left Side</p>
                      <div className="flex justify-center gap-4">
                        <span className="text-red-500 font-black">R: {counts.leftRed}</span>
                        <span className="text-blue-500 font-black">B: {counts.leftBlue}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-100 text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Right Side</p>
                      <div className="flex justify-center gap-4">
                        <span className="text-red-500 font-black">R: {counts.rightRed}</span>
                        <span className="text-blue-500 font-black">B: {counts.rightBlue}</span>
                      </div>
                    </div>
                  </div>

                  {isPartitionRemoved && (
                    <div className={`p-4 rounded-xl mb-8 text-center font-black uppercase tracking-tight ${netDiffusion === 'equilibrium' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
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

                  <div className="flex gap-4">
                    {!isPartitionRemoved ? (
                      <button
                        onClick={() => setIsPartitionRemoved(true)}
                        className="flex-1 bg-orange-500 text-white py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_0_#c2410c] active:shadow-none active:translate-y-1 transition-all"
                      >
                        Remove Partition
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsPartitionRemoved(false);
                          initParticles();
                        }}
                        className="flex-1 bg-gray-200 text-gray-500 py-4 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-gray-300 transition-all"
                      >
                        Reset Simulation
                      </button>
                    )}
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
          </main>
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
    const revisionNumber = "1.7.0";
    
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
              href="https://github.com/Tomanlam/Y8-Revision" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-gray-900 text-white p-4 rounded-2xl hover:bg-gray-800 transition-colors group"
            >
              <span className="font-bold text-sm truncate mr-2">github.com/Tomanlam/Y8-Revision</span>
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
      {['dashboard', 'playground', 'user-stats', 'about'].includes(mode) && (
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
