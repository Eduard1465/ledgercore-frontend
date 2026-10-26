import type { FileNode } from './files';

// Domain Modules — Critical for Enterprise Time-to-Value
export const domainModules: FileNode[] = [
  {
    name: 'modules/',
    path: 'factory/internal/generator/templates/modules/',
    type: 'folder',
    children: [
      {
        name: 'card-issuing/',
        path: 'factory/internal/generator/templates/modules/card-issuing/',
        type: 'folder',
        children: [
          {
            name: 'domain/card.go.tmpl',
            path: 'factory/internal/generator/templates/modules/card-issuing/domain/card.go.tmpl',
            type: 'file',
            language: 'go',
            icon: '💳',
            content: `package domain

import (
    "context"
    "time"
)

// Card represents a payment card
type Card struct {
    ID              string    \`json:"id"\`
    CardholderID    string    \`json:"cardholder_id"\`
    PAN             string    \`json:"pan,omitempty"\` // Masked in responses
    ExpiryDate      string    \`json:"expiry_date"\`
    CVV             string    \`json:"cvv,omitempty"\` // Never stored
    Status          string    \`json:"status"\` // ACTIVE, BLOCKED, EXPIRED
    CardType        string    \`json:"card_type"\` // VISA, MASTERCARD
    Limits          Limits    \`json:"limits"\`
    CreatedAt       time.Time \`json:"created_at"\`
}

type Limits struct {
    DailyLimit      int64 \`json:"daily_limit"\`
    MonthlyLimit    int64 \`json:"monthly_limit"\`
    PerTransaction  int64 \`json:"per_transaction"\`
}

type CardService interface {
    IssueCard(ctx context.Context, req *IssueCardRequest) (*Card, error)
    BlockCard(ctx context.Context, cardID string) error
    Authorize(ctx context.Context, req *AuthorizationRequest) (*AuthorizationResponse, error)
}

type IssueCardRequest struct {
    CardholderID string \`json:"cardholder_id" validate:"required"\`
    CardType     string \`json:"card_type" validate:"required,oneof=VISA MASTERCARD"\`
    Limits       Limits \`json:"limits"\`
}

type AuthorizationRequest struct {
    CardID       string  \`json:"card_id" validate:"required"\`
    Amount       int64   \`json:"amount" validate:"required,gt=0"\`
    Currency     string  \`json:"currency" validate:"required"\`
    MerchantID   string  \`json:"merchant_id" validate:"required"\`
    MerchantName string  \`json:"merchant_name"\`
}

type AuthorizationResponse struct {
    Approved      bool   \`json:"approved"\`
    AuthCode      string \`json:"auth_code,omitempty"\`
    DeclineReason string \`json:"decline_reason,omitempty"\`
}`
          },
          {
            name: 'service/card_service.go.tmpl',
            path: 'factory/internal/generator/templates/modules/card-issuing/service/card_service.go.tmpl',
            type: 'file',
            language: 'go',
            icon: '⚙️',
            content: `package service

import (
    "context"
    "fmt"
    "time"

    "{{.Handover.Repo}}/internal/domain"
    "{{.Handover.Repo}}/internal/gateway"
)

type CardServiceImpl struct {
    repo       CardRepository
    ledger     *domain.Ledger
    scheme     gateway.SchemeGateway // Visa/Mastercard integration
}

func NewCardService(repo CardRepository, ledger *domain.Ledger, scheme gateway.SchemeGateway) *CardServiceImpl {
    return &CardServiceImpl{
        repo:   repo,
        ledger: ledger,
        scheme: scheme,
    }
}

func (s *CardServiceImpl) IssueCard(ctx context.Context, req *domain.IssueCardRequest) (*domain.Card, error) {
    // 1. Validate cardholder (KYC check)
    cardholder, err := s.repo.GetCardholder(ctx, req.CardholderID)
    if err != nil {
        return nil, fmt.Errorf("cardholder not found: %w", err)
    }

    // 2. Generate PAN (via scheme gateway)
    pan, err := s.scheme.GeneratePAN(ctx, req.CardType)
    if err != nil {
        return nil, fmt.Errorf("failed to generate PAN: %w", err)
    }

    // 3. Create card record
    card := &domain.Card{
        ID:           generateUUID(),
        CardholderID: req.CardholderID,
        PAN:          maskPAN(pan), // Store only masked PAN
        ExpiryDate:   calculateExpiry(3), // 3 years
        Status:       "ACTIVE",
        CardType:     req.CardType,
        Limits:       req.Limits,
        CreatedAt:    time.Now(),
    }

    // 4. Persist card (PAN encrypted via KMS)
    if err := s.repo.SaveCard(ctx, card, pan); err != nil {
        return nil, fmt.Errorf("failed to save card: %w", err)
    }

    return card, nil
}

func (s *CardServiceImpl) Authorize(ctx context.Context, req *domain.AuthorizationRequest) (*domain.AuthorizationResponse, error) {
    // 1. Load card
    card, err := s.repo.GetCard(ctx, req.CardID)
    if err != nil {
        return &domain.AuthorizationResponse{Approved: false, DeclineReason: "CARD_NOT_FOUND"}, nil
    }

    // 2. Check card status
    if card.Status != "ACTIVE" {
        return &domain.AuthorizationResponse{Approved: false, DeclineReason: "CARD_NOT_ACTIVE"}, nil
    }

    // 3. Check limits
    if req.Amount > card.Limits.PerTransaction {
        return &domain.AuthorizationResponse{Approved: false, DeclineReason: "EXCEEDS_LIMIT"}, nil
    }

    // 4. Check balance via ledger
    balance, err := s.ledger.GetBalance(ctx, card.CardholderID, "CARD", req.Currency, nil)
    if err != nil {
        return nil, fmt.Errorf("failed to get balance: %w", err)
    }
    if balance < req.Amount {
        return &domain.AuthorizationResponse{Approved: false, DeclineReason: "INSUFFICIENT_FUNDS"}, nil
    }

    // 5. Create authorization hold via ledger
    tx := &domain.Transaction{
        ID:             generateUUID(),
        IdempotencyKey: req.CardID + "-" + time.Now().Format(time.RFC3339Nano),
        Entity:         "CARD",
        Type:           "AUTHORIZATION",
        Entries: []domain.Entry{
            {AccountID: card.CardholderID, Currency: req.Currency, Amount: req.Amount, Direction: "DEBIT"},
            {AccountID: "MERCHANT_" + req.MerchantID, Currency: req.Currency, Amount: req.Amount, Direction: "CREDIT"},
        },
        Timestamp: time.Now(),
    }

    if err := s.ledger.PostTransaction(ctx, tx); err != nil {
        return nil, fmt.Errorf("failed to post authorization: %w", err)
    }

    return &domain.AuthorizationResponse{
        Approved: true,
        AuthCode: generateAuthCode(),
    }, nil
}`
          }
        ]
      },
      {
        name: 'reconciliation/',
        path: 'factory/internal/generator/templates/modules/reconciliation/',
        type: 'folder',
        children: [
          {
            name: 'domain/reconciliation.go.tmpl',
            path: 'factory/internal/generator/templates/modules/reconciliation/domain/reconciliation.go.tmpl',
            type: 'file',
            language: 'go',
            icon: '🔄',
            content: `package domain

import (
    "context"
    "time"
)

// ReconciliationJob represents a reconciliation run
type ReconciliationJob struct {
    ID          string    \`json:"id"\`
    Type        string    \`json:"type"\` // DAILY, REALTIME, MANUAL
    Status      string    \`json:"status"\` // PENDING, RUNNING, COMPLETED, FAILED
    StartedAt   time.Time \`json:"started_at"\`
    CompletedAt time.Time \`json:"completed_at,omitempty"\`
    Results     ReconciliationResult \`json:"results"\`
}

type ReconciliationResult struct {
    TotalRecords     int \`json:"total_records"\`
    MatchedRecords   int \`json:"matched_records"\`
    UnmatchedRecords int \`json:"unmatched_records"\`
    Exceptions       []Exception \`json:"exceptions"\`
}

type Exception struct {
    ID          string  \`json:"id"\`
    Type        string  \`json:"type"\` // MISSING, DUPLICATE, AMOUNT_MISMATCH
    Description string  \`json:"description"\`
    Amount      int64   \`json:"amount,omitempty"\`
    Resolution  string  \`json:"resolution,omitempty"\` // PENDING, RESOLVED, IGNORED
}

type ReconciliationService interface {
    RunDailyReconciliation(ctx context.Context, date time.Time) (*ReconciliationJob, error)
    GetExceptions(ctx context.Context, jobID string) ([]Exception, error)
    ResolveException(ctx context.Context, exceptionID string, resolution string) error
}

// PSPAdapter interface for different payment service providers
type PSPAdapter interface {
    FetchTransactions(ctx context.Context, from, to time.Time) ([]ExternalTransaction, error)
}

type ExternalTransaction struct {
    ID             string    \`json:"id"\`
    PSP            string    \`json:"psp"\` // STRIPE, ADYEN, SBP
    Amount         int64     \`json:"amount"\`
    Currency       string    \`json:"currency"\`
    Status         string    \`json:"status"\`
    Timestamp      time.Time \`json:"timestamp"\`
    ReferenceID    string    \`json:"reference_id"\` // Maps to internal transaction
}`
          }
        ]
      }
    ]
  }
];
