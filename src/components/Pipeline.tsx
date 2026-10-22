import { motion } from 'framer-motion';
import { useState } from 'react';

const stages = [
  {
    id: 'spec',
    title: '1. YAML Spec',
    subtitle: 'Single Source of Truth',
    icon: '📋',
    color: 'from-emerald-500 to-teal-500',
    description: 'Edit ledgercore.yaml — the ONLY file you touch. Define project, ledger, infra, and handover parameters.',
    details: [
      'Project: name, org, compliance frameworks, cloud, region',
      'Ledger: currencies, entities, accounts, TPS',
      'Infra: DB, MQ, orchestrator, KMS',
      'Handover: repo URL, sandbox TTL'
    ],
    file: 'spec/ledgercore.yaml'
  },
  {
    id: 'validate',
    title: '2. CUE Validation',
    subtitle: 'Contract Enforcement',
    icon: '✅',
    color: 'from-cyan-500 to-blue-500',
    description: 'CUE schema validates all fields, enums, and constraints before generation begins.',
    details: [
      'Type checking: string, int, enum constraints',
      'Cloud must be "aws" | "gcp"',
      'DB must be "cockroach" | "postgresql"',
      'MQ must be "redpanda" | "kafka"'
    ],
    file: 'internal/spec/schema.cue'
  },
  {
    id: 'parse',
    title: '3. Go Struct Decode',
    subtitle: 'Type-Safe Loading',
    icon: '🔧',
    color: 'from-blue-500 to-indigo-500',
    description: 'YAML decoded into typed Go structs for template rendering.',
    details: [
      'Spec struct with nested ProjectSpec, LedgerSpec',
      'InfraSpec, HandoverSpec sub-structures',
      'Type-safe field access in templates',
      'Zero-value defaults for optional fields'
    ],
    file: 'internal/spec/loader.go'
  },
  {
    id: 'generate',
    title: '4. Template Engine',
    subtitle: 'Go text/template + embed.FS',
    icon: '⚙️',
    color: 'from-purple-500 to-pink-500',
    description: 'Embedded templates rendered with spec data. Custom funcs: join, upper, conditionals.',
    details: [
      '20+ embedded .tmpl files',
      'Conditional logic based on TPS/entity count',
      'Custom template functions (join, upper)',
      'Atomic file writes via fsutil'
    ],
    file: 'internal/generator/generator.go'
  },
  {
    id: 'output',
    title: '5. Output Generation',
    subtitle: 'Production Repository',
    icon: '📦',
    color: 'from-orange-500 to-red-500',
    description: '40+ files generated across 7 categories, ready for git push.',
    details: [
      'Terraform: VPC, EKS, RDS, Vault modules',
      'Go: Domain, gRPC, HTTP handlers',
      'K8s: Helm chart with auto-scaling',
      'OPA: PCI + Security policies',
      'CI: GitHub Actions with 6 gates',
      'Evidence: Control matrix, threat model',
      'Docs: ADRs, architecture decisions'
    ],
    file: 'output/client-delivery/'
  }
];

export function Pipeline() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <div id="pipeline-section">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-100 mb-4">Generation Pipeline</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          From a single YAML spec to a complete, compliant, production-ready repository in 5 stages.
        </p>

        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-medium cursor-pointer hover:bg-emerald-500/30 transition-all">
            🛡️ PCI DSS
          </span>
          <span className="px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-medium cursor-pointer hover:bg-blue-500/30 transition-all">
            🇪🇺 MiCA
          </span>
          <span className="px-3 py-1.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-medium cursor-pointer hover:bg-purple-500/30 transition-all">
            🔄 Migration
          </span>
          <span className="px-3 py-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-medium cursor-pointer hover:bg-orange-500/30 transition-all">
            🔐 Own IP
          </span>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-10 flex-wrap">
        {stages.map((stage, i) => (
          <button
            key={stage.id}
            onClick={() => setActiveStage(i)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeStage === i
                ? `bg-gradient-to-r ${stage.color} text-white shadow-lg`
                : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
            }`}
          >
            <span>{stage.icon}</span>
            <span className="hidden md:inline">{stage.title}</span>
            <span className="md:hidden">{i + 1}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-800 hidden lg:block" />

        <div className="flex justify-between items-start mb-12 hidden lg:flex">
          {stages.map((stage, i) => (
            <div key={stage.id} className="flex flex-col items-center relative z-10">
              <motion.div
                animate={{
                  scale: activeStage === i ? 1.2 : 1,
                  boxShadow: activeStage === i ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none'
                }}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all ${
                  activeStage === i
                    ? 'border-emerald-400 bg-emerald-500/20'
                    : i < activeStage
                    ? 'border-emerald-600 bg-emerald-900/20'
                    : 'border-gray-700 bg-gray-800'
                }`}
              >
                {stage.icon}
              </motion.div>
              <span className={`mt-3 text-xs font-medium ${activeStage === i ? 'text-emerald-400' : 'text-gray-500'}`}>
                Stage {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        key={activeStage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-8"
      >
        <div className="flex items-start gap-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stages[activeStage].color} flex items-center justify-center text-3xl shrink-0`}>
            {stages[activeStage].icon}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-100 mb-1">
              {stages[activeStage].title}
            </h3>
            <p className="text-emerald-400 text-sm mb-4">{stages[activeStage].subtitle}</p>
            <p className="text-gray-300 mb-6">{stages[activeStage].description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stages[activeStage].details.map((detail, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2 text-sm text-gray-400"
                >
                  <span className="text-emerald-400 mt-0.5">▸</span>
                  <span>{detail}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
              <span className="text-gray-600">📁</span>
              <code className="bg-gray-800 px-2 py-1 rounded">{stages[activeStage].file}</code>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-12 bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h3 className="text-lg font-bold text-gray-200 mb-6 text-center">Data Flow</h3>
        <div className="flex items-center justify-center gap-2 flex-wrap text-sm">
          {[
            { label: 'ledgercore.yaml', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
            { label: '→', color: 'text-gray-600' },
            { label: 'YAML Parse', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
            { label: '→', color: 'text-gray-600' },
            { label: 'CUE Validate', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
            { label: '→', color: 'text-gray-600' },
            { label: 'Go Struct', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
            { label: '→', color: 'text-gray-600' },
            { label: 'Template Render', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
            { label: '→', color: 'text-gray-600' },
            { label: 'Atomic Write', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
            { label: '→', color: 'text-gray-600' },
            { label: '40+ Files', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
          ].map((item, i) => (
            <span
              key={i}
              className={`px-3 py-1.5 rounded-lg border ${item.color} ${item.label === '→' ? 'border-none text-lg' : ''}`}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
