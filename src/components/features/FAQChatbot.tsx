import { useState, useRef, useEffect, useMemo } from 'react';
import { bringToFront } from '../../directives/draggable';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue } from 'motion/react';
import { getChatbotResponse } from '../../lib/gemini';
import { registerFloating, unregisterFloating, updateFloatingCorner } from '../../lib/floatingRegistry';

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  isLoading?: boolean;
}

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const getSpacing = () => {
  if (typeof window === 'undefined') return 16;
  return window.innerWidth >= 640 ? 24 : 16;
};

const getTopOffset = () => {
  if (typeof window === 'undefined') return 72;
  return window.innerWidth >= 640 ? 96 : 72;
};

const getCornerStyle = (corner: Corner, spacing: number) => {
  const style: Record<'top' | 'bottom' | 'left' | 'right', number | 'auto'> = {
    top: 'auto',
    bottom: 'auto',
    left: 'auto',
    right: 'auto',
  };

  if (corner.startsWith('top')) {
    style.top = getTopOffset() + spacing;
  } else {
    style.bottom = spacing;
  }

  if (corner.endsWith('left')) {
    style.left = spacing;
  } else {
    style.right = spacing;
  }

  return style;
};

const determineCorner = (pointX: number, pointY: number): Corner => {
  if (typeof window === 'undefined') return 'bottom-right';
  const horizontal = pointX < window.innerWidth / 2 ? 'left' : 'right';
  const vertical = pointY < window.innerHeight / 2 ? 'top' : 'bottom';
  return `${vertical}-${horizontal}` as Corner;
};

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
  const [corner, setCorner] = useState<Corner>('bottom-right');
  const [spacing, setSpacing] = useState(() => getSpacing());
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef('faq-chatbot');

  useEffect(() => {
    const handleResize = () => setSpacing(getSpacing());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cornerStyle = useMemo(() => getCornerStyle(corner, spacing), [corner, spacing]);
  const isLeftCorner = corner.endsWith('left');

  useEffect(() => {
    const id = idRef.current;
    const el = containerRef.current;
    if (!el) return;
    registerFloating(id, el, corner);
    return () => unregisterFloating(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateFloatingCorner(idRef.current, corner);
  }, [corner]);

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
      <motion.div
    ref={containerRef}
    className={`fixed z-40 flex flex-col-reverse gap-3 sm:gap-4 ${isLeftCorner ? 'items-start' : 'items-end'}`}
        drag
        dragMomentum={false}
        dragElastic={0.2}
        dragListener={true}
    onPointerDown={() => bringToFront(containerRef.current)}
    style={{ ...cornerStyle, x, y }}
        onDragEnd={(_, info) => {
          const newCorner = determineCorner(info.point.x, info.point.y);
          setCorner(newCorner);
          x.set(0);
          y.set(0);
        }}
      >
        {/* Floating Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 sm:p-4 rounded-full bg-pink-500 text-white shadow-lg hover:shadow-xl hover:bg-pink-600 transition-all"
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
              className="w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
              onPointerDown={event => event.stopPropagation()}
            >
            {/* Header */}
            <div className="bg-pink-500 p-3 sm:p-4">
              <div
                className={`flex items-center gap-2 ${
                  isLeftCorner ? 'justify-start' : 'justify-between'
                }`}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className={`p-1 rounded-full transition-colors hover:bg-white/20 text-white ${
                    isLeftCorner ? 'order-1' : 'order-2'
                  }`}
                  aria-label="Close FAQ chatbot"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
                <div
                  className={`flex items-center gap-2 text-sm sm:text-base font-semibold text-white ${
                    isLeftCorner ? 'order-2 text-left' : 'order-1'
                  }`}
                >
                  <h3>FAQ Assistant</h3>
                </div>
              </div>
              <p className="text-white/90 text-xs mt-1">Ask me anything</p>
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
      </motion.div>
    </>
  );
}
