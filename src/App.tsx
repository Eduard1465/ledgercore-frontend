import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FileTree } from './components/FileTree';
import { CodeViewer } from './components/CodeViewer';
import { Pipeline } from './components/Pipeline';
import { Architecture } from './components/Architecture';
import { SpecEditor } from './components/SpecEditor';
import { BootstrapScript } from './components/BootstrapScript';
import { GetStarted } from './components/GetStarted';
import { PlatformFeatures } from './components/PlatformFeatures';
import { AuditorMode } from './components/AuditorMode';
import { KYCWaterfall } from './components/KYCWaterfall';
import { TravelRule } from './components/TravelRule';
import { ISO20022Gateway } from './components/ISO20022Gateway';
import { ModuleRegistry } from './components/ModuleRegistry';
import { MigrationWizard } from './components/MigrationWizard';
import { RegToCodeUI } from './components/RegToCodeUI';
import { Roadmap } from './components/Roadmap';
import { SandboxEnvironment } from './components/SandboxEnvironment';
import { PaymentOrchestrator } from './components/PaymentOrchestrator';
import { TreasuryModule } from './components/TreasuryModule';
import { LendingEngine } from './components/LendingEngine';
import { SEPAInstant } from './components/SEPAInstant';
import { RealTimeCompliance } from './components/RealTimeCompliance';
import { PartnerPortal } from './components/PartnerPortal';
import { AISpecOptimizer } from './components/AISpecOptimizer';
import { AIAssistant } from './components/AIAssistant';
import { useLanguage } from './contexts/LanguageContext';
import { files, type FileNode } from './data/files';

function App() {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(files[0].children![0].children![0]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { language } = useLanguage();

  const handleLoadPreset = () => { setActiveTab('spec'); };

  const tabs = [
    { id: 'overview', en: 'Overview', ru: 'Обзор' },
    { id: 'tree', en: 'File Tree', ru: 'Дерево файлов' },
    { id: 'pipeline', en: 'Pipeline', ru: 'Трубопровод' },
    { id: 'architecture', en: 'Architecture', ru: 'Архитектура' },
    { id: 'spec', en: 'Spec Editor', ru: 'Редактор спецификаций' },
    { id: 'bootstrap', en: 'Bootstrap', ru: 'Bootstrap' },
    { id: 'download', en: 'Get Infrastructure', ru: 'Скачать' },
    { id: 'platform', en: 'Platform', ru: 'Платформа' },
    { id: 'auditor', en: 'Auditor Mode', ru: 'Режим аудитора' },
    { id: 'kyc', en: '🔍 KYC/AML', ru: '🔍 KYC/AML' },
    { id: 'travel-rule', en: '✈️ Travel Rule', ru: '✈️ Правила путешествий' },
    { id: 'iso20022', en: '🌐 ISO 20022', ru: '🌐 ISO 20022' },
    { id: 'registry', en: '📦 Registry', ru: '📦 Регистрация' },
    { id: 'migration', en: '🔄 Migration', ru: '🔄 Миграция' },
    { id: 'reg-to-code', en: '🤖 Reg-to-Code', ru: '🤖 Reg-to-Code' },
    { id: 'roadmap', en: '🗺️ Roadmap', ru: '🗺️ Дорожная карта' },
    { id: 'sandbox', en: '🏖️ Sandbox', ru: '🏖️ Песочница' },
    { id: 'payments', en: '💳 Payments', ru: '💳 Платежи' },
    { id: 'treasury', en: '💰 Treasury', ru: '💰 Казначейство' },
    { id: 'lending', en: '🏦 Lending', ru: '🏦 Кредитование' },
    { id: 'sepa', en: '⚡ SEPA', ru: '⚡ SEPA' },
    { id: 'realtime', en: '📊 Real-Time', ru: '📊 Real-Time' },
    { id: 'partner', en: '🤝 Partner', ru: '🤝 Партнеры' },
    { id: 'ai-optimizer', en: '🧠 AI Optimizer', ru: '🧠 AI Оптимизатор' }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      <Header onLoadPreset={handleLoadPreset} />
      
      <nav className="fixed top-[76px] left-0 right-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 px-4 py-2 whitespace-nowrap min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm transition-all flex-shrink-0 ${
                  activeTab === tab.id 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                {language === 'ru' ? tab.ru : tab.en}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <AIAssistant currentTab={activeTab} />
      
      <main className="pt-[140px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto px-4 py-8"
          >
            {activeTab === 'overview' && <Hero />}
            {activeTab === 'tree' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 overflow-auto max-h-[calc(100vh-120px)]">
                  <FileTree files={files} onSelect={setSelectedFile} selectedFile={selectedFile} />
                </div>
                <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                  <CodeViewer file={selectedFile} />
                </div>
              </div>
            )}
            {activeTab === 'pipeline' && <Pipeline />}
            {activeTab === 'architecture' && <Architecture />}
            {activeTab === 'spec' && <SpecEditor />}
            {activeTab === 'bootstrap' && <BootstrapScript />}
            {activeTab === 'download' && <GetStarted />}
            {activeTab === 'platform' && <PlatformFeatures />}
            {activeTab === 'auditor' && <AuditorMode />}
            {activeTab === 'kyc' && <KYCWaterfall />}
            {activeTab === 'travel-rule' && <TravelRule />}
            {activeTab === 'iso20022' && <ISO20022Gateway />}
            {activeTab === 'registry' && <ModuleRegistry />}
            {activeTab === 'migration' && <MigrationWizard />}
            {activeTab === 'reg-to-code' && <RegToCodeUI />}
            {activeTab === 'roadmap' && <Roadmap />}
            {activeTab === 'sandbox' && <SandboxEnvironment />}
            {activeTab === 'payments' && <PaymentOrchestrator />}
            {activeTab === 'treasury' && <TreasuryModule />}
            {activeTab === 'lending' && <LendingEngine />}
            {activeTab === 'sepa' && <SEPAInstant />}
            {activeTab === 'realtime' && <RealTimeCompliance />}
            {activeTab === 'partner' && <PartnerPortal />}
            {activeTab === 'ai-optimizer' && <AISpecOptimizer />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
export default App;
