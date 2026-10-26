import type { FileNode } from './files';

// Regulatory Traceability Matrix (RTM) — Critical Enterprise IP
export const rtmTemplates: FileNode[] = [
  {
    name: 'evidence/',
    path: 'factory/internal/generator/templates/evidence/',
    type: 'folder',
    children: [
      {
        name: 'regulatory_traceability_matrix.csv.tmpl',
        path: 'factory/internal/generator/templates/evidence/regulatory_traceability_matrix.csv.tmpl',
        type: 'file',
        language: 'csv',
        icon: '📋',
        content: `Requirement_ID,Regulation,Section,Description,Terraform_Resource,OPA_Policy,Test_Case,Evidence_File,Implementation_Status,Auditor_Notes
{{- range .Project.Compliance}}
{{- if eq . "PCI-DSS-SAQ-D"}}
PCI-1.2.1,PCI-DSS v4.0,1.2.1,Restrict inbound/outbound traffic to CDE,aws_security_group_rule,pci.rego:deny[0],SG_Rule_Check,terraform/plan.json,IMPLEMENTED,Auto-generated evidence
PCI-3.4.1,PCI-DSS v4.0,3.4.1,Encrypt transmission of cardholder data,aws_kms_key,pci.rego:deny[1],KMS_Key_Check,terraform/plan.json,IMPLEMENTED,Auto-generated evidence
PCI-8.3.1,PCI-DSS v4.0,8.3.1,Protect authentication credentials,kubernetes_pod,pci.rego:deny[2],Secret_Env_Check,k8s/manifests.yaml,IMPLEMENTED,Auto-generated evidence
PCI-10.2,PCI-DSS v4.0,10.2,Track all access to system components,aws_vpc,pci.rego:deny[3],Flow_Logs_Check,terraform/plan.json,IMPLEMENTED,Auto-generated evidence
{{- end}}
{{- if eq . "SOC2-Type2"}}
SOC2-CC6.1,SOC2 Type II,CC6.1,Logical and physical access controls,aws_iam_policy,security.rego:deny[1],IAM_Wildcard_Check,terraform/plan.json,IMPLEMENTED,Auto-generated evidence
SOC2-CC6.7,SOC2 Type II,CC6.7,Encryption of data at rest,aws_kms_key,security.rego:deny[0],S3_Encryption_Check,terraform/plan.json,IMPLEMENTED,Auto-generated evidence
SOC2-CC7.2,SOC2 Type II,CC7.2,Monitoring for anomalies,aws_cloudwatch_log_group,security.rego:deny[2],Monitoring_Check,terraform/plan.json,IMPLEMENTED,Auto-generated evidence
{{- end}}
{{- end}}
{{- if .GeoCompliance.Enabled}}
{{- range .GeoCompliance.DataResidencyRules}}
GEO-{{.Jurisdiction}}-001,{{.Regulation}},Data Residency,{{.Action}} for {{.Jurisdiction}},aws_vpc,geo_compliance.rego:deny[0],Region_Check,terraform/plan.json,IMPLEMENTED,Auto-generated evidence
{{- end}}
{{- end}}`
      },
      {
        name: 'control_mapping_document.md.tmpl',
        path: 'factory/internal/generator/templates/evidence/control_mapping_document.md.tmpl',
        type: 'file',
        language: 'markdown',
        icon: '📖',
        content: `# Control Mapping Document — {{.Project.Name}}

**Generated:** {{ now | date "2006-01-02" }}
**Factory Version:** 1.1.0
**Compliance Frameworks:** {{join ", " .Project.Compliance}}

---

## Executive Summary

This document provides a complete mapping of regulatory requirements to technical implementations for {{.Project.Name}}. Each requirement is traced to:
- **Terraform Resource** — Infrastructure component
- **OPA Policy** — Automated compliance check
- **Test Case** — Validation method
- **Evidence File** — Audit artifact

---

## Regulatory Frameworks

{{- range .Project.Compliance}}

### {{.}}

{{- if eq . "PCI-DSS-SAQ-D"}}

#### PCI DSS v4.0 Requirements

| Req ID | Description | Implementation | Evidence |
|--------|-------------|----------------|----------|
| 1.2.1 | Restrict traffic to CDE | AWS Security Groups + NACLs | \`terraform/plan.json\` |
| 3.4.1 | Encrypt cardholder data | AWS KMS + RDS encryption | \`terraform/plan.json\` |
| 8.3.1 | Protect credentials | Kubernetes Secrets (no env vars) | \`k8s/manifests.yaml\` |
| 10.2 | Track all access | VPC Flow Logs + CloudWatch | \`terraform/plan.json\` |

**Implementation Details:**

1. **Network Segmentation (1.2.1)**
   - Terraform: \`aws_security_group_rule\` with explicit CIDR blocks
   - OPA Policy: \`pci.rego:deny[0]\` blocks 0.0.0.0/0 on sensitive ports
   - Evidence: Network ACL rules in VPC module

2. **Encryption at Rest (3.4.1)**
   - Terraform: \`aws_kms_key\` with automatic rotation
   - OPA Policy: \`pci.rego:deny[1]\` checks all storage resources
   - Evidence: KMS key ARN in RDS/S3/EBS resources

3. **Credential Protection (8.3.1)**
   - Implementation: Kubernetes \`secretKeyRef\` (no env vars)
   - OPA Policy: \`pci.rego:deny[2]\` scans pod env vars
   - Evidence: Deployment manifests with secret references

4. **Audit Trails (10.2)**
   - Terraform: \`aws_flow_log\` + \`aws_cloudwatch_log_group\`
   - OPA Policy: \`pci.rego:deny[3]\` checks VPC flow logs
   - Evidence: Flow log configuration in VPC module

{{- end}}

{{- if eq . "SOC2-Type2"}}

#### SOC2 Type II Trust Services Criteria

| Criteria | Description | Implementation | Evidence |
|----------|-------------|----------------|----------|
| CC6.1 | Logical access controls | IAM policies + RBAC | \`terraform/plan.json\` |
| CC6.7 | Encryption at rest | KMS + S3 encryption | \`terraform/plan.json\` |
| CC7.2 | System monitoring | CloudWatch + Prometheus | \`terraform/plan.json\` |

**Implementation Details:**

1. **Access Controls (CC6.1)**
   - Terraform: IAM policies with least privilege
   - OPA Policy: \`security.rego:deny[1]\` blocks wildcard actions
   - Evidence: IAM policy documents

2. **Encryption (CC6.7)**
   - Terraform: S3 bucket encryption + KMS keys
   - OPA Policy: \`security.rego:deny[0]\` checks encryption
   - Evidence: S3 bucket configuration

3. **Monitoring (CC7.2)**
   - Terraform: CloudWatch alarms + Prometheus annotations
   - OPA Policy: \`security.rego:deny[2]\` checks monitoring
   - Evidence: CloudWatch configuration

{{- end}}

{{- end}}

{{- if .GeoCompliance.Enabled}}

## Geo-Compliance Requirements

### Data Residency Rules

| Jurisdiction | Regulation | Action | Implementation | Evidence |
|--------------|------------|--------|----------------|----------|
{{- range .GeoCompliance.DataResidencyRules}}
| {{.Jurisdiction}} | {{.Regulation}} | {{.Action}} | Multi-region VPC + Network Firewall | \`terraform/plan.json\` |
{{- end}}

**Implementation Details:**

{{- range .GeoCompliance.DataResidencyRules}}

#### {{.Jurisdiction}} — {{.Regulation}}

- **Action:** {{.Action}}
- **Data Classes:** {{join ", " .DataClasses}}
- **Terraform:** Multi-region VPC deployment
- **OPA Policy:** \`geo_compliance.rego\` enforces residency
- **Evidence:** Network Firewall rules + VPC configuration

{{- end}}

{{- end}}

---

## Automated Compliance Verification

### OPA Policy Engine

All compliance checks are automated via OPA (Open Policy Agent):

\`\`\`bash
# Run compliance checks
opa eval -d policies/ -i terraform/plan.json "data.pci.deny"
opa eval -d policies/ -i terraform/plan.json "data.security.deny"
opa eval -d policies/ -i terraform/plan.json "data.geo_compliance.deny"
\`\`\`

### CI/CD Integration

Compliance checks run automatically in CI/CD pipeline:
- **Gate 1:** Terraform validation
- **Gate 2:** OPA policy checks
- **Gate 3:** Security scanning (Trivy)
- **Gate 4:** Build and deploy

---

## Evidence Collection

### Automated Evidence

The following evidence is automatically collected:
1. **Terraform Plan** — Infrastructure configuration
2. **OPA Results** — Compliance check results
3. **Kubernetes Manifests** — Application configuration
4. **Audit Logs** — VPC flow logs + CloudWatch

### Manual Evidence

The following evidence requires manual collection:
1. **Penetration Test Report** — Quarterly
2. **Access Review** — Monthly
3. **Change Management** — Per change
4. **Incident Response** — Per incident

---

## Auditor Notes

This document is auto-generated by LedgerCore Factory v1.1.0.

**For QSA/Auditors:**
- All Terraform resources are version-controlled
- All OPA policies are tested in CI/CD
- All evidence is collected automatically
- Regulatory Traceability Matrix provides full traceability

**Contact:** [Tech Lead] / [Compliance Officer]
`
      }
    ]
  }
];
