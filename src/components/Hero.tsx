import { motion } from 'framer-motion';

export function Hero() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6"
      >
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        <span className="text-emerald-400 text-sm font-medium">v2.0 — Production Ready</span>
      </motion.div>

      <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
        LedgerCore Factory
      </h1>
      <p className="text-xl text-gray-400 mb-8">
        Spec → Production Code Generator
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {[
          { icon: '⚡', title: '30 Seconds', desc: 'From spec to production-ready repo' },
          { icon: '🛡️', title: 'Compliance Built-in', desc: 'PCI DSS, SOC2, GDPR, DORA' },
          { icon: '🔐', title: 'Your IP', desc: 'Full ownership, no vendor lock-in' }
        ].map((f, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="text-lg font-bold text-gray-100 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
