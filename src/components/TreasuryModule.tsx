import { useState } from 'react';
import { motion } from 'framer-motion';

export function TreasuryModule() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const positions = [
    { currency: 'USD', balance: 2500000, change: '+12.5%', status: 'healthy' },
    { currency: 'EUR', balance: 1800000, change: '+8.3%', status: 'healthy' },
    { currency: 'GBP', balance: 950000, change: '-2.1%', status: 'warning' },
    { currency: 'BTC', balance: 45.5, change: '+23.7%', status: 'healthy' },
    { currency: 'ETH', balance: 320.8, change: '+15.2%', status: 'healthy' },
  ];

  const fxRates = [
    { from: 'USD', to: 'EUR', rate: 0.92, change: '+0.3%' },
    { from: 'USD', to: 'GBP', rate: 0.79, change: '-0.5%' },
    { from: 'EUR', to: 'GBP', rate: 0.86, change: '-0.2%' },
    { from: 'USD', to: 'BTC', rate: 0.000023, change: '+2.1%' },
  ];

  const liquidityPools = [
    { name: 'Primary Operating', amount: 1500000, currency: 'USD', purpose: 'Daily operations' },
    { name: 'Reserve Fund', amount: 3000000, currency: 'USD', purpose: 'Emergency reserves' },
    { name: 'Investment Portfolio', amount: 2000000, currency: 'EUR', purpose: 'Yield generation' },
    { name: 'Crypto Treasury', amount: 850000, currency: 'USD', purpose: 'Digital assets' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-6"
        >
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          <span className="text-yellow-400 text-sm font-medium">Multi-Currency Treasury</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">Treasury & Liquidity</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Real-time visibility across all currencies and liquidity pools. Automated FX optimization.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-gray-100 mb-4">Currency Positions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {positions.map((pos, i) => (
            <motion.div
              key={pos.currency}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              onClick={() => setSelectedCurrency(pos.currency)}
              className={`bg-gray-800 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                selectedCurrency === pos.currency
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-gray-100">{pos.currency}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  pos.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {pos.status}
                </span>
              </div>
              <div className="text-lg font-bold text-gray-200 mb-1">
                {pos.currency === 'BTC' || pos.currency === 'ETH'
                  ? pos.balance.toFixed(2)
                  : pos.balance.toLocaleString()
                }
              </div>
              <div className={`text-sm ${pos.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                {pos.change} (24h)
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-gray-100 mb-4">FX Rates (Live)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Pair</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Rate</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">24h Change</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {fxRates.map((fx, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4 text-gray-200 font-mono">{fx.from}/{fx.to}</td>
                  <td className="py-3 px-4 text-center text-cyan-400 font-bold">{fx.rate}</td>
                  <td className={`py-3 px-4 text-center ${fx.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {fx.change}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded text-xs hover:bg-yellow-500/30 transition-all">
                      Convert
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-gray-100 mb-4">Liquidity Pools</h2>
        <div className="space-y-3">
          {liquidityPools.map((pool, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold">
                  {pool.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-100">{pool.name}</div>
                  <div className="text-xs text-gray-500">{pool.purpose}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-400">
                  {pool.amount.toLocaleString()} {pool.currency}
                </div>
                <div className="text-xs text-gray-500">Available</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-1">$8.3M</div>
          <div className="text-xs text-gray-400">Total AUM</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-emerald-400 mb-1">5</div>
          <div className="text-xs text-gray-400">Active Currencies</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-cyan-400 mb-1">4</div>
          <div className="text-xs text-gray-400">Liquidity Pools</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-1">+12.5%</div>
          <div className="text-xs text-gray-400">30d Return</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-gray-100 mb-4">⚔️ VS Competitors</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Feature</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Kyriba</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">BVNK</th>
                <th className="text-center py-3 px-4 text-emerald-400 font-medium">Factory Treasury</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Crypto Support</td>
                <td className="py-3 px-4 text-center text-red-400">✗</td>
                <td className="py-3 px-4 text-center text-yellow-400">⚠ Limited</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Full</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Ledger Integration</td>
                <td className="py-3 px-4 text-center text-red-400">✗</td>
                <td className="py-3 px-4 text-center text-red-400">✗</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Native</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Automated FX</td>
                <td className="py-3 px-4 text-center text-yellow-400">⚠ Manual</td>
                <td className="py-3 px-4 text-center text-yellow-400">⚠ Basic</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ AI-optimized</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-300">Compliance</td>
                <td className="py-3 px-4 text-center text-yellow-400">⚠ Basic</td>
                <td className="py-3 px-4 text-center text-red-400">✗</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ PCI/SOC2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6 text-center"
      >
        <h3 className="text-2xl font-bold text-gray-100 mb-2">Treasury Module</h3>
        <div className="text-4xl font-bold text-yellow-400 mb-2">$60,000</div>
        <div className="text-gray-400 mb-4">One-time setup + $8,000/month (includes FX optimization + liquidity management)</div>
        <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-xl transition-all">
          Add to Your Factory
        </button>
      </motion.div>
    </div>
  );
}
