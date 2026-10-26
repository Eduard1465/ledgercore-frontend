import type { FileNode } from './files';

// Additional templates to fix critical issues
export const additionalTemplates: FileNode[] = [
  {
    name: 'redis/',
    path: 'factory/internal/generator/templates/terraform/modules/redis/',
    type: 'folder',
    children: [
      {
        name: 'main.tf.tmpl',
        path: 'factory/internal/generator/templates/terraform/modules/redis/main.tf.tmpl',
        type: 'file',
        language: 'hcl',
        icon: '🔴',
        content: `# Redis/ElastiCache for idempotency and caching
resource "aws_elasticache_subnet_group" "redis" {
  name       = "{{.Project.Name}}-redis-subnet"
  subnet_ids = var.private_subnet_ids
}

resource "aws_security_group" "redis" {
  name   = "{{.Project.Name}}-redis-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [var.eks_sg_id]
  }

  tags = var.common_tags
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id = "{{.Project.Name}}-redis"
  description          = "Redis cluster for {{.Project.Name}}"

  node_type            = "{{if ge .Ledger.TpsPeak 5000}}cache.r6g.xlarge{{else if ge .Ledger.TpsPeak 1000}}cache.r6g.large{{else}}cache.r6g.large{{end}}"
  port                 = 6379
  parameter_group_name = "default.redis7"

  automatic_failover_enabled = true
  multi_az_enabled          = true

  subnet_ids         = var.private_subnet_ids
  security_group_ids = [aws_security_group.redis.id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true

  snapshot_retention_limit = 7
  snapshot_window         = "03:00-05:00"

  tags = var.common_tags
}`
      }
    ]
  },
  {
    name: 'temporal/',
    path: 'factory/internal/generator/templates/terraform/modules/temporal/',
    type: 'folder',
    children: [
      {
        name: 'main.tf.tmpl',
        path: 'factory/internal/generator/templates/terraform/modules/temporal/main.tf.tmpl',
        type: 'file',
        language: 'hcl',
        icon: '⏱️',
        content: `# Temporal workflow engine (deployed on EKS via Helm)
resource "helm_release" "temporal" {
  name       = "temporal"
  repository = "https://charts.temporal.io"
  chart      = "temporal"
  version    = "0.33.0"
  namespace  = "temporal"
  create_namespace = true

  values = [
    <<EOF
server:
  config:
    persistence:
      default:
        sql:
          driver: "postgresql"
          databaseName: "temporal"
          connectAddr: "\${var.rds_endpoint}:5432"
          user: "temporal"
          password: "\${var.db_password}"
      visibility:
        sql:
          driver: "postgresql"
          databaseName: "temporal_visibility"
          connectAddr: "\${var.rds_endpoint}:5432"
          user: "temporal"
          password: "\${var.db_password}"
EOF
  ]

  depends_on = [var.rds_endpoint]
}`
      }
    ]
  }
];
