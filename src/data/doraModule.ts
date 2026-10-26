import type { FileNode } from './files';

// DORA Module — Digital Operational Resilience Act (EU)
export const doraModule: FileNode[] = [
  {
    name: 'dora/',
    path: 'factory/internal/generator/templates/dora/',
    type: 'folder',
    children: [
      {
        name: 'register_of_information.tf.tmpl',
        path: 'factory/internal/generator/templates/dora/register_of_information.tf.tmpl',
        type: 'file',
        language: 'hcl',
        icon: '📋',
        content: `# DORA Register of Information — Third-Party Providers
# Required by DORA Article 28

resource "local_file" "dora_register_of_information" {
  filename = "\${path.module}/evidence/dora/register_of_information.json"
  content = jsonencode({
    version = "1.0"
    generated = timestamp()
    financial_entity = {
      name = "{{.Project.Name}}"
      org = "{{.Project.Org}}"
      region = "{{.Project.Region}}"
      authorization = "{{join ", " .Project.Compliance}}"
    }
    
    # ICT Third-Party Providers
    ict_third_party_providers = [
      {
        provider_name = "Amazon Web Services"
        provider_type = "Cloud Infrastructure"
        service_description = "AWS Cloud Services (EKS, RDS, S3, KMS)"
        criticality = "Critical"
        data_location = "{{.Project.Region}}"
        contract_start = "2024-01-01"
        contract_end = "2027-12-31"
        governing_law = "EU Standard Contractual Clauses"
        exit_strategy = "Multi-cloud migration plan documented"
        sub_contractors = []
      },
      {
        provider_name = "HashiCorp Vault"
        provider_type = "Secrets Management"
        service_description = "Secrets management and encryption"
        criticality = "Critical"
        data_location = "{{.Project.Region}}"
        contract_start = "2024-01-01"
        contract_end = "2026-12-31"
        governing_law = "Apache 2.0 License"
        exit_strategy = "Alternative: AWS Secrets Manager"
        sub_contractors = []
      },
      {{- if .GeoCompliance.SanctionsScreening}}
      {
        provider_name = "{{.GeoCompliance.SanctionsScreening.Provider | title}}"
        provider_type = "Sanctions Screening"
        service_description = "AML/Sanctions screening API"
        criticality = "Critical"
        data_location = "{{.Project.Region}}"
        contract_start = "2024-01-01"
        contract_end = "2025-12-31"
        governing_law = "Commercial Agreement"
        exit_strategy = "Alternative providers: Refinitiv, Dow Jones"
        sub_contractors = []
      }
      {{- end}}
    ]
    
    # Concentration Risk
    concentration_risk_assessment = {
      single_provider_dependency = "AWS (mitigated by multi-AZ deployment)"
      geographic_concentration = "{{.Project.Region}} (mitigated by DR region)"
      substitution_difficulty = "Low (alternative providers available)"
    }
    
    # Exit Strategy
    exit_strategy = {
      documented = true
      tested = true
      last_test = "2024-06-01"
      next_test = "2025-06-01"
      estimated_time = "30 days"
      alternative_providers = ["GCP", "Azure"]
    }
  })
}

# DORA Compliance Evidence
resource "local_file" "dora_compliance_evidence" {
  filename = "\${path.module}/evidence/dora/compliance_evidence.csv"
  content = <<CSV
DORA_Pillar,Requirement,Control,Implementation,Evidence,Status
Pillar 1: ICT Risk Management,Article 5,ICT risk management framework,spec.yaml + policies/,evidence/dora/ict_risk_framework.md,IMPLEMENTED
Pillar 1: ICT Risk Management,Article 6,ICT risk management policies,policies/*.rego,evidence/dora/ict_policies.md,IMPLEMENTED
Pillar 1: ICT Risk Management,Article 9,ICT business continuity policy,resilience/dr-automation.tf,evidence/dora/bcp.md,IMPLEMENTED
Pillar 2: Incident Reporting,Article 17,Incident classification,runbook_incident.md,evidence/dora/incident_classification.md,IMPLEMENTED
Pillar 2: Incident Reporting,Article 18,Incident reporting timeline,CloudWatch + SNS,evidence/dora/incident_reporting.md,IMPLEMENTED
Pillar 3: Testing,Article 24,TLPT scenarios,resilience/chaos-scenarios.yaml,evidence/dora/tlpt_scenarios.md,IMPLEMENTED
Pillar 4: Third-Party Risk,Article 28,Register of Information,register_of_information.tf,evidence/dora/register_of_information.json,IMPLEMENTED
Pillar 5: Information Sharing,Article 30,Cyber threat intelligence,CloudWatch + OPA,evidence/dora/threat_intel.md,IMPLEMENTED
CSV
}`
      },
      {
        name: 'tlpt_scenarios.yaml.tmpl',
        path: 'factory/internal/generator/templates/dora/tlpt_scenarios.yaml.tmpl',
        type: 'file',
        language: 'yaml',
        icon: '🎯',
        content: `# DORA Threat-Led Penetration Testing (TLPT) Scenarios
# Required by DORA Article 24-26
# Frequency: At least every 3 years, or after significant changes

scenarios:
  - id: TLPT-001
    name: "Advanced Persistent Threat (APT) Simulation"
    description: "Simulate sophisticated attacker gaining persistent access to ledger system"
    scope:
      - "EKS cluster (ledger namespace)"
      - "RDS database"
      - "Vault secrets"
    objectives:
      - "Detect lateral movement within cluster"
      - "Verify secrets isolation"
      - "Test incident response time"
    ttps:
      - "T1190: Exploit Public-Facing Application"
      - "T1078: Valid Accounts"
      - "T1021: Remote Services"
    red_team: "External (Certified)"
    duration: "3 weeks"
    frequency: "Annual"
    last_executed: null
    next_scheduled: "2025-06-01"

  - id: TLPT-002
    name: "Insider Threat Simulation"
    description: "Simulate malicious insider with elevated privileges"
    scope:
      - "Kubernetes RBAC"
      - "Vault access policies"
      - "Audit log integrity"
    objectives:
      - "Detect privilege escalation"
      - "Verify audit trail immutability"
      - "Test data exfiltration prevention"
    ttps:
      - "T1078.004: Cloud Accounts"
      - "T1098: Account Manipulation"
      - "T1530: Data from Cloud Storage Object"
    red_team: "Internal + External"
    duration: "2 weeks"
    frequency: "Annual"
    last_executed: null
    next_scheduled: "2025-09-01"

  - id: TLPT-003
    name: "Supply Chain Attack Simulation"
    description: "Simulate compromise of third-party dependencies"
    scope:
      - "Container registry"
      - "CI/CD pipeline"
      - "Third-party APIs"
    objectives:
      - "Detect malicious container images"
      - "Verify image signing verification"
      - "Test dependency vulnerability scanning"
    ttps:
      - "T1195.002: Compromise Software Supply Chain"
      - "T1199: Trusted Relationship"
    red_team: "External"
    duration: "2 weeks"
    frequency: "Annual"
    last_executed: null
    next_scheduled: "2025-12-01"

  - id: TLPT-004
    name: "Ransomware Simulation"
    description: "Simulate ransomware attack on critical systems"
    scope:
      - "Database encryption"
      - "Backup systems"
      - "Recovery procedures"
    objectives:
      - "Test backup integrity"
      - "Verify recovery time objective (RTO)"
      - "Test recovery point objective (RPO)"
    ttps:
      - "T1486: Data Encrypted for Impact"
      - "T1490: Inhibit System Recovery"
    red_team: "External"
    duration: "1 week"
    frequency: "Annual"
    last_executed: null
    next_scheduled: "2026-03-01"

# TLPT Governance
governance:
  oversight_body: "CISO + Head of Compliance"
  approval_required: true
  reporting:
    - "Executive summary to Board"
    - "Detailed report to CISO"
    - "Remediation plan to Engineering"
  retention: "7 years"
  regulatory_notification: "Required within 72 hours of completion"`
      },
      {
        name: 'incident_report_flow.go.tmpl',
        path: 'factory/internal/generator/templates/dora/incident_report_flow.go.tmpl',
        type: 'file',
        language: 'go',
        icon: '🚨',
        content: `package incident

import (
    "context"
    "fmt"
    "time"

    "{{.Handover.Repo}}/internal/domain"
)

// DORA Incident Reporting Flow
// Required by DORA Articles 17-20

type Incident struct {
    ID              string    \`json:"id"\`
    Severity        string    \`json:"severity"\` // CRITICAL, HIGH, MEDIUM, LOW
    Classification  string    \`json:"classification"\` // CYBER, OPERATIONAL, THIRD_PARTY
    DetectedAt      time.Time \`json:"detected_at"\`
    ReportedAt      time.Time \`json:"reported_at"\`
    ResolvedAt      time.Time \`json:"resolved_at,omitempty"\`
    Impact          IncidentImpact \`json:"impact"\`
    RootCause       string    \`json:"root_cause,omitempty"\`
    Remediation     string    \`json:"remediation,omitempty"\`
    Status          string    \`json:"status"\` // DETECTED, INVESTIGATING, RESOLVED, CLOSED
}

type IncidentImpact struct {
    ServicesAffected []string \`json:"services_affected"\`
    CustomersAffected int     \`json:"customers_affected"\`
    FinancialImpact  int64    \`json:"financial_impact,omitempty"\`
    DataBreach       bool     \`json:"data_breach"\`
}

type IncidentReporter struct {
    auditLog  *domain.AuditLog
    notifier  Notifier
}

func NewIncidentReporter(auditLog *domain.AuditLog, notifier Notifier) *IncidentReporter {
    return &IncidentReporter{
        auditLog: auditLog,
        notifier: notifier,
    }
}

// ReportIncident reports incident per DORA requirements
func (r *IncidentReporter) ReportIncident(ctx context.Context, incident *Incident) error {
    // 1. Log to immutable audit trail
    err := r.auditLog.Record(ctx,
        "system",
        "INCIDENT_DETECTED",
        incident.ID,
        map[string]interface{}{
            "severity":       incident.Severity,
            "classification": incident.Classification,
            "impact":         incident.Impact,
        },
    )
    if err != nil {
        return fmt.Errorf("failed to log incident: %w", err)
    }

    // 2. DORA Initial Notification (within 4 hours for major incidents)
    if incident.Severity == "CRITICAL" || incident.Severity == "HIGH" {
        if time.Since(incident.DetectedAt) > 4*time.Hour {
            return fmt.Errorf("DORA violation: initial notification exceeded 4 hours")
        }

        err := r.notifier.SendInitialNotification(ctx, incident)
        if err != nil {
            return fmt.Errorf("failed to send initial notification: %w", err)
        }
    }

    // 3. Intermediate Report (within 1 week)
    go func() {
        time.Sleep(7 * 24 * time.Hour)
        r.notifier.SendIntermediateReport(context.Background(), incident)
    }()

    // 4. Final Report (within 1 month after resolution)
    go func() {
        <-ctx.Done() // Wait for resolution
        time.Sleep(30 * 24 * time.Hour)
        r.notifier.SendFinalReport(context.Background(), incident)
    }()

    return nil
}

// ResolveIncident marks incident as resolved
func (r *IncidentReporter) ResolveIncident(ctx context.Context, incidentID, rootCause, remediation string) error {
    incident, err := r.getIncident(ctx, incidentID)
    if err != nil {
        return err
    }

    incident.ResolvedAt = time.Now()
    incident.RootCause = rootCause
    incident.Remediation = remediation
    incident.Status = "RESOLVED"

    // Log resolution to audit trail
    err = r.auditLog.Record(ctx,
        "system",
        "INCIDENT_RESOLVED",
        incidentID,
        map[string]interface{}{
            "root_cause":   rootCause,
            "remediation":  remediation,
            "duration":     incident.ResolvedAt.Sub(incident.DetectedAt).String(),
        },
    )
    if err != nil {
        return fmt.Errorf("failed to log resolution: %w", err)
    }

    return nil
}

type Notifier interface {
    SendInitialNotification(ctx context.Context, incident *Incident) error
    SendIntermediateReport(ctx context.Context, incident *Incident) error
    SendFinalReport(ctx context.Context, incident *Incident) error
}`
      }
    ]
  }
];
