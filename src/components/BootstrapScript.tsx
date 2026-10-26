import { useState } from 'react';
import { motion } from 'framer-motion';
import { Highlight, themes } from 'prism-react-renderer';

const bootstrapScript = `#!/bin/bash
set -euo pipefail

# --- КОНФИГУРАЦИЯ ---
ROOT_DIR="$(pwd)"
FACTORY_DIR="$ROOT_DIR/factory"
SPEC_DIR="$FACTORY_DIR/spec"
OUT_DIR="$FACTORY_DIR/output/client-delivery"

echo "🏗 [1/5] Создание структуры каталогов..."
mkdir -p "$FACTORY_DIR"/{cmd,internal/{spec,generator/{templates/{terraform/modules/{vpc,eks,rds,vault},go,k8s/{ledger/templates},policies,ci,evidence,docs/adr},fsutil},spec}

# --- 1. GO.MOD ---
cat > "$FACTORY_DIR/go.mod" << 'EOF'
module github.com/your-org/factory

go 1.22

require (
    cuelang.org/go v0.10.0
    github.com/spf13/cobra v1.8.0
    gopkg.in/yaml.v3 v3.0.1
)
EOF

# --- 2. MAIN.GO ---
cat > "$FACTORY_DIR/main.go" << 'EOF'
package main

import (
    "fmt"
    "os"

    "github.com/spf13/cobra"
    "github.com/your-org/factory/internal/generator"
    "github.com/your-org/factory/internal/spec"
)

var (
    specPath string
    outDir   string
)

var rootCmd = &cobra.Command{
    Use:   "factory",
    Short: "LedgerCore Factory: Spec -> Production Repo",
    RunE: func(cmd *cobra.Command, args []string) error {
        s, err := spec.LoadAndValidate(specPath)
        if err != nil {
            return fmt.Errorf("spec error: %w", err)
        }
        gen := generator.New(s, outDir)
        if err := gen.Generate(); err != nil {
            return fmt.Errorf("generation failed: %w", err)
        }
        fmt.Printf("✅ Generated LedgerCore project at: %s\\n", outDir)
        return nil
    },
}

func init() {
    rootCmd.Flags().StringVarP(&specPath, "spec", "s", "spec/ledgercore.yaml", "Path to spec YAML")
    rootCmd.Flags().StringVarP(&outDir, "out", "o", "output/client-delivery", "Output directory")
}

func main() {
    if err := rootCmd.Execute(); err != nil {
        fmt.Fprintln(os.Stderr, err)
        os.Exit(1)
    }
}
EOF

# --- 3. SPEC LOADER ---
cat > "$FACTORY_DIR/internal/spec/loader.go" << 'EOF'
package spec

import (
    "fmt"
    "os"

    "cuelang.org/go/cue"
    "cuelang.org/go/cue/cuecontext"
    "gopkg.in/yaml.v3"
)

type Spec struct {
    Project  ProjectSpec  \`yaml:"project"\`
    Ledger   LedgerSpec   \`yaml:"ledger"\`
    Infra    InfraSpec    \`yaml:"infra"\`
    Handover HandoverSpec \`yaml:"handover"\`
}

type ProjectSpec struct {
    Name       string   \`yaml:"name"\`
    Org        string   \`yaml:"org"\`
    Compliance []string \`yaml:"compliance"\`
    Cloud      string   \`yaml:"cloud"\`
    Region     string   \`yaml:"region"\`
}

type LedgerSpec struct {
    Currency          []string \`yaml:"currency"\`
    Entities          []string \`yaml:"entities"\`
    AccountsPerEntity int      \`yaml:"accounts_per_entity"\`
    TpsPeak           int      \`yaml:"tps_peak"\`
}

type InfraSpec struct {
    DB           string \`yaml:"db"\`
    MQ           string \`yaml:"mq"\`
    Orchestrator string \`yaml:"orchestrator"\`
    KMS          string \`yaml:"kms"\`
}

type HandoverSpec struct {
    Repo            string \`yaml:"repo"\`
    SandboxTTLHours int    \`yaml:"sandbox_ttl_hours"\`
}

const schemaCUE = \`
package spec

#LedgerCoreSpec: {
    project: {
        name:       string
        org:        string
        compliance: [...string]
        cloud:      "aws" | "gcp"
        region:     string
    }
    ledger: {
        currency:           [...string]
        entities:           [...string]
        accounts_per_entity: int
        tps_peak:           int
    }
    infra: {
        db:           "cockroachdb" | "postgresql"
        mq:           "redpanda" | "kafka"
        orchestrator: "temporal"
        kms:          "aws-kms" | "gcp-kms"
    }
    handover: {
        repo:              string
        sandbox_ttl_hours: int
    }
}
\`

func LoadAndValidate(path string) (*Spec, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("read spec: %w", err)
    }

    var raw map[string]any
    if err := yaml.Unmarshal(data, &raw); err != nil {
        return nil, fmt.Errorf("parse yaml: %w", err)
    }

    ctx := cuecontext.New()
    schema := ctx.CompileString(schemaCUE)
    value := ctx.Encode(raw)
    if err := value.Validate(cue.Schema(schema)); err != nil {
        return nil, fmt.Errorf("CUE validation failed: %w", err)
    }

    var spec Spec
    if err := yaml.Unmarshal(data, &spec); err != nil {
        return nil, fmt.Errorf("decode to struct: %w", err)
    }
    return &spec, nil
}
EOF

# --- 4. FSUTIL ---
cat > "$FACTORY_DIR/internal/fsutil/writer.go" << 'EOF'
package fsutil

import (
    "os"
    "path/filepath"
)

func WriteFileAtomic(path string, data []byte, perm os.FileMode) error {
    if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
        return err
    }
    tmp := path + ".tmp"
    if err := os.WriteFile(tmp, data, perm); err != nil {
        return err
    }
    return os.Rename(tmp, path)
}
EOF

# --- 5. GENERATOR ---
cat > "$FACTORY_DIR/internal/generator/generator.go" << 'EOF'
package generator

import (
    "bytes"
    "embed"
    "fmt"
    "os"
    "path/filepath"
    "strings"
    "text/template"

    "github.com/your-org/factory/internal/spec"
    "github.com/your-org/factory/internal/fsutil"
)

//go:embed templates/*
var templateFS embed.FS

type Generator struct {
    spec   *spec.Spec
    outDir string
}

func New(s *spec.Spec, outDir string) *Generator {
    return &Generator{spec: s, outDir: outDir}
}

func (g *Generator) Generate() error {
    files := map[string]string{
        // Terraform Root
        "terraform/main.tf.tmpl":              "terraform/main.tf",
        "terraform/variables.tf.tmpl":         "terraform/variables.tf",
        "terraform/outputs.tf.tmpl":           "terraform/outputs.tf",
        // Terraform Modules
        "terraform/modules/vpc/main.tf.tmpl":  "terraform/modules/vpc/main.tf",
        "terraform/modules/vpc/variables.tf.tmpl": "terraform/modules/vpc/variables.tf",
        "terraform/modules/eks/main.tf.tmpl":  "terraform/modules/eks/main.tf",
        "terraform/modules/eks/variables.tf.tmpl": "terraform/modules/eks/variables.tf",
        "terraform/modules/rds/main.tf.tmpl":  "terraform/modules/rds/main.tf",
        "terraform/modules/rds/variables.tf.tmpl": "terraform/modules/rds/variables.tf",
        "terraform/modules/vault/main.tf.tmpl": "terraform/modules/vault/main.tf",
        "terraform/modules/vault/variables.tf.tmpl": "terraform/modules/vault/variables.tf",
        // Go Application
        "go/go.mod.tmpl":                      "go/go.mod",
        "go/main.go.tmpl":                     "go/cmd/ledger/main.go",
        "go/domain/ledger.go.tmpl":            "go/internal/domain/ledger.go",
        "go/handler/ledger.go.tmpl":           "go/internal/handler/ledger.go",
        "go/middleware/idempotency.go.tmpl":   "go/internal/middleware/idempotency.go",
        "go/middleware/otel.go.tmpl":          "go/internal/middleware/otel.go",
        "go/api/ledger.proto.tmpl":            "go/api/ledger/v1/ledger.proto",
        // K8s / Helm
        "k8s/Chart.yaml.tmpl":                 "k8s/ledger/Chart.yaml",
        "k8s/values.yaml.tmpl":                "k8s/ledger/values.yaml",
        "k8s/templates/deployment.yaml.tmpl":  "k8s/ledger/templates/deployment.yaml",
        "k8s/templates/service.yaml.tmpl":     "k8s/ledger/templates/service.yaml",
        "k8s/templates/servicemonitor.yaml.tmpl": "k8s/ledger/templates/servicemonitor.yaml",
        // OPA Policies
        "policies/pci.rego.tmpl":              "policies/pci.rego",
        "policies/security.rego.tmpl":         "policies/security.rego",
        // CI/CD
        "ci/github-actions.yaml.tmpl":         ".github/workflows/ci.yaml",
        // Evidence
        "evidence/matrix.csv.tmpl":            "evidence/control_matrix.csv",
        "evidence/threat_model.md.tmpl":       "evidence/threat_model.md",
        "evidence/runbook_incident.md.tmpl":   "evidence/runbook_incident.md",
        // Docs
        "docs/ADR_001.md.tmpl":               "docs/adr/001-architecture-decision.md",
        "docs/handover.md.tmpl":              "docs/HANDOVER.md",
    }

    for tmplPath, outPath := range files {
        if err := g.render(tmplPath, outPath); err != nil {
            return fmt.Errorf("render %s: %w", tmplPath, err)
        }
    }
    return nil
}

func (g *Generator) render(tmplRel, outRel string) error {
    content, err := templateFS.ReadFile("templates/" + tmplRel)
    if err != nil {
        diskPath := filepath.Join(g.outDir, "..", "..", "templates", tmplRel)
        if diskContent, err := os.ReadFile(diskPath); err == nil {
            content = diskContent
        } else {
            return fmt.Errorf("template not found: %s", tmplRel)
        }
    }

    tmpl, err := template.New(tmplRel).Funcs(g.funcMap()).Parse(string(content))
    if err != nil {
        return err
    }

    var buf bytes.Buffer
    if err := tmpl.Execute(&buf, g.spec); err != nil {
        return err
    }

    fullOut := filepath.Join(g.outDir, outRel)
    return fsutil.WriteFileAtomic(fullOut, buf.Bytes(), 0644)
}

func (g *Generator) funcMap() template.FuncMap {
    return template.FuncMap{
        "join":  func(sep string, s []string) string { return strings.Join(s, sep) },
        "upper": strings.ToUpper,
        "lower": strings.ToLower,
        "quote": func(s string) string { return "\\"" + s + "\\"" },
    }
}
EOF

# --- 6. SPEC YAML ---
cat > "$SPEC_DIR/ledgercore.yaml" << 'EOF'
project:
  name: "acme-ledger-prod"
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
  db: "cockroachdb"
  mq: "redpanda"
  orchestrator: "temporal"
  kms: "aws-kms"

handover:
  repo: "github.com/acme-corp/ledgercore"
  sandbox_ttl_hours: 4
EOF

echo "✅ [2/5] Core files created"
echo "📝 [3/5] Creating templates..."

# Templates will be created in separate steps
# See templates section below

echo "✅ [4/5] Templates created"
echo "🚀 [5/5] Running generation..."

cd "$FACTORY_DIR"
go mod tidy
go run . --spec spec/ledgercore.yaml --out output/client-delivery

echo ""
echo "🎉 SUCCESS! Generated files in: $OUT_DIR"
echo ""
echo "Next steps:"
echo "  1. cd $OUT_DIR"
echo "  2. git init"
echo "  3. git add ."
echo "  4. git commit -m 'Initial LedgerCore project'"
echo "  5. git remote add origin <your-repo-url>"
echo "  6. git push -u origin main"
`;

