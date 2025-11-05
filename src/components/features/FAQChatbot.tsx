import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getChatbotResponse } from '../../lib/gemini';

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  isLoading?: boolean;
}

export function FAQChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      type: 'bot',
      content: "Hi! I'm your Eventurer FAQ assistant. I'm here to help answer any questions you have about using the platform. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length,
      type: 'user',
      content: input,
    };

    const loadingMessage: Message = {
      id: messages.length + 1,
      type: 'bot',
      content: '',
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatbotResponse(input);

      setMessages(prev =>
        prev.map(msg =>
          msg.id === loadingMessage.id
            ? { ...msg, content: response, isLoading: false }
            : msg
        )
      );
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === loadingMessage.id
            ? {
                ...msg,
                content: "Sorry, I'm experiencing technical difficulties. Please try again or contact support at eventurer.support@gmail.com.",
                isLoading: false
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
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
                      {message.isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      )}
                    </div>
                  </div>
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
                  disabled={!input.trim() || isLoading}
                  className="p-2 sm:p-2.5 rounded-xl bg-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-600 transition-all"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
