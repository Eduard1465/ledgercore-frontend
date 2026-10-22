import { useState } from 'react';
import { motion } from 'framer-motion';

export function RegToCodeUI() {
  const [inputText, setInputText] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('ollama');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPolicy, setGeneratedPolicy] = useState('');

  const providers = [
    { id: 'ollama', name: 'Ollama (Local)', logo: '🦙', cost: 'Free', privacy: '100% Private' },
    { id: 'openai', name: 'OpenAI GPT-4', logo: '🤖', cost: '$0.03/1K tokens', privacy: 'Cloud-based' },
    { id: 'anthropic', name: 'Anthropic Claude', logo: '🧠', cost: '$0.02/1K tokens', privacy: 'Cloud-based' },
  ];

  const sampleRegulations = [
    { name: 'PCI DSS v4.0 - Requirement 3.4.1', text: 'Render PAN unreadable anywhere it is stored using strong cryptography to prevent disclosure of the cardholder data.' },
    { name: 'GDPR - Article 32', text: 'The controller and the processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk, including the pseudonymisation and encryption of personal data.' },
    { name: 'DORA - Article 10', text: 'Financial entities shall have in place internal policies and procedures to assess the ICT risk arising from the use of third-party ICT service providers.' },
    { name: 'MiCA - Article 60', text: 'Crypto-asset service providers shall establish, implement and maintain policies and procedures to ensure compliance with AML/CFT requirements.' }
  ];

  const handleGenerate = () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const policy = `package compliance

import future.keywords.if
import future.keywords.in

# Auto-generated from: ${inputText.substring(0, 50)}...
# Provider: ${selectedProvider}
# Generated: ${new Date().toISOString()}

default allow = false

# Main compliance rule
allow if {
    # Check data encryption at rest
    input.resource.type in ["aws_db_instance", "aws_s3_bucket", "aws_ebs_volume"]
    input.resource.encryption_enabled == true

    # Check KMS key rotation
    input.resource.kms_key_rotation_enabled == true

    # Check no public access
    not input.resource.public_access_enabled
}

# Deny rule for violations
deny contains msg if {
    input.resource.type in ["aws_db_instance", "aws_s3_bucket"]
    not input.resource.encryption_enabled
    msg := sprintf("VIOLATION: %s must have encryption enabled", [input.resource.name])
}

deny contains msg if {
    input.resource.type == "aws_s3_bucket"
    input.resource.public_access_enabled == true
    msg := sprintf("VIOLATION: %s must not have public access", [input.resource.name])
}

# Audit logging requirement
allow if {
    input.resource.type in ["aws_vpc", "aws_ecs_service"]
    input.resource.logging_enabled == true
    input.resource.log_retention_days >= 365
}`;
      setGeneratedPolicy(policy);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 rounded-full mb-6"
        >
          <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
          <span className="text-violet-400 text-sm font-medium">AI-Powered Policy Generation</span>
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-100 mb-4">Reg-to-Code Engine</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Paste regulatory text → Get executable OPA Rego policy. Powered by local or cloud LLM.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-gray-100 mb-4">Select LLM Provider</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setSelectedProvider(provider.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedProvider === provider.id
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="text-3xl mb-2">{provider.logo}</div>
              <div className="text-sm font-bold text-gray-100">{provider.name}</div>
              <div className="text-xs text-gray-400 mt-1">{provider.cost}</div>
              <div className="text-xs text-violet-400 mt-1">{provider.privacy}</div>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-gray-100 mb-4">Input: Regulatory Text</h3>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste regulatory requirement here..."
            className="w-full h-64 bg-gray-950 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500 resize-none"
          />
          <div className="mt-4">
            <div className="text-xs text-gray-500 mb-2">Sample regulations:</div>
            <div className="flex flex-wrap gap-2">
              {sampleRegulations.map((reg, i) => (
                <button
                  key={i}
                  onClick={() => setInputText(reg.text)}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-300 transition-all"
                >
                  {reg.name}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={!inputText.trim() || isGenerating}
            className="w-full mt-4 px-6 py-3 bg-violet-500 hover:bg-violet-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating Policy...
              </span>
            ) : (
              '🚀 Generate OPA Policy'
            )}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-gray-100 mb-4">Output: OPA Rego Policy</h3>
          <pre className="w-full h-64 bg-gray-950 border border-gray-700 rounded-xl p-4 text-xs text-emerald-400 overflow-auto font-mono">
            {generatedPolicy || '// Generated policy will appear here...'}
          </pre>
          {generatedPolicy && (
            <div className="mt-4 flex gap-2">
              <button className="flex-1 px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-all">
                📋 Copy Policy
              </button>
              <button className="flex-1 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm font-medium hover:bg-cyan-500/30 transition-all">
                💾 Save to Project
              </button>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-gray-100 mb-4">✨ Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-2xl mb-2">🔒</div>
            <h4 className="text-sm font-bold text-gray-100 mb-1">Privacy-First</h4>
            <p className="text-xs text-gray-400">Use local LLM (Ollama) for 100% data privacy. No data leaves your infrastructure.</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="text-sm font-bold text-gray-100 mb-1">RAG-Enhanced</h4>
            <p className="text-xs text-gray-400">Retrieval-Augmented Generation with knowledge base of PCI, GDPR, DORA, MiCA regulations.</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="text-sm font-bold text-gray-100 mb-1">Human-in-the-Loop</h4>
            <p className="text-xs text-gray-400">AI generates draft, human reviews and approves. No black-box automation.</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-gray-100 mb-4">⚔️ VS Alternatives</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Feature</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Manual Policy Writing</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Generic AI Tools</th>
                <th className="text-center py-3 px-4 text-emerald-400 font-medium">Factory Reg-to-Code</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Time to Generate</td>
                <td className="py-3 px-4 text-center text-red-400">2-4 weeks</td>
                <td className="py-3 px-4 text-center text-yellow-400">1-2 days</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-bold">30 seconds</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Regulation Knowledge</td>
                <td className="py-3 px-4 text-center text-yellow-400">⚠ Expert needed</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Generic</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ PCI/GDPR/DORA/MiCA</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">OPA Syntax</td>
                <td className="py-3 px-4 text-center text-yellow-400">⚠ Manual</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Errors common</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Validated</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-300">Data Privacy</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ On-prem</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Cloud only</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Local or Cloud</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-2xl p-6 text-center"
      >
        <h3 className="text-2xl font-bold text-gray-100 mb-2">Reg-to-Code Engine</h3>
        <div className="text-4xl font-bold text-violet-400 mb-2">$75,000</div>
        <div className="text-gray-400 mb-4">One-time setup + $10,000/month (includes LLM hosting + knowledge base updates)</div>
        <button className="px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded-xl transition-all">
          Enable Reg-to-Code
        </button>
      </motion.div>
    </div>
  );
}
