export interface FileNode { name: string; path: string; type: 'file' | 'folder'; language?: string; content?: string; children?: FileNode[]; icon?: string; }
export const files: FileNode[] = [
  {
    name: 'factory/', path: 'factory/', type: 'folder', icon: '🏭',
    children: [
      { name: 'spec/', path: 'factory/spec/', type: 'folder', icon: '📋', children: [{ name: 'ledgercore.yaml', path: 'factory/spec/ledgercore.yaml', type: 'file', language: 'yaml', icon: '📝', content: `project:\n  name: "Acme-Ledger-Prod"\n  compliance: ["PCI-DSS-SAQ-A"]\n  cloud: "aws"` }] },
      { name: 'internal/', path: 'factory/internal/', type: 'folder', icon: '⚙️', children: [{ name: 'generator.go', path: 'factory/internal/generator.go', type: 'file', language: 'go', icon: '🐹', content: `package generator\n\nfunc Generate() error {\n\treturn nil\n}` }] }
    ]
  }
];
