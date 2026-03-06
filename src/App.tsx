import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Brain, Trophy, ArrowRight, CheckCircle2, XCircle, Play, RotateCcw, Volume2, VolumeX, Sparkles, Loader2, Lightbulb } from 'lucide-react';
import { generateGameRounds, Round } from './services/gemini';
import { rounds as staticRounds } from './data';

type GameState = 'intro' | 'generating' | 'playing' | 'round_result' | 'game_over' | 'error';

const FloatingOrbs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-float" style={{ animationDuration: '8s' }}></div>
    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-float" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-float" style={{ animationDuration: '9s', animationDelay: '2s' }}></div>
  </div>
);

export default function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [team1Name, setTeam1Name] = useState('Команда 1');
  const [team2Name, setTeam2Name] = useState('Команда 2');
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [activeHint, setActiveHint] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      if (isMusicPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying]);

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  const startGame = async () => {
    setGameState('generating');
    setErrorMessage(null);
    try {
      const generatedRounds = await generateGameRounds(10);
      setRounds(generatedRounds);
      setCurrentRound(0);
      setTeam1Score(0);
      setTeam2Score(0);
      setShowAnswer(false);
      setActiveHint(null);
      setGameState('playing');
    } catch (error: any) {
      console.error("Failed to generate rounds, falling back to static data:", error);
      
      // Fallback to static data
      const normalizedStaticRounds: Round[] = staticRounds.map(r => ({
        id: r.id,
        imageUrls: r.images,
        hints: ["Подсказка 1", "Подсказка 2", "Подсказка 3"], // Default hints for static data
        answer: r.answer,
        explanation: r.explanation
      }));
      
      setRounds(normalizedStaticRounds);
      setCurrentRound(0);
      setTeam1Score(0);
      setTeam2Score(0);
      setShowAnswer(false);
      setActiveHint(null);
      setGameState('playing');
      
      // Optional: show a small notification that we are using pre-defined rounds
      console.log("Using static fallback rounds due to API error.");
    }
  };

  const handleRevealAnswer = () => {
    setShowAnswer(true);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#818cf8', '#34d399', '#fbbf24', '#f472b6']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#818cf8', '#34d399', '#fbbf24', '#f472b6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleAssignPoint = (team: 1 | 2 | 0) => {
    if (team === 1) {
      setTeam1Score(s => s + 1);
      triggerConfetti();
    }
    if (team === 2) {
      setTeam2Score(s => s + 1);
      triggerConfetti();
    }
    
    setGameState('round_result');
  };

  const nextRound = () => {
    if (currentRound < rounds.length - 1) {
      setCurrentRound(r => r + 1);
      setShowAnswer(false);
      setActiveHint(null);
      setGameState('playing');
    } else {
      setGameState('game_over');
      triggerConfetti();
    }
  };

  const round = rounds[currentRound];

  return (
    <div className="min-h-screen bg-dynamic text-slate-100 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      <FloatingOrbs />
      
      {/* Background Music */}
      <audio 
        ref={audioRef} 
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3" 
        loop 
      />

      <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen flex flex-col relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200 drop-shadow-sm">
              Где логика?
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleMusic}
              className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all backdrop-blur-md"
              title={isMusicPlaying ? "Выключить музыку" : "Включить музыку"}
            >
              {isMusicPlaying ? <Volume2 className="w-5 h-5 text-indigo-300" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
            </button>

            {gameState !== 'intro' && gameState !== 'generating' && (
              <div className="flex items-center gap-6 glass-panel px-6 py-3 rounded-2xl">
                <div className="text-center">
                  <div className="text-sm text-indigo-200 font-medium mb-1">{team1Name}</div>
                  <div className="text-3xl font-black text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]">{team1Score}</div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div className="text-center">
                  <div className="text-sm text-emerald-200 font-medium mb-1">{team2Name}</div>
                  <div className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">{team2Score}</div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            {gameState === 'intro' && (
              <motion.div 
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto w-full glass-panel p-10 rounded-3xl"
              >
                <div className="text-center mb-10">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-4xl font-black text-white mb-3">Готовы играть?</h2>
                  <p className="text-indigo-200">Каждая игра уникальна. Мы подготовим новые загадки специально для вас!</p>
                </div>

                <div className="space-y-5 mb-10">
                  <div>
                    <label className="block text-sm font-semibold text-indigo-200 mb-2 uppercase tracking-wider">Команда 1</label>
                    <input 
                      type="text" 
                      value={team1Name}
                      onChange={(e) => setTeam1Name(e.target.value)}
                      className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
                      placeholder="Название первой команды"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-emerald-200 mb-2 uppercase tracking-wider">Команда 2</label>
                    <input 
                      type="text" 
                      value={team2Name}
                      onChange={(e) => setTeam2Name(e.target.value)}
                      className="w-full bg-slate-900/50 border border-emerald-500/30 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
                      placeholder="Название второй команды"
                    />
                  </div>
                </div>

                <button 
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/25"
                >
                  <Play className="w-6 h-6 fill-current" />
                  Создать игру и начать
                </button>
              </motion.div>
            )}

            {gameState === 'generating' && (
              <motion.div 
                key="generating"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center max-w-md mx-auto"
              >
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-12 h-12 text-indigo-400 animate-pulse" />
                  </div>
                </div>
                <h2 className="text-3xl font-black text-white mb-4">Подготовка игры...</h2>
                <p className="text-indigo-200 text-lg">Создаем уникальные загадки, загружаем картинки и придумываем подсказки.</p>
              </motion.div>
            )}

            {gameState === 'playing' && round && (
              <motion.div 
                key="playing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full flex flex-col items-center"
              >
                <div className="mb-10 text-center">
                  <span className="inline-block px-5 py-2 glass-panel rounded-full text-sm font-bold text-indigo-200 tracking-widest uppercase mb-6">
                    Раунд {currentRound + 1} из {rounds.length}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-md">
                    Что общего между этими картинками?
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-28">
                  {round.imageUrls.map((imgUrl, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className="relative group"
                      onMouseEnter={() => setActiveHint(idx)}
                      onMouseLeave={() => setActiveHint(null)}
                      onClick={() => setActiveHint(activeHint === idx ? null : idx)}
                    >
                      <div className="aspect-square rounded-3xl overflow-hidden glass-panel p-2 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] group-hover:-translate-y-2 cursor-pointer">
                        <div className="w-full h-full rounded-2xl overflow-hidden relative">
                          <img 
                            src={imgUrl} 
                            alt={`Картинка ${idx + 1}`} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                            <Lightbulb className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-bounce" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Hint Tooltip */}
                      <AnimatePresence>
                        {activeHint === idx && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 translate-y-full w-11/12 z-20"
                          >
                            <div className="bg-slate-800/90 backdrop-blur-xl border border-indigo-500/50 p-4 rounded-2xl text-center shadow-2xl shadow-indigo-500/20">
                              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-800 border-t border-l border-indigo-500/50 rotate-45"></div>
                              <p className="text-indigo-100 font-medium relative z-10">{round.hints[idx]}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {!showAnswer && (
                  <button 
                    onClick={handleRevealAnswer}
                    className="glass-panel hover:bg-white/10 text-white font-bold py-5 px-10 rounded-2xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] text-lg"
                  >
                    Показать правильный ответ
                  </button>
                )}

                <AnimatePresence>
                  {showAnswer && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
                    >
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="w-full max-w-3xl bg-slate-800/70 backdrop-blur-xl border border-white/10 p-10 rounded-3xl text-center shadow-[0_0_40px_rgba(99,102,241,0.2)]"
                      >
                        <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 mb-6 drop-shadow-lg">
                          {round.answer}
                        </h3>
                        <p className="text-indigo-100 text-xl mb-10 leading-relaxed">{round.explanation}</p>
                        
                        <div className="space-y-5">
                          <p className="text-sm font-bold text-indigo-300 uppercase tracking-widest">Кто ответил правильно?</p>
                          <div className="flex flex-wrap justify-center gap-4">
                            <button 
                              onClick={() => handleAssignPoint(1)}
                              className="flex-1 min-w-[200px] bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/50 text-indigo-200 py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 font-bold text-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                            >
                              <CheckCircle2 className="w-6 h-6" />
                              {team1Name}
                            </button>
                            <button 
                              onClick={() => handleAssignPoint(2)}
                              className="flex-1 min-w-[200px] bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/50 text-emerald-200 py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 font-bold text-lg hover:shadow-[0_0_20px_rgba(52,211,153,0.4)]"
                            >
                              <CheckCircle2 className="w-6 h-6" />
                              {team2Name}
                            </button>
                            <button 
                              onClick={() => handleAssignPoint(0)}
                              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 font-medium"
                            >
                              <XCircle className="w-5 h-5" />
                              Никто не угадал
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {gameState === 'round_result' && (
              <motion.div 
                key="round_result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center"
              >
                <div className="glass-panel inline-block p-12 rounded-full mb-10 shadow-[0_0_50px_rgba(234,179,8,0.3)]">
                  <Trophy className="w-28 h-28 text-yellow-400 mx-auto drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
                </div>
                <h2 className="text-4xl font-black text-white mb-10 drop-shadow-md">Счет обновлен!</h2>
                
                <button 
                  onClick={nextRound}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-5 px-10 rounded-2xl flex items-center justify-center gap-3 mx-auto transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(99,102,241,0.4)] text-lg"
                >
                  {currentRound < rounds.length - 1 ? 'Следующий раунд' : 'Показать итоги'}
                  <ArrowRight className="w-6 h-6" />
                </button>
              </motion.div>
            )}

            {gameState === 'game_over' && (
              <motion.div 
                key="game_over"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto w-full glass-panel p-16 rounded-[3rem] text-center shadow-[0_0_60px_rgba(99,102,241,0.3)] relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                
                <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-8 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]" />
                <h2 className="text-5xl font-black text-white mb-4 drop-shadow-lg">Игра окончена!</h2>
                <p className="text-indigo-200 text-xl mb-16 font-medium uppercase tracking-widest">Финальный счет</p>

                <div className="flex items-center justify-center gap-10 mb-16">
                  <div className={`flex-1 p-8 rounded-3xl border-2 transition-all ${team1Score > team2Score ? 'bg-indigo-500/20 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.3)] scale-105' : 'bg-white/5 border-white/10'}`}>
                    <div className="text-indigo-200 font-bold mb-4 text-lg">{team1Name}</div>
                    <div className={`text-8xl font-black drop-shadow-lg ${team1Score > team2Score ? 'text-indigo-300' : 'text-white'}`}>
                      {team1Score}
                    </div>
                    {team1Score > team2Score && <div className="text-indigo-300 text-sm font-black uppercase tracking-widest mt-6 bg-indigo-500/20 py-2 rounded-lg">Победитель</div>}
                  </div>
                  
                  <div className="text-5xl font-black text-white/20">:</div>
                  
                  <div className={`flex-1 p-8 rounded-3xl border-2 transition-all ${team2Score > team1Score ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.3)] scale-105' : 'bg-white/5 border-white/10'}`}>
                    <div className="text-emerald-200 font-bold mb-4 text-lg">{team2Name}</div>
                    <div className={`text-8xl font-black drop-shadow-lg ${team2Score > team1Score ? 'text-emerald-300' : 'text-white'}`}>
                      {team2Score}
                    </div>
                    {team2Score > team1Score && <div className="text-emerald-300 text-sm font-black uppercase tracking-widest mt-6 bg-emerald-500/20 py-2 rounded-lg">Победитель</div>}
                  </div>
                </div>

                {team1Score === team2Score && (
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-16 drop-shadow-lg">
                    Ничья! Победила дружба!
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mx-auto">
                  <button 
                    onClick={startGame}
                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-5 px-10 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(99,102,241,0.4)] text-lg"
                  >
                    <RotateCcw className="w-6 h-6" />
                    Играть снова (те же команды)
                  </button>
                  
                  <button 
                    onClick={() => setGameState('intro')}
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-5 px-10 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-lg"
                  >
                    <Play className="w-6 h-6" />
                    Изменить команды
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
