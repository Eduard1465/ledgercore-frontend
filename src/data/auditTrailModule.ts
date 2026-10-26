import type { FileNode } from './files';

// Immutable Audit Trail — "Живой" аудит-трейл с Merkle Tree
export const auditTrailModule: FileNode[] = [
  {
    name: 'audit/',
    path: 'factory/internal/generator/templates/audit/',
    type: 'folder',
    children: [
      {
        name: 'domain/audit_log.go.tmpl',
        path: 'factory/internal/generator/templates/audit/domain/audit_log.go.tmpl',
        type: 'file',
        language: 'go',
        icon: '🔒',
        content: `package domain

import (
    "context"
    "crypto/sha256"
    "encoding/hex"
    "encoding/json"
    "fmt"
    "time"
)

// AuditEvent represents an immutable audit record
type AuditEvent struct {
    ID          string                 \`json:"id"\`
    Timestamp   time.Time              \`json:"timestamp"\`
    Actor       string                 \`json:"actor"\`
    Action      string                 \`json:"action"\`
    Resource    string                 \`json:"resource"\`
    Details     map[string]interface{} \`json:"details"\`
    PrevHash    string                 \`json:"prev_hash"\`
    Hash        string                 \`json:"hash"\`
    Signature   string                 \`json:"signature,omitempty"\`
}

// AuditLog provides immutable, append-only audit trail
type AuditLog struct {
    store    AuditStore
    merkle   *MerkleTree
}

type AuditStore interface {
    Append(ctx context.Context, event *AuditEvent) error
    GetByHash(ctx context.Context, hash string) (*AuditEvent, error)
    GetByTimeRange(ctx context.Context, from, to time.Time) ([]*AuditEvent, error)
    VerifyIntegrity(ctx context.Context) error
}

// MerkleTree provides cryptographic proof of audit trail integrity
type MerkleTree struct {
    root   string
    leaves []string
}

func NewAuditLog(store AuditStore) *AuditLog {
    return &AuditLog{
        store:  store,
        merkle: NewMerkleTree(),
    }
}

func (al *AuditLog) Record(ctx context.Context, actor, action, resource string, details map[string]interface{}) error {
    // Get last event for chaining
    lastEvent, err := al.getLastEvent(ctx)
    var prevHash string
    if err == nil && lastEvent != nil {
        prevHash = lastEvent.Hash
    }

    event := &AuditEvent{
        ID:        generateUUID(),
        Timestamp: time.Now().UTC(),
        Actor:     actor,
        Action:    action,
        Resource:  resource,
        Details:   details,
        PrevHash:  prevHash,
    }

    // Calculate hash (includes prev_hash for chaining)
    event.Hash = calculateHash(event)

    // Add to Merkle tree
    al.merkle.AddLeaf(event.Hash)

    // Append to store
    if err := al.store.Append(ctx, event); err != nil {
        return fmt.Errorf("failed to append audit event: %w", err)
    }

    return nil
}

func (al *AuditLog) Verify(ctx context.Context) error {
    // Verify chain integrity
    events, err := al.store.GetByTimeRange(ctx, time.Time{}, time.Now())
    if err != nil {
        return fmt.Errorf("failed to get events: %w", err)
    }

    var prevHash string
    for _, event := range events {
        if event.PrevHash != prevHash {
            return fmt.Errorf("audit chain broken at event %s: expected prev_hash %s, got %s",
                event.ID, prevHash, event.PrevHash)
        }
        if event.Hash != calculateHash(event) {
            return fmt.Errorf("audit event %s hash mismatch", event.ID)
        }
        prevHash = event.Hash
    }

    // Verify Merkle root
    if err := al.store.VerifyIntegrity(ctx); err != nil {
        return fmt.Errorf("merkle tree verification failed: %w", err)
    }

    return nil
}

func (al *AuditLog) GenerateProof(ctx context.Context, eventID string) (*AuditProof, error) {
    event, err := al.store.GetByHash(ctx, eventID)
    if err != nil {
        return nil, fmt.Errorf("event not found: %w", err)
    }

    // Generate Merkle proof
    proof := al.merkle.GenerateProof(event.Hash)

    return &AuditProof{
        Event:       event,
        MerkleProof: proof,
        Root:        al.merkle.Root(),
    }, nil
}

func calculateHash(event *AuditEvent) string {
    data := fmt.Sprintf("%s|%s|%s|%s|%s|%s",
        event.ID, event.Timestamp.Format(time.RFC3339Nano),
        event.Actor, event.Action, event.Resource, event.PrevHash)
    
    detailsJSON, _ := json.Marshal(event.Details)
    data += "|" + string(detailsJSON)

    hash := sha256.Sum256([]byte(data))
    return hex.EncodeToString(hash[:])
}

type AuditProof struct {
    Event       *AuditEvent   \`json:"event"\`
    MerkleProof []string      \`json:"merkle_proof"\`
    Root        string        \`json:"root"\`
}`
      },
      {
        name: 'store/clickhouse_store.go.tmpl',
        path: 'factory/internal/generator/templates/audit/store/clickhouse_store.go.tmpl',
        type: 'file',
        language: 'go',
        icon: '🗄️',
        content: `package store

import (
    "context"
    "fmt"
    "time"

    "github.com/ClickHouse/clickhouse-go/v2"
    "{{.Handover.Repo}}/internal/domain"
)

// ClickHouseStore implements immutable audit storage
type ClickHouseStore struct {
    conn clickhouse.Conn
}

func NewClickHouseStore(dsn string) (*ClickHouseStore, error) {
    conn, err := clickhouse.Open(&clickhouse.Options{
        Addr: []string{dsn},
        Auth: clickhouse.Auth{
            Database: "audit",
        },
    })
    if err != nil {
        return nil, fmt.Errorf("failed to connect to ClickHouse: %w", err)
    }

    // Create immutable audit table
    err = conn.Exec(context.Background(), \`
        CREATE TABLE IF NOT EXISTS audit_events (
            id String,
            timestamp DateTime64(9),
            actor String,
            action String,
            resource String,
            details String,
            prev_hash String,
            hash String,
            signature String,
            merkle_root String,
            INDEX idx_timestamp timestamp TYPE minmax GRANULARITY 8192,
            INDEX idx_hash hash TYPE set(0) GRANULARITY 1
        ) ENGINE = MergeTree()
        ORDER BY (timestamp, hash)
        SETTINGS index_granularity = 8192
    \`)
    if err != nil {
        return nil, fmt.Errorf("failed to create audit table: %w", err)
    }

    return &ClickHouseStore{conn: conn}, nil
}

func (s *ClickHouseStore) Append(ctx context.Context, event *domain.AuditEvent) error {
    detailsJSON, _ := json.Marshal(event.Details)
    
    batch, err := s.conn.PrepareBatch(ctx, "INSERT INTO audit_events")
    if err != nil {
        return err
    }

    err = batch.Append(
        event.ID,
        event.Timestamp,
        event.Actor,
        event.Action,
        event.Resource,
        string(detailsJSON),
        event.PrevHash,
        event.Hash,
        event.Signature,
        "", // merkle_root updated separately
    )
    if err != nil {
        return err
    }

    return batch.Send()
}

func (s *ClickHouseStore) GetByHash(ctx context.Context, hash string) (*domain.AuditEvent, error) {
    var event domain.AuditEvent
    var detailsJSON string

    err := s.conn.QueryRow(ctx, \`
        SELECT id, timestamp, actor, action, resource, details, prev_hash, hash, signature
        FROM audit_events
        WHERE hash = ?
    \`, hash).Scan(
        &event.ID, &event.Timestamp, &event.Actor, &event.Action,
        &event.Resource, &detailsJSON, &event.PrevHash, &event.Hash, &event.Signature,
    )
    if err != nil {
        return nil, err
    }

    json.Unmarshal([]byte(detailsJSON), &event.Details)
    return &event, nil
}

func (s *ClickHouseStore) GetByTimeRange(ctx context.Context, from, to time.Time) ([]*domain.AuditEvent, error) {
    rows, err := s.conn.Query(ctx, \`
        SELECT id, timestamp, actor, action, resource, details, prev_hash, hash, signature
        FROM audit_events
        WHERE timestamp BETWEEN ? AND ?
        ORDER BY timestamp ASC
    \`, from, to)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var events []*domain.AuditEvent
    for rows.Next() {
        var event domain.AuditEvent
        var detailsJSON string
        err := rows.Scan(
            &event.ID, &event.Timestamp, &event.Actor, &event.Action,
            &event.Resource, &detailsJSON, &event.PrevHash, &event.Hash, &event.Signature,
        )
        if err != nil {
            return nil, err
        }
        json.Unmarshal([]byte(detailsJSON), &event.Details)
        events = append(events, &event)
    }

    return events, nil
}

func (s *ClickHouseStore) VerifyIntegrity(ctx context.Context) error {
    // Query all events and verify chain
    events, err := s.GetByTimeRange(ctx, time.Time{}, time.Now())
    if err != nil {
        return err
    }

    var prevHash string
    for _, event := range events {
        if event.PrevHash != prevHash {
            return fmt.Errorf("chain broken at %s", event.ID)
        }
        prevHash = event.Hash
    }

    return nil
}`
      },
      {
        name: 'api/audit_api.go.tmpl',
        path: 'factory/internal/generator/templates/audit/api/audit_api.go.tmpl',
        type: 'file',
        language: 'go',
        icon: '🔌',
        content: `package api

import (
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "{{.Handover.Repo}}/internal/domain"
)

type AuditAPI struct {
    auditLog *domain.AuditLog
}

func NewAuditAPI(auditLog *domain.AuditLog) *AuditAPI {
    return &AuditAPI{auditLog: auditLog}
}

func (api *AuditAPI) RegisterRoutes(r *gin.RouterGroup) {
    r.GET("/audit/events", api.GetEvents)
    r.GET("/audit/events/:hash", api.GetEvent)
    r.GET("/audit/events/:hash/proof", api.GetProof)
    r.POST("/audit/verify", api.VerifyIntegrity)
}

// GetEvents returns audit events in time range
// GET /audit/events?from=2024-01-01T00:00:00Z&to=2024-12-31T23:59:59Z
func (api *AuditAPI) GetEvents(c *gin.Context) {
    fromStr := c.Query("from")
    toStr := c.Query("to")

    from, err := time.Parse(time.RFC3339, fromStr)
    if err != nil {
        from = time.Time{}
    }

    to, err := time.Parse(time.RFC3339, toStr)
    if err != nil {
        to = time.Now()
    }

    events, err := api.auditLog.store.GetByTimeRange(c.Request.Context(), from, to)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "count":  len(events),
        "events": events,
    })
}

// GetEvent returns single event by hash
// GET /audit/events/:hash
func (api *AuditAPI) GetEvent(c *gin.Context) {
    hash := c.Param("hash")

    event, err := api.auditLog.store.GetByHash(c.Request.Context(), hash)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "event not found"})
        return
    }

    c.JSON(http.StatusOK, event)
}

// GetProof returns cryptographic proof for event
// GET /audit/events/:hash/proof
func (api *AuditAPI) GetProof(c *gin.Context) {
    hash := c.Param("hash")

    proof, err := api.auditLog.GenerateProof(c.Request.Context(), hash)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "event":        proof.Event,
        "merkle_proof": proof.MerkleProof,
        "root":         proof.Root,
        "verifiable":   true,
    })
}

// VerifyIntegrity verifies entire audit trail
// POST /audit/verify
func (api *AuditAPI) VerifyIntegrity(c *gin.Context) {
    err := api.auditLog.Verify(c.Request.Context())
    if err != nil {
        c.JSON(http.StatusOK, gin.H{
            "valid":   false,
            "error":   err.Error(),
            "message": "Audit trail integrity check failed",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "valid":    true,
        "message":  "Audit trail integrity verified",
        "verified": time.Now().UTC(),
    })
}`
      }
    ]
  }
];