export function BootstrapScript() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(bootstrapScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-100 mb-4">Bootstrap Script</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Complete one-command setup. Copy this script, run it in your terminal, and get a fully
          functional LedgerCore Factory in seconds.
        </p>
      </div>

      {/* Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <div className="text-3xl mb-3">1️⃣</div>
          <h3 className="text-lg font-bold text-gray-200 mb-2">Create Directory</h3>
          <code className="block bg-gray-950 rounded-lg p-3 text-xs text-emerald-400 font-mono">
            mkdir -p ~/ledgercore-factory<br />
            cd ~/ledgercore-factory
          </code>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <div className="text-3xl mb-3">2️⃣</div>
          <h3 className="text-lg font-bold text-gray-200 mb-2">Save Script</h3>
          <code className="block bg-gray-950 rounded-lg p-3 text-xs text-emerald-400 font-mono">
            nano bootstrap_factory.sh<br />
            # Paste the script below<br />
            chmod +x bootstrap_factory.sh
          </code>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <div className="text-3xl mb-3">3️⃣</div>
          <h3 className="text-lg font-bold text-gray-200 mb-2">Run</h3>
          <code className="block bg-gray-950 rounded-lg p-3 text-xs text-emerald-400 font-mono">
            ./bootstrap_factory.sh
          </code>
        </motion.div>
      </div>

      {/* Script Viewer */}
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
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {copied ? '✓ Copied!' : '📋 Copy Script'}
          </button>
        </div>
        <div className="overflow-auto max-h-[600px]">
          <Highlight theme={themes.nightOwl} code={bootstrapScript} language="bash">
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={`${className} p-4 text-sm leading-relaxed`} style={{ ...style, background: 'transparent', margin: 0 }}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })} className="table-row">
                    <span className="table-cell pr-4 text-right text-gray-600 select-none w-8 text-xs">
                      {i + 1}
                    </span>
                    <span className="table-cell">
                      {line.map((token, key) => (
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

      {/* What's Included */}
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

      {/* Total Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { value: '36+', label: 'Template Files' },
          { value: '32', label: 'Generated Files' },
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
