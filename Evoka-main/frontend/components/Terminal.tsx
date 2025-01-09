import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface TerminalProps {
  messages: Message[];
  isSimulating: boolean;
  sessionId?: string;
  onProgress?: (currentIndex: number, isComplete: boolean) => void;
}

/**
 * Terminal component for Evoka AI.
 * Provides a real-time terminal interface to display messages and logs.
 */
export default function Terminal({ messages, isSimulating, sessionId, onProgress }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const processNextMessage = async () => {
      if (!isSimulating || currentMessageIndex >= messages.length) {
        if (onProgress && currentMessageIndex > 0) {
          onProgress(currentMessageIndex, true);
        }
        return;
      }

      const message = messages[currentMessageIndex];

      setVisibleMessages((prev) => [...prev, { ...message, content: '' }]);
      setIsTyping(true);

      for (let i = 0; i < message.content.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 30));
        setVisibleMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            ...message,
            content: message.content.slice(0, i + 1),
          };
          return updatedMessages;
        });
      }

      setIsTyping(false);
      setCurrentMessageIndex((prev) => prev + 1);
    };

    if (!isTyping) {
      processNextMessage();
    }
  }, [isTyping, isSimulating, messages, currentMessageIndex, onProgress]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleMessages]);

  return (
    <div className="h-full flex flex-col bg-terminal-black/95 border border-cyber-blue/30 rounded-lg overflow-hidden">
      {/* Terminal Header */}
      <div className="flex-none flex items-center justify-between p-4 bg-terminal-black/90 border-b border-cyber-blue/30">
        <div className="text-sm text-gray-400">Evoka AI Terminal</div>
        <div className="text-xs text-cyber-blue">Session ID: {sessionId || 'N/A'}</div>
      </div>

      {/* Terminal Content */}
      <div ref={terminalRef} className="flex-1 overflow-auto p-4 font-mono text-sm text-gray-300">
        <AnimatePresence>
          {visibleMessages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="mb-2"
            >
              <span
                className={`$ {
                  message.role === 'system' ? 'text-cyber-green' :
                  message.role === 'user' ? 'text-cyber-blue' :
                  'text-cyber-purple'
                }`}
              >
                [{new Date(message.timestamp).toLocaleTimeString()}]
              </span>{' '}
              {message.content}
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && <div className="text-cyber-purple animate-pulse">Typing...</div>}
      </div>
    </div>
  );
}
