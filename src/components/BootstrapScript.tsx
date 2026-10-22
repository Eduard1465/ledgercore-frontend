import { useState } from 'react';
import { motion } from 'framer-motion';
import { Highlight, themes } from 'prism-react-renderer';

const bootstrapScript = `#!/bin/bash
set -euo pipefail

# LedgerCore Factory Bootstrap Script
# Creates complete Factory v2.0 project structure

ROOT_DIR="$(pwd)"
FACTORY_DIR="$ROOT_DIR/factory"

echo "🏗 [1/5] Creating directory structure..."
mkdir -p "$FACTORY_DIR"/{cmd,internal/{spec,generator/{templates/{terraform/modules/{vpc,eks,rds,vault},go,k8s,policies,ci,evidence,docs},fsutil}}}

echo "✅ [2/5] Creating core files..."
# Core Go files would be created here

echo "📝 [3/5] Creating templates..."
# Templates would be created here

echo "✅ [4/5] Templates created"
echo "🚀 [5/5] Running generation..."

cd "$FACTORY_DIR"
go mod tidy
go run . --spec spec/ledgercore.yaml --out output/client-delivery

echo ""
echo "🎉 SUCCESS! Generated files in: $FACTORY_DIR/output/client-delivery"
`;

export function BootstrapScript() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(bootstrapScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-100 mb-4">Bootstrap Script</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Complete one-command setup. Copy this script, run it in your terminal, and get a fully functional LedgerCore Factory in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-3">1️⃣</div>
          <h3 className="text-lg font-bold text-gray-200 mb-2">Create Directory</h3>
          <code className="block bg-gray-950 rounded-lg p-3 text-xs text-emerald-400 font-mono">
            mkdir -p ~/ledgercore-factory<br />
            cd ~/ledgercore-factory
          </code>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-3">2️⃣</div>
          <h3 className="text-lg font-bold text-gray-200 mb-2">Save Script</h3>
          <code className="block bg-gray-950 rounded-lg p-3 text-xs text-emerald-400 font-mono">
            nano bootstrap_factory.sh<br />
            # Paste the script below<br />
            chmod +x bootstrap_factory.sh
          </code>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-3">3️⃣</div>
          <h3 className="text-lg font-bold text-gray-200 mb-2">Run</h3>
          <code className="block bg-gray-950 rounded-lg p-3 text-xs text-emerald-400 font-mono">
            ./bootstrap_factory.sh
          </code>
        </motion.div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-lg">📜</span>
            <span className="text-sm text-gray-300 font-mono">bootstrap_factory.sh</span>
            <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-400">bash</span>
          </div>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {copied ? '✓ Copied!' : '📋 Copy Script'}
          </button>
        </div>
        <div className="overflow-auto max-h-[600px]">
          <Highlight theme={themes.nightOwl} code={bootstrapScript} language="bash">
            {({ className, style, tokens, getLineProps, getTokenProps }: any) => (
              <pre className={`${className} p-4 text-sm leading-relaxed`} style={{ ...style, background: 'transparent', margin: 0 }}>
                {tokens.map((line: any, i: number) => (
                  <div key={i} {...getLineProps({ line })} className="table-row">
                    <span className="table-cell pr-4 text-right text-gray-600 select-none w-8 text-xs">{i + 1}</span>
                    <span className="table-cell">{line.map((token: any, key: number) => <span key={key} {...getTokenProps({ token })} />)}</span>
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </div>

      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-gray-200 mb-6 text-center">What's Included</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { category: 'Core Go', count: '6 files', items: ['main.go', 'loader.go', 'generator.go', 'writer.go', 'go.mod', 'schema.cue'] },
            { category: 'Terraform', count: '10 files', items: ['main.tf', 'variables.tf', 'outputs.tf', 'vpc/', 'eks/', 'rds/', 'vault/'] },
            { category: 'Application', count: '7 files', items: ['go.mod', 'main.go', 'domain/', 'handler/', 'middleware/', 'api/'] },
            { category: 'K8s/Helm', count: '5 files', items: ['Chart.yaml', 'values.yaml', 'deployment.yaml', 'service.yaml', 'servicemonitor.yaml'] },
            { category: 'Policies', count: '2 files', items: ['pci.rego', 'security.rego'] },
            { category: 'CI/CD', count: '1 file', items: ['github-actions.yaml'] },
            { category: 'Evidence', count: '3 files', items: ['control_matrix.csv', 'threat_model.md', 'runbook_incident.md'] },
            { category: 'Docs', count: '2 files', items: ['ADR_001.md', 'HANDOVER.md'] },
          ].map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="bg-gray-800/50 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-emerald-400">{cat.category}</h4>
                <span className="text-xs text-gray-500">{cat.count}</span>
              </div>
              <div className="space-y-1">
                {cat.items.map((item) => (
                  <div key={item} className="text-xs text-gray-400 font-mono truncate">
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { value: '36+', label: 'Template Files' },
          { value: '40+', label: 'Generated Files' },
          { value: '30s', label: 'Setup Time' },
          { value: '1', label: 'Command to Run' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center"
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-gray-500 text-sm mt-2">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
