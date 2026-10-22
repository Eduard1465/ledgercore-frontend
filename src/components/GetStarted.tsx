import { useState } from 'react';
import { motion } from 'framer-motion';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useLanguage } from '../contexts/LanguageContext';

interface ProjectFile {
  path: string;
  content: string;
  language: string;
}

const projectFiles: ProjectFile[] = [
  {
    path: 'go.mod',
    language: 'go',
    content: `module github.com/your-org/factory\n\ngo 1.22\n\nrequire (\n    cuelang.org/go v0.10.0\n    github.com/spf13/cobra v1.8.0\n    gopkg.in/yaml.v3 v3.0.1\n)`
  },
  {
    path: 'main.go',
    language: 'go',
    content: `package main\n\nimport (\n    "fmt"\n    "os"\n\n    "github.com/spf13/cobra"\n)\n\nfunc main() {\n    fmt.Println("LedgerCore Factory v2.0")\n}`
  },
  {
    path: 'spec/ledgercore.yaml',
    language: 'yaml',
    content: `project:\n  name: "acme-ledger-prod"\n  org: "acme-corp"\n  compliance: ["PCI-DSS-SAQ-D", "SOC2-Type2"]\n  cloud: "aws"\n  region: "eu-central-1"\n\nledger:\n  currency: ["USD", "EUR"]\n  entities: ["PARENT", "SUBSIDIARY_EU"]\n  accounts_per_entity: 5000\n  tps_peak: 1000`
  },
  {
    path: 'Makefile',
    language: 'makefile',
    content: `.PHONY: build run generate test clean\n\nbuild:\n\tgo build -o bin/factory .\n\nrun: build\n\t./bin/factory -spec spec/ledgercore.yaml -out output/client-delivery\n\ngenerate:\n\tgo run . -spec spec/ledgercore.yaml -out output/client-delivery\n\ntest:\n\tgo test -v ./...\n\nclean:\n\trm -rf bin/ output/`
  }
];

export function GetStarted() {
  const { language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const zip = new JSZip();
      projectFiles.forEach(file => {
        zip.file(`factory/${file.path}`, file.content);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'ledgercore-factory-v2.0.zip');
    } catch (error) {
      console.error('Error generating ZIP:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const tr = language === 'en' ? {
    title: 'Launch Your FinTech Infrastructure in 30 Seconds',
    subtitle: 'Get a complete, audit-ready, multi-jurisdiction compliant system',
    download: 'Download Production-Ready Infrastructure',
    generating: 'Building your package...',
    step1Title: 'Download & Unpack',
    step1Desc: 'Get the full factory package',
    step2Title: 'Configure Your Spec',
    step2Desc: 'Edit the spec/ledgercore.yaml file',
    step3Title: 'Generate & Deploy',
    step3Desc: 'Run "make generate" → "terraform apply"',
  } : {
    title: 'Запустите FinTech-инфраструктуру за 30 секунд',
    subtitle: 'Получите полную, готовую к аудиту, мульти-юрисдикционную систему',
    download: 'Скачать готовую инфраструктуру',
    generating: 'Собираем ваш пакет...',
    step1Title: 'Скачать и распаковать',
    step1Desc: 'Получите полный заводской пакет',
    step2Title: 'Настройте свои характеристики',
    step2Desc: 'Отредактируйте файл spec/ledgercore.yaml',
    step3Title: 'Создание и развертывание',
    step3Desc: 'Выполните команду "make generate" → "terraform apply"',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6"
        >
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-sm font-medium">Factory v2.0 + Geo-Compliance Module</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-gray-100 mb-4"
        >
          {tr.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-3xl mx-auto mb-8"
        >
          {tr.subtitle}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={handleDownload}
          disabled={isGenerating}
          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {tr.generating}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {tr.download}
            </span>
          )}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { num: '1', title: tr.step1Title, desc: tr.step1Desc },
          { num: '2', title: tr.step2Title, desc: tr.step2Desc },
          { num: '3', title: tr.step3Title, desc: tr.step3Desc }
        ].map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center"
          >
            <div className="w-10 h-10 mx-auto bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center font-bold mb-4">
              {step.num}
            </div>
            <h3 className="text-lg font-bold text-gray-100 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-400">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
