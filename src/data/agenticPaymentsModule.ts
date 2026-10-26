import type { FileNode } from './files';

// Agentic Payments Control Layer — AI Agent Payment Authorization
export const agenticPaymentsModule: FileNode[] = [
  {
    name: 'agents/',
    path: 'factory/internal/generator/templates/agents/',
    type: 'folder',
    children: [
      {
        name: 'domain/agent_payment.go.tmpl',
        path: 'factory/internal/generator/templates/agents/domain/agent_payment.go.tmpl',
        type: 'file',
        language: 'go',
        icon: '🤖',
        content: `package domain

import (
    "context"
    "crypto/ed25519"
    "encoding/base64"
    "fmt"
    "time"
)

// Agent represents an AI agent authorized to initiate payments
type Agent struct {
    ID              string            \`json:"id"\`
    PrincipalID     string            \`json:"principal_id"\` // Human principal
    PublicKey       string            \`json:"public_key"\`   // Ed25519 public key
    Permissions     AgentPermissions  \`json:"permissions"\`
    Limits          AgentLimits       \`json:"limits"\`
    Status          string            \`json:"status"\` // ACTIVE, SUSPENDED, REVOKED
    RegisteredAt    time.Time         \`json:"registered_at"\`
    LastActiveAt    time.Time         \`json:"last_active_at"\`
}

type AgentPermissions struct {
    CanInitiatePayments    bool     \`json:"can_initiate_payments"\`
    CanApprovePayments     bool     \`json:"can_approve_payments"\`
    AllowedCurrencies      []string \`json:"allowed_currencies"\`
    AllowedCounterparties  []string \`json:"allowed_counterparties"\` // Empty = all
    MaxTransactionAmount   int64    \`json:"max_transaction_amount"\`
}

type AgentLimits struct {
    DailyLimit      int64 \`json:"daily_limit"\`
    MonthlyLimit    int64 \`json:"monthly_limit"\`
    MaxTransactions int   \`json:"max_transactions_per_day"\`
}

// AgentPaymentRequest represents a payment request from an AI agent
type AgentPaymentRequest struct {
    AgentID         string                 \`json:"agent_id"\`
    Signature       string                 \`json:"signature"\` // Ed25519 signature
    Nonce           string                 \`json:"nonce"\`      // Replay protection
    Timestamp       time.Time              \`json:"timestamp"\`
    Amount          int64                  \`json:"amount"\`
    Currency        string                 \`json:"currency"\`
    CounterpartyID  string                 \`json:"counterparty_id"\`
    Purpose         string                 \`json:"purpose"\`
    Metadata        map[string]interface{} \`json:"metadata"\`
}

// AgentPaymentService handles agent-initiated payments
type AgentPaymentService struct {
    agentRegistry AgentRegistry
    ledger        *Ledger
    auditLog      *AuditLog
}

func NewAgentPaymentService(registry AgentRegistry, ledger *Ledger, auditLog *AuditLog) *AgentPaymentService {
    return &AgentPaymentService{
        agentRegistry: registry,
        ledger:        ledger,
        auditLog:      auditLog,
    }
}

// ProcessAgentPayment validates and processes agent-initiated payment
func (s *AgentPaymentService) ProcessAgentPayment(ctx context.Context, req *AgentPaymentRequest) error {
    // 1. Load agent
    agent, err := s.agentRegistry.GetAgent(ctx, req.AgentID)
    if err != nil {
        return fmt.Errorf("agent not found: %w", err)
    }

    // 2. Verify agent status
    if agent.Status != "ACTIVE" {
        return fmt.Errorf("agent %s is not active", req.AgentID)
    }

    // 3. Verify cryptographic signature (x401 protocol)
    if err := s.verifySignature(agent, req); err != nil {
        return fmt.Errorf("signature verification failed: %w", err)
    }

    // 4. Check permissions
    if !agent.Permissions.CanInitiatePayments {
        return fmt.Errorf("agent lacks payment initiation permission")
    }

    // 5. Check currency permission
    if !s.isAllowedCurrency(agent, req.Currency) {
        return fmt.Errorf("currency %s not allowed for agent", req.Currency)
    }

    // 6. Check counterparty permission
    if !s.isAllowedCounterparty(agent, req.CounterpartyID) {
        return fmt.Errorf("counterparty %s not allowed for agent", req.CounterpartyID)
    }

    // 7. Check transaction limit
    if req.Amount > agent.Permissions.MaxTransactionAmount {
        return fmt.Errorf("amount %d exceeds agent limit %d", req.Amount, agent.Permissions.MaxTransactionAmount)
    }

    // 8. Check daily/monthly limits
    if err := s.checkLimits(ctx, agent, req.Amount); err != nil {
        return fmt.Errorf("limit exceeded: %w", err)
    }

    // 9. Check nonce (replay protection)
    if err := s.checkNonce(ctx, req.Nonce); err != nil {
        return fmt.Errorf("nonce check failed: %w", err)
    }

    // 10. Post transaction to ledger
    tx := &Transaction{
        ID:             generateUUID(),
        IdempotencyKey: req.Nonce,
        Entity:         "AGENT_PAYMENT",
        Type:           "TRANSFER",
        Entries: []Entry{
            {AccountID: agent.PrincipalID, Currency: req.Currency, Amount: req.Amount, Direction: "DEBIT"},
            {AccountID: req.CounterpartyID, Currency: req.Currency, Amount: req.Amount, Direction: "CREDIT"},
        },
        Metadata: map[string]interface{}{
            "agent_id":      req.AgentID,
            "purpose":       req.Purpose,
            "agent_metadata": req.Metadata,
        },
        Timestamp: req.Timestamp,
    }

    if err := s.ledger.PostTransaction(ctx, tx); err != nil {
        return fmt.Errorf("failed to post transaction: %w", err)
    }

    // 11. Audit log
    s.auditLog.Record(ctx,
        req.AgentID,
        "AGENT_PAYMENT_INITIATED",
        tx.ID,
        map[string]interface{}{
            "amount":       req.Amount,
            "currency":     req.Currency,
            "counterparty": req.CounterpartyID,
            "purpose":      req.Purpose,
        },
    )

    return nil
}

func (s *AgentPaymentService) verifySignature(agent *Agent, req *AgentPaymentRequest) error {
    // Decode public key
    pubKeyBytes, err := base64.StdEncoding.DecodeString(agent.PublicKey)
    if err != nil {
        return fmt.Errorf("failed to decode public key: %w", err)
    }

    // Decode signature
    sigBytes, err := base64.StdEncoding.DecodeString(req.Signature)
    if err != nil {
        return fmt.Errorf("failed to decode signature: %w", err)
    }

    // Create message to verify
    message := fmt.Sprintf("%s|%s|%s|%d|%s|%s|%d",
        req.AgentID, req.Nonce, req.Timestamp.Format(time.RFC3339Nano),
        req.Amount, req.Currency, req.CounterpartyID, req.Timestamp.Unix())

    // Verify Ed25519 signature
    pubKey := ed25519.PublicKey(pubKeyBytes)
    if !ed25519.Verify(pubKey, []byte(message), sigBytes) {
        return fmt.Errorf("invalid signature")
    }

    return nil
}

func (s *AgentPaymentService) isAllowedCurrency(agent *Agent, currency string) bool {
    if len(agent.Permissions.AllowedCurrencies) == 0 {
        return true // Empty = all allowed
    }
    for _, c := range agent.Permissions.AllowedCurrencies {
        if c == currency {
            return true
        }
    }
    return false
}

func (s *AgentPaymentService) isAllowedCounterparty(agent *Agent, counterpartyID string) bool {
    if len(agent.Permissions.AllowedCounterparties) == 0 {
        return true // Empty = all allowed
    }
    for _, cp := range agent.Permissions.AllowedCounterparties {
        if cp == counterpartyID {
            return true
        }
    }
    return false
}

func (s *AgentPaymentService) checkLimits(ctx context.Context, agent *Agent, amount int64) error {
    // TODO: Query agent's daily/monthly usage from store
    // For now, placeholder
    return nil
}

func (s *AgentPaymentService) checkNonce(ctx context.Context, nonce string) error {
    // TODO: Check nonce in Redis/cache for replay protection
    // For now, placeholder
    return nil
}

type AgentRegistry interface {
    GetAgent(ctx context.Context, agentID string) (*Agent, error)
    RegisterAgent(ctx context.Context, agent *Agent) error
    SuspendAgent(ctx context.Context, agentID string) error
    RevokeAgent(ctx context.Context, agentID string) error
}`
      },
      {
        name: 'api/agent_api.go.tmpl',
        path: 'factory/internal/generator/templates/agents/api/agent_api.go.tmpl',
        type: 'file',
        language: 'go',
        icon: '🔌',
        content: `package api

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "{{.Handover.Repo}}/internal/domain"
)

type AgentAPI struct {
    agentService *domain.AgentPaymentService
    registry     domain.AgentRegistry
}

func NewAgentAPI(agentService *domain.AgentPaymentService, registry domain.AgentRegistry) *AgentAPI {
    return &AgentAPI{
        agentService: agentService,
        registry:     registry,
    }
}

func (api *AgentAPI) RegisterRoutes(r *gin.RouterGroup) {
    agents := r.Group("/agents")
    {
        agents.POST("/register", api.RegisterAgent)
        agents.GET("/:id", api.GetAgent)
        agents.POST("/:id/suspend", api.SuspendAgent)
        agents.POST("/:id/revoke", api.RevokeAgent)
    }

    payments := r.Group("/agent-payments")
    {
        payments.POST("/initiate", api.InitiatePayment)
    }
}

// RegisterAgent registers a new AI agent
// POST /agents/register
func (api *AgentAPI) RegisterAgent(c *gin.Context) {
    var agent domain.Agent
    if err := c.ShouldBindJSON(&agent); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := api.registry.RegisterAgent(c.Request.Context(), &agent); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "agent_id": agent.ID,
        "status":   "ACTIVE",
        "message":  "Agent registered successfully",
    })
}

// GetAgent returns agent details
// GET /agents/:id
func (api *AgentAPI) GetAgent(c *gin.Context) {
    agentID := c.Param("id")

    agent, err := api.registry.GetAgent(c.Request.Context(), agentID)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "agent not found"})
        return
    }

    c.JSON(http.StatusOK, agent)
}

// SuspendAgent suspends an agent
// POST /agents/:id/suspend
func (api *AgentAPI) SuspendAgent(c *gin.Context) {
    agentID := c.Param("id")

    if err := api.registry.SuspendAgent(c.Request.Context(), agentID); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Agent suspended"})
}

// RevokeAgent revokes an agent
// POST /agents/:id/revoke
func (api *AgentAPI) RevokeAgent(c *gin.Context) {
    agentID := c.Param("id")

    if err := api.registry.RevokeAgent(c.Request.Context(), agentID); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Agent revoked"})
}

// InitiatePayment processes agent-initiated payment
// POST /agent-payments/initiate
func (api *AgentAPI) InitiatePayment(c *gin.Context) {
    var req domain.AgentPaymentRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := api.agentService.ProcessAgentPayment(c.Request.Context(), &req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error":   err.Error(),
            "status":  "REJECTED",
            "message": "Payment request rejected",
        })
        return
    }

    c.JSON(http.StatusAccepted, gin.H{
        "status":  "ACCEPTED",
        "message": "Payment initiated successfully",
    })
}`
      },
      {
        name: 'policies/agent_payments.rego.tmpl',
        path: 'factory/internal/generator/templates/agents/policies/agent_payments.rego.tmpl',
        type: 'file',
        language: 'rego',
        icon: '🛡️',
        content: `package agent_payments

import future.keywords.if
import future.keywords.in

# Agent Payment Policy Enforcement
# Ensures AI agents operate within defined boundaries

# Rule 1: Agent must be registered and active
deny contains msg if {
    input.agent.status != "ACTIVE"
    msg := sprintf("Agent %s is not active (status: %s)", [input.agent.id, input.agent.status])
}

# Rule 2: Agent must have payment initiation permission
deny contains msg if {
    not input.agent.permissions.can_initiate_payments
    msg := sprintf("Agent %s lacks payment initiation permission", [input.agent.id])
}

# Rule 3: Transaction amount must not exceed agent limit
deny contains msg if {
    input.request.amount > input.agent.permissions.max_transaction_amount
    msg := sprintf("Agent %s transaction amount %d exceeds limit %d",
        [input.agent.id, input.request.amount, input.agent.permissions.max_transaction_amount])
}

# Rule 4: Currency must be allowed
deny contains msg if {
    count(input.agent.permissions.allowed_currencies) > 0
    not input.request.currency in input.agent.permissions.allowed_currencies
    msg := sprintf("Agent %s not allowed to use currency %s",
        [input.agent.id, input.request.currency])
}

# Rule 5: Counterparty must be allowed (if whitelist defined)
deny contains msg if {
    count(input.agent.permissions.allowed_counterparties) > 0
    not input.request.counterparty_id in input.agent.permissions.allowed_counterparties
    msg := sprintf("Agent %s not allowed to transact with counterparty %s",
        [input.agent.id, input.request.counterparty_id])
}

# Rule 6: Signature must be valid (cryptographic verification)
deny contains msg if {
    not input.signature_valid
    msg := sprintf("Agent %s signature verification failed", [input.agent.id])
}

# Rule 7: Nonce must be unique (replay protection)
deny contains msg if {
    input.nonce_reused
    msg := sprintf("Agent %s nonce %s already used (replay attack)",
        [input.agent.id, input.request.nonce])
}

# Rule 8: Timestamp must be recent (within 5 minutes)
deny contains msg if {
    time.now_ns() - input.request.timestamp_ns > 5 * 60 * 1000000000
    msg := sprintf("Agent %s request timestamp too old (> 5 minutes)", [input.agent.id])
}

# Rule 9: Daily limit check
deny contains msg if {
    input.agent.daily_usage + input.request.amount > input.agent.limits.daily_limit
    msg := sprintf("Agent %s would exceed daily limit (%d + %d > %d)",
        [input.agent.id, input.agent.daily_usage, input.request.amount, input.agent.limits.daily_limit])
}

# Rule 10: Monthly limit check
deny contains msg if {
    input.agent.monthly_usage + input.request.amount > input.agent.limits.monthly_limit
    msg := sprintf("Agent %s would exceed monthly limit (%d + %d > %d)",
        [input.agent.id, input.agent.monthly_usage, input.request.amount, input.agent.limits.monthly_limit])
}

# Allow rule (if no deny rules triggered)
allow if {
    count(deny) == 0
}`
      }
    ]
  }
];
