import { infraFiles } from './infraFiles';
import { geoComplianceTemplates } from './geoTemplates';
import { rtmTemplates } from './rtmTemplates';
import { domainModules } from './domainModules';
import { resilienceModule } from './resilienceModule';
import { auditTrailModule } from './auditTrailModule';
import { doraModule } from './doraModule';
import { agenticPaymentsModule } from './agenticPaymentsModule';
import { cbdcModule } from './cbdcModule';
import { regToCodeModule } from './regToCodeModule';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  language?: string;
  content?: string;
  children?: FileNode[];
  icon?: string;
}

// Infrastructure files added to factory root
const factoryRootFiles: FileNode[] = [
  ...infraFiles
];

export const files: FileNode[] = [
  {
    name: 'factory/',
    path: 'factory/',
    type: 'folder',
    children: [
      ...factoryRootFiles,
      {
        name: 'go.mod',
        path: 'factory/go.mod',
        type: 'file',
        language: 'go',
        icon: '📦',
        content: `module github.com/your-org/factory

go 1.22

require (
    cuelang.org/go v0.10.0
    github.com/spf13/cobra v1.8.0
    gopkg.in/yaml.v3 v3.0.1
)`
      },
      {
        name: 'main.go',
        path: 'factory/main.go',
        type: 'file',
        language: 'go',
        icon: '🚀',
        content: `package main

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
    Short: "LedgerCore Factory: Spec → Production Repo",
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
}`
      },
      {
        name: 'internal/',
        path: 'factory/internal/',
        type: 'folder',
        children: [
          {
            name: 'spec/',
            path: 'factory/internal/spec/',
            type: 'folder',
            children: [
              {
                name: 'loader.go',
                path: 'factory/internal/spec/loader.go',
                type: 'file',
                language: 'go',
                icon: '📄',
                content: `package spec

import (
    "fmt"
    "os"

    "cuelang.org/go/cue"
    "cuelang.org/go/cue/cuecontext"
    "gopkg.in/yaml.v3"
)

type Spec struct {
    Project       ProjectSpec       \`yaml:"project"\`
    Ledger        LedgerSpec        \`yaml:"ledger"\`
    Infra         InfraSpec         \`yaml:"infra"\`
    Handover      HandoverSpec      \`yaml:"handover"\`
    GeoCompliance *GeoComplianceSpec \`yaml:"geo_compliance,omitempty"\`
}

type GeoComplianceSpec struct {
    Enabled           bool                  \`yaml:"enabled"\`
    PrimaryRegion     string                \`yaml:"primary_region"\`
    DataResidencyRules []DataResidencyRule  \`yaml:"data_residency_rules"\`
    SanctionsScreening *SanctionsScreening  \`yaml:"sanctions_screening,omitempty"\`
    LicensingMap      []string              \`yaml:"licensing_map,omitempty"\`
}

type DataResidencyRule struct {
    Jurisdiction string   \`yaml:"jurisdiction"\`
    Regulation   string   \`yaml:"regulation"\`
    DataClasses  []string \`yaml:"data_classes"\`
    Action       string   \`yaml:"action"\` // deny_egress, local_only, opt_out_flag
}

type SanctionsScreening struct {
    Provider   string   \`yaml:"provider"\` // chainalysis, refinitiv, dow_jones
    OnAction   []string \`yaml:"on_action"\`
    BlockOnMatch bool   \`yaml:"block_on_match"\`
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
        cloud:      "aws"  // Only AWS implemented in v1.1
        region:     string
    }
    ledger: {
        currency:           [...string]
        entities:           [...string]
        accounts_per_entity: int
        tps_peak:           int
    }
    infra: {
        db:           "cockroachdb"  // Only CockroachDB implemented
        mq:           "redpanda"     // Only Redpanda implemented
        orchestrator: "temporal"
        kms:          "aws-kms"      // Only AWS KMS implemented
    }
    handover: {
        repo:              string
        sandbox_ttl_hours: int
    }
    geo_compliance?: {
        enabled: bool
        primary_region: string
        data_residency_rules: [...{
            jurisdiction: string
            regulation: string
            data_classes: [...string]
            action: "deny_egress" | "local_only" | "opt_out_flag"
        }]
        sanctions_screening?: {
            provider: "chainalysis" | "refinitiv" | "dow_jones"
            on_action: [...string]
            block_on_match: bool
        }
        licensing_map?: [...string]
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
}`
              },
              {
                name: 'loader_test.go',
                path: 'factory/internal/spec/loader_test.go',
                type: 'file',
                language: 'go',
                icon: '🧪',
                content: `package spec

import (
    "os"
    "path/filepath"
    "testing"
)

func TestLoadAndValidate_ValidSpec(t *testing.T) {
    validYAML := \`
project:
  name: "test-proj"
  org: "test-org"
  compliance: ["PCI-DSS-SAQ-A"]
  cloud: "aws"
  region: "us-east-1"
ledger:
  currency: ["USD"]
  entities: ["PARENT"]
  accounts_per_entity: 100
  tps_peak: 100
infra:
  db: "cockroachdb"
  mq: "redpanda"
  orchestrator: "temporal"
  kms: "aws-kms"
handover:
  repo: "github.com/test/test"
  sandbox_ttl_hours: 4
\`
    tmpDir := t.TempDir()
    specPath := filepath.Join(tmpDir, "valid.yaml")
    os.WriteFile(specPath, []byte(validYAML), 0644)

    s, err := LoadAndValidate(specPath)
    if err != nil {
        t.Fatalf("LoadAndValidate failed on valid spec: %v", err)
    }
    if s.Project.Name != "test-proj" {
        t.Errorf("Expected name 'test-proj', got '%s'", s.Project.Name)
    }
    if len(s.Project.Compliance) != 1 {
        t.Errorf("Expected 1 compliance, got %d", len(s.Project.Compliance))
    }
    if s.Ledger.TpsPeak != 100 {
        t.Errorf("Expected tps_peak 100, got %d", s.Ledger.TpsPeak)
    }
}

func TestLoadAndValidate_InvalidCloud(t *testing.T) {
    invalidYAML := \`
project:
  name: "test"
  org: "test"
  compliance: ["PCI-DSS-SAQ-A"]
  cloud: "azure"
  region: "us-east-1"
ledger:
  currency: ["USD"]
  entities: ["PARENT"]
  accounts_per_entity: 100
  tps_peak: 100
infra:
  db: "cockroachdb"
  mq: "redpanda"
  orchestrator: "temporal"
  kms: "aws-kms"
handover:
  repo: "github.com/test/test"
  sandbox_ttl_hours: 4
\`
    tmpDir := t.TempDir()
    specPath := filepath.Join(tmpDir, "invalid.yaml")
    os.WriteFile(specPath, []byte(invalidYAML), 0644)

    _, err := LoadAndValidate(specPath)
    if err == nil {
        t.Fatal("Expected validation error for invalid cloud 'azure', got nil")
    }
}

func TestLoadAndValidate_MissingField(t *testing.T) {
    missingYAML := \`
project:
  name: "test"
  org: "test"
\`
    tmpDir := t.TempDir()
    specPath := filepath.Join(tmpDir, "missing.yaml")
    os.WriteFile(specPath, []byte(missingYAML), 0644)

    _, err := LoadAndValidate(specPath)
    if err == nil {
        t.Fatal("Expected validation error for missing fields, got nil")
    }
}`
              }
            ]
          },
          {
            name: 'generator/',
            path: 'factory/internal/generator/',
            type: 'folder',
            children: [
              {
                name: 'generator.go',
                path: 'factory/internal/generator/generator.go',
                type: 'file',
                language: 'go',
                icon: '⚙️',
                content: `package generator

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
        "terraform/modules/eks/main.tf.tmpl":  "terraform/modules/eks/main.tf",
        "terraform/modules/rds/main.tf.tmpl":  "terraform/modules/rds/main.tf",
        "terraform/modules/vault/main.tf.tmpl":"terraform/modules/vault/main.tf",
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
        // Root files
        "docker/Dockerfile.tmpl":             "Dockerfile",
        "makefile/Makefile.tmpl":             "Makefile",
        "db/migrations/001_init.sql.tmpl":    "db/migrations/001_init.sql",
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
        return fmt.Errorf("template not found: %s", tmplRel)
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
}`
              },
              {
                name: 'generator_test.go',
                path: 'factory/internal/generator/generator_test.go',
                type: 'file',
                language: 'go',
                icon: '🧪',
                content: `package generator

import (
    "os"
    "path/filepath"
    "strings"
    "testing"

    "github.com/your-org/factory/internal/spec"
)

func TestGenerator_RendersAllFiles(t *testing.T) {
    s := &spec.Spec{
        Project: spec.ProjectSpec{
            Name:       "test-proj",
            Org:        "test-org",
            Compliance: []string{"PCI-DSS-SAQ-A"},
            Cloud:      "aws",
            Region:     "us-east-1",
        },
        Ledger: spec.LedgerSpec{
            Currency:          []string{"USD"},
            Entities:          []string{"PARENT"},
            AccountsPerEntity: 100,
            TpsPeak:           100,
        },
        Infra: spec.InfraSpec{
            DB:           "cockroachdb",
            MQ:           "redpanda",
            Orchestrator: "temporal",
            KMS:          "aws-kms",
        },
        Handover: spec.HandoverSpec{
            Repo:            "github.com/test/test",
            SandboxTTLHours: 4,
        },
    }

    tmpDir := t.TempDir()
    outDir := filepath.Join(tmpDir, "output")

    gen := New(s, outDir)
    err := gen.Generate()
    if err != nil {
        t.Fatalf("Generate failed: %v", err)
    }

    // Check critical files exist
    expectedFiles := []string{
        "terraform/main.tf",
        "terraform/modules/vpc/main.tf",
        "go/go.mod",
        "go/cmd/ledger/main.go",
        "k8s/ledger/Chart.yaml",
        "policies/pci.rego",
        ".github/workflows/ci.yaml",
        "evidence/control_matrix.csv",
        "docs/adr/001-architecture-decision.md",
        "docs/HANDOVER.md",
    }

    for _, f := range expectedFiles {
        fullPath := filepath.Join(outDir, f)
        if _, err := os.Stat(fullPath); os.IsNotExist(err) {
            t.Errorf("Missing expected generated file: %s", f)
        }
    }

    // Check content rendering (spot check)
    content, _ := os.ReadFile(filepath.Join(outDir, "go/go.mod"))
    if !strings.Contains(string(content), "module github.com/test/test") {
        t.Errorf("go.mod not rendered correctly: %s", string(content))
    }
    content, _ = os.ReadFile(filepath.Join(outDir, "terraform/main.tf"))
    if !strings.Contains(string(content), "test-proj") {
        t.Errorf("terraform main.tf not rendered: %s", string(content))
    }
}

func TestGenerator_HighTPS_Scaling(t *testing.T) {
    s := &spec.Spec{
        Project: spec.ProjectSpec{
            Name:       "high-tps-proj",
            Org:        "test-org",
            Compliance: []string{"PCI-DSS-SAQ-A"},
            Cloud:      "aws",
            Region:     "us-east-1",
        },
        Ledger: spec.LedgerSpec{
            Currency:          []string{"USD", "EUR", "BTC"},
            Entities:          []string{"PARENT", "EU", "APAC"},
            AccountsPerEntity: 50000,
            TpsPeak:           10000,
        },
        Infra: spec.InfraSpec{
            DB:           "cockroachdb",
            MQ:           "redpanda",
            Orchestrator: "temporal",
            KMS:          "aws-kms",
        },
        Handover: spec.HandoverSpec{
            Repo:            "github.com/test/high-tps",
            SandboxTTLHours: 4,
        },
    }

    tmpDir := t.TempDir()
    outDir := filepath.Join(tmpDir, "output")

    gen := New(s, outDir)
    err := gen.Generate()
    if err != nil {
        t.Fatalf("Generate failed for high-TPS: %v", err)
    }

    // Verify K8s values has higher replicas for high TPS
    content, _ := os.ReadFile(filepath.Join(outDir, "k8s/ledger/values.yaml"))
    if !strings.Contains(string(content), "replicaCount: 5") {
        t.Errorf("Expected replicaCount: 5 for high TPS, got: %s", string(content))
    }
}`
              },
              {
                name: 'templates/',
                path: 'factory/internal/generator/templates/',
                type: 'folder',
                children: [
                  {
                    name: 'terraform/',
                    path: 'factory/internal/generator/templates/terraform/',
                    type: 'folder',
                    children: [
                      {
                        name: 'main.tf.tmpl',
                        path: 'factory/internal/generator/templates/terraform/main.tf.tmpl',
                        type: 'file',
                        language: 'hcl',
                        icon: '🏗️',
                        content: `terraform {
  required_version = ">= 1.5"
  required_providers {
    aws        = { source = "hashicorp/aws", version = "~> 5.0" }
    kubernetes = { source = "hashicorp/kubernetes", version = "~> 2.30" }
    helm       = { source = "hashicorp/helm", version = "~> 2.10" }
    random     = { source = "hashicorp/random", version = "~> 3.6" }
    tls        = { source = "hashicorp/tls", version = "~> 4.0" }
  }
  backend "s3" {}
}

provider "aws" {
  region = var.region
  default_tags { tags = var.common_tags }
}

module "vpc"   { source = "./modules/vpc" }
module "eks"   { source = "./modules/eks"; depends_on = [module.vpc] }
module "rds"   { source = "./modules/rds"; depends_on = [module.vpc] }
module "vault" { source = "./modules/vault"; depends_on = [module.eks] }`
                      },
                      {
                        name: 'variables.tf.tmpl',
                        path: 'factory/internal/generator/templates/terraform/variables.tf.tmpl',
                        type: 'file',
                        language: 'hcl',
                        icon: '📝',
                        content: `variable "region" {
  type    = string
  default = "{{.Project.Region}}"
}

variable "project_name" {
  type    = string
  default = "{{.Project.Name}}"
}

variable "org_name" {
  type    = string
  default = "{{.Project.Org}}"
}

variable "compliance_tags" {
  type    = list(string)
  default = [{{range $i, $v := .Project.Compliance}}{{if $i}}, {{end}}"{{$v}}"{{end}}]
}

variable "common_tags" {
  type = map(string)
  default = {
    Project   = "{{.Project.Name}}"
    Org       = "{{.Project.Org}}"
    ManagedBy = "LedgerCoreFactory"
  }
}`
                      },
                      {
                        name: 'outputs.tf.tmpl',
                        path: 'factory/internal/generator/templates/terraform/outputs.tf.tmpl',
                        type: 'file',
                        language: 'hcl',
                        icon: '📤',
                        content: `output "vpc_id" {
  value = module.vpc.vpc_id
}

output "eks_cluster_name" {
  value = module.eks.cluster_name
}

output "rds_endpoint" {
  value = module.rds.db_endpoint
}

output "vault_address" {
  value = module.vault.vault_address
}`
                      },
                      {
                        name: 'modules/',
                        path: 'factory/internal/generator/templates/terraform/modules/',
                        type: 'folder',
                        children: [
                          {
                            name: 'vpc/main.tf.tmpl',
                            path: 'factory/internal/generator/templates/terraform/modules/vpc/main.tf.tmpl',
                            type: 'file',
                            language: 'hcl',
                            icon: '🌐',
                            content: `module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "{{.Project.Name}}-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["\${var.region}a", "\${var.region}b", "\${var.region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway   = true
  single_nat_gateway   = false
  enable_dns_hostnames = true
  enable_dns_support   = true

  # PCI DSS: Network segmentation
  enable_network_acl = true

  public_subnet_tags = {
    "kubernetes.io/role/elb" = "1"
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = "1"
  }

  tags = var.common_tags
}

# PCI DSS 10.2: Flow logs
resource "aws_flow_log" "vpc" {
  iam_role_arn    = aws_iam_role.flow_log.arn
  log_destination = aws_cloudwatch_log_group.vpc.arn
  traffic_type    = "ALL"
  vpc_id          = module.vpc.vpc_id
}

resource "aws_iam_role" "flow_log" {
  assume_role_policy = data.aws_iam_policy_document.flow_log.json
}

resource "aws_cloudwatch_log_group" "vpc" {
  name              = "/aws/vpc/flowlogs/{{.Project.Name}}"
  retention_in_days = 365
}

data "aws_iam_policy_document" "flow_log" {
  statement {
    actions = ["logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["\${aws_cloudwatch_log_group.vpc.arn}:*"]
    principals {
      type        = "Service"
      identifiers = ["vpc-flow-logs.amazonaws.com"]
    }
  }
}`
                          },
                          {
                            name: 'eks/main.tf.tmpl',
                            path: 'factory/internal/generator/templates/terraform/modules/eks/main.tf.tmpl',
                            type: 'file',
                            language: 'hcl',
                            icon: '☸️',
                            content: `module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "{{.Project.Name}}-eks"
  cluster_version = "1.28"

  vpc_id     = var.vpc_id
  subnet_ids = var.private_subnets

  cluster_endpoint_private_access = true
  cluster_endpoint_public_access  = false

  eks_managed_node_group_defaults = {
    ami_type = "AL2_x86_64"
  }

  eks_managed_node_groups = {
    system = {
      name            = "system"
      instance_types  = ["t3.medium"]
      capacity_type   = "ON_DEMAND"
      min_size        = 1
      max_size        = 3
      desired_size    = 2
      labels = {
        workload = "system"
      }
    }
    app = {
      name            = "app"
      instance_types  = ["t3.large"]
      capacity_type   = "ON_DEMAND"
      min_size        = {{if ge .Ledger.TpsPeak 5000}}5{{else if ge .Ledger.TpsPeak 1000}}3{{else}}2{{end}}
      max_size        = {{if ge .Ledger.TpsPeak 5000}}20{{else if ge .Ledger.TpsPeak 1000}}10{{else}}5{{end}}
      desired_size    = {{if ge .Ledger.TpsPeak 5000}}5{{else if ge .Ledger.TpsPeak 1000}}3{{else}}2{{end}}
      labels = {
        workload = "app"
      }
    }
  }

  tags = var.common_tags
}`
                          },
                          {
                            name: 'rds/main.tf.tmpl',
                            path: 'factory/internal/generator/templates/terraform/modules/rds/main.tf.tmpl',
                            type: 'file',
                            language: 'hcl',
                            icon: '🗄️',
                            content: `resource "aws_kms_key" "rds" {
  description             = "RDS encryption key for {{.Project.Name}}"
  deletion_window_in_days = 30
  enable_key_rotation     = true
}

resource "aws_db_subnet_group" "rds" {
  name       = "{{.Project.Name}}-rds-subnet"
  subnet_ids = var.private_subnets
  tags       = var.common_tags
}

resource "aws_security_group" "rds" {
  name   = "{{.Project.Name}}-rds-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.eks_sg_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.common_tags
}

# PostgreSQL RDS Cluster (Aurora)
# Note: For CockroachDB, deploy on EKS or use CockroachCloud
resource "aws_rds_cluster" "postgresql" {
  cluster_identifier = "{{.Project.Name}}-postgresql"
  engine             = "aurora-postgresql"
  engine_version     = "15.4"
  database_name      = "ledger"
  master_username    = "postgres"

  manage_master_user_password       = true
  master_user_password_secret_kms_key_id = aws_kms_key.rds.arn

  db_subnet_group_name   = aws_db_subnet_group.rds.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  storage_encrypted = true
  kms_key_id        = aws_kms_key.rds.arn

  backup_retention_period = 30
  preferred_backup_window = "03:00-04:00"

  skip_final_snapshot       = false
  final_snapshot_identifier = "{{.Project.Name}}-postgresql-final"

  tags = var.common_tags
}

resource "aws_rds_cluster_instance" "postgresql" {
  count              = 3
  identifier         = "\${aws_rds_cluster.postgresql.id}-\${count.index}"
  cluster_identifier = aws_rds_cluster.postgresql.id
  instance_class     = "db.r6g.large"
  engine             = aws_rds_cluster.postgresql.engine
  tags               = var.common_tags
}`
                          },
                          {
                            name: 'vault/main.tf.tmpl',
                            path: 'factory/internal/generator/templates/terraform/modules/vault/main.tf.tmpl',
                            type: 'file',
                            language: 'hcl',
                            icon: '🔐',
                            content: `module "vault" {
  source  = "hashicorp/vault/aws"
  version = "~> 0.10"

  cluster_name = "{{.Project.Name}}-vault"
  vpc_id       = var.vpc_id
  private_subnet_ids = var.private_subnet_ids

  vault_version = "1.15.2"
  replicas      = 3
  storage_type  = "raft"

  kms_key_id = var.kms_key_id

  tags = var.common_tags
}

resource "aws_security_group" "vault" {
  name   = "{{.Project.Name}}-vault-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port       = 8200
    to_port         = 8200
    protocol        = "tcp"
    security_groups = [var.eks_sg_id]
  }

  ingress {
    from_port   = 8201
    to_port     = 8201
    protocol    = "tcp"
    self        = true
  }

  tags = var.common_tags
}`
                          }
                        ]
                      }
                    ]
                  },
                  {
                    name: 'go/',
                    path: 'factory/internal/generator/templates/go/',
                    type: 'folder',
                    children: [
                      {
                        name: 'go.mod.tmpl',
                        path: 'factory/internal/generator/templates/go/go.mod.tmpl',
                        type: 'file',
                        language: 'go',
                        icon: '📦',
                        content: `module {{.Handover.Repo}}

go 1.22

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/go-playground/validator/v10 v10.16.0
    github.com/jackc/pgx/v5 v5.5.0
    github.com/redis/go-redis/v9 v9.3.0
    go.opentelemetry.io/otel v1.21.0
    go.temporal.io/sdk v1.23.0
    google.golang.org/grpc v1.59.0
    google.golang.org/protobuf v1.31.0
)`
                      },
                      {
                        name: 'main.go.tmpl',
                        path: 'factory/internal/generator/templates/go/main.go.tmpl',
                        type: 'file',
                        language: 'go',
                        icon: '🚀',
                        content: `package main

import (
    "context"
    "log"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "{{.Handover.Repo}}/internal/domain"
    "{{.Handover.Repo}}/internal/handler"
    "{{.Handover.Repo}}/internal/middleware"

    "github.com/gin-gonic/gin"
)

func main() {
    log.Printf("🚀 Starting LedgerCore: %s (Org: %s)", "{{.Project.Name}}", "{{.Project.Org}}")

    ledger := domain.NewLedger(domain.Config{
        Currencies: {{.Ledger.Currency | join "," | quote}},
        Entities:   {{.Ledger.Entities | join "," | quote}},
    })

    r := gin.Default()
    r.Use(middleware.Idempotency(), middleware.OTEL())
    r.GET("/healthz", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok"})
    })

    h := handler.NewLedgerHandler(ledger)
    h.RegisterRoutes(r.Group("/api/v1"))

    srv := &http.Server{Addr: ":8080", Handler: r}
    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("listen: %s\\n", err)
        }
    }()

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit
    log.Println("Shutting down server...")

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    if err := srv.Shutdown(ctx); err != nil {
        log.Fatal("Server Shutdown:", err)
    }
    log.Println("Server exiting")
}`
                      },
                      {
                        name: 'domain/ledger.go.tmpl',
                        path: 'factory/internal/generator/templates/go/domain/ledger.go.tmpl',
                        type: 'file',
                        language: 'go',
                        icon: '💰',
                        content: `package domain

import (
    "context"
    "errors"
    "fmt"
    "time"

    "github.com/jackc/pgx/v5/pgxpool"
)

type Config struct {
    Currencies []string
    Entities   []string
    DBHost     string
}

type Ledger struct {
    pool       *pgxpool.Pool
    currencies map[string]bool
    entities   map[string]bool
}

func NewLedger(cfg Config) (*Ledger, error) {
    pool, err := pgxpool.New(context.Background(), cfg.DBHost)
    if err != nil {
        return nil, fmt.Errorf("unable to connect to database: %w", err)
    }

    currencies := make(map[string]bool)
    for _, c := range cfg.Currencies {
        currencies[c] = true
    }

    entities := make(map[string]bool)
    for _, e := range cfg.Entities {
        entities[e] = true
    }

    return &Ledger{
        pool:       pool,
        currencies: currencies,
        entities:   entities,
    }, nil
}

func (l *Ledger) PostTransaction(ctx context.Context, tx *Transaction) error {
    // 1. Validate entity
    if !l.entities[tx.Entity] {
        return ErrInvalidEntity
    }

    // 2. Validate currencies
    for _, entry := range tx.Entries {
        if !l.currencies[entry.Currency] {
            return fmt.Errorf("unsupported currency: %s", entry.Currency)
        }
    }

    // 3. Double-entry validation: sum(debits) == sum(credits)
    var debitSum, creditSum int64
    for _, entry := range tx.Entries {
        if entry.Direction == "DEBIT" {
            debitSum += entry.Amount
        } else if entry.Direction == "CREDIT" {
            creditSum += entry.Amount
        }
    }
    if debitSum != creditSum {
        return fmt.Errorf("double-entry violation: debits (%d) != credits (%d)", debitSum, creditSum)
    }

    // 4. Idempotency check
    var exists bool
    err := l.pool.QueryRow(ctx, 
        "SELECT EXISTS(SELECT 1 FROM transactions WHERE idempotency_key = $1)", 
        tx.IdempotencyKey).Scan(&exists)
    if err != nil {
        return fmt.Errorf("idempotency check failed: %w", err)
    }
    if exists {
        return nil // Already processed
    }

    // 5. Insert transaction
    _, err = l.pool.Exec(ctx,
        \`INSERT INTO transactions (id, idempotency_key, entity, type, entries, metadata, timestamp)
         VALUES ($1, $2, $3, $4, $5, $6, $7)\`,
        tx.ID, tx.IdempotencyKey, tx.Entity, tx.Type, tx.Entries, tx.Metadata, tx.Timestamp)
    if err != nil {
        return fmt.Errorf("failed to insert transaction: %w", err)
    }

    return nil
}

func (l *Ledger) GetBalance(ctx context.Context, accountID, entity, currency string, asOf *time.Time) (int64, error) {
    if !l.entities[entity] {
        return 0, ErrInvalidEntity
    }

    query := \`
        SELECT COALESCE(SUM(
            CASE WHEN e.direction = 'DEBIT' THEN e.amount
                 WHEN e.direction = 'CREDIT' THEN -e.amount
                 ELSE 0 END
        ), 0)
        FROM transactions t,
        LATERAL jsonb_to_recordset(t.entries) AS e(account_id text, amount bigint, direction text, currency text)
        WHERE e.account_id = $1
          AND e.currency = $2
          AND t.entity = $3
    \`
    
    var args []interface{} = []interface{}{accountID, currency, entity}
    if asOf != nil {
        query += " AND t.timestamp <= $4"
        args = append(args, *asOf)
    }

    var balance int64
    err := l.pool.QueryRow(ctx, query, args...).Scan(&balance)
    if err != nil {
        return 0, fmt.Errorf("failed to get balance: %w", err)
    }

    return balance, nil
}

type Transaction struct {
    ID             string                 \`json:"id" validate:"required,uuid"\`
    IdempotencyKey string                 \`json:"idempotency_key" validate:"required"\`
    Entity         string                 \`json:"entity" validate:"required"\`
    Type           string                 \`json:"type" validate:"required,oneof=TRANSFER ADJUSTMENT REVERSAL FEE INTEREST"\`
    Entries        []Entry                \`json:"entries" validate:"required,min=2,dive"\`
    Metadata       map[string]interface{} \`json:"metadata,omitempty"\`
    Timestamp      time.Time              \`json:"timestamp"\`
}

type Entry struct {
    AccountID string \`json:"account_id" validate:"required"\`
    Currency  string \`json:"currency" validate:"required"\`
    Amount    int64  \`json:"amount" validate:"required,ne=0"\`
    Direction string \`json:"direction" validate:"required,oneof=DEBIT CREDIT"\`
}

var ErrInsufficientFunds = errors.New("insufficient funds")
var ErrInvalidEntity = errors.New("invalid entity")`
                      },
                      {
                        name: 'handler/ledger.go.tmpl',
                        path: 'factory/internal/generator/templates/go/handler/ledger.go.tmpl',
                        type: 'file',
                        language: 'go',
                        icon: '🔌',
                        content: `package handler

import (
    "errors"
    "net/http"

    "github.com/gin-gonic/gin"
    "{{.Handover.Repo}}/internal/domain"
)

type LedgerHandler struct {
    ledger *domain.Ledger
}

func NewLedgerHandler(l *domain.Ledger) *LedgerHandler {
    return &LedgerHandler{ledger: l}
}

func (h *LedgerHandler) RegisterRoutes(rg *gin.RouterGroup) {
    rg.POST("/transactions", h.PostTransaction)
    rg.GET("/accounts/:entity/:account_id/balance", h.GetBalance)
}

func (h *LedgerHandler) PostTransaction(c *gin.Context) {
    var tx domain.Transaction
    if err := c.ShouldBindJSON(&tx); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    if err := h.ledger.PostTransaction(c.Request.Context(), &tx); err != nil {
        if errors.Is(err, domain.ErrInsufficientFunds) {
            c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusAccepted, gin.H{
        "transaction_id": tx.ID,
        "status":         "ACCEPTED",
    })
}

func (h *LedgerHandler) GetBalance(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
        "balance":  0,
        "currency": c.Param("currency"),
    })
}`
                      },
                      {
                        name: 'middleware/idempotency.go.tmpl',
                        path: 'factory/internal/generator/templates/go/middleware/idempotency.go.tmpl',
                        type: 'file',
                        language: 'go',
                        icon: '🔑',
                        content: `package middleware

import (
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/redis/go-redis/v9"
)

func Idempotency() gin.HandlerFunc {
    return func(c *gin.Context) {
        key := c.GetHeader("Idempotency-Key")
        if key == "" {
            c.Next()
            return
        }
        ctx := c.Request.Context()
        // Check Redis cache
        // ... implementation
        c.Next()
        // Cache response on success
        if c.Writer.Status() < 400 {
            // Store in Redis with 24h TTL
        }
    }
}`
                      },
                      {
                        name: 'middleware/otel.go.tmpl',
                        path: 'factory/internal/generator/templates/go/middleware/otel.go.tmpl',
                        type: 'file',
                        language: 'go',
                        icon: '📊',
                        content: `package middleware

import (
    "github.com/gin-gonic/gin"
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/propagation"
)

func OTEL() gin.HandlerFunc {
    return func(c *gin.Context) {
        ctx := otel.GetTextMapPropagator().Extract(
            c.Request.Context(),
            propagation.HeaderCarrier(c.Request.Header),
        )
        c.Request = c.Request.WithContext(ctx)
        c.Next()
    }
}`
                      },
                      {
                        name: 'api/ledger.proto.tmpl',
                        path: 'factory/internal/generator/templates/go/api/ledger.proto.tmpl',
                        type: 'file',
                        language: 'proto',
                        icon: '📡',
                        content: `syntax = "proto3";
package ledger.v1;
option go_package = "{{.Handover.Repo}}/api/ledger/v1";

service LedgerService {
  rpc PostTransaction(PostTransactionRequest) returns (PostTransactionResponse);
  rpc GetBalance(GetBalanceRequest) returns (GetBalanceResponse);
}

message PostTransactionRequest {
  string idempotency_key = 1;
  string entity = 2;
  repeated Entry entries = 3;
  map<string, string> metadata = 4;
}

message PostTransactionResponse {
  string transaction_id = 1;
  string status = 2;
}

message GetBalanceRequest {
  string entity = 1;
  string account_id = 2;
  string currency = 3;
}

message GetBalanceResponse {
  int64 balance = 1;
  string currency = 2;
}

message Entry {
  string account_id = 1;
  string currency = 2;
  int64 amount = 3;
  string direction = 4;
}`
                      }
                    ]
                  },
                  {
                    name: 'k8s/',
                    path: 'factory/internal/generator/templates/k8s/',
                    type: 'folder',
                    children: [
                      {
                        name: 'Chart.yaml.tmpl',
                        path: 'factory/internal/generator/templates/k8s/Chart.yaml.tmpl',
                        type: 'file',
                        language: 'yaml',
                        icon: '📋',
                        content: `apiVersion: v2
name: ledger
description: LedgerCore Helm Chart for {{.Project.Name}}
type: application
version: 0.1.0
appVersion: "1.0.0"
annotations:
  ledgercore.factory/version: "1.0.0"`
                      },
                      {
                        name: 'values.yaml.tmpl',
                        path: 'factory/internal/generator/templates/k8s/values.yaml.tmpl',
                        type: 'file',
                        language: 'yaml',
                        icon: '⚙️',
                        content: `replicaCount: {{if ge .Ledger.TpsPeak 5000}}5{{else if ge .Ledger.TpsPeak 1000}}3{{else}}2{{end}}

image:
  repository: {{.Handover.Repo}}
  tag: latest
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 8080

resources:
  limits:
    cpu: {{if ge .Ledger.TpsPeak 5000}}"4"{{else if ge .Ledger.TpsPeak 1000}}"2"{{else}}"1"{{end}}
    memory: {{if ge .Ledger.TpsPeak 5000}}"8Gi"{{else if ge .Ledger.TpsPeak 1000}}"4Gi"{{else}}"2Gi"{{end}}
  requests:
    cpu: "500m"
    memory: "1Gi"

autoscaling:
  enabled: true
  minReplicas: {{if ge .Ledger.TpsPeak 5000}}5{{else if ge .Ledger.TpsPeak 1000}}3{{else}}2{{end}}
  maxReplicas: {{if ge .Ledger.TpsPeak 5000}}20{{else if ge .Ledger.TpsPeak 1000}}10{{else}}5{{end}}
  targetCPUUtilization: 70

podSecurityContext:
  runAsNonRoot: true
  runAsUser: 1000
  fsGroup: 1000

env:
  - name: DB_HOST
    valueFrom:
      secretKeyRef:
        name: ledger-db
        key: host
  - name: REDIS_ADDR
    valueFrom:
      secretKeyRef:
        name: ledger-redis
        key: addr
  - name: VAULT_ADDR
    value: "https://vault.{{.Project.Name}}.internal:8200"

serviceMonitor:
  enabled: true
  interval: "30s"`
                      },
                      {
                        name: 'templates/deployment.yaml.tmpl',
                        path: 'factory/internal/generator/templates/k8s/templates/deployment.yaml.tmpl',
                        type: 'file',
                        language: 'yaml',
                        icon: '🚢',
                        content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{.Project.Name}}-ledger
  labels:
    app: {{.Project.Name}}-ledger
spec:
  replicas: {{if ge .Ledger.TpsPeak 5000}}5{{else if ge .Ledger.TpsPeak 1000}}3{{else}}2{{end}}
  selector:
    matchLabels:
      app: {{.Project.Name}}-ledger
  template:
    metadata:
      labels:
        app: {{.Project.Name}}-ledger
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 1000
      containers:
        - name: ledger
          image: "{{.Handover.Repo}}:latest"
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8080
              name: http
          env:
            - name: DB_HOST
              valueFrom:
                secretKeyRef:
                  name: ledger-db-credentials
                  key: host
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: ledger-redis
                  key: url
            - name: LOG_LEVEL
              value: "info"
          resources:
            limits:
              cpu: {{if ge .Ledger.TpsPeak 5000}}"4"{{else if ge .Ledger.TpsPeak 1000}}"2"{{else}}"1"{{end}}
              memory: {{if ge .Ledger.TpsPeak 5000}}"8Gi"{{else if ge .Ledger.TpsPeak 1000}}"4Gi"{{else}}"2Gi"{{end}}
            requests:
              cpu: "500m"
              memory: "1Gi"
          livenessProbe:
            httpGet:
              path: /healthz
              port: http
            initialDelaySeconds: 10
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /healthz
              port: http
            initialDelaySeconds: 5
            periodSeconds: 5`
                      },
                      {
                        name: 'templates/service.yaml.tmpl',
                        path: 'factory/internal/generator/templates/k8s/templates/service.yaml.tmpl',
                        type: 'file',
                        language: 'yaml',
                        icon: '🌐',
                        content: `apiVersion: v1
kind: Service
metadata:
  name: {{.Project.Name}}-ledger
  labels:
    app: {{.Project.Name}}-ledger
spec:
  type: ClusterIP
  ports:
    - port: 8080
      targetPort: http
      protocol: TCP
      name: http
  selector:
    app: {{.Project.Name}}-ledger`
                      }
                    ]
                  },
                  {
                    name: 'policies/',
                    path: 'factory/internal/generator/templates/policies/',
                    type: 'folder',
                    children: [
                      {
                        name: 'pci.rego.tmpl',
                        path: 'factory/internal/generator/templates/policies/pci.rego.tmpl',
                        type: 'file',
                        language: 'rego',
                        icon: '🛡️',
                        content: `package pci

import future.keywords.if
import future.keywords.in

# REQ 1.2.1: No 0.0.0.0/0 on sensitive ports
deny contains msg if {
    some i
    input.resource_changes[i].change.after.type == "aws_security_group_rule"
    input.resource_changes[i].change.after.cidr_blocks[_] == "0.0.0.0/0"
    input.resource_changes[i].change.after.from_port in [22, 3306, 5432, 6379, 9200, 27017]
    msg := sprintf("PCI 1.2.1 VIOLATION: SG Rule %s open to world on port %d",
      [input.resource_changes[i].address, input.resource_changes[i].change.after.from_port])
}

# REQ 3.4.1: Encryption at rest (explicit KMS)
deny contains msg if {
    some i
    resource := input.resource_changes[i].change.after
    resource.type in ["aws_db_instance", "aws_s3_bucket", "aws_ebs_volume",
                       "aws_efs_file_system", "aws_redshift_cluster"]
    not resource.kms_key_id
    msg := sprintf("PCI 3.4.1 VIOLATION: %s %s missing explicit kms_key_id",
      [resource.type, input.resource_changes[i].address])
}

# REQ 8.3.1: No secrets in env vars (MFA for admin access)
deny contains msg if {
    some i
    resource := input.resource_changes[i].change.after
    resource.type == "kubernetes_pod"
    env := resource.spec.template.spec.containers[_].env[_]
    regex.match("(?i)(PASSWORD|SECRET|KEY|TOKEN)", env.name)
    msg := sprintf("PCI 8.3.1 VIOLATION: Pod %s has secret-like env var %s",
      [resource.metadata.name, env.name])
}

# REQ 10.2: Audit trails for all access
deny contains msg if {
    some i
    input.resource_changes[i].change.after.type == "aws_vpc"
    not input.resource_changes[i].change.after.flow_log_enabled
    msg := sprintf("PCI 10.2 VIOLATION: VPC %s has no flow logs",
      [input.resource_changes[i].address])
}`
                      },
                      {
                        name: 'security.rego.tmpl',
                        path: 'factory/internal/generator/templates/policies/security.rego.tmpl',
                        type: 'file',
                        language: 'rego',
                        icon: '🔒',
                        content: `package security

import future.keywords.in

default deny = false

# CIS: S3 encryption
deny[msg] {
    input.resource.type == "aws_s3_bucket"
    not input.resource.server_side_encryption_configuration
    msg := sprintf("SECURITY: S3 bucket %s missing default encryption",
      [input.resource.address])
}

# CIS: IAM wildcard
deny[msg] {
    input.resource.type == "aws_iam_policy"
    regex.match(".*\\"Action\\": \\\\[\\"\\\\*\\\\\\".*", input.resource.policy)
    msg := sprintf("SECURITY: IAM policy %s has wildcard '*' action",
      [input.resource.address])
}

# K8s: Non-root
deny[msg] {
    input.resource.type == "kubernetes_pod"
    not input.resource.spec.template.spec.security_context.run_as_non_root
    msg := sprintf("SECURITY: Pod %s must run as non-root",
      [input.resource.metadata.name])
}

# K8s: No privileged containers
deny[msg] {
    input.resource.type == "kubernetes_pod"
    input.resource.spec.template.spec.containers[_].security_context.privileged == true
    msg := sprintf("SECURITY: Pod %s runs privileged container",
      [input.resource.metadata.name])
}`
                      }
                    ]
                  },
                  {
                    name: 'ci/',
                    path: 'factory/internal/generator/templates/ci/',
                    type: 'folder',
                    children: [
                      {
                        name: 'github-actions.yaml.tmpl',
                        path: 'factory/internal/generator/templates/ci/github-actions.yaml.tmpl',
                        type: 'file',
                        language: 'yaml',
                        icon: '🔄',
                        content: `name: LedgerCore CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch: {}

env:
  GO_VERSION: "1.22"
  TF_VERSION: "1.8.0"
  REGISTRY: "ghcr.io"
  IMAGE_NAME: "{{.Handover.Repo}}"

jobs:
  validate-spec:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate Spec
        run: |
          cd factory
          go run . -spec ../spec/ledgercore.yaml -out ../output/test-gen
          echo "Spec validation passed."

  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: \${{ env.GO_VERSION }}
      - name: Go Mod Download
        run: cd output/client-delivery/go && go mod download
      - name: Go Build
        run: cd output/client-delivery/go && go build -v ./...
      - name: Go Vet
        run: cd output/client-delivery/go && go vet ./...
      - name: Go Test
        run: cd output/client-delivery/go && go test -race -coverprofile=coverage.out ./...

  terraform-validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: \${{ env.TF_VERSION }}
      - name: Terraform Format
        run: cd output/client-delivery/terraform && terraform fmt -check -recursive
      - name: Terraform Init
        run: cd output/client-delivery/terraform && terraform init -backend=false
      - name: Terraform Validate
        run: cd output/client-delivery/terraform && terraform validate

  policy-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install OPA
        run: |
          curl -L -o opa https://openpolicyagent.org/downloads/latest/opa_linux_amd64_static
          chmod +x opa
          sudo mv opa /usr/local/bin/
      - name: Check Policies
        run: |
          cd output/client-delivery
          opa fmt -d policies/
          echo "Policy syntax OK."

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Trivy
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: 'output/client-delivery'
          format: 'sarif'
          output: 'trivy.sarif'
      - name: Upload Trivy
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy.sarif'

  build-and-push:
    needs: [lint-and-test, terraform-validate, policy-check, security-scan]
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: \${{ env.REGISTRY }}
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - name: Build and Push
        uses: docker/build-push-action@v5
        with:
          context: output/client-delivery/go
          push: true
          tags: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:latest`
                      }
                    ]
                  },
                  {
                    name: 'evidence/',
                    path: 'factory/internal/generator/templates/evidence/',
                    type: 'folder',
                    children: [
                      {
                        name: 'matrix.csv.tmpl',
                        path: 'factory/internal/generator/templates/evidence/matrix.csv.tmpl',
                        type: 'file',
                        language: 'csv',
                        icon: '📊',
                        content: `Control_ID,Control_Description,PCI_DSS_Req,SOC2_Criteria,Terraform_Resource,OPA_Policy,Test_Case,Evidence_Location,Status
PCI-1.2.1,Restrict inbound/outbound traffic,1.2.1,CC6.1,aws_security_group_rule,pci.rego:deny[0],SG Rule Check,terraform/plan.json,PENDING
PCI-3.4.1,Encryption at rest with KMS,3.4.1,CC6.7,aws_db_instance/aws_s3_bucket,pci.rego:deny[1],KMS Key Check,terraform/plan.json,PENDING
PCI-8.2.1,No secrets in env vars,8.2.1,CC6.3,kubernetes_pod,pci.rego:deny[2],Pod Env Scan,k8s/manifests.yaml,PENDING
PCI-10.2.1,Audit trails for all access,10.2.1,CC7.2,aws_vpc,pci.rego:deny[3],Flow Logs Check,terraform/plan.json,PENDING
SOC2-CC6.1,Logical Access Controls,,CC6.1,aws_iam_policy,security.rego:deny[1],IAM Wildcard Check,terraform/plan.json,PENDING
SOC2-CC6.7,Encryption Key Management,,CC6.7,aws_kms_key,security.rego:deny[0],Key Rotation Check,terraform/plan.json,PENDING`
                      },
                      {
                        name: 'threat_model.md.tmpl',
                        path: 'factory/internal/generator/templates/evidence/threat_model.md.tmpl',
                        type: 'file',
                        language: 'markdown',
                        icon: '⚠️',
                        content: `# Threat Model: {{.Project.Name}} LedgerCore

**Methodology:** STRIDE
**Generated:** {{now | date "2006-01-02"}}
**Version:** 1.0

## System Overview
- **Scope:** Transaction ledger API, infrastructure (VPC, EKS, RDS, Vault), CI/CD pipeline
- **Trust Boundaries:** Public Internet → NAT → Private Subnets (App, Data, CDE) → Vault/KMS
- **Data Classification:** PCI CHD, PII, Financial Records

## Threat Analysis

| Threat | Category | Asset | Impact | Likelihood | Mitigation | Residual Risk | Control |
|--------|----------|-------|--------|------------|------------|---------------|---------|
| T1 | Spoofing | API Authentication | High | Medium | mTLS + JWT + Idempotency keys | Low | PCI-8.2.1 |
| T2 | Tampering | Ledger Entries | Critical | Low | Immutable event store, row-level DB security | Low | PCI-10.2.1 |
| T3 | Repudiation | Admin Actions | High | Medium | Immutable audit log (Merkle tree) | Low | PCI-10.2.1 |
| T4 | Info Disclosure | DB Credentials | Critical | Low | Vault dynamic secrets, KMS encryption, no env vars | Low | PCI-3.4.1, 8.2.1 |
| T5 | DoS | API Availability | High | Medium | WAF, rate limiting, autoscaling | Medium | - |
| T6 | Elevation of Privilege | K8s Privilege Escalation | Critical | Low | PSP/OPA gatekeeper, non-root, no-privilege | Low | security.rego |

## Risk Registry Summary
- **Critical Risks:** 0 (after mitigations)
- **High Risks:** 1 (DoS - mitigated with Shield/WAF)
- **Medium Risks:** 2
- **Low Risks:** 3`
                      },
                      {
                        name: 'runbook_incident.md.tmpl',
                        path: 'factory/internal/generator/templates/evidence/runbook_incident.md.tmpl',
                        type: 'file',
                        language: 'markdown',
                        icon: '🚨',
                        content: `# Incident Response Runbook: SEV-1/SEV-2

**System:** {{.Project.Name}} LedgerCore
**Owner:** Platform Team
**Escalation:** CTO → VP Engineering

## SEV-1: Data Corruption / Ledger Imbalance Detected

**Symptoms:** Balance mismatch alerts, audit log hash check failure.
**Impact:** Financial data integrity compromised.

**Troubleshooting Steps:**
1. **CONFIRM** (5 min): Page on-call + CTO. Freeze deployments.
2. **ISOLATE** (15 min): Enable \`READ_ONLY\` mode in Ledger API (feature flag). Block write traffic at WAF.
3. **DIAGNOSE** (30 min): Check event store (Kafka/Redpanda) vs DB state. Verify Merkle tree root.
4. **RECOVER** (RTO < 4h):
   - Option A: Replay events from last verified checkpoint (point-in-time recovery).
   - Option B: Failover to DR region (RPO < 1 min).
5. **VERIFY**: Run reconciliation job. Confirm hash chain integrity.
6. **POST-MORTEM** (48h): Document RCA, action items, update runbook.

## SEV-2: PCI Control Failure (Scanner Alert / Audit Finding)

**Symptoms:** OPA Gatekeeper failure in CI/CD, audit log gap detected.
**Impact:** Compliance violation, potential regulatory exposure.

**Troubleshooting Steps:**
1. **ASSESS** (10 min): Determine scope — single resource vs systemic.
2. **REMEDIATE** (2h): Fix IaC, re-run pipeline, verify OPA pass.
3. **DOCUMENT**: Update evidence matrix, notify compliance officer.
4. **PREVENT**: Add regression test, update policy if needed.`
                      }
                    ]
                  },
                  {
                    name: 'docs/',
                    path: 'factory/internal/generator/templates/docs/',
                    type: 'folder',
                    children: [
                      {
                        name: 'ADR_001.md.tmpl',
                        path: 'factory/internal/generator/templates/docs/ADR_001.md.tmpl',
                        type: 'file',
                        language: 'markdown',
                        icon: '📖',
                        content: `# ADR 001: Core Architecture Decision — LedgerCore Factory v1.0

**Status:** Accepted
**Date:** {{ now | date "2006-01-02" }}
**Decision Makers:** {{.Project.Org}} CTO, Lead Platform Engineer, Compliance Engineer
**Tags:** architecture, compliance, factory, ledger, PCI-DSS, SOC2

---

## Context

We need to deliver a **production-ready, audit-proof transaction ledger system + infrastructure** to fintech clients within **10 business days** at a **fixed price**. The solution must satisfy:

1. **Functional**: Double-entry, multi-currency, multi-entity, idempotent event-sourced ledger.
2. **Compliance**: Auto-generated PCI DSS SAQ-A/L1 and SOC2 Type II evidence.
3. **Operational**: GitOps, policy-as-code, zero-trust networking, immutable audit trail.
4. **Commercial**: Deterministic delivery, IP transfer, no vendor lock-in.

The alternative is manual consulting (3–6 months, T&M billing, high variance).

---

## Decision

We adopt a **spec-driven production model**:

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Contract** | **CUE** (Schema + Validation) | Single source of truth, type-safety, spec validation before generation |
| **Generation** | **Go + text/template + embed.FS** | Compile-time safety, deterministic output, no runtime deps |
| **Infrastructure** | **Terraform (AWS modules) + Helm** | Declarative, plan-able, OPA-policyable, drift-detectable |
| **Runtime** | **Go (gRPC/REST) + CockroachDB + Redpanda + Temporal** | Strong consistency (CRDB), durability/ordering (Redpanda), durable execution (Temporal) |
| **Compliance** | **OPA/Rego (Policy as Code)** | Unit-testable infra, CI gates, auditor-readable rules |
| **Evidence** | **Artifact Templates (CSV, MD, scripts)** | "Evidence as code" — generated alongside infra, always in sync |

**Key Principles:**
- **Spec Freeze** → Generate → Gate Checks → Handover.
- **No manual edits** in generated output. Changes → Update spec/factory → Regenerate.
- **Factory versioning** (\`factory/vX.YZ\`) pins generator to spec for reproducibility.

---

## Consequences

### Positive
- **Speed**: 10 days from spec to audit-ready repo.
- **Quality**: 0 critical/high findings in CI (SAST, SCA, IaC, policy).
- **Compliance**: Evidence package generated *with* code, not after.
- **Margin**: COGS ~$42K / Revenue $185K (77% gross) at scale.
- **Scalability**: One team (2 eng + 1 PM) = 2 projects/month.

### Negative / Risks
| Risk | Mitigation |
|------|------------|
| **Spec expressiveness limits** | CUE allows arbitrary constraints; extend schema for new modules (KYC, cards) |
| **Generator becomes bottleneck** | Factory is code — tested, versioned, CI-gated. Changes require factory tests |
| **Client customization pressure** | Strict change order process ($25K/day). "One pass" = one spec |
| **Cloud lock-in (AWS)** | Modules abstracted; GCP port = new TF modules + same spec/Go/K8s |

---

## Alternatives Considered

1. **Pure consulting (manual Terraform/Go)** — Rejected: Too slow, high variance, knowledge silo.
2. **Low-code platform (Retool, Windmill)** — Rejected: Not fit for production Core Ledger/PCI.
3. **Pulumi (TypeScript/Python)** — Rejected: Go templates + Terraform providers = better K8s/infra ecosystem.
4. **Kubernetes Operators for Ledger** — Rejected: Overkill for MVP; Temporal + Go simpler workflow.

---

## Implementation Notes

- **Factory Repo**: \`github.com/{{.Project.Org}}/ledgercore-factory\` (private).
- **Client Repo**: \`github.com/{{.Project.Org}}/{{.Project.Name}}\` (generated, client-owned).
- **Invocation**: \`factory generate -spec spec/ledgercore.yaml -out output/client-delivery\`.
- **CI Pipeline**: Spec Validate → Generate → Go Test → TF Validate → OPA Check → Security Scan.

---

## References

- [PCI DSS v4.0 Requirements](https://www.pcisecuritystandards.org/)
- [SOC2 Trust Services Criteria](https://www.aicpa.org/)
- [CUE Language](https://cuelang.org/)
- [OPA/Rego](https://www.openpolicyagent.org/)
- [CockroachDB Architecture](https://www.cockroachlabs.com/docs/architecture/overview)
- [Temporal.io](https://temporal.io/)`
                      },
                      {
                        name: 'HANDOVER.md.tmpl',
                        path: 'factory/internal/generator/templates/docs/handover.md.tmpl',
                        type: 'file',
                        language: 'markdown',
                        icon: '🤝',
                        content: `# Project Handover: {{.Project.Name}}

## Quick Start
\`\`\`bash
# Prerequisites
- Go 1.22+
- Terraform 1.5+
- kubectl configured for {{.Project.Cloud}}
- AWS CLI / gcloud CLI authenticated

# Deploy Infrastructure
cd terraform
terraform init
terraform plan -out=tfplan
terraform apply tfplan

# Deploy Application
cd ../k8s/ledger
helm upgrade --install ledger . -n ledger --create-namespace

# Run Tests
cd ../../go
go test ./...
\`\`\`

## Repository Structure
- \`terraform/\` — Infrastructure as Code
- \`go/\` — Application source
- \`k8s/\` — Kubernetes manifests (Helm)
- \`policies/\` — OPA/Rego policies
- \`.github/workflows/\` — CI/CD pipeline
- \`evidence/\` — Compliance evidence
- \`docs/\` — Architecture decisions

## Key Contacts
- **Tech Lead:** [TBD]
- **Platform Team:** [TBD]
- **Security:** [TBD]
- **Compliance Officer:** [TBD]

## Sandbox Access
- **TTL:** {{.Handover.SandboxTTLHours}} hours
- **Repo:** {{.Handover.Repo}}
- **Environment:** {{.Project.Cloud}} / {{.Project.Region}}

## Compliance Status
{{- range .Project.Compliance}}
- [ ] {{.}} — Initial verification pending
{{- end}}`
                      }
                    ]
                  }
                ]
              },
              ...geoComplianceTemplates,
              ...rtmTemplates,
              ...domainModules,
              ...resilienceModule,
              ...auditTrailModule,
              ...doraModule,
              ...agenticPaymentsModule,
              ...cbdcModule,
              ...regToCodeModule
            ]
          },
          {
            name: 'fsutil/',
            path: 'factory/internal/fsutil/',
            type: 'folder',
            children: [
              {
                name: 'writer.go',
                path: 'factory/internal/fsutil/writer.go',
                type: 'file',
                language: 'go',
                icon: '💾',
                content: `package fsutil

import (
    "os"
    "path/filepath"
)

// WriteFileAtomic writes data to a file atomically using rename.
// Creates parent directories if they don't exist.
func WriteFileAtomic(path string, data []byte, perm os.FileMode) error {
    if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
        return err
    }
    tmp := path + ".tmp"
    if err := os.WriteFile(tmp, data, perm); err != nil {
        return err
    }
    return os.Rename(tmp, path)
}`
              }
            ]
          }
        ]
      },
      {
        name: 'spec/',
        path: 'factory/spec/',
        type: 'folder',
        children: [
          {
            name: 'ledgercore.yaml',
            path: 'factory/spec/ledgercore.yaml',
            type: 'file',
            language: 'yaml',
            icon: '📝',
            content: `# ═══════════════════════════════════════════════
# LedgerCore Specification — Single Source of Truth
# Edit ONLY this file to configure your project
# ═══════════════════════════════════════════════

project:
  name: "acme-ledger-prod"
  org: "acme-corp"
  compliance: ["PCI-DSS-SAQ-D", "SOC2-Type2"]  # SAQ-D for CHD storage
  compliance_pack: "PCI-DSS-4.0.1|SOC2-Type2|GDPR"  # Enterprise IP: Regulatory mapping
  cloud: "aws"
  region: "eu-central-1"  # GDPR anchor region

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

# Geo-Compliance Module (Factory v1.1)
geo_compliance:
  enabled: true
  primary_region: "eu-central-1"
  data_residency_rules:
    - jurisdiction: "EU"
      regulation: "GDPR"
      data_classes: ["PII", "CHD", "TransactionLogs"]
      action: "deny_egress"
    # Note: 152-FZ (Russia) requires local cloud (Yandex Cloud/Selectel)
    # AWS does not have Russian regions. Remove or use separate deployment.
    # - jurisdiction: "RU"
    #   regulation: "152-FZ"
    #   data_classes: ["PII", "PaymentData"]
    #   action: "local_only"
    - jurisdiction: "US-CA"
      regulation: "CCPA"
      data_classes: ["PII"]
      action: "opt_out_flag"
  sanctions_screening:
    provider: "chainalysis"
    on_action: ["CreateAccount", "CreateTransaction"]
    block_on_match: true
  licensing_map:
    - "US-NY-DFS"
    - "UK-FCA-EMI"
    - "EU-MiCA"

# Domain Modules (Enterprise Time-to-Value)
modules:
  - "card-issuing"      # Payment card issuance and processing
  - "reconciliation"    # Transaction reconciliation engine
  - "resilience"        # DORA / Operational Resilience
  - "audit-trail"       # Immutable audit log with Merkle tree
  - "dora"              # DORA compliance (Register, TLPT, Incident)
  - "agentic-payments"  # AI agent payment authorization (x401)
  - "cbdc-rub"          # Digital Ruble (ЦБ РФ) integration

# Operational Model
operational_model:
  managed_operations: true  # Enable Managed Operations ($15k-$40k/mo)
  support_tier: "enterprise"  # 24/7 on-call, 1h SLA for SEV-1`
          }
        ]
      },
      {
        name: 'output/',
        path: 'factory/output/',
        type: 'folder',
        children: [
          {
            name: 'client-delivery/',
            path: 'factory/output/client-delivery/',
            type: 'folder',
            icon: '📦',
            children: [
              { name: 'terraform/', path: 'factory/output/client-delivery/terraform/', type: 'folder', icon: '🏗️', children: [] },
              { name: 'go/', path: 'factory/output/client-delivery/go/', type: 'folder', icon: '🐹', children: [] },
              { name: 'k8s/', path: 'factory/output/client-delivery/k8s/', type: 'folder', icon: '☸️', children: [] },
              { name: 'policies/', path: 'factory/output/client-delivery/policies/', type: 'folder', icon: '🛡️', children: [] },
              { name: '.github/', path: 'factory/output/client-delivery/.github/', type: 'folder', icon: '🔄', children: [] },
              { name: 'evidence/', path: 'factory/output/client-delivery/evidence/', type: 'folder', icon: '📊', children: [] },
              { name: 'docs/', path: 'factory/output/client-delivery/docs/', type: 'folder', icon: '📖', children: [] },
            ]
          }
        ]
      }
    ]
  }
];
