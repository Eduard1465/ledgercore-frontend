import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

type FeatureTab = 'ai' | 'dashboard' | 'marketplace' | 'cost' | 'multicloud' | 'pentest' | 'realtime' | 'caas';

export function PlatformFeatures() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<FeatureTab>('ai');

  const translations = {
    en: {
      badge: 'Next-Gen Platform Features',
      title: 'Beyond Code Generation',
      subtitle: '8 advanced features that turn LedgerCore Factory into the AWS for FinTech Compliance Infrastructure',
      tabs: {
        ai: '🧠 AI Spec Optimizer',
        dashboard: '📊 Compliance Dashboard',
        marketplace: '🏪 Module Marketplace',
        cost: '💰 Cost Optimizer',
        multicloud: '☁️ Multi-Cloud',
        pentest: '🔒 Auto Pentest',
        realtime: '🛡️ Real-Time Monitor',
        caas: '📋 CaaS',
      },
    },
    ru: {
      badge: 'Функции платформы нового поколения',
      title: 'Больше, чем генерация кода',
      subtitle: '8 продвинутых функций, превращающих LedgerCore Factory в AWS для FinTech Compliance Infrastructure',
      tabs: {
        ai: '🧠 AI Оптимизатор',
        dashboard: '📊 Dashboard Compliance',
        marketplace: '🏪 Маркетплейс',
        cost: '💰 Оптимизатор затрат',
        multicloud: '☁️ Multi-Cloud',
        pentest: '🔒 Авто Pentest',
        realtime: '🛡️ Real-Time мониторинг',
        caas: '📋 CaaS',
      },
    }
  };

  const tr = translations[language];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6"
        >
          <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          <span className="text-purple-400 text-sm font-medium">{tr.badge}</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">{tr.title}</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">{tr.subtitle}</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {(Object.keys(tr.tabs) as FeatureTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            {tr.tabs[tab]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'ai' && <AIOptimizer />}
          {activeTab === 'dashboard' && <ComplianceDashboard />}
          {activeTab === 'marketplace' && <ModuleMarketplace />}
          {activeTab === 'cost' && <CostOptimizer />}
          {activeTab === 'multicloud' && <MultiCloud />}
          {activeTab === 'pentest' && <AutoPentest />}
          {activeTab === 'realtime' && <RealTimeMonitor />}
          {activeTab === 'caas' && <ComplianceAsAService />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// 1. AI Spec Optimizer
function AIOptimizer() {
  const { language } = useLanguage();
  const [tps, setTps] = useState(1000);
  const [entities, setEntities] = useState(3);
  const [currencies, setCurrencies] = useState(3);

  const recommendations = {
    replicas: tps > 5000 ? 5 : tps > 1000 ? 3 : 2,
    instanceType: tps > 5000 ? 'r6g.2xlarge' : tps > 1000 ? 'r6g.xlarge' : 'r6g.large',
    dbNodes: entities > 5 ? 5 : entities > 2 ? 3 : 2,
    estimatedCost: Math.round((tps * 0.15) + (entities * 500) + (currencies * 200)),
    complianceGaps: currencies > 5 ? ['Consider splitting entities by currency region'] : [],
  };

  const tr = language === 'en' ? {
    title: 'AI-Powered Spec Optimization',
    desc: 'Get intelligent recommendations based on your requirements. Our AI analyzes industry benchmarks and optimizes your spec for performance, cost, and compliance.',
    inputs: 'Your Requirements',
    tpsLabel: 'Peak TPS',
    entitiesLabel: 'Legal Entities',
    currenciesLabel: 'Currencies',
    recommendations: 'AI Recommendations',
    replicas: 'K8s Replicas',
    instance: 'Instance Type',
    dbNodes: 'DB Nodes',
    cost: 'Estimated Monthly Cost',
    gaps: 'Compliance Gaps',
    apply: 'Apply Recommendations',
  } : {
    title: 'AI-оптимизация спецификаций',
    desc: 'Получите интеллектуальные рекомендации на основе ваших требований. Наш AI анализирует отраслевые бенчмарки и оптимизирует spec для производительности, стоимости и compliance.',
    inputs: 'Ваши требования',
    tpsLabel: 'Пиковый TPS',
    entitiesLabel: 'Юридические лица',
    currenciesLabel: 'Валюты',
    recommendations: 'AI Рекомендации',
    replicas: 'K8s реплики',
    instance: 'Тип инстанса',
    dbNodes: 'DB ноды',
    cost: 'Оценка месячных затрат',
    gaps: 'Compliance пробелы',
    apply: 'Применить рекомендации',
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">{tr.title}</h2>
      <p className="text-gray-400 mb-8">{tr.desc}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div>
          <h3 className="text-lg font-bold text-emerald-400 mb-4">{tr.inputs}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">{tr.tpsLabel}: {tps.toLocaleString()}</label>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={tps}
                onChange={(e) => setTps(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">{tr.entitiesLabel}: {entities}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={entities}
                onChange={(e) => setEntities(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">{tr.currenciesLabel}: {currencies}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={currencies}
                onChange={(e) => setCurrencies(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-lg font-bold text-cyan-400 mb-4">{tr.recommendations}</h3>
          <div className="space-y-3">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">{tr.replicas}</div>
              <div className="text-2xl font-bold text-emerald-400">{recommendations.replicas}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">{tr.instance}</div>
              <div className="text-2xl font-bold text-cyan-400">{recommendations.instanceType}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">{tr.dbNodes}</div>
              <div className="text-2xl font-bold text-purple-400">{recommendations.dbNodes}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">{tr.cost}</div>
              <div className="text-2xl font-bold text-orange-400">${recommendations.estimatedCost.toLocaleString()}</div>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-bold">
            {tr.apply}
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Compliance Dashboard
function ComplianceDashboard() {
  const { language } = useLanguage();

  const tr = language === 'en' ? {
    title: 'Continuous Compliance Dashboard',
    desc: 'Real-time visibility into your compliance posture. Monitor PCI DSS, SOC2, GDPR, and more from a single pane of glass.',
    overall: 'Overall Compliance Score',
    frameworks: 'Framework Status',
    controls: 'Active Controls',
    evidence: 'Evidence Collected',
    alerts: 'Recent Alerts',
    noViolations: 'No violations detected in the last 24 hours',
  } : {
    title: 'Continuous Compliance Dashboard',
    desc: 'Real-time видимость вашего compliance статуса. Мониторьте PCI DSS, SOC2, GDPR и другое из единой панели.',
    overall: 'Общий compliance score',
    frameworks: 'Статус фреймворков',
    controls: 'Активных контролей',
    evidence: 'Собрано evidence',
    alerts: 'Последние алерты',
    noViolations: 'Нарушений за последние 24 часа не обнаружено',
  };

  const frameworks = [
    { name: 'PCI DSS v4.0', score: 98, color: 'emerald' },
    { name: 'SOC2 Type II', score: 95, color: 'cyan' },
    { name: 'GDPR', score: 100, color: 'purple' },
    { name: '152-ФЗ', score: 97, color: 'orange' },
    { name: 'CCPA', score: 92, color: 'pink' },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">{tr.title}</h2>
      <p className="text-gray-400 mb-8">{tr.desc}</p>

      {/* Overall Score */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-xl p-6 text-center">
          <div className="text-5xl font-bold text-emerald-400 mb-2">96%</div>
          <div className="text-sm text-gray-400">{tr.overall}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-5xl font-bold text-cyan-400 mb-2">{frameworks.length}</div>
          <div className="text-sm text-gray-400">{tr.frameworks}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-5xl font-bold text-purple-400 mb-2">47</div>
          <div className="text-sm text-gray-400">{tr.controls}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-5xl font-bold text-orange-400 mb-2">1,247</div>
          <div className="text-sm text-gray-400">{tr.evidence}</div>
        </div>
      </div>

      {/* Framework Status */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-200 mb-4">{tr.frameworks}</h3>
        <div className="space-y-3">
          {frameworks.map((fw) => (
            <div key={fw.name} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-200 font-medium">{fw.name}</span>
                <span className={`text-${fw.color}-400 font-bold`}>{fw.score}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${fw.color}-500`}
                  style={{ width: `${fw.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-emerald-400 mb-2">{tr.alerts}</h3>
        <p className="text-gray-300">✅ {tr.noViolations}</p>
      </div>
    </div>
  );
}

// 3. Module Marketplace
function ModuleMarketplace() {
  const { language } = useLanguage();

  const tr = language === 'en' ? {
    title: 'Domain Module Marketplace',
    desc: 'Extend your LedgerCore with pre-built, compliance-ready modules. Install in seconds, production-ready out of the box.',
    install: 'Install',
    installed: 'Installed',
    price: 'Price',
    modules: [
      { name: 'SEPA Instant Payments', desc: 'Real-time EUR transfers across EU', price: '$25K', icon: '💶', status: 'available' },
      { name: 'Card Issuing', desc: 'Virtual & physical card issuance', price: '$35K', icon: '💳', status: 'available' },
      { name: 'KYC/AML Integration', desc: 'Identity verification & AML screening', price: '$20K', icon: '🔍', status: 'available' },
      { name: 'Crypto On/Off Ramp', desc: 'Fiat ↔ Crypto conversion', price: '$30K', icon: '₿', status: 'available' },
      { name: 'Treasury Management', desc: 'Cash pooling & FX optimization', price: '$40K', icon: '💰', status: 'coming' },
      { name: 'Lending Engine', desc: 'Loan origination & servicing', price: '$45K', icon: '🏦', status: 'coming' },
    ],
  } : {
    title: 'Маркетплейс доменных модулей',
    desc: 'Расширьте LedgerCore готовыми, compliance-ready модулями. Установка за секунды, production-ready из коробки.',
    install: 'Установить',
    installed: 'Установлен',
    price: 'Цена',
    modules: [
      { name: 'SEPA Instant Payments', desc: 'Real-time EUR переводы по EU', price: '$25K', icon: '💶', status: 'available' },
      { name: 'Card Issuing', desc: 'Выпуск виртуальных и физических карт', price: '$35K', icon: '💳', status: 'available' },
      { name: 'KYC/AML Integration', desc: 'Верификация личности и AML скрининг', price: '$20K', icon: '🔍', status: 'available' },
      { name: 'Crypto On/Off Ramp', desc: 'Конвертация Fiat ↔ Crypto', price: '$30K', icon: '₿', status: 'available' },
      { name: 'Treasury Management', desc: 'Cash pooling и FX оптимизация', price: '$40K', icon: '💰', status: 'coming' },
      { name: 'Lending Engine', desc: 'Ориджинация и обслуживание кредитов', price: '$45K', icon: '🏦', status: 'coming' },
    ],
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">{tr.title}</h2>
      <p className="text-gray-400 mb-8">{tr.desc}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tr.modules.map((mod, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all"
          >
            <div className="text-4xl mb-4">{mod.icon}</div>
            <h3 className="text-lg font-bold text-gray-100 mb-2">{mod.name}</h3>
            <p className="text-sm text-gray-400 mb-4">{mod.desc}</p>

            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <h4 className="text-xs font-bold text-red-400 mb-2">⚔️ VS COMPETITORS</h4>
              <div className="space-y-1.5 text-xs">
                {mod.name === 'Card Issuing' && (
                  <>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      <span className="text-gray-400">Marqeta/Lithic: API Only, No Ledger Control, Vendor Lock-in</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-gray-300">Factory: Own Ledger Logic, Own IP, Any Processor</span>
                    </div>
                  </>
                )}
                {mod.name === 'KYC/AML Integration' && (
                  <>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      <span className="text-gray-400">Chainalysis/SumSub: Data Only, No Ledger Integration</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-gray-300">Factory: Integrated with Ledger, OPA Policies, Evidence Pack</span>
                    </div>
                  </>
                )}
                {mod.name === 'Crypto On/Off Ramp' && (
                  <>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      <span className="text-gray-400">MoonPay/Ramp: High Fees, Limited Control, Black Box</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-gray-300">Factory: Own Ramp, Custom Logic, Full Audit Trail</span>
                    </div>
                  </>
                )}
                {mod.name === 'SEPA Instant Payments' && (
                  <>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      <span className="text-gray-400">Banking APIs: Slow, Expensive, Limited Customization</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-gray-300">Factory: Real-time, Own Infrastructure, Full Control</span>
                    </div>
                  </>
                )}
                {!['Card Issuing', 'KYC/AML Integration', 'Crypto On/Off Ramp', 'SEPA Instant Payments'].includes(mod.name) && (
                  <div className="text-gray-500 italic">No direct competitors — unique Factory module</div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold">{mod.price}</span>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  mod.status === 'available'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
                disabled={mod.status !== 'available'}
              >
                {mod.status === 'available' ? tr.install : 'Coming Soon'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 4. Cost Optimizer
function CostOptimizer() {
  const { language } = useLanguage();

  const tr = language === 'en' ? {
    title: 'Cost Optimization Engine',
    desc: 'Automatically analyze your infrastructure and get actionable recommendations to reduce cloud costs by 20-30%.',
    current: 'Current Monthly Cost',
    optimized: 'Optimized Cost',
    savings: 'Monthly Savings',
    recommendations: 'Recommendations',
    items: [
      { title: 'Right-size RDS instances', saving: '$1,200', impact: 'high' },
      { title: 'Use Reserved Instances for EKS', saving: '$2,500', impact: 'high' },
      { title: 'Enable S3 Intelligent-Tiering', saving: '$450', impact: 'medium' },
      { title: 'Consolidate NAT Gateways', saving: '$800', impact: 'medium' },
      { title: 'Use Spot Instances for batch jobs', saving: '$600', impact: 'low' },
    ],
  } : {
    title: 'Движок оптимизации затрат',
    desc: 'Автоматически анализируйте вашу инфраструктуру и получайте рекомендации по снижению cloud затрат на 20-30%.',
    current: 'Текущие месячные затраты',
    optimized: 'Оптимизированные затраты',
    savings: 'Месячная экономия',
    recommendations: 'Рекомендации',
    items: [
      { title: 'Оптимизировать размер RDS инстансов', saving: '$1,200', impact: 'high' },
      { title: 'Использовать Reserved Instances для EKS', saving: '$2,500', impact: 'high' },
      { title: 'Включить S3 Intelligent-Tiering', saving: '$450', impact: 'medium' },
      { title: 'Объединить NAT Gateways', saving: '$800', impact: 'medium' },
      { title: 'Использовать Spot Instances для batch jobs', saving: '$600', impact: 'low' },
    ],
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">{tr.title}</h2>
      <p className="text-gray-400 mb-8">{tr.desc}</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-sm text-gray-400 mb-2">{tr.current}</div>
          <div className="text-4xl font-bold text-red-400">$18,500</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-sm text-gray-400 mb-2">{tr.optimized}</div>
          <div className="text-4xl font-bold text-emerald-400">$12,950</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-xl p-6 text-center">
          <div className="text-sm text-gray-400 mb-2">{tr.savings}</div>
          <div className="text-4xl font-bold text-emerald-400">$5,550</div>
          <div className="text-xs text-gray-500 mt-1">30% reduction</div>
        </div>
      </div>

      {/* Recommendations */}
      <h3 className="text-lg font-bold text-gray-200 mb-4">{tr.recommendations}</h3>
      <div className="space-y-3">
        {tr.items.map((item, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                item.impact === 'high' ? 'bg-red-400' :
                item.impact === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
              }`} />
              <span className="text-gray-200">{item.title}</span>
            </div>
            <span className="text-emerald-400 font-bold">{item.saving}/mo</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. Multi-Cloud
function MultiCloud() {
  const { language } = useLanguage();

  const tr = language === 'en' ? {
    title: 'Multi-Cloud Support',
    desc: 'Deploy to AWS, GCP, Azure, or multi-cloud with a single spec change. No vendor lock-in.',
    clouds: [
      { name: 'AWS', status: 'Production Ready', icon: '🟠', features: ['Full support', 'All modules', 'Optimized templates'] },
      { name: 'GCP', status: 'Beta', icon: '🔵', features: ['Core modules', 'GKE support', 'Cloud SQL'] },
      { name: 'Azure', status: 'Coming Q3', icon: '🟦', features: ['AKS support', 'Azure SQL', 'Key Vault'] },
      { name: 'Multi-Cloud', status: 'Coming Q4', icon: '🌐', features: ['Crossplane', 'Hybrid deployments', 'DR across clouds'] },
    ],
  } : {
    title: 'Поддержка Multi-Cloud',
    desc: 'Деплойте в AWS, GCP, Azure или multi-cloud с одним изменением spec. Без vendor lock-in.',
    clouds: [
      { name: 'AWS', status: 'Production Ready', icon: '🟠', features: ['Полная поддержка', 'Все модули', 'Оптимизированные шаблоны'] },
      { name: 'GCP', status: 'Beta', icon: '🔵', features: ['Основные модули', 'GKE поддержка', 'Cloud SQL'] },
      { name: 'Azure', status: 'Скоро Q3', icon: '🟦', features: ['AKS поддержка', 'Azure SQL', 'Key Vault'] },
      { name: 'Multi-Cloud', status: 'Скоро Q4', icon: '🌐', features: ['Crossplane', 'Hybrid deployments', 'DR across clouds'] },
    ],
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">{tr.title}</h2>
      <p className="text-gray-400 mb-8">{tr.desc}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tr.clouds.map((cloud, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{cloud.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-100">{cloud.name}</h3>
                <span className="text-xs text-emerald-400">{cloud.status}</span>
              </div>
            </div>
            <ul className="space-y-2">
              {cloud.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-emerald-400">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 6. Auto Pentest
function AutoPentest() {
  const { language } = useLanguage();

  const tr = language === 'en' ? {
    title: 'Automated Penetration Testing',
    desc: 'Schedule and run automated pentests against your infrastructure. Get detailed reports and remediation guidance.',
    schedule: 'Schedule',
    providers: 'Integrated Providers',
    lastRun: 'Last Run',
    findings: 'Findings',
    items: [
      { provider: 'Cobalt', type: 'Pentest-as-a-Service', status: 'Active', findings: 0 },
      { provider: 'HackerOne', type: 'Bug Bounty', status: 'Active', findings: 2 },
      { provider: 'Synack', type: 'Crowdsourced Security', status: 'Scheduled', findings: 0 },
    ],
  } : {
    title: 'Автоматизированные пентесты',
    desc: 'Планируйте и запускайте автоматические пентесты против вашей инфраструктуры. Получайте детальные отчёты и рекомендации по устранению.',
    schedule: 'Расписание',
    providers: 'Интегрированные провайдеры',
    lastRun: 'Последний запуск',
    findings: 'Находки',
    items: [
      { provider: 'Cobalt', type: 'Pentest-as-a-Service', status: 'Активен', findings: 0 },
      { provider: 'HackerOne', type: 'Bug Bounty', status: 'Активен', findings: 2 },
      { provider: 'Synack', type: 'Crowdsourced Security', status: 'Запланирован', findings: 0 },
    ],
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">{tr.title}</h2>
      <p className="text-gray-400 mb-8">{tr.desc}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-sm text-gray-400 mb-2">{tr.schedule}</div>
          <div className="text-2xl font-bold text-cyan-400">Quarterly</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-sm text-gray-400 mb-2">{tr.lastRun}</div>
          <div className="text-2xl font-bold text-emerald-400">2 days ago</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-sm text-gray-400 mb-2">{tr.findings}</div>
          <div className="text-2xl font-bold text-orange-400">2 (Low)</div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-200 mb-4">{tr.providers}</h3>
      <div className="space-y-3">
        {tr.items.map((item, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="text-gray-200 font-medium">{item.provider}</div>
              <div className="text-xs text-gray-500">{item.type}</div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">{item.findings} findings</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'
              }`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. Real-Time Monitor
function RealTimeMonitor() {
  const { language } = useLanguage();

  const tr = language === 'en' ? {
    title: 'Real-Time Compliance Monitoring',
    desc: 'Continuous policy enforcement in your cluster. OPA Policy Server evaluates every request and blocks violations in real-time.',
    metrics: [
      { label: 'Requests Evaluated', value: '1.2M', trend: '+12%' },
      { label: 'Violations Blocked', value: '47', trend: '-8%' },
      { label: 'Policy Hit Rate', value: '99.9%', trend: '+0.1%' },
      { label: 'Avg Latency', value: '2.3ms', trend: '-0.2ms' },
    ],
    recentEvents: [
      { time: '2 min ago', event: 'Blocked: S3 bucket without encryption', severity: 'high' },
      { time: '15 min ago', event: 'Allowed: Pod with security context', severity: 'low' },
      { time: '1 hour ago', event: 'Blocked: IAM policy with wildcard', severity: 'high' },
      { time: '3 hours ago', event: 'Allowed: VPC with flow logs enabled', severity: 'low' },
    ],
  } : {
    title: 'Real-Time Compliance Monitoring',
    desc: 'Непрерывное применение политик в вашем кластере. OPA Policy Server оценивает каждый запрос и блокирует нарушения в реальном времени.',
    metrics: [
      { label: 'Оценено запросов', value: '1.2M', trend: '+12%' },
      { label: 'Заблокировано нарушений', value: '47', trend: '-8%' },
      { label: 'Policy Hit Rate', value: '99.9%', trend: '+0.1%' },
      { label: 'Средняя задержка', value: '2.3ms', trend: '-0.2ms' },
    ],
    recentEvents: [
      { time: '2 мин назад', event: 'Заблокировано: S3 bucket без шифрования', severity: 'high' },
      { time: '15 мин назад', event: 'Разрешено: Pod с security context', severity: 'low' },
      { time: '1 час назад', event: 'Заблокировано: IAM policy с wildcard', severity: 'high' },
      { time: '3 часа назад', event: 'Разрешено: VPC с flow logs', severity: 'low' },
    ],
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">{tr.title}</h2>
      <p className="text-gray-400 mb-8">{tr.desc}</p>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {tr.metrics.map((metric, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{metric.value}</div>
            <div className="text-xs text-gray-400 mt-1">{metric.label}</div>
            <div className="text-xs text-cyan-400 mt-1">{metric.trend}</div>
          </div>
        ))}
      </div>

      {/* Recent Events */}
      <h3 className="text-lg font-bold text-gray-200 mb-4">Recent Events</h3>
      <div className="space-y-2">
        {tr.recentEvents.map((event, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                event.severity === 'high' ? 'bg-red-400' : 'bg-emerald-400'
              }`} />
              <span className="text-sm text-gray-300">{event.event}</span>
            </div>
            <span className="text-xs text-gray-500">{event.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 8. Compliance-as-a-Service
function ComplianceAsAService() {
  const { language } = useLanguage();

  const tr = language === 'en' ? {
    title: 'Compliance-as-a-Service (CaaS)',
    desc: 'We manage your compliance so you can focus on your product. Our team of experts handles audits, evidence collection, and regulatory changes.',
    plans: [
      {
        name: 'Starter',
        price: '$8K/mo',
        features: ['Quarterly audit prep', 'Evidence collection', 'Email support', '1 framework'],
      },
      {
        name: 'Professional',
        price: '$12K/mo',
        popular: true,
        features: ['Continuous monitoring', 'QSA coordination', 'Slack support', '3 frameworks', 'Regulatory updates'],
      },
      {
        name: 'Enterprise',
        price: '$15K/mo',
        features: ['24/7 support', 'Dedicated CISO', 'All frameworks', 'Custom policies', 'Incident response'],
      },
    ],
  } : {
    title: 'Compliance-as-a-Service (CaaS)',
    desc: 'Мы управляем вашим compliance, чтобы вы могли фокусироваться на продукте. Наша команда экспертов обрабатывает аудиты, сбор evidence и регуляторные изменения.',
    plans: [
      {
        name: 'Starter',
        price: '$8K/мес',
        features: ['Подготовка к квартальному аудиту', 'Сбор evidence', 'Email поддержка', '1 фреймворк'],
      },
      {
        name: 'Professional',
        price: '$12K/мес',
        popular: true,
        features: ['Непрерывный мониторинг', 'Координация с QSA', 'Slack поддержка', '3 фреймворка', 'Регуляторные обновления'],
      },
      {
        name: 'Enterprise',
        price: '$15K/мес',
        features: ['24/7 поддержка', 'Выделенный CISO', 'Все фреймворки', 'Кастомные политики', 'Incident response'],
      },
    ],
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">{tr.title}</h2>
      <p className="text-gray-400 mb-8">{tr.desc}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tr.plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative bg-gray-800 border rounded-xl p-6 ${
              plan.popular ? 'border-emerald-500/50' : 'border-gray-700'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 rounded-full text-xs font-bold text-gray-900">
                POPULAR
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-100 mb-2">{plan.name}</h3>
            <div className="text-3xl font-bold text-emerald-400 mb-4">{plan.price}</div>
            <ul className="space-y-2">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className={`w-full mt-6 px-4 py-2 rounded-lg font-medium ${
              plan.popular
                ? 'bg-emerald-500 text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}>
              Get Started
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
