import type { FileNode } from './files';

// Reg-to-Code Module with Ollama (Local LLM) + Optional Cloud LLM
export const regToCodeModule: FileNode[] = [
  {
    name: 'regtocode/',
    path: 'factory/internal/generator/templates/regtocode/',
    type: 'folder',
    children: [
      {
        name: 'llm/provider.go.tmpl',
        path: 'factory/internal/generator/templates/regtocode/llm/provider.go.tmpl',
        type: 'file',
        language: 'go',
        icon: '🤖',
        content: `package llm

import (
    "context"
    "fmt"
)

// LLMProvider interface for flexible LLM backend selection
type LLMProvider interface {
    Generate(ctx context.Context, prompt string) (string, error)
    Name() string
}

// ProviderType represents the LLM backend type
type ProviderType string

const (
    ProviderOllama    ProviderType = "ollama"     // Local (default, free)
    ProviderOpenAI    ProviderType = "openai"     // Cloud (paid)
    ProviderAnthropic ProviderType = "anthropic"  // Cloud (paid)
)

// Config holds LLM provider configuration
type Config struct {
    Provider   ProviderType \`yaml:"provider"\`
    Endpoint   string       \`yaml:"endpoint,omitempty"\`   // For Ollama: http://localhost:11434
    APIKey     string       \`yaml:"api_key,omitempty"\`    // For OpenAI/Anthropic
    Model      string       \`yaml:"model,omitempty"\`      // Model name
    MaxTokens  int          \`yaml:"max_tokens,omitempty"\`
    Timeout    int          \`yaml:"timeout,omitempty"\`    // seconds
}

// NewProvider creates LLM provider based on config
func NewProvider(cfg Config) (LLMProvider, error) {
    switch cfg.Provider {
    case ProviderOllama:
        return NewOllamaProvider(cfg)
    case ProviderOpenAI:
        return NewOpenAIProvider(cfg)
    case ProviderAnthropic:
        return NewAnthropicProvider(cfg)
    default:
        return nil, fmt.Errorf("unknown provider: %s", cfg.Provider)
    }
}

// DefaultConfig returns default configuration (Ollama local)
func DefaultConfig() Config {
    return Config{
        Provider:  ProviderOllama,
        Endpoint:  "http://localhost:11434",
        Model:     "llama3.1:8b",
        MaxTokens: 4096,
        Timeout:   60,
    }
}`
      },
      {
        name: 'llm/ollama.go.tmpl',
        path: 'factory/internal/generator/templates/regtocode/llm/ollama.go.tmpl',
        type: 'file',
        language: 'go',
        icon: '🦙',
        content: `package llm

import (
    "bytes"
    "context"
    "encoding/json"
    "fmt"
    "net/http"
    "time"
)

// OllamaProvider implements LLMProvider for local Ollama
type OllamaProvider struct {
    endpoint  string
    model     string
    maxTokens int
    client    *http.Client
}

func NewOllamaProvider(cfg Config) (*OllamaProvider, error) {
    if cfg.Endpoint == "" {
        cfg.Endpoint = "http://localhost:11434"
    }
    if cfg.Model == "" {
        cfg.Model = "llama3.1:8b"
    }

    return &OllamaProvider{
        endpoint:  cfg.Endpoint,
        model:     cfg.Model,
        maxTokens: cfg.MaxTokens,
        client: &http.Client{
            Timeout: time.Duration(cfg.Timeout) * time.Second,
        },
    }, nil
}

func (p *OllamaProvider) Name() string {
    return "ollama"
}

func (p *OllamaProvider) Generate(ctx context.Context, prompt string) (string, error) {
    reqBody := map[string]interface{}{
        "model":  p.model,
        "prompt": prompt,
        "stream": false,
        "options": map[string]interface{}{
            "num_predict": p.maxTokens,
        },
    }

    jsonData, err := json.Marshal(reqBody)
    if err != nil {
        return "", fmt.Errorf("failed to marshal request: %w", err)
    }

    req, err := http.NewRequestWithContext(ctx, "POST", p.endpoint+"/api/generate", bytes.NewReader(jsonData))
    if err != nil {
        return "", fmt.Errorf("failed to create request: %w", err)
    }
    req.Header.Set("Content-Type", "application/json")

    resp, err := p.client.Do(req)
    if err != nil {
        return "", fmt.Errorf("failed to call Ollama: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return "", fmt.Errorf("Ollama returned status %d", resp.StatusCode)
    }

    var result struct {
        Response string \`json:"response"\`
    }
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return "", fmt.Errorf("failed to decode response: %w", err)
    }

    return result.Response, nil
}

// InstallOllama provides instructions for installing Ollama
func InstallOllama() string {
    return \`
# Install Ollama (local LLM runtime)
curl -fsSL https://ollama.com/install.sh | sh

# Pull model (8B parameters, ~4.7GB)
ollama pull llama3.1:8b

# Or use smaller model (2B parameters, ~1.6GB)
ollama pull llama3.1:2b

# Start Ollama server
ollama serve

# Verify
curl http://localhost:11434/api/tags
\`
}`
      },
      {
        name: 'llm/openai.go.tmpl',
        path: 'factory/internal/generator/templates/regtocode/llm/openai.go.tmpl',
        type: 'file',
        language: 'go',
        icon: '🔑',
        content: `package llm

import (
    "bytes"
    "context"
    "encoding/json"
    "fmt"
    "net/http"
    "time"
)

// OpenAIProvider implements LLMProvider for OpenAI API
type OpenAIProvider struct {
    apiKey    string
    model     string
    maxTokens int
    client    *http.Client
}

func NewOpenAIProvider(cfg Config) (*OpenAIProvider, error) {
    if cfg.APIKey == "" {
        return nil, fmt.Errorf("OpenAI API key is required")
    }
    if cfg.Model == "" {
        cfg.Model = "gpt-4-turbo-preview"
    }

    return &OpenAIProvider{
        apiKey:    cfg.APIKey,
        model:     cfg.Model,
        maxTokens: cfg.MaxTokens,
        client: &http.Client{
            Timeout: time.Duration(cfg.Timeout) * time.Second,
        },
    }, nil
}

func (p *OpenAIProvider) Name() string {
    return "openai"
}

func (p *OpenAIProvider) Generate(ctx context.Context, prompt string) (string, error) {
    reqBody := map[string]interface{}{
        "model": p.model,
        "messages": []map[string]string{
            {"role": "system", "content": "You are a compliance expert. Generate OPA Rego policies based on regulatory requirements."},
            {"role": "user", "content": prompt},
        },
        "max_tokens": p.maxTokens,
    }

    jsonData, err := json.Marshal(reqBody)
    if err != nil {
        return "", fmt.Errorf("failed to marshal request: %w", err)
    }

    req, err := http.NewRequestWithContext(ctx, "POST", "https://api.openai.com/v1/chat/completions", bytes.NewReader(jsonData))
    if err != nil {
        return "", fmt.Errorf("failed to create request: %w", err)
    }
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "Bearer "+p.apiKey)

    resp, err := p.client.Do(req)
    if err != nil {
        return "", fmt.Errorf("failed to call OpenAI: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return "", fmt.Errorf("OpenAI returned status %d", resp.StatusCode)
    }

    var result struct {
        Choices []struct {
            Message struct {
                Content string \`json:"content"\`
            } \`json:"message"\`
        } \`json:"choices"\`
    }
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return "", fmt.Errorf("failed to decode response: %w", err)
    }

    if len(result.Choices) == 0 {
        return "", fmt.Errorf("no response from OpenAI")
    }

    return result.Choices[0].Message.Content, nil
}`
      },
      {
        name: 'rag/knowledge_base.go.tmpl',
        path: 'factory/internal/generator/templates/regtocode/rag/knowledge_base.go.tmpl',
        type: 'file',
        language: 'go',
        icon: '📚',
        content: `package rag

import (
    "context"
    "embed"
    "fmt"
    "strings"
)

//go:embed knowledge/*
var knowledgeFS embed.FS

// KnowledgeBase provides RAG (Retrieval-Augmented Generation) for regulatory texts
type KnowledgeBase struct {
    documents map[string]string
}

func NewKnowledgeBase() *KnowledgeBase {
    kb := &KnowledgeBase{
        documents: make(map[string]string),
    }
    kb.loadEmbeddedKnowledge()
    return kb
}

func (kb *KnowledgeBase) loadEmbeddedKnowledge() {
    // Load embedded regulatory knowledge
    files := []string{
        "knowledge/pci_dss_v4.0.md",
        "knowledge/gdpr.md",
        "knowledge/dora.md",
        "knowledge/mica.md",
        "knowledge/152_fz.md",
        "knowledge/ccpa.md",
    }

    for _, file := range files {
        content, err := knowledgeFS.ReadFile(file)
        if err != nil {
            continue // Skip if file not found
        }
        kb.documents[file] = string(content)
    }
}

// Retrieve returns relevant documents for a query
func (kb *KnowledgeBase) Retrieve(ctx context.Context, query string, regulation string) (string, error) {
    // Simple keyword-based retrieval (can be enhanced with embeddings)
    var relevantDocs []string

    for filename, content := range kb.documents {
        // Filter by regulation if specified
        if regulation != "" && !strings.Contains(strings.ToLower(filename), strings.ToLower(regulation)) {
            continue
        }

        // Check if content is relevant to query
        queryKeywords := strings.Fields(strings.ToLower(query))
        contentLower := strings.ToLower(content)
        
        matchCount := 0
        for _, keyword := range queryKeywords {
            if strings.Contains(contentLower, keyword) {
                matchCount++
            }
        }

        // If at least 30% of keywords match, consider it relevant
        if len(queryKeywords) > 0 && float64(matchCount)/float64(len(queryKeywords)) >= 0.3 {
            relevantDocs = append(relevantDocs, fmt.Sprintf("=== %s ===\n%s", filename, content))
        }
    }

    if len(relevantDocs) == 0 {
        return "", fmt.Errorf("no relevant documents found for query: %s", query)
    }

    return strings.Join(relevantDocs, "\n\n"), nil
}

// GetSupportedRegulations returns list of supported regulations
func (kb *KnowledgeBase) GetSupportedRegulations() []string {
    return []string{
        "PCI-DSS",
        "GDPR",
        "DORA",
        "MiCA",
        "152-FZ",
        "CCPA",
    }
}`
      },
      {
        name: 'policy_generator.go.tmpl',
        path: 'factory/internal/generator/templates/regtocode/policy_generator.go.tmpl',
        type: 'file',
        language: 'go',
        icon: '⚙️',
        content: `package regtocode

import (
    "context"
    "fmt"
    "strings"

    "{{.Handover.Repo}}/internal/regtocode/llm"
    "{{.Handover.Repo}}/internal/regtocode/rag"
)

// PolicyGenerator generates OPA Rego policies from regulatory text
type PolicyGenerator struct {
    llmProvider llm.LLMProvider
    knowledgeBase *rag.KnowledgeBase
}

func NewPolicyGenerator(llmProvider llm.LLMProvider) *PolicyGenerator {
    return &PolicyGenerator{
        llmProvider:   llmProvider,
        knowledgeBase: rag.NewKnowledgeBase(),
    }
}

// GenerateResult holds the output of policy generation
type GenerateResult struct {
    RegoPolicy    string \`json:"rego_policy"\`
    Plan          string \`json:"plan"\`
    Diff          string \`json:"diff"\`
    Confidence    float64 \`json:"confidence"\`
    Warnings      []string \`json:"warnings"\`
}

// GenerateFromText generates policy from regulatory text
func (g *PolicyGenerator) GenerateFromText(ctx context.Context, regulatoryText string, regulation string) (*GenerateResult, error) {
    // 1. Retrieve relevant knowledge
    knowledge, err := g.knowledgeBase.Retrieve(ctx, regulatoryText, regulation)
    if err != nil {
        knowledge = "No relevant knowledge found. Generate based on provided text only."
    }

    // 2. Build prompt
    prompt := g.buildPrompt(regulatoryText, knowledge, regulation)

    // 3. Generate with LLM
    response, err := g.llmProvider.Generate(ctx, prompt)
    if err != nil {
        return nil, fmt.Errorf("LLM generation failed: %w", err)
    }

    // 4. Parse response
    result := g.parseResponse(response)

    return result, nil
}

// GenerateFromURL generates policy from regulatory URL
func (g *PolicyGenerator) GenerateFromURL(ctx context.Context, url string, regulation string) (*GenerateResult, error) {
    // TODO: Fetch content from URL
    // For now, return error
    return nil, fmt.Errorf("URL fetching not implemented yet. Use GenerateFromText instead.")
}

func (g *PolicyGenerator) buildPrompt(regulatoryText string, knowledge string, regulation string) string {
    return fmt.Sprintf(\`
You are a compliance expert specializing in %s regulations.

## Task
Generate an OPA Rego policy based on the following regulatory requirement.

## Regulatory Text
%s

## Reference Knowledge
%s

## Output Format
Provide your response in the following format:

### REGO POLICY
\`\`\`rego
package %s

# Your Rego policy here
\`\`\`

### PLAN
Brief description of what the policy does and how it maps to the regulation.

### DIFF
List of infrastructure changes needed (if any).

### CONFIDENCE
Your confidence level (0.0 to 1.0) that this policy correctly implements the regulation.

### WARNINGS
Any warnings or caveats about the policy.

## Important
- Generate valid OPA Rego syntax
- Use "deny contains msg if" pattern (not "deny[msg]")
- Include proper input validation
- Add clear error messages
- Follow OPA best practices
\`, regulation, regulatoryText, knowledge, strings.ToLower(regulation))
}

func (g *PolicyGenerator) parseResponse(response string) *GenerateResult {
    result := &GenerateResult{
        Confidence: 0.8, // Default confidence
    }

    // Parse sections from response
    sections := strings.Split(response, "###")
    for _, section := range sections {
        section = strings.TrimSpace(section)
        if strings.HasPrefix(section, "REGO POLICY") {
            result.RegoPolicy = extractCodeBlock(section)
        } else if strings.HasPrefix(section, "PLAN") {
            result.Plan = strings.TrimSpace(strings.TrimPrefix(section, "PLAN"))
        } else if strings.HasPrefix(section, "DIFF") {
            result.Diff = strings.TrimSpace(strings.TrimPrefix(section, "DIFF"))
        } else if strings.HasPrefix(section, "CONFIDENCE") {
            // Parse confidence score
            confStr := strings.TrimSpace(strings.TrimPrefix(section, "CONFIDENCE"))
            fmt.Sscanf(confStr, "%f", &result.Confidence)
        } else if strings.HasPrefix(section, "WARNINGS") {
            warnings := strings.TrimSpace(strings.TrimPrefix(section, "WARNINGS"))
            result.Warnings = strings.Split(warnings, "\n")
        }
    }

    return result
}

func extractCodeBlock(text string) string {
    // Extract code between \`\`\`rego and \`\`\`
    start := strings.Index(text, "\`\`\`rego")
    if start == -1 {
        return ""
    }
    start += 7 // Skip \`\`\`rego

    end := strings.Index(text[start:], "\`\`\`")
    if end == -1 {
        return strings.TrimSpace(text[start:])
    }

    return strings.TrimSpace(text[start : start+end])
}`
      },
      {
        name: 'cli/main.go.tmpl',
        path: 'factory/internal/generator/templates/regtocode/cli/main.go.tmpl',
        type: 'file',
        language: 'go',
        icon: '💻',
        content: `package main

import (
    "context"
    "flag"
    "fmt"
    "os"

    "{{.Handover.Repo}}/internal/regtocode/llm"
    "{{.Handover.Repo}}/internal/regtocode"
)

func main() {
    // Parse flags
    provider := flag.String("provider", "ollama", "LLM provider: ollama, openai, anthropic")
    endpoint := flag.String("endpoint", "http://localhost:11434", "LLM endpoint (for Ollama)")
    apiKey := flag.String("api-key", "", "API key (for OpenAI/Anthropic)")
    model := flag.String("model", "llama3.1:8b", "Model name")
    regulation := flag.String("regulation", "", "Regulation name (PCI-DSS, GDPR, DORA, etc.)")
    output := flag.String("output", "policy.rego", "Output file path")
    flag.Parse()

    // Get regulatory text from stdin or file
    var regulatoryText string
    if flag.NArg() > 0 {
        // Read from file
        data, err := os.ReadFile(flag.Arg(0))
        if err != nil {
            fmt.Fprintf(os.Stderr, "Error reading file: %v\\n", err)
            os.Exit(1)
        }
        regulatoryText = string(data)
    } else {
        // Read from stdin
        fmt.Println("Enter regulatory text (Ctrl+D to finish):")
        buf := make([]byte, 1024*1024) // 1MB buffer
        n, _ := os.Stdin.Read(buf)
        regulatoryText = string(buf[:n])
    }

    if regulatoryText == "" {
        fmt.Fprintln(os.Stderr, "Error: no regulatory text provided")
        os.Exit(1)
    }

    // Create LLM provider
    cfg := llm.Config{
        Provider:  llm.ProviderType(*provider),
        Endpoint:  *endpoint,
        APIKey:    *apiKey,
        Model:     *model,
        MaxTokens: 4096,
        Timeout:   120,
    }

    llmProvider, err := llm.NewProvider(cfg)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error creating LLM provider: %v\\n", err)
        os.Exit(1)
    }

    fmt.Printf("Using LLM provider: %s (%s)\\n", llmProvider.Name(), *model)

    // Generate policy
    generator := regtocode.NewPolicyGenerator(llmProvider)
    ctx := context.Background()

    fmt.Println("Generating policy...")
    result, err := generator.GenerateFromText(ctx, regulatoryText, *regulation)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error generating policy: %v\\n", err)
        os.Exit(1)
    }

    // Write output
    if err := os.WriteFile(*output, []byte(result.RegoPolicy), 0644); err != nil {
        fmt.Fprintf(os.Stderr, "Error writing output: %v\\n", err)
        os.Exit(1)
    }

    fmt.Printf("\\n✅ Policy generated successfully!\\n")
    fmt.Printf("Output: %s\\n", *output)
    fmt.Printf("Confidence: %.2f\\n", result.Confidence)

    if len(result.Warnings) > 0 {
        fmt.Printf("\\n⚠️  Warnings:\\n")
        for _, warning := range result.Warnings {
            fmt.Printf("  - %s\\n", warning)
        }
    }

    if result.Plan != "" {
        fmt.Printf("\\n📋 Plan:\\n%s\\n", result.Plan)
    }

    if result.Diff != "" {
        fmt.Printf("\\n🔧 Infrastructure Changes:\\n%s\\n", result.Diff)
    }
}`
      }
    ]
  }
];
