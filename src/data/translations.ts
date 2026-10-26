export type Language = 'en' | 'ru';

export const translations = {
  en: {
    nav: {
      overview: 'Overview',
      tree: 'File Tree',
      pipeline: 'Pipeline',
      architecture: 'Architecture',
      spec: 'Spec Editor',
      bootstrap: 'Bootstrap',
      download: 'Get Infrastructure',
      platform: 'Platform',
    },
    hero: {
      badge: 'v1.1 — Production Ready',
      title1: 'LedgerCore',
      title2: 'Factory',
      subtitle: 'The AWS for FinTech Compliance Infrastructure. From spec to production-ready, audit-proof systems in 30 seconds.',
      command: 'go run . --spec spec/ledgercore.yaml --out output/client-delivery',
      stats: {
        files: '40+',
        filesLabel: 'Generated Files',
        time: '30s',
        timeLabel: 'Generation Time',
        rules: '10+',
        rulesLabel: 'PCI Rules',
        gates: '4',
        gatesLabel: 'CI/CD Gates',
      },
      features: [
        {
          title: 'Single Source of Truth',
          description: 'Edit one YAML spec → generate entire production repository',
        },
        {
          title: 'Compliance by Design',
          description: 'PCI-DSS v4.0, SOC2 Type2 policies auto-generated & enforced',
        },
        {
          title: '30-Second Setup',
          description: 'From spec to 40+ production files with CI/CD gates',
        },
        {
          title: 'Full Stack Generation',
          description: 'Terraform, Go, K8s, OPA, CI/CD, Evidence, Docs — all at once',
        },
        {
          title: 'Security Gates',
          description: 'SAST, SCA, IaC scanning, OPA policy checks in CI pipeline',
        },
        {
          title: 'Audit Evidence',
          description: 'Auto-generated control matrices, threat models, ADRs',
        },
      ],
    },
    tree: {
      title: 'Project Structure',
      selectFile: 'Select a file from the tree to view its contents',
    },
    pipeline: {
      title: 'Generation Pipeline',
      subtitle: 'From a single YAML spec to a complete, compliant, production-ready repository in 5 stages.',
      stages: [
        {
          title: '1. YAML Spec',
          subtitle: 'Single Source of Truth',
          description: 'Edit ledgercore.yaml — the ONLY file you touch. Define project, ledger, infra, and handover parameters.',
          details: [
            'Project: name, org, compliance frameworks, cloud, region',
            'Ledger: currencies, entities, accounts, TPS',
            'Infra: DB, MQ, orchestrator, KMS',
            'Handover: repo URL, sandbox TTL',
          ],
        },
        {
          title: '2. CUE Validation',
          subtitle: 'Contract Enforcement',
          description: 'CUE schema validates all fields, enums, and constraints before generation begins.',
          details: [
            'Type checking: string, int, enum constraints',
            'Cloud must be "aws" | "gcp"',
            'DB must be "cockroach" | "postgresql"',
            'MQ must be "redpanda" | "kafka"',
          ],
        },
        {
          title: '3. Go Struct Decode',
          subtitle: 'Type-Safe Loading',
          description: 'YAML decoded into typed Go structs for template rendering.',
          details: [
            'Spec struct with nested ProjectSpec, LedgerSpec',
            'InfraSpec, HandoverSpec sub-structures',
            'Type-safe field access in templates',
            'Zero-value defaults for optional fields',
          ],
        },
        {
          title: '4. Template Engine',
          subtitle: 'Go text/template + embed.FS',
          description: 'Embedded templates rendered with spec data. Custom funcs: join, upper, conditionals.',
          details: [
            '20+ embedded .tmpl files',
            'Conditional logic based on TPS/entity count',
            'Custom template functions (join, upper)',
            'Atomic file writes via fsutil',
          ],
        },
        {
          title: '5. Output Generation',
          subtitle: 'Production Repository',
          description: '40+ files generated across 7 categories, ready for git push.',
          details: [
            'Terraform: VPC, EKS, RDS, Vault modules',
            'Go: Domain, gRPC, HTTP handlers',
            'K8s: Helm chart with auto-scaling',
            'OPA: PCI + Security policies',
            'CI: GitHub Actions with 6 gates',
            'Evidence: Control matrix, threat model',
            'Docs: ADRs, architecture decisions',
          ],
        },
      ],
    },
    architecture: {
      title: 'System Architecture',
      subtitle: 'Layered architecture from spec input to production output. Each layer is independently testable.',
      layers: [
        {
          name: 'Input Layer',
          items: [
            { name: 'ledgercore.yaml', desc: 'Single YAML spec' },
          ],
        },
        {
          name: 'Validation Layer',
          items: [
            { name: 'CUE Schema', desc: 'Type + enum constraints' },
            { name: 'Go Structs', desc: 'Type-safe decode' },
          ],
        },
        {
          name: 'Generation Layer',
          items: [
            { name: 'Template Engine', desc: 'text/template + embed.FS' },
            { name: 'Atomic Writer', desc: 'fsutil.WriteFileAtomic' },
          ],
        },
        {
          name: 'Output Layer',
          items: [
            { name: 'Terraform', desc: 'VPC, EKS, RDS, Vault' },
            { name: 'Go Source', desc: 'Domain, gRPC, HTTP' },
            { name: 'K8s/Helm', desc: 'Chart + values + templates' },
            { name: 'OPA Policies', desc: 'PCI + Security Rego' },
            { name: 'CI/CD', desc: 'GitHub Actions 6 gates' },
            { name: 'Evidence', desc: 'Matrix + Threat Model' },
            { name: 'Docs', desc: 'ADRs + Architecture' },
          ],
        },
      ],
      techStack: {
        title: 'Technology Stack',
        categories: [
          { category: 'Language', items: ['Go 1.22', 'CUE', 'Rego', 'HCL', 'YAML'] },
          { category: 'Infrastructure', items: ['AWS', 'Terraform', 'EKS', 'CockroachDB', 'Redpanda'] },
          { category: 'Application', items: ['Gin', 'gRPC', 'Temporal', 'OpenTelemetry'] },
          { category: 'Security', items: ['OPA', 'KMS', 'Vault', 'gosec', 'Trivy'] },
          { category: 'CI/CD', items: ['GitHub Actions', 'Checkov', 'golangci-lint', 'Docker'] },
        ],
      },
      compliance: {
        title: 'Compliance Coverage',
        headers: ['Framework', 'Controls', 'Implementation', 'Verification'],
        rows: [
          { framework: 'PCI-DSS v4.0', controls: '1.2.1, 3.4.1, 8.2.1, 10.2', impl: 'VPC segmentation, KMS encryption, Network policies', verify: 'OPA Rego policies in CI' },
          { framework: 'SOC2 Type 2', controls: 'CC6.1, CC7.2', impl: 'IAM policies, CloudWatch monitoring', verify: 'AWS Config + manual audit' },
          { framework: 'CIS Benchmarks', controls: 'All applicable', impl: 'Terraform hardened modules', verify: 'Checkov IaC scanning' },
          { framework: 'OWASP Top 10', controls: 'A01-A10', impl: 'gosec SAST, input validation', verify: 'GitHub Actions SAST gate' },
        ],
      },
    },
    spec: {
      title: 'Interactive Spec Editor',
      subtitle: 'This is the ONLY file you edit. Modify the spec below and see real-time validation and output estimation.',
      validation: 'CUE Validation',
      valid: 'All constraints satisfied',
      errors: 'Errors',
      warnings: 'WARNINGS',
      outputEstimate: 'Output Estimate',
      filesGenerated: 'files generated',
      quickActions: 'Quick Actions',
      resetDefault: 'Reset to Default',
      highTpsMode: 'High TPS Mode (10K)',
      switchToGcp: 'Switch to GCP',
      runCommand: 'Run Command',
    },
    bootstrap: {
      title: 'Bootstrap Script',
      subtitle: 'Complete one-command setup. Copy this script, run it in your terminal, and get a fully functional LedgerCore Factory in seconds.',
      steps: [
        {
          title: 'Create Directory',
          command: 'mkdir -p ~/ledgercore-factory\ncd ~/ledgercore-factory',
        },
        {
          title: 'Save Script',
          command: 'nano bootstrap_factory.sh\n# Paste the script below\nchmod +x bootstrap_factory.sh',
        },
        {
          title: 'Run',
          command: './bootstrap_factory.sh',
        },
      ],
      scriptTitle: 'bootstrap_factory.sh',
      copyScript: 'Copy Script',
      copied: '✓ Copied!',
      included: "What's Included",
      categories: [
        { category: 'Core Go', count: '6 files', items: ['main.go', 'loader.go', 'generator.go', 'writer.go', 'go.mod', 'schema.cue'] },
        { category: 'Terraform', count: '10 files', items: ['main.tf', 'variables.tf', 'outputs.tf', 'vpc/', 'eks/', 'rds/', 'vault/'] },
        { category: 'Application', count: '7 files', items: ['go.mod', 'main.go', 'domain/', 'handler/', 'middleware/', 'api/'] },
        { category: 'K8s/Helm', count: '5 files', items: ['Chart.yaml', 'values.yaml', 'deployment.yaml', 'service.yaml', 'servicemonitor.yaml'] },
        { category: 'Policies', count: '2 files', items: ['pci.rego', 'security.rego'] },
        { category: 'CI/CD', count: '1 file', items: ['github-actions.yaml'] },
        { category: 'Evidence', count: '3 files', items: ['control_matrix.csv', 'threat_model.md', 'runbook_incident.md'] },
        { category: 'Docs', count: '2 files', items: ['ADR_001.md', 'HANDOVER.md'] },
      ],
      stats: [
        { value: '36+', label: 'Template Files' },
        { value: '40+', label: 'Generated Files' },
        { value: '30s', label: 'Setup Time' },
        { value: '1', label: 'Command to Run' },
      ],
    },
    ai: {
      greeting: "Hi! I'm the LedgerCore Factory AI assistant. How can I help?",
      placeholder: 'Ask a question...',
      suggestions: [
        'How to start using Factory?',
        'What is spec/ledgercore.yaml?',
        'What compliance standards are supported?',
      ],
    },
  },
  ru: {
    nav: {
      overview: 'Обзор',
      tree: 'Дерево файлов',
      pipeline: 'Конвейер',
      architecture: 'Архитектура',
      spec: 'Редактор Spec',
      bootstrap: 'Запуск',
      download: 'Получить инфраструктуру',
      platform: 'Платформа',
    },
    hero: {
      badge: 'v1.1 — Готово к продакшену',
      title1: 'LedgerCore',
      title2: 'Factory',
      subtitle: 'AWS для FinTech Compliance Infrastructure. От спецификации до production-ready, audit-proof систем за 30 секунд.',
      command: 'go run . --spec spec/ledgercore.yaml --out output/client-delivery',
      stats: {
        files: '40+',
        filesLabel: 'Генерируемых файлов',
        time: '30с',
        timeLabel: 'Время генерации',
        rules: '10+',
        rulesLabel: 'PCI правил',
        gates: '4',
        gatesLabel: 'CI/CD гейтов',
      },
      features: [
        {
          title: 'Единый источник истины',
          description: 'Редактируйте один YAML spec → генерируйте весь production репозиторий',
        },
        {
          title: 'Compliance из коробки',
          description: 'PCI-DSS v4.0, SOC2 Type2 политики генерируются и применяются автоматически',
        },
        {
          title: 'Настройка за 30 секунд',
          description: 'От spec до 40+ production файлов с CI/CD гейтами',
        },
        {
          title: 'Full Stack генерация',
          description: 'Terraform, Go, K8s, OPA, CI/CD, Evidence, Docs — всё сразу',
        },
        {
          title: 'Гейты безопасности',
          description: 'SAST, SCA, IaC сканирование, OPA проверки политик в CI пайплайне',
        },
        {
          title: 'Доказательства для аудита',
          description: 'Автогенерируемые матрицы контроля, модели угроз, ADR',
        },
      ],
    },
    tree: {
      title: 'Структура проекта',
      selectFile: 'Выберите файл из дерева для просмотра содержимого',
    },
    pipeline: {
      title: 'Конвейер генерации',
      subtitle: 'От одного YAML spec до полного, compliant, production-ready репозитория за 5 этапов.',
      stages: [
        {
          title: '1. YAML Spec',
          subtitle: 'Единый источник истины',
          description: 'Редактируйте ledgercore.yaml — ЕДИНСТВЕННЫЙ файл, который вы трогаете. Определите параметры проекта, реестра, инфраструктуры и передачи.',
          details: [
            'Project: имя, организация, compliance фреймворки, облако, регион',
            'Ledger: валюты, сущности, счета, TPS',
            'Infra: БД, MQ, оркестратор, KMS',
            'Handover: URL репозитория, TTL песочницы',
          ],
        },
        {
          title: '2. CUE Валидация',
          subtitle: 'Принудительное соблюдение контракта',
          description: 'CUE схема валидирует все поля, перечисления и ограничения перед началом генерации.',
          details: [
            'Проверка типов: string, int, enum ограничения',
            'Cloud должен быть "aws" | "gcp"',
            'DB должен быть "cockroach" | "postgresql"',
            'MQ должен быть "redpanda" | "kafka"',
          ],
        },
        {
          title: '3. Декодирование в Go структуры',
          subtitle: 'Типобезопасная загрузка',
          description: 'YAML декодируется в типизированные Go структуры для рендеринга шаблонов.',
          details: [
            'Spec структура с вложенными ProjectSpec, LedgerSpec',
            'Подструктуры InfraSpec, HandoverSpec',
            'Типобезопасный доступ к полям в шаблонах',
            'Zero-value значения по умолчанию для опциональных полей',
          ],
        },
        {
          title: '4. Шаблонизатор',
          subtitle: 'Go text/template + embed.FS',
          description: 'Встроенные шаблоны рендерятся с данными из spec. Кастомные функции: join, upper, условия.',
          details: [
            '20+ встроенных .tmpl файлов',
            'Условная логика на основе TPS/количества сущностей',
            'Кастомные функции шаблонов (join, upper)',
            'Атомарная запись файлов через fsutil',
          ],
        },
        {
          title: '5. Генерация результата',
          subtitle: 'Production репозиторий',
          description: '40+ файлов генерируются в 7 категориях, готовы к git push.',
          details: [
            'Terraform: модули VPC, EKS, RDS, Vault',
            'Go: Domain, gRPC, HTTP handlers',
            'K8s: Helm chart с автомасштабированием',
            'OPA: PCI + Security политики',
            'CI: GitHub Actions с 6 гейтами',
            'Evidence: Матрица контроля, модель угроз',
            'Docs: ADR, архитектурные решения',
          ],
        },
      ],
    },
    architecture: {
      title: 'Системная архитектура',
      subtitle: 'Многослойная архитектура от входного spec до production результата. Каждый слой независимо тестируем.',
      layers: [
        {
          name: 'Слой ввода',
          items: [
            { name: 'ledgercore.yaml', desc: 'Единый YAML spec' },
          ],
        },
        {
          name: 'Слой валидации',
          items: [
            { name: 'CUE Схема', desc: 'Типы + enum ограничения' },
            { name: 'Go Структуры', desc: 'Типобезопасное декодирование' },
          ],
        },
        {
          name: 'Слой генерации',
          items: [
            { name: 'Шаблонизатор', desc: 'text/template + embed.FS' },
            { name: 'Атомарный Writer', desc: 'fsutil.WriteFileAtomic' },
          ],
        },
        {
          name: 'Слой вывода',
          items: [
            { name: 'Terraform', desc: 'VPC, EKS, RDS, Vault' },
            { name: 'Go Код', desc: 'Domain, gRPC, HTTP' },
            { name: 'K8s/Helm', desc: 'Chart + values + templates' },
            { name: 'OPA Политики', desc: 'PCI + Security Rego' },
            { name: 'CI/CD', desc: 'GitHub Actions 6 гейтов' },
            { name: 'Evidence', desc: 'Матрица + Модель угроз' },
            { name: 'Документация', desc: 'ADR + Архитектура' },
          ],
        },
      ],
      techStack: {
        title: 'Технологический стек',
        categories: [
          { category: 'Языки', items: ['Go 1.22', 'CUE', 'Rego', 'HCL', 'YAML'] },
          { category: 'Инфраструктура', items: ['AWS', 'Terraform', 'EKS', 'CockroachDB', 'Redpanda'] },
          { category: 'Приложение', items: ['Gin', 'gRPC', 'Temporal', 'OpenTelemetry'] },
          { category: 'Безопасность', items: ['OPA', 'KMS', 'Vault', 'gosec', 'Trivy'] },
          { category: 'CI/CD', items: ['GitHub Actions', 'Checkov', 'golangci-lint', 'Docker'] },
        ],
      },
      compliance: {
        title: 'Покрытие Compliance',
        headers: ['Фреймворк', 'Контроли', 'Реализация', 'Проверка'],
        rows: [
          { framework: 'PCI-DSS v4.0', controls: '1.2.1, 3.4.1, 8.2.1, 10.2', impl: 'Сегментация VPC, шифрование KMS, сетевые политики', verify: 'OPA Rego политики в CI' },
          { framework: 'SOC2 Type 2', controls: 'CC6.1, CC7.2', impl: 'IAM политики, мониторинг CloudWatch', verify: 'AWS Config + ручной аудит' },
          { framework: 'CIS Benchmarks', controls: 'Все применимые', impl: 'Усиленные Terraform модули', verify: 'Checkov IaC сканирование' },
          { framework: 'OWASP Top 10', controls: 'A01-A10', impl: 'gosec SAST, валидация ввода', verify: 'GitHub Actions SAST гейт' },
        ],
      },
    },
    spec: {
      title: 'Интерактивный редактор Spec',
      subtitle: 'Это ЕДИНСТВЕННЫЙ файл, который вы редактируете. Измените spec ниже и увидите валидацию в реальном времени и оценку результата.',
      validation: 'CUE Валидация',
      valid: 'Все ограничения соблюдены',
      errors: 'Ошибки',
      warnings: 'ПРЕДУПРЕЖДЕНИЯ',
      outputEstimate: 'Оценка результата',
      filesGenerated: 'файлов генерируется',
      quickActions: 'Быстрые действия',
      resetDefault: 'Сбросить по умолчанию',
      highTpsMode: 'Режим высокого TPS (10K)',
      switchToGcp: 'Переключить на GCP',
      runCommand: 'Команда запуска',
    },
    bootstrap: {
      title: 'Скрипт запуска',
      subtitle: 'Полная настройка одной командой. Скопируйте этот скрипт, запустите в терминале и получите полностью функциональный LedgerCore Factory за секунды.',
      steps: [
        {
          title: 'Создать директорию',
          command: 'mkdir -p ~/ledgercore-factory\ncd ~/ledgercore-factory',
        },
        {
          title: 'Сохранить скрипт',
          command: 'nano bootstrap_factory.sh\n# Вставьте скрипт ниже\nchmod +x bootstrap_factory.sh',
        },
        {
          title: 'Запустить',
          command: './bootstrap_factory.sh',
        },
      ],
      scriptTitle: 'bootstrap_factory.sh',
      copyScript: 'Копировать скрипт',
      copied: '✓ Скопировано!',
      included: 'Что включено',
      categories: [
        { category: 'Core Go', count: '6 файлов', items: ['main.go', 'loader.go', 'generator.go', 'writer.go', 'go.mod', 'schema.cue'] },
        { category: 'Terraform', count: '10 файлов', items: ['main.tf', 'variables.tf', 'outputs.tf', 'vpc/', 'eks/', 'rds/', 'vault/'] },
        { category: 'Приложение', count: '7 файлов', items: ['go.mod', 'main.go', 'domain/', 'handler/', 'middleware/', 'api/'] },
        { category: 'K8s/Helm', count: '5 файлов', items: ['Chart.yaml', 'values.yaml', 'deployment.yaml', 'service.yaml', 'servicemonitor.yaml'] },
        { category: 'Политики', count: '2 файла', items: ['pci.rego', 'security.rego'] },
        { category: 'CI/CD', count: '1 файл', items: ['github-actions.yaml'] },
        { category: 'Evidence', count: '3 файла', items: ['control_matrix.csv', 'threat_model.md', 'runbook_incident.md'] },
        { category: 'Документация', count: '2 файла', items: ['ADR_001.md', 'HANDOVER.md'] },
      ],
      stats: [
        { value: '36+', label: 'Файлов шаблонов' },
        { value: '40+', label: 'Генерируемых файлов' },
        { value: '30с', label: 'Время настройки' },
        { value: '1', label: 'Команда для запуска' },
      ],
    },
    ai: {
      greeting: 'Привет! Я AI-помощник LedgerCore Factory. Чем могу помочь?',
      placeholder: 'Задайте вопрос...',
      suggestions: [
        'Как начать использовать Factory?',
        'Что такое spec/ledgercore.yaml?',
        'Какие compliance стандарты поддерживаются?',
      ],
    },
  },
};
