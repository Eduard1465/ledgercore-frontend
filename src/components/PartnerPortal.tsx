import { useState } from 'react';
import { motion } from 'framer-motion';

export function PartnerPortal() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const partners = [
    { name: 'EPAM Systems', status: 'certified', deals: 12, revenue: '$2.4M', level: 'Platinum' },
    { name: 'ЛАНИТ', status: 'certified', deals: 8, revenue: '$1.6M', level: 'Gold' },
    { name: 'CROC', status: 'certified', deals: 5, revenue: '$950K', level: 'Silver' },
    { name: 'Бутик SI', status: 'pending', deals: 2, revenue: '$350K', level: 'Bronze' },
  ];

  const deals = [
    { id: 'D-001', partner: 'EPAM Systems', client: 'Acme Bank', value: '$300K', status: 'closed', date: '2024-01-15' },
    { id: 'D-002', partner: 'ЛАНИТ', client: 'Crypto Exchange', value: '$250K', status: 'active', date: '2024-01-20' },
    { id: 'D-003', partner: 'CROC', client: 'Neobank', value: '$180K', status: 'negotiation', date: '2024-01-22' },
    { id: 'D-004', partner: 'EPAM Systems', client: 'Payment Platform', value: '$420K', status: 'active', date: '2024-01-25' },
  ];

  const certifications = [
    { name: 'Certified Factory Architect (CFA)', level: 'Advanced', holders: 45 },
    { name: 'Certified Factory Operator (CFO)', level: 'Intermediate', holders: 128 },
    { name: 'Factory Sales Specialist', level: 'Basic', holders: 234 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6"
        >
          <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          <span className="text-purple-400 text-sm font-medium">Partner Ecosystem</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">Partner Portal</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Manage partnerships, track deals, access resources, and grow your Factory business
        </p>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide"
      >
        {[
          { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
          { id: 'partners', label: '🤝 Partners', icon: '🤝' },
          { id: 'deals', label: '💼 Deals', icon: '💼' },
          { id: 'certifications', label: '🎓 Certifications', icon: '🎓' },
          { id: 'resources', label: '📚 Resources', icon: '📚' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeSection === tab.id
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Dashboard */}
      {activeSection === 'dashboard' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">4</div>
              <div className="text-xs text-gray-400">Active Partners</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-1">27</div>
              <div className="text-xs text-gray-400">Total Deals</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-1">$5.3M</div>
              <div className="text-xs text-gray-400">Total Revenue</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-orange-400 mb-1">407</div>
              <div className="text-xs text-gray-400">Certified Users</div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {deals.slice(0, 4).map((deal, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-gray-100">{deal.client}</div>
                    <div className="text-xs text-gray-400">{deal.partner} • {deal.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-400">{deal.value}</div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      deal.status === 'closed' ? 'bg-emerald-500/20 text-emerald-400' :
                      deal.status === 'active' ? 'bg-cyan-500/20 text-cyan-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {deal.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Partners */}
      {activeSection === 'partners' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-gray-100 mb-4">Partner Directory</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Partner</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Level</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Deals</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner, i) => (
                  <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-gray-200 font-medium">{partner.name}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        partner.status === 'certified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {partner.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        partner.level === 'Platinum' ? 'bg-purple-500/20 text-purple-400' :
                        partner.level === 'Gold' ? 'bg-yellow-500/20 text-yellow-400' :
                        partner.level === 'Silver' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {partner.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-cyan-400 font-bold">{partner.deals}</td>
                    <td className="py-3 px-4 text-center text-emerald-400 font-bold">{partner.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Deals */}
      {activeSection === 'deals' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-gray-100 mb-4">Deal Pipeline</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Deal ID</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Partner</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Client</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Value</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal, i) => (
                  <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-gray-200 font-mono">{deal.id}</td>
                    <td className="py-3 px-4 text-gray-300">{deal.partner}</td>
                    <td className="py-3 px-4 text-gray-300">{deal.client}</td>
                    <td className="py-3 px-4 text-center text-emerald-400 font-bold">{deal.value}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        deal.status === 'closed' ? 'bg-emerald-500/20 text-emerald-400' :
                        deal.status === 'active' ? 'bg-cyan-500/20 text-cyan-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {deal.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-400 font-mono">{deal.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Certifications */}
      {activeSection === 'certifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {certifications.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6"
              >
                <div className="text-3xl mb-3">🎓</div>
                <h3 className="text-lg font-bold text-gray-100 mb-2">{cert.name}</h3>
                <div className="text-sm text-gray-400 mb-3">Level: {cert.level}</div>
                <div className="text-sm text-purple-400 font-bold">{cert.holders} holders</div>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-100 mb-2">Become a Certified Partner</h3>
            <p className="text-gray-400 mb-4">Complete training and get certified to start selling Factory solutions</p>
            <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-all">
              Start Certification
            </button>
          </div>
        </motion.div>
      )}

      {/* Resources */}
      {activeSection === 'resources' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-lg font-bold text-gray-100 mb-2">Documentation</h3>
            <p className="text-sm text-gray-400 mb-4">Complete technical documentation and API references</p>
            <button className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-sm hover:bg-purple-500/30 transition-all">
              Access Docs
            </button>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl mb-3">🎥</div>
            <h3 className="text-lg font-bold text-gray-100 mb-2">Training Videos</h3>
            <p className="text-sm text-gray-400 mb-4">Video tutorials and certification prep materials</p>
            <button className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-sm hover:bg-purple-500/30 transition-all">
              Watch Videos
            </button>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl mb-3">💼</div>
            <h3 className="text-lg font-bold text-gray-100 mb-2">Sales Kit</h3>
            <p className="text-sm text-gray-400 mb-4">Presentations, battle cards, and objection handlers</p>
            <button className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-sm hover:bg-purple-500/30 transition-all">
              Download Kit
            </button>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="text-lg font-bold text-gray-100 mb-2">Partner Support</h3>
            <p className="text-sm text-gray-400 mb-4">Dedicated partner manager and technical support</p>
            <button className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-sm hover:bg-purple-500/30 transition-all">
              Contact Support
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
