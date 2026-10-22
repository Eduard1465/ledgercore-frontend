import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Highlight, themes } from 'prism-react-renderer';

const defaultSpec = `# ═══════════════════════════════════════════════
# LedgerCore Specification — Single Source of Truth
# Edit ONLY this file to configure your project
# ═══════════════════════════════════════════════

project:
  name: "Acme-Ledger-Prod"
  org: "acme-corp"
  compliance: ["PCI-DSS-SAQ-A", "SOC2-Type2"]
  cloud: "aws"
  region: "us-east-1"

ledger:
  currency: ["USD", "EUR", "BTC"]
  entities: ["PARENT", "SUBSIDIARY_EU", "SUBSIDIARY_APAC"]
  accounts_per_entity: 5000
  tps_peak: 1000

infra:
  db: "cockroach"
  mq: "redpanda"
  orchestrator: "Temporal"
  kms: "aws-kms"

handover:
  repo: "github.com/acme-corp/ledgercore"
  sandbox_ttl_hours: 4`;

interface SpecValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function validateSpec(spec: string): SpecValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!spec.includes('project:')) errors.push('Missing required field: project');
  if (!spec.includes('ledger:')) errors.push('Missing required field: ledger');
  if (!spec.includes('infra:')) errors.push('Missing required field: infra');
  if (!spec.includes('handover:')) errors.push('Missing required field: handover');

  if (spec.includes('cloud:')) {
    if (!spec.includes('"aws"') && !spec.includes('"gcp"')) {
      errors.push('cloud must be "aws" | "gcp"');
    }
  }

  if (spec.includes('db:')) {
    if (!spec.includes('"cockroach"') && !spec.includes('"postgresql"')) {
      errors.push('db must be "cockroach" | "postgresql"');
    }
  }

  if (spec.includes('mq:')) {
    if (!spec.includes('"redpanda"') && !spec.includes('"kafka"')) {
      errors.push('mq must be "redpanda" | "kafka"');
    }
  }

  const tpsMatch = spec.match(/tps_peak:\s*(\d+)/);
  if (tpsMatch) {
    const tps = parseInt(tpsMatch[1]);
    if (tps > 10000) warnings.push('Very high TPS — ensure infrastructure sizing is adequate');
    if (tps < 100) warnings.push('Low TPS — consider reducing resource allocation');
  }

  if (!spec.includes('compliance:')) {
    warnings.push('No compliance frameworks specified — add PCI-DSS or SOC2');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

function estimateOutput(spec: string): { files: number; categories: string[] } {
  let files = 20;
  const categories = ['terraform', 'go', 'k8s', 'policies', 'ci', 'evidence', 'docs'];

  const complianceMatch = spec.match(/compliance:\s*\[([^\]]+)\]/);
  if (complianceMatch) {
    const count = complianceMatch[1].split(',').length;
    files += count;
  }

  const entitiesMatch = spec.match(/entities:\s*\[([^\]]+)\]/);
  if (entitiesMatch) {
    const count = entitiesMatch[1].split(',').length;
    if (count > 3) files += 2;
  }

  return { files, categories };
}

export function SpecEditor() {
  const [spec, setSpec] = useState(defaultSpec);
  const [copied, setCopied] = useState(false);
  const validation = validateSpec(spec);
  const estimate = estimateOutput(spec);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedSpec = params.get('spec');
    if (encodedSpec) {
      try {
        const decoded = atob(encodedSpec);
        setSpec(decoded);
      } catch (e) {
        console.error('Failed to decode spec from URL:', e);
      }
    }
  }, []);

  const handleShare = () => {
    const encoded = btoa(spec);
    const url = `${window.location.origin}${window.location.pathname}?spec=${encoded}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-100 mb-4">Interactive Spec Editor</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          This is the ONLY file you edit. Modify the spec below and see real-time validation
          and output estimation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 border-b border-gray-700">
            <span className="text-lg">📝</span>
            <span className="text-sm text-gray-300 font-mono">spec/ledgercore.yaml</span>
            <div className="ml-auto flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${validation.valid ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span className={`text-xs ${validation.valid ? 'text-emerald-400' : 'text-red-400'}`}>
                {validation.valid ? 'Valid' : 'Errors'}
              </span>
            </div>
          </div>
          <div className="relative">
            <Highlight theme={themes.nightOwl} code={spec} language="yaml">
              {({ className, style, tokens, getLineProps, getTokenProps }: any) => (
                <pre
                  className={`${className} p-4 text-sm leading-relaxed overflow-auto max-h-[600px]`}
                  style={{ ...style, background: 'transparent', margin: 0 }}
                >
                  <textarea
                    value={spec}
                    onChange={(e) => setSpec(e.target.value)}
                    className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-emerald-400 resize-none outline-none p-4 font-mono text-sm leading-relaxed"
                    spellCheck={false}
                  />
                  {tokens.map((line: any, i: number) => (
                    <div key={i} {...getLineProps({ line })} className="table-row">
                      <span className="table-cell pr-4 text-right text-gray-600 select-none w-8 text-xs">
                        {i + 1}
                      </span>
                      <span className="table-cell">
                        {line.map((token: any, key: number) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </span>
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        </div>

        <div className="space-y-4">
          <motion.div
            layout
            className={`bg-gray-900 border rounded-2xl p-6 ${
              validation.valid ? 'border-emerald-500/30' : 'border-red-500/30'
            }`}
          >
            <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
              <span>{validation.valid ? '✅' : '❌'}</span>
              CUE Validation
            </h3>
            {validation.errors.length === 0 ? (
              <p className="text-emerald-400 text-sm">All constraints satisfied</p>
            ) : (
              <div className="space-y-2">
                {validation.errors.map((err, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-red-400">
                    <span>✗</span>
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            )}
            {validation.warnings.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <h4 className="text-xs font-bold text-yellow-400 mb-2">WARNINGS</h4>
                {validation.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-yellow-400/80">
                    <span>⚠</span>
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            layout
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
              <span>📦</span>
              Output Estimate
            </h3>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {estimate.files}+
              </div>
              <div className="text-gray-500 text-sm">files generated</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {estimate.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400"
                >
                  {cat}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
              <span>⚡</span>
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleShare}
                className="w-full px-4 py-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 text-sm hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <span>✓</span>
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <span>🔗</span>
                    <span>Share Spec via URL</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setSpec(defaultSpec)}
                className="w-full px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm hover:bg-emerald-500/20 transition-all"
              >
                Reset to Default
              </button>
              <button
                onClick={() => setSpec(prev => prev.replace('tps_peak: 1000', 'tps_peak: 10000'))}
                className="w-full px-4 py-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 text-sm hover:bg-cyan-500/20 transition-all"
              >
                High TPS Mode (10K)
              </button>
              <button
                onClick={() => setSpec(prev => prev.replace('"aws"', '"gcp"').replace('aws-kms', 'gcp-kms'))}
                className="w-full px-4 py-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400 text-sm hover:bg-purple-500/20 transition-all"
              >
                Switch to GCP
              </button>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
              <span>🚀</span>
              Run Command
            </h3>
            <code className="block bg-gray-950 rounded-lg p-3 text-xs text-emerald-400 font-mono overflow-x-auto">
              go run . \<br />
              &nbsp;&nbsp;--spec spec/ledgercore.yaml \<br />
              &nbsp;&nbsp;--out output/client-delivery
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
