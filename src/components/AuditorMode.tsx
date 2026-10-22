import { useState } from 'react';
import { motion } from 'framer-motion';

export function AuditorMode() {
  const [auditorMode, setAuditorMode] = useState(false);

  const controls = [
    { id: 'PCI-1.2.1', requirement: 'Restrict inbound/outbound traffic to CDE', evidence: 'terraform/plan.json', status: 'PASS', hash: 'a1b2c3d4e5f6...' },
    { id: 'PCI-3.4.1', requirement: 'Encrypt transmission of cardholder data', evidence: 'terraform/plan.json', status: 'PASS', hash: 'f6e5d4c3b2a1...' },
    { id: 'PCI-8.3.1', requirement: 'Protect authentication credentials', evidence: 'k8s/manifests.yaml', status: 'PASS', hash: '1a2b3c4d5e6f...' },
    { id: 'PCI-10.2', requirement: 'Track all access to system components', evidence: 'terraform/plan.json', status: 'PASS', hash: '6f5e4d3c2b1a...' },
    { id: 'SOC2-CC6.1', requirement: 'Logical and physical access controls', evidence: 'terraform/plan.json', status: 'PASS', hash: '2b3c4d5e6f7g...' },
    { id: 'SOC2-CC6.7', requirement: 'Encryption of data at rest', evidence: 'terraform/plan.json', status: 'PASS', hash: '7g6f5e4d3c2b...' },
    { id: 'GDPR-Art.32', requirement: 'Security of processing', evidence: 'terraform/plan.json', status: 'PASS', hash: '3c4d5e6f7g8h...' },
    { id: 'DORA-Art.28', requirement: 'Register of Information (ICT third-party)', evidence: 'evidence/dora/register.json', status: 'PASS', hash: '8h7g6f5e4d3c...' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6"
        >
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-blue-400 text-sm font-medium">Audit-Ready Evidence Pack</span>
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-100 mb-4">Compliance Evidence</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
          Real-time proof of compliance for auditors and regulators
        </p>

        <div className="inline-flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <span className="text-sm text-gray-400">Technical View</span>
          <button
            onClick={() => setAuditorMode(!auditorMode)}
            className={`relative w-14 h-7 rounded-full transition-all ${
              auditorMode ? 'bg-emerald-500' : 'bg-gray-700'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                auditorMode ? 'left-8' : 'left-1'
              }`}
            />
          </button>
          <span className="text-sm text-gray-400">Auditor Mode</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Control ID
                </th>
                {auditorMode ? (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Requirement
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Evidence Hash
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Requirement
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Implementation
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Evidence File
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {controls.map((control, i) => (
                <motion.tr
                  key={control.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-mono text-emerald-400 font-bold">
                    {control.id}
                  </td>
                  {auditorMode ? (
                    <>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {control.requirement}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
                          ✓ {control.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-500">
                        {control.hash}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {control.requirement}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        OPA Policy + Terraform
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-cyan-400">
                        {control.evidence}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
                          ✓ {control.status}
                        </span>
                      </td>
                    </>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-800/50 border-t border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            <span className="font-bold text-emerald-400">{controls.length}</span> controls verified
          </div>
          <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-lg transition-all">
            📦 Export Auditor Package (ZIP)
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6"
      >
        <h3 className="text-lg font-bold text-blue-400 mb-3">💡 What is Auditor Mode?</h3>
        <p className="text-sm text-gray-300 mb-3">
          <strong>Auditor Mode</strong> hides technical implementation details and shows only what auditors need:
        </p>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>✓ Control ID (e.g., PCI-1.2.1)</li>
          <li>✓ Requirement description</li>
          <li>✓ Compliance status (PASS/FAIL)</li>
          <li>✓ Cryptographic evidence hash (verifiable on-chain)</li>
        </ul>
        <p className="text-sm text-gray-400 mt-3">
          Perfect for QSA auditors, regulators, and compliance officers who need proof, not technical details.
        </p>
      </motion.div>
    </div>
  );
}
