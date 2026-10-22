import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AIAssistant({ currentTab }: { currentTab?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col"
          >
            <div className="px-4 py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-b border-gray-700 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-100">AI Assistant</h3>
                  <p className="text-xs text-gray-400">LedgerCore Factory Helper</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%] bg-gray-800 text-gray-200 rounded-2xl px-4 py-2">
                  <p className="text-sm">
                    Hi! I'm the LedgerCore Factory AI assistant. How can I help you today?
                  </p>
                  <div className="mt-3 space-y-2">
                    <button className="block w-full text-left text-xs px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                      💡 How to start using Factory?
                    </button>
                    <button className="block w-full text-left text-xs px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                      💡 What is spec/ledgercore.yaml?
                    </button>
                    <button className="block w-full text-left text-xs px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                      💡 What compliance standards are supported?
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white text-sm font-medium transition-colors">
                  →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
