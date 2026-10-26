import type { FileNode } from './files';

// Infrastructure files to add to the root factory/ structure
export const infraFiles: FileNode[] = [
  {
    name: 'Makefile',
    path: 'factory/Makefile',
    type: 'file',
    language: 'makefile',
    icon: '🔨',
    content: `# LedgerCore Factory — Build & Operations
# Usage: make <target>
# ----------------------------------------------------------

BINARY_NAME        := factory
MODULE             := github.com/your-org/factory
VERSION            := $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
BUILD_TIME         := $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")
GIT_COMMIT         := $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")
LDFLAGS            := -ldflags "-X main.version=$(VERSION) -X main.buildTime=$(BUILD_TIME) -X main.gitCommit=$(GIT_COMMIT)"

GO                 := go
GOFMT              := gofmt
GOLANGCI_LINT      := golangci-lint
DOCKER             := docker
DOCKER_REGISTRY    := ghcr.io
DOCKER_IMAGE       := $(DOCKER_REGISTRY)/your-org/ledgercore-factory

.PHONY: all build run test lint fmt vet generate clean docker-build docker-push help

all: lint test build

## Build
build:
\t@echo "🔨 Building $(BINARY_NAME) v$(VERSION)..."
\t@$(GO) build $(LDFLAGS) -o bin/$(BINARY_NAME) .

run: build
\t@./bin/$(BINARY_NAME) -spec spec/ledgercore.yaml -out output/client-delivery

## Generate (for development: re-generate templates into output/)
generate:
\t@echo "🔄 Generating client-delivery from spec..."
\t@go run . -spec spec/ledgercore.yaml -out output/client-delivery

## Quality
lint:
\t@echo "🔍 Linting..."
\t@$(GOLANGCI_LINT) run ./...

fmt:
\t@echo "🎨 Formatting..."
\t@$(GOFMT) -w -s .

vet:
\t@echo "🔬 Vetting..."
\t@$(GO) vet ./...

## Testing
test: test-unit test-integration

test-unit:
\t@echo "🧪 Unit tests..."
\t@$(GO) test -v -race -coverprofile=coverage.unit.out ./internal/...

test-integration: build
\t@echo "🧪 Integration test: Generate -> Terraform Validate..."
\t@./bin/$(BINARY_NAME) -spec spec/ledgercore.yaml -out /tmp/it-test
\t@cd /tmp/it-test/terraform && terraform init -backend=false >/dev/null && terraform validate
\t@echo "✅ Integration test passed"

## Docker
docker-build:
\t@echo "🐳 Building Docker image $(DOCKER_IMAGE):$(VERSION)..."
\t@$(DOCKER) build --build-arg VERSION=$(VERSION) --build-arg COMMIT=$(GIT_COMMIT) -t $(DOCKER_IMAGE):$(VERSION) -t $(DOCKER_IMAGE):latest -f Dockerfile .

docker-push: docker-build
\t@echo "📤 Pushing $(DOCKER_IMAGE):$(VERSION)..."
\t@$(DOCKER) push $(DOCKER_IMAGE):$(VERSION)
\t@$(DOCKER) push $(DOCKER_IMAGE):latest

## Release
release-tag:
\t@git tag -a v$(VERSION) -m "Release $(VERSION)"
\t@git push origin v$(VERSION)

## Clean
clean:
\t@echo "🧹 Cleaning..."
\t@rm -rf bin/ output/client-delivery coverage.*.out

## Help
help:
\t@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\\033[36m%-20s\\033[0m %s\\n", $$1, $$2}'`
  },
  {
    name: 'Dockerfile',
    path: 'factory/Dockerfile',
    type: 'file',
    language: 'dockerfile',
    icon: '🐳',
    content: `# ----------------------------------------------------------
# LedgerCore Factory — Multi-stage Dockerfile
# ----------------------------------------------------------
# Build stage
FROM golang:1.22-alpine AS builder

ARG VERSION=dev
ARG COMMIT=unknown

RUN apk add --no-cache git make gcc musl-dev

WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build \\
    -ldflags "-X main.version=$VERSION -X main.gitCommit=$COMMIT" \\
    -o /out/factory .

# ----------------------------------------------------------
# Final stage — Distroless (non-root, minimal)
# ----------------------------------------------------------
FROM gcr.io/distroless/static-debian12:nonroot

COPY --from=builder /out/factory /factory
COPY --from=builder /src/spec /spec
COPY --from=builder /src/internal/generator/templates /templates

ENV FACTORY_TEMPLATES_DIR=/templates
ENV FACTORY_SPEC_DIR=/spec

ENTRYPOINT ["/factory"]
CMD ["-spec", "/spec/ledgercore.yaml", "-out", "/output/client-delivery"]`
  },
  {
    name: 'docker-compose.yml',
    path: 'factory/docker-compose.yml',
    type: 'file',
    language: 'yaml',
    icon: '🐙',
    content: `version: '3.8'

services:
  factory:
    build:
      context: .
      dockerfile: Dockerfile
    image: ledgercore-factory:local
    volumes:
      - ./spec:/spec:ro
      - ./output:/output
      - ./internal/generator/templates:/templates:ro
    environment:
      - FACTORY_TEMPLATES_DIR=/templates
    command: ["-spec", "/spec/ledgercore.yaml", "-out", "/output/client-delivery"]
    profiles: ["build"]

  # For integration tests (Terraform validate)
  terraform:
    image: hashicorp/terraform:1.8
    volumes:
      - ./output/client-delivery/terraform:/workspace
    working_dir: /workspace
    entrypoint: ["terraform"]
    command: ["init", "-backend=false"]
    profiles: ["test"]

  # Local S3 for Terraform state (optional)
  localstack:
    image: localstack/localstack:latest
    ports: ["4566:4566"]
    environment:
      - SERVICES=s3
      - DEBUG=1
    profiles: ["localstack"]`
  },
  {
    name: 'README.md',
    path: 'factory/README.md',
    type: 'file',
    language: 'markdown',
    icon: '📖',
    content: `# LedgerCore Factory ⚙️

> **Deterministic Factory for PCI DSS / SOC2 Compliant FinTech Infrastructure**
>
> *From Spec to Audit-Ready Repo in 10 days. Fixed Price. Your IP.*

---

## 🎯 What is this?

**LedgerCore Factory** is a **Spec-Driven Code Generator** that transforms a single YAML specification (\\\`spec/ledgercore.yaml\\\`) into a complete, production-ready, audit-ready FinTech infrastructure repository.

**Input:** \\\`spec/ledgercore.yaml\\\` (Project name, Compliance targets, Cloud, Ledger config)
**Output:** \\\`output/client-delivery/\\\` — A full Git repo ready for \\\`git push\\\` → \\\`terraform apply\\\` → \\\`helm install\\\` → Audit.

---

## 📦 What gets generated?

| Layer | Technology | Compliance |
|-------|------------|------------|
| **Infrastructure** | Terraform (AWS VPC, EKS, CockroachDB, Vault) | PCI DSS 1.2.1, 3.4.1, 8.2.1, 10.2.1 |
| **Kubernetes** | Helm Charts (Deployment, Service, ServiceMonitor, HPA) | SOC2 CC6.1, CC6.7, CC7.2 |
| **Application** | Go 1.22 (gRPC/REST, Double-Entry Ledger, Idempotency, OTEL) | PCI 8.2.1 (No secrets in env) |
| **Policy** | OPA/Rego (PCI DSS, CIS, Cost Guardrails) | Automated CI Gates |
| **CI/CD** | GitHub Actions (SAST, SCA, TF Validate, OPA, Trivy, Build/Push) | Supply Chain Security |
| **Evidence** | Control Matrix (CSV), Threat Model (STRIDE), Runbooks, ADR | Audit-Ready Package |

---

## 🚀 Quick Start

### Prerequisites
- Go 1.22+
- Docker (for containerized build)
- \\\`golangci-lint\\\` (for linting)
- \\\`make\\\`

### Local Development
\\\`\\\`\\\`bash
# 1. Clone
git clone https://github.com/your-org/ledgercore-factory
cd ledgercore-factory/factory

# 2. Configure your project
cp spec/ledgercore.yaml spec/my-project.yaml
# Edit spec/my-project.yaml with your project details

# 3. Generate
make generate

# 4. Inspect output
tree output/client-delivery
\\\`\\\`\\\`

### Using Docker (Recommended for CI/CD)
\\\`\\\`\\\`bash
# Build image
make docker-build

# Generate using container (mounts spec + output)
docker run --rm \\\\
  -v $(pwd)/spec:/spec:ro \\\\
  -v $(pwd)/output:/output \\\\
  ledgercore-factory:latest \\\\
  -spec /spec/ledgercore.yaml -out /output/client-delivery
\\\`\\\`\\\`

### Using the Binary
\\\`\\\`\\\`bash
# Build binary
make build

# Run
./bin/factory -spec spec/ledgercore.yaml -out output/client-delivery

# Version
./bin/factory -v
\\\`\\\`\\\`

---

## 🏗 Architecture

\\\`\\\`\\\`
factory/
├── cmd/factory/           # CLI Entry (Cobra)
├── internal/
│   ├── spec/              # CUE Schema + Loader + Validator
│   ├── generator/         # Go Template Engine (embed.FS)
│   │   └── templates/     # All templates (TF, Go, K8s, OPA, CI, Evidence, Docs)
│   └── fsutil/            # Atomic file writer
├── spec/                  # Input Specs (YAML)
├── output/                # Generated Client Repos (gitignored)
├── .github/workflows/     # Factory CI/CD
├── Makefile               # Build, Test, Lint, Docker
├── Dockerfile             # Multi-stage (Builder -> Distroless)
├── docker-compose.yml     # Local Dev Environment
└── .golangci.yml          # Lint Config
\\\`\\\`\\\`

---

## 🧪 Testing

\\\`\\\`\\\`bash
# Unit tests (Spec validation, Template rendering)
make test-unit

# Integration test: Generate -> Terraform Validate
make test-integration

# Full pipeline (Lint + Test + Build)
make all
\\\`\\\`\\\`

---

## 📋 Specification Reference

\\\`\\\`\\\`yaml
project:
  name: "my-ledger"           # DNS-safe, unique
  org: "my-corp"              # GitHub Org / Namespace
  compliance: ["PCI-DSS-SAQ-A", "SOC2-Type2"]
  cloud: "aws"                # or "gcp"
  region: "us-east-1"

ledger:
  currency: ["USD", "EUR"]    # ISO 4217
  entities: ["PARENT", "EU"]  # Legal entities
  accounts_per_entity: 5000   # Capacity hint
  tps_peak: 1000              # Provisioning hint

infra:
  db: "cockroachdb"           # or "postgresql"
  mq: "redpanda"              # or "kafka"
  orchestrator: "temporal"
  kms: "aws-kms"              # or "gcp-kms"

handover:
  repo: "github.com/my-corp/my-ledger"
  sandbox_ttl_hours: 4
\\\`\\\`\\\`

---

## 🔒 Compliance Mapping

| Control | PCI DSS | SOC2 | Implementation | Verification |
|---------|---------|------|----------------|--------------|
| Network Segmentation | 1.2.1 | CC6.1 | VPC NACLs, SG rules | OPA pci.rego |
| Encryption at Rest | 3.4.1 | CC6.7 | KMS keys, EBS/RDS encryption | OPA pci.rego |
| No Secrets in Env | 8.2.1 | CC6.3 | Vault dynamic secrets | OPA pci.rego |
| Audit Trails | 10.2.1 | CC7.2 | VPC flow logs, CloudWatch | OPA pci.rego |
| IAM Least Privilege | - | CC6.1 | IRSA, scoped policies | OPA security.rego |

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

1. Fork → Feature Branch
2. \\\`make lint test\\\` must pass
3. Update templates in \\\`internal/generator/templates/\\\`
4. Add tests for new logic
5. PR with description of generated output changes

---

## 📄 License

Apache 2.0 — See LICENSE.

---

*Built by engineers who passed 12 PCI DSS audits. We automate the boring stuff so you launch.*`
  },
  {
    name: '.golangci.yml',
    path: 'factory/.golangci.yml',
    type: 'file',
    language: 'yaml',
    icon: '🔍',
    content: `run:
  timeout: 3m
  go: "1.22"
  modules-download-mode: readonly

linters:
  enable:
    - govet
    - errcheck
    - staticcheck
    - gosimple
    - unused
    - misspell
    - ineffassign
    - bodyclose
    - copyloopvar
    - noctx
    - rowserrcheck
    - sqlclosecheck
    - errorlint
  disable-all: false
  fast: false

issues:
  exclude-rules:
    - path: _test\\.go
      linters:
        - errcheck
        - gosec
  max-issues-per-linter: 0
  max-same-issues: 0

output:
  format: colored-line-number
  print-issued-lines: true
  print-linter-name: true`
  },
  {
    name: '.gitignore',
    path: 'factory/.gitignore',
    type: 'file',
    language: 'text',
    icon: '🚫',
    content: `# Binaries
bin/
factory

# Generated Output
output/client-delivery/
/tmp/it-test/

# Coverage
coverage.*.out

# IDE
.idea/
.vscode/
*.swp

# OS
.DS_Store

# Env
.env
.env.local

# Terraform (in generated output, not here)
*.tfstate
*.tfstate.backup
.terraform/

# Logs
*.log`
  },
  {
    name: 'CONTRIBUTING.md',
    path: 'factory/CONTRIBUTING.md',
    type: 'file',
    language: 'markdown',
    icon: '🤝',
    content: `# Contributing to LedgerCore Factory

## Development Setup

\\\`\\\`\\\`bash
# 1. Install tools
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
go install cuelang.org/go/cmd/cue@latest

# 2. Setup pre-commit (optional)
# pre-commit install
\\\`\\\`\\\`

## Workflow

1. **Issue First**: Discuss changes in an Issue.
2. **Branch**: \\\`feat/short-description\\\` or \\\`fix/short-description\\\`.
3. **Develop**:
   - Modify templates in \\\`internal/generator/templates/\\\`
   - Update spec schema in \\\`internal/spec/schema.cue\\\` if needed
   - Add unit tests for new logic
4. **Validate**:
   \\\`\\\`\\\`bash
   make lint test generate
   \\\`\\\`\\\`
5. **Commit**: Conventional Commits (\\\`feat:\\\`, \\\`fix:\\\`, \\\`docs:\\\`, \\\`refactor:\\\`).
6. **PR**: Fill template, link Issue.

## Adding a New Template

1. Create \\\`.tmpl\\\` file in \\\`internal/generator/templates/<category>/\\\`
2. Register in \\\`internal/generator/generator.go\\\` \\\`files\\\` map.
3. Add test case in \\\`internal/generator/generator_test.go\\\` (check file exists).
4. Run \\\`make generate\\\` and inspect \\\`output/client-delivery/\\\`.

## Code Style

- \\\`make fmt\\\` before commit.
- \\\`make lint\\\` must pass.
- Table-driven tests for logic.
- Comments for exported functions/types.

## Releasing

\\\`\\\`\\\`bash
# Tag triggers release workflow
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
\\\`\\\`\\\``
  },
  {
    name: '.env.example',
    path: 'factory/.env.example',
    type: 'file',
    language: 'text',
    icon: '🔧',
    content: `# Factory Environment Variables (optional)
FACTORY_TEMPLATES_DIR=/custom/path/to/templates
FACTORY_SPEC_DIR=/custom/path/to/specs
LOG_LEVEL=info`
  },
  {
    name: 'test/',
    path: 'factory/test/',
    type: 'folder',
    children: [
      {
        name: 'integration/',
        path: 'factory/test/integration/',
        type: 'folder',
        children: [
          {
            name: 'terraform_validate_test.sh',
            path: 'factory/test/integration/terraform_validate_test.sh',
            type: 'file',
            language: 'bash',
            icon: '🔧',
            content: `#!/bin/bash
set -euo pipefail

# This script is called by 'make test-integration'
# It assumes the binary has generated output to /tmp/it-test

OUT_DIR="/tmp/it-test"
BINARY="./bin/factory"
SPEC="spec/ledgercore.yaml"

echo "🧪 Integration Test: Generate -> Terraform Validate"

# 1. Generate
echo "📦 Generating..."
$BINARY -spec $SPEC -out $OUT_DIR

# 2. Terraform Init & Validate (no backend)
echo "🔧 Terraform Init & Validate..."
cd $OUT_DIR/terraform
terraform init -backend=false > /dev/null
terraform validate

echo "✅ Integration Test PASSED"`
          }
        ]
      }
    ]
  },
  {
    name: '.github/',
    path: 'factory/.github/',
    type: 'folder',
    children: [
      {
        name: 'workflows/',
        path: 'factory/.github/workflows/',
        type: 'folder',
        children: [
          {
            name: 'factory-ci.yaml',
            path: 'factory/.github/workflows/factory-ci.yaml',
            type: 'file',
            language: 'yaml',
            icon: '🔄',
            content: `name: Factory CI/CD

on:
  push:
    branches: [main]
    tags: ['v*']
  pull_request:
    branches: [main]

env:
  GO_VERSION: '1.22'
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  lint-and-test:
    name: Lint & Test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Go
        uses: actions/setup-go@v5
        with:
          go-version: \${{ env.GO_VERSION }}
          cache: true

      - name: Install golangci-lint
        uses: golangci/golangci-lint-action@v6
        with:
          version: latest

      - name: Run Linters
        run: make lint

      - name: Run Unit Tests
        run: make test-unit

      - name: Upload Coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage.unit.out

  integration-test:
    name: Integration Test (Generate -> TF Validate)
    runs-on: ubuntu-latest
    needs: lint-and-test
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Go
        uses: actions/setup-go@v5
        with:
          go-version: \${{ env.GO_VERSION }}
          cache: true

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.8.0

      - name: Build Binary
        run: make build

      - name: Run Integration Test
        run: make test-integration

  docker-build:
    name: Build & Push Docker Image
    runs-on: ubuntu-latest
    needs: integration-test
    if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || startsWith(github.ref, 'refs/tags/v'))
    permissions:
      contents: read
      packages: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: \${{ env.REGISTRY }}
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and Push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: \${{ steps.meta.outputs.tags }}
          labels: \${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  release:
    name: Create Release
    runs-on: ubuntu-latest
    needs: docker-build
    if: github.event_name == 'push' && startsWith(github.ref, 'refs/tags/v')
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Create Release
        uses: softprops/action-gh-release@v2
        with:
          generate_release_notes: true`
          }
        ]
      }
    ]
  }
];
