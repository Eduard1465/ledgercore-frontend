import type { FileNode } from './files';

// CBDC Digital Ruble Adapter — Цифровой рубль (Россия)
export const cbdcModule: FileNode[] = [
  {
    name: 'cbdc/',
    path: 'factory/internal/generator/templates/cbdc/',
    type: 'folder',
    children: [
      {
        name: 'domain/cbdc.go.tmpl',
        path: 'factory/internal/generator/templates/cbdc/domain/cbdc.go.tmpl',
        type: 'file',
        language: 'go',
        icon: '💰',
        content: `package domain

import (
    "context"
    "fmt"
    "time"
)

// DigitalRuble represents Russian CBDC (Цифровой рубль)
type DigitalRuble struct {
    WalletID    string \`json:"wallet_id"\`
    OwnerID     string \`json:"owner_id"\`
    Balance     int64  \`json:"balance"\` // In kopecks (1/100 of ruble)
    Currency    string \`json:"currency"\` // "RUB-D" (Digital Ruble)
    Status      string \`json:"status"\` // ACTIVE, BLOCKED, CLOSED
}

// DigitalRubleTransaction represents a CBDC transaction
type DigitalRubleTransaction struct {
    ID              string    \`json:"id"\`
    Type            string    \`json:"type"\` // TRANSFER, TOP_UP, WITHDRAWAL
    Amount          int64     \`json:"amount"\` // In kopecks
    FromWalletID    string    \`json:"from_wallet_id,omitempty"\`
    ToWalletID      string    \`json:"to_wallet_id,omitempty"\`
    Status          string    \`json:"status"\` // PENDING, COMPLETED, FAILED
    Timestamp       time.Time \`json:"timestamp"\`
    CBDCReferenceID string    \`json:"cbdc_reference_id"\` // Platform reference
}

// DigitalRubleService interface for CBDC platform integration
type DigitalRubleService interface {
    // Wallet operations
    CreateWallet(ctx context.Context, ownerID string) (*DigitalRuble, error)
    GetWallet(ctx context.Context, walletID string) (*DigitalRuble, error)
    GetBalance(ctx context.Context, walletID string) (int64, error)
    
    // Transaction operations
    Transfer(ctx context.Context, fromWalletID, toWalletID string, amount int64) (*DigitalRubleTransaction, error)
    TopUp(ctx context.Context, walletID string, amount int64, sourceAccountID string) (*DigitalRubleTransaction, error)
    Withdraw(ctx context.Context, walletID string, amount int64, targetAccountID string) (*DigitalRubleTransaction, error)
    
    // Status operations
    GetTransactionStatus(ctx context.Context, txID string) (*DigitalRubleTransaction, error)
}

// CBDCAdapter implements integration with Central Bank Digital Ruble Platform
type CBDCAdapter struct {
    platformURL    string
    apiKey         string
    ledger         *Ledger
    auditLog       *AuditLog
    httpClient     HTTPClient
}

func NewCBDCAdapter(platformURL, apiKey string, ledger *Ledger, auditLog *AuditLog) *CBDCAdapter {
    return &CBDCAdapter{
        platformURL: platformURL,
        apiKey:      apiKey,
        ledger:      ledger,
        auditLog:    auditLog,
        httpClient:  &DefaultHTTPClient{},
    }
}

// CreateWallet creates a new digital ruble wallet
func (a *CBDCAdapter) CreateWallet(ctx context.Context, ownerID string) (*DigitalRuble, error) {
    // 1. Call CBDC platform API
    req := &CreateWalletRequest{
        OwnerID:    ownerID,
        WalletType: "PERSONAL", // or "BUSINESS"
    }

    resp, err := a.httpClient.Post(ctx, a.platformURL+"/wallets", req, a.apiKey)
    if err != nil {
        return nil, fmt.Errorf("failed to create wallet on CBDC platform: %w", err)
    }

    wallet := &DigitalRuble{
        WalletID: resp.WalletID,
        OwnerID:  ownerID,
        Balance:  0,
        Currency: "RUB-D",
        Status:   "ACTIVE",
    }

    // 2. Audit log
    a.auditLog.Record(ctx,
        "system",
        "CBDC_WALLET_CREATED",
        wallet.WalletID,
        map[string]interface{}{
            "owner_id": ownerID,
        },
    )

    return wallet, nil
}

// Transfer transfers digital rubles between wallets
func (a *CBDCAdapter) Transfer(ctx context.Context, fromWalletID, toWalletID string, amount int64) (*DigitalRubleTransaction, error) {
    // 1. Validate amount
    if amount <= 0 {
        return nil, fmt.Errorf("amount must be positive")
    }

    // 2. Call CBDC platform API
    req := &TransferRequest{
        FromWalletID: fromWalletID,
        ToWalletID:   toWalletID,
        Amount:       amount,
        Currency:     "RUB-D",
    }

    resp, err := a.httpClient.Post(ctx, a.platformURL+"/transfers", req, a.apiKey)
    if err != nil {
        return nil, fmt.Errorf("failed to transfer on CBDC platform: %w", err)
    }

    tx := &DigitalRubleTransaction{
        ID:              resp.TransactionID,
        Type:            "TRANSFER",
        Amount:          amount,
        FromWalletID:    fromWalletID,
        ToWalletID:      toWalletID,
        Status:          "COMPLETED",
        Timestamp:       time.Now(),
        CBDCReferenceID: resp.ReferenceID,
    }

    // 3. Record in internal ledger
    ledgerTx := &Transaction{
        ID:             tx.ID,
        IdempotencyKey: tx.CBDCReferenceID,
        Entity:         "CBDC",
        Type:           "TRANSFER",
        Entries: []Entry{
            {AccountID: fromWalletID, Currency: "RUB-D", Amount: amount, Direction: "DEBIT"},
            {AccountID: toWalletID, Currency: "RUB-D", Amount: amount, Direction: "CREDIT"},
        },
        Metadata: map[string]interface{}{
            "cbdc_reference_id": tx.CBDCReferenceID,
        },
        Timestamp: tx.Timestamp,
    }

    if err := a.ledger.PostTransaction(ctx, ledgerTx); err != nil {
        return nil, fmt.Errorf("failed to record in ledger: %w", err)
    }

    // 4. Audit log
    a.auditLog.Record(ctx,
        "system",
        "CBDC_TRANSFER_COMPLETED",
        tx.ID,
        map[string]interface{}{
            "from_wallet": fromWalletID,
            "to_wallet":   toWalletID,
            "amount":      amount,
        },
    )

    return tx, nil
}

// TopUp tops up digital ruble wallet from traditional account
func (a *CBDCAdapter) TopUp(ctx context.Context, walletID string, amount int64, sourceAccountID string) (*DigitalRubleTransaction, error) {
    // 1. Debit from traditional account (RUB)
    debitTx := &Transaction{
        ID:             generateUUID(),
        IdempotencyKey: fmt.Sprintf("topup-%s-%d", walletID, time.Now().UnixNano()),
        Entity:         "CBDC",
        Type:           "TOP_UP",
        Entries: []Entry{
            {AccountID: sourceAccountID, Currency: "RUB", Amount: amount, Direction: "DEBIT"},
            {AccountID: "CBDC_PLATFORM", Currency: "RUB", Amount: amount, Direction: "CREDIT"},
        },
        Timestamp: time.Now(),
    }

    if err := a.ledger.PostTransaction(ctx, debitTx); err != nil {
        return nil, fmt.Errorf("failed to debit from source account: %w", err)
    }

    // 2. Call CBDC platform to credit wallet
    req := &TopUpRequest{
        WalletID: walletID,
        Amount:   amount,
        SourceID: sourceAccountID,
    }

    resp, err := a.httpClient.Post(ctx, a.platformURL+"/topups", req, a.apiKey)
    if err != nil {
        return nil, fmt.Errorf("failed to top up on CBDC platform: %w", err)
    }

    tx := &DigitalRubleTransaction{
        ID:              resp.TransactionID,
        Type:            "TOP_UP",
        Amount:          amount,
        ToWalletID:      walletID,
        Status:          "COMPLETED",
        Timestamp:       time.Now(),
        CBDCReferenceID: resp.ReferenceID,
    }

    // 3. Audit log
    a.auditLog.Record(ctx,
        "system",
        "CBDC_TOPUP_COMPLETED",
        tx.ID,
        map[string]interface{}{
            "wallet_id":       walletID,
            "amount":          amount,
            "source_account":  sourceAccountID,
        },
    )

    return tx, nil
}

// Withdraw withdraws digital rubles to traditional account
func (a *CBDCAdapter) Withdraw(ctx context.Context, walletID string, amount int64, targetAccountID string) (*DigitalRubleTransaction, error) {
    // 1. Call CBDC platform to debit wallet
    req := &WithdrawRequest{
        WalletID:   walletID,
        Amount:     amount,
        TargetID:   targetAccountID,
    }

    resp, err := a.httpClient.Post(ctx, a.platformURL+"/withdrawals", req, a.apiKey)
    if err != nil {
        return nil, fmt.Errorf("failed to withdraw on CBDC platform: %w", err)
    }

    tx := &DigitalRubleTransaction{
        ID:              resp.TransactionID,
        Type:            "WITHDRAWAL",
        Amount:          amount,
        FromWalletID:    walletID,
        Status:          "COMPLETED",
        Timestamp:       time.Now(),
        CBDCReferenceID: resp.ReferenceID,
    }

    // 2. Credit to traditional account (RUB)
    creditTx := &Transaction{
        ID:             tx.ID,
        IdempotencyKey: tx.CBDCReferenceID,
        Entity:         "CBDC",
        Type:           "WITHDRAWAL",
        Entries: []Entry{
            {AccountID: "CBDC_PLATFORM", Currency: "RUB", Amount: amount, Direction: "DEBIT"},
            {AccountID: targetAccountID, Currency: "RUB", Amount: amount, Direction: "CREDIT"},
        },
        Timestamp: tx.Timestamp,
    }

    if err := a.ledger.PostTransaction(ctx, creditTx); err != nil {
        return nil, fmt.Errorf("failed to credit to target account: %w", err)
    }

    // 3. Audit log
    a.auditLog.Record(ctx,
        "system",
        "CBDC_WITHDRAWAL_COMPLETED",
        tx.ID,
        map[string]interface{}{
            "wallet_id":      walletID,
            "amount":         amount,
            "target_account": targetAccountID,
        },
    )

    return tx, nil
}

// Request/Response types for CBDC platform API
type CreateWalletRequest struct {
    OwnerID    string \`json:"owner_id"\`
    WalletType string \`json:"wallet_type"\`
}

type CreateWalletResponse struct {
    WalletID string \`json:"wallet_id"\`
}

type TransferRequest struct {
    FromWalletID string \`json:"from_wallet_id"\`
    ToWalletID   string \`json:"to_wallet_id"\`
    Amount       int64  \`json:"amount"\`
    Currency     string \`json:"currency"\`
}

type TransferResponse struct {
    TransactionID string \`json:"transaction_id"\`
    ReferenceID   string \`json:"reference_id"\`
}

type TopUpRequest struct {
    WalletID string \`json:"wallet_id"\`
    Amount   int64  \`json:"amount"\`
    SourceID string \`json:"source_id"\`
}

type TopUpResponse struct {
    TransactionID string \`json:"transaction_id"\`
    ReferenceID   string \`json:"reference_id"\`
}

type WithdrawRequest struct {
    WalletID string \`json:"wallet_id"\`
    Amount   int64  \`json:"amount"\`
    TargetID string \`json:"target_id"\`
}

type WithdrawResponse struct {
    TransactionID string \`json:"transaction_id"\`
    ReferenceID   string \`json:"reference_id"\`
}`
      },
      {
        name: 'policies/cbdc.rego.tmpl',
        path: 'factory/internal/generator/templates/cbdc/policies/cbdc.rego.tmpl',
        type: 'file',
        language: 'rego',
        icon: '🛡️',
        content: `package cbdc

import future.keywords.if
import future.keywords.in

# Digital Ruble (CBDC) Compliance Policies
# Required by Central Bank of Russia regulations

# Rule 1: Transaction amount must not exceed CBDC limits
deny contains msg if {
    input.transaction.amount > 100000000  # 1 million rubles in kopecks
    msg := sprintf("CBDC transaction %s exceeds daily limit (1M RUB)", [input.transaction.id])
}

# Rule 2: KYC verification required for transactions > 100k RUB
deny contains msg if {
    input.transaction.amount > 10000000  # 100k rubles in kopecks
    not input.wallet.kyc_verified
    msg := sprintf("CBDC transaction %s requires KYC verification (amount > 100k RUB)", [input.transaction.id])
}

# Rule 3: Wallet must be active
deny contains msg if {
    input.wallet.status != "ACTIVE"
    msg := sprintf("CBDC wallet %s is not active (status: %s)", [input.wallet.id, input.wallet.status])
}

# Rule 4: Counterparty must not be sanctioned
deny contains msg if {
    input.counterparty.sanctioned
    msg := sprintf("CBDC transaction blocked: counterparty %s is sanctioned", [input.counterparty.id])
}

# Rule 5: Transaction must have valid purpose code
deny contains msg if {
    not input.transaction.purpose_code in ["GOODS", "SERVICES", "TRANSFER", "OTHER"]
    msg := sprintf("CBDC transaction %s has invalid purpose code: %s",
        [input.transaction.id, input.transaction.purpose_code])
}

# Rule 6: Audit trail required for all CBDC transactions
deny contains msg if {
    not input.audit_logged
    msg := sprintf("CBDC transaction %s not logged to audit trail", [input.transaction.id])
}

# Rule 7: Cross-border CBDC transfers require additional verification
deny contains msg if {
    input.transaction.cross_border
    not input.additional_verification_completed
    msg := sprintf("CBDC cross-border transaction %s requires additional verification", [input.transaction.id])
}

# Rule 8: Business wallets must have valid business registration
deny contains msg if {
    input.wallet.type == "BUSINESS"
    not input.wallet.business_registration_valid
    msg := sprintf("CBDC business wallet %s has invalid business registration", [input.wallet.id])
}

# Allow rule
allow if {
    count(deny) == 0
}`
      },
      {
        name: 'evidence/cbdc_compliance.csv.tmpl',
        path: 'factory/internal/generator/templates/cbdc/evidence/cbdc_compliance.csv.tmpl',
        type: 'file',
        language: 'csv',
        icon: '📊',
        content: `Requirement,Regulation,Control,Implementation,Evidence,Status
Transaction Limits,ЦБ РФ 823-П,Daily limit 1M RUB,OPA policy cbdc.rego:deny[0],policies/cbdc.rego,IMPLEMENTED
KYC Verification,ЦБ РФ 823-П,KYC for >100k RUB,OPA policy cbdc.rego:deny[1],policies/cbdc.rego,IMPLEMENTED
Wallet Status,ЦБ РФ 823-П,Active wallet required,OPA policy cbdc.rego:deny[2],policies/cbdc.rego,IMPLEMENTED
Sanctions Screening,ЦБ РФ 823-П,No sanctioned counterparties,OPA policy cbdc.rego:deny[3],policies/cbdc.rego,IMPLEMENTED
Purpose Code,ЦБ РФ 823-П,Valid purpose code required,OPA policy cbdc.rego:deny[4],policies/cbdc.rego,IMPLEMENTED
Audit Trail,ЦБ РФ 823-П,All transactions logged,Audit log module,audit/audit_log.go,IMPLEMENTED
Cross-Border,ЦБ РФ 823-П,Additional verification,OPA policy cbdc.rego:deny[7],policies/cbdc.rego,IMPLEMENTED
Business Registration,ЦБ РФ 823-П,Valid registration required,OPA policy cbdc.rego:deny[8],policies/cbdc.rego,IMPLEMENTED
ISO 20022,ЦБ РФ,ISO 20022 message format,CBDC adapter,cbdc/cbdc_adapter.go,IMPLEMENTED
Platform Integration,ЦБ РФ,CBDC platform API,CBDC adapter,cbdc/cbdc_adapter.go,IMPLEMENTED`
      }
    ]
  }
];
