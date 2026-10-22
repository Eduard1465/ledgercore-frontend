import { motion } from 'framer-motion';

export function Architecture() {
  const layers = [
    { name: 'Input Layer', color: 'border-emerald-500/50 bg-emerald-500/5', items: [{ name: 'ledgercore.yaml', desc: 'Single YAML spec', icon: '📋' }] },
    { name: 'Validation Layer', color: 'border-cyan-500/50 bg-cyan-500/5', items: [{ name: 'CUE Schema', desc: 'Type + enum constraints', icon: '✅' }, { name: 'Go Structs', desc: 'Type-safe decode', icon: '🔧' }] },
    { name: 'Generation Layer', color: 'border-purple-500/50 bg-purple-500/5', items: [{ name: 'Template Engine', desc: 'text/template + embed.FS', icon: '⚙️' }, { name: 'Atomic Writer', desc: 'fsutil.WriteFileAtomic', icon: '💾' }] },
    { name: 'Output Layer', color: 'border-orange-500/50 bg-orange-500/5', items: [
      { name: 'Terraform', desc: 'VPC, EKS, RDS, Vault', icon: '🏗️' },
      { name: 'Go Source', desc: 'Domain, gRPC, HTTP', icon: '🐹' },
      { name: 'K8s/Helm', desc: 'Chart + values + templates', icon: '☸️' },
      { name: 'OPA Policies', desc: 'PCI + Security Rego', icon: '🛡️' },
      { name: 'CI/CD', desc: 'GitHub Actions 6 gates', icon: '🔄' },
      { name: 'Evidence', desc: 'Matrix + Threat Model', icon: '📊' },
      { name: 'Docs', desc: 'ADRs + Architecture', icon: '📖' }
    ] }
  ];

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-100 mb-4">System Architecture</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Layered architecture from spec input to production output. Each layer is independently testable.
        </p>
      </div>

      <div className="space-y-4 mb-16">
        {layers.map((layer, layerIdx) => (
          <motion.div
            key={layer.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: layerIdx * 0.15 }}
            className={`border rounded-2xl p-6 ${layer.color}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Layer {layerIdx + 1}
              </span>
              <h3 className="text-lg font-bold text-gray-200">{layer.name}</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {layer.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: layerIdx * 0.15 + i * 0.05 }}
                  className="bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-3 flex items-center gap-3"
                >
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-200">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            {layerIdx < layers.length - 1 && (
              <div className="flex justify-center mt-4">
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-gray-600 text-2xl"
                >
                  ↓
                </motion.div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-12">
        <h3 className="text-xl font-bold text-gray-200 mb-6 text-center">Technology Stack</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { category: 'Language', items: ['Go 1.22', 'CUE', 'Rego', 'HCL', 'YAML'] },
            { category: 'Infrastructure', items: ['AWS', 'Terraform', 'EKS', 'CockroachDB', 'Redpanda'] },
            { category: 'Application', items: ['Gin', 'gRPC', 'Temporal', 'OpenTelemetry'] },
            { category: 'Security', items: ['OPA', 'KMS', 'Vault', 'gosec', 'Trivy'] },
            { category: 'CI/CD', items: ['GitHub Actions', 'Checkov', 'golangci-lint', 'Docker'] },
          ].map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="text-center"
            >
              <h4 className="text-sm font-bold text-emerald-400 mb-3 uppercase tracking-wider">
                {cat.category}
              </h4>
              <div className="space-y-2">
                {cat.items.map((item) => (
                  <div
                    key={item}
                    className="bg-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-gray-200 mb-6 text-center">Compliance Coverage</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Framework</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Controls</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Implementation</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Verification</th>
              </tr>
            </thead>
            <tbody>
              {[
                { framework: 'PCI-DSS v4.0', controls: '1.2.1, 3.4.1, 8.2.1, 10.2', impl: 'VPC segmentation, KMS encryption, Network policies', verify: 'OPA Rego policies in CI' },
                { framework: 'SOC2 Type 2', controls: 'CC6.1, CC7.2', impl: 'IAM policies, CloudWatch monitoring', verify: 'AWS Config + manual audit' },
                { framework: 'CIS Benchmarks', controls: 'All applicable', impl: 'Terraform hardened modules', verify: 'Checkov IaC scanning' },
                { framework: 'OWASP Top 10', controls: 'A01-A10', impl: 'gosec SAST, input validation', verify: 'GitHub Actions SAST gate' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4 text-emerald-400 font-medium">{row.framework}</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-xs">{row.controls}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{row.impl}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{row.verify}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
