import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { searchFAQ, FAQItem } from '../../data/faqData';

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  faqResults?: FAQItem[];
}

export function FAQChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      type: 'bot',
      content: "Hi! I'm here to help answer your questions. Type your question below and I'll search our FAQ database.",
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length,
      type: 'user',
      content: input,
    };

    const results = searchFAQ(input);

    let botMessage: Message;

    if (results.length > 0) {
      botMessage = {
        id: messages.length + 1,
        type: 'bot',
        content: `I found ${results.length} answer${results.length > 1 ? 's' : ''} that might help:`,
        faqResults: results,
      };
    } else {
      botMessage = {
        id: messages.length + 1,
        type: 'bot',
        content: "I couldn't find an exact match for your question. Please try rephrasing it, or contact us at eventurer.support@gmail.com for personalized assistance.",
      };
    }

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 sm:right-6 bottom-20 sm:bottom-24 z-40 p-3 sm:p-4 rounded-full bg-pink-500 text-white shadow-lg hover:shadow-xl hover:bg-pink-600 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open FAQ chatbot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed right-4 sm:right-6 bottom-36 sm:bottom-40 z-40 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-pink-500 p-3 sm:p-4">
              <h3 className="text-white font-semibold text-sm sm:text-base">FAQ Assistant</h3>
              <p className="text-white/90 text-xs">Ask me anything</p>
            </div>

            {/* Messages */}
            <div className="h-64 sm:h-96 overflow-y-auto p-3 sm:p-4 space-y-3 bg-gray-50">
              {messages.map(message => (
                <div key={message.id}>
                  <div
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm ${
                        message.type === 'user'
                          ? 'bg-pink-500 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>

                  {/* FAQ Results */}
                  {message.faqResults && message.faqResults.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.faqResults.map(faq => (
                        <div
                          key={faq.id}
                          className="ml-0 bg-white rounded-xl p-3 border border-gray-200 shadow-sm"
                        >
                          <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">
                            {faq.question}
                          </h4>
                          <p className="text-gray-600 text-xs leading-relaxed">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question..."
                  className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2 sm:p-2.5 rounded-xl bg-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-600 transition-all"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
