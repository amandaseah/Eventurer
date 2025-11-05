import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Progress } from "../../ui/progress";
import { ChevronRight } from "lucide-react";
import { quizQuestions, moods } from "../../../lib/mockData";

type MoodId = "chill" | "active" | "social" | "educational";

export default function MoodQuiz({ onComplete }: { onComplete: (mood: string) => void }) {
  // keep the behavior you had (quiz opens immediately)
  const [quizStarted, setQuizStarted] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodId | "">("");

  // use functional updates to avoid stale state
  const [moodScores, setMoodScores] = useState<Record<MoodId, number>>({
    chill: 0, active: 0, social: 0, educational: 0,
  });

  // remember last picked mood (used as a tie-breaker)
  const lastAnswerRef = useRef<MoodId | null>(null);

  const totalQuestions = quizQuestions.length;
  const progress = useMemo(() => {
    if (!quizStarted || totalQuestions === 0) return 0;
    return ((currentQuestion + 1) / totalQuestions) * 100;
  }, [currentQuestion, quizStarted, totalQuestions]);

  const finalizeQuiz = useCallback((scores: Record<MoodId, number>) => {
    // find max score(s)
    const max = Math.max(...Object.values(scores));
    const top = (Object.entries(scores) as [MoodId, number][])
      .filter(([, v]) => v === max)
      .map(([k]) => k);

    // tie-breaker: prefer the most recent answer if it’s among ties, else first
    const winner =
      (lastAnswerRef.current && top.includes(lastAnswerRef.current)
        ? lastAnswerRef.current
        : top[0]) ?? "chill";

    setSelectedMood(winner);
    setQuizComplete(true);
  }, []);

  const handleAnswer = useCallback(
    (mood: MoodId) => {
      lastAnswerRef.current = mood;
      setMoodScores(prev => {
        const next = { ...prev, [mood]: prev[mood] + 1 };
        // move to next question or finalize
        setCurrentQuestion(q => {
          if (q < totalQuestions - 1) return q + 1;
          // finished
          finalizeQuiz(next);
          return q;
        });
        return next;
      });
    },
    [finalizeQuiz, totalQuestions]
  );

  // keyboard shortcuts: 1..N picks the option
  useEffect(() => {
    if (!quizStarted || quizComplete) return;

    const keyHandler = (e: KeyboardEvent) => {
      const q = quizQuestions[currentQuestion];
      if (!q) return;
      // map keys "1".."9" to answers
      const index = Number(e.key) - 1;
      if (index >= 0 && index < q.options.length) {
        const mood = q.options[index].mood as MoodId;
        handleAnswer(mood);
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [quizStarted, quizComplete, currentQuestion, handleAnswer]);

  const retake = () => {
    setQuizStarted(true);
    setQuizComplete(false);
    setCurrentQuestion(0);
    setSelectedMood("");
    lastAnswerRef.current = null;
    setMoodScores({ chill: 0, active: 0, social: 0, educational: 0 });
  };

  // defensive: no questions available
  if (!totalQuestions) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-6 shadow">
          <p className="text-center text-gray-700">No quiz questions available.</p>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="container mx-auto px-6 py-12 relative z-10">
      <AnimatePresence mode="wait">
        {quizStarted && !quizComplete && (
          <motion.div
            key="quiz-body"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-xl"
            role="group"
            aria-labelledby="quiz-question"
          >
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of {totalQuestions}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <motion.h3
              id="quiz-question"
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl mb-6 text-gray-800"
            >
              {question.question}
            </motion.h3>

            <div className="grid gap-4" role="listbox" aria-label="Quiz options">
              {question.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  type="button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option.mood as MoodId)}
                  className="p-4 text-left rounded-2xl border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all group focus:outline-none focus:ring-2 focus:ring-pink-200"
                  aria-selected="false"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 group-hover:text-pink-600">
                      {option.text}
                    </span>
                    <span className="ml-3 inline-flex items-center text-xs text-gray-400 group-hover:text-pink-500">
                      {idx + 1}
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={retake}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Retake quiz
              </button>
            </div>
          </motion.div>
        )}

        {quizComplete && (
          <motion.div
            key="quiz-result"
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.15 }}
              className="text-6xl mb-4"
              aria-hidden="true"
            >
              {moods.find(m => m.id === selectedMood)?.emoji}
            </motion.div>

            <h3 className="text-3xl mb-2">You're feeling:</h3>
            <p
              className="text-4xl mb-8"
              style={{ color: moods.find(m => m.id === selectedMood)?.color }}
            >
              {moods.find(m => m.id === selectedMood)?.name}
            </p>

            <div className="flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onComplete(selectedMood)}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-pink-400 text-white rounded-xl text-base sm:text-lg font-semibold hover:bg-pink-500 hover:shadow-lg transition-all"
              >
                See Matching Events
              </motion.button>

              <button
                type="button"
                onClick={retake}
                className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Retake
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}