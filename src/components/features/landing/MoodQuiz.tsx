import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Progress } from '../../ui/progress';
import { ChevronRight } from 'lucide-react';
import { quizQuestions, moods } from '../../../lib/mockData';

export default function MoodQuiz({ onComplete }: { onComplete: (mood: string) => void }) {
  const [quizStarted, setQuizStarted] = useState(true); // render as soon as used
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [moodScores, setMoodScores] = useState<Record<string, number>>({
    chill: 0, active: 0, social: 0, educational: 0,
  });
  const [quizComplete, setQuizComplete] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');

  const handleAnswer = (mood: string) => {
    const newScores = { ...moodScores, [mood]: moodScores[mood] + 1 };
    setMoodScores(newScores);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const topMood = Object.entries(newScores).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0];
      setSelectedMood(topMood);
      setQuizComplete(true);
    }
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="container mx-auto px-6 py-12 relative z-10">
      <AnimatePresence mode="wait">
        {quizStarted && !quizComplete && (
          <motion.div
            key="quiz-body"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-xl"
          >
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <motion.h3
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl mb-6 text-gray-800"
            >
              {quizQuestions[currentQuestion].question}
            </motion.h3>

            <div className="grid gap-4">
              {quizQuestions[currentQuestion].options.map((option, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option.mood)}
                  className="p-4 text-left rounded-2xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
                >
                  <span className="text-gray-700 group-hover:text-purple-700">
                    {option.text}
                  </span>
                  <ChevronRight className="inline-block ml-2 w-4 h-4 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {quizComplete && (
          <motion.div
            key="quiz-result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-6xl mb-4"
            >
              {moods.find(m => m.id === selectedMood)?.emoji}
            </motion.div>
            <h3 className="text-3xl mb-2">You're feeling:</h3>
            <p className="text-4xl mb-8" style={{ color: moods.find(m => m.id === selectedMood)?.color }}>
              {moods.find(m => m.id === selectedMood)?.name}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onComplete(selectedMood)}
              className="px-8 py-4 bg-purple-600 text-white rounded-xl text-lg font-semibold hover:bg-purple-700 hover:shadow-lg transition-all"
            >
              See Matching Events
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}