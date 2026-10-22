import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface PriorityItem {
  num: number;
  block: string;
  impact: string;
  impactColor: string;
  complexity: string;
  complexityColor: string;
  timeline: string;
  timelineColor: string;
  description: string;
}

const priorities: PriorityItem[] = [
  {
    num: 1,
    block: 'Supply Chain Security',
    impact: '🔴 Блокер для enterprise',
    impactColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    complexity: 'Средняя',
    complexityColor: 'bg-yellow-500/20 text-yellow-400',
    timeline: 'Сейчас',
    timelineColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'SBOM, SLSA, подписи артефактов. Без этого enterprise не подпишет контракт.'
  },
  {
    num: 2,
    block: 'Observability Pack',
    impact: '🔴 Усиливает «живой аудит»',
    impactColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    complexity: 'Средняя',
    complexityColor: 'bg-yellow-500/20 text-yellow-400',
    timeline: 'Сейчас',
    timelineColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'OpenTelemetry, Grafana dashboards, alerting rules. Непрерывный мониторинг compliance.'
  },
  {
    num: 3,
    block: 'Multi-cloud / on-prem',
    impact: '🔴 Блокер для РФ и EU',
    impactColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    complexity: 'Высокая',
    complexityColor: 'bg-red-500/20 text-red-400',
    timeline: 'Q1–Q2 2026',
    timelineColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    description: 'Поддержка GCP, Azure, Yandex Cloud, on-prem. Критично для geo-compliance.'
  },
  {
    num: 4,
    block: 'FinOps',
    impact: '🟡 Ускоряет CFO-сделки',
    impactColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    complexity: 'Низкая',
    complexityColor: 'bg-emerald-500/20 text-emerald-400',
    timeline: 'Q1 2026',
    timelineColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'Cost optimization, budget alerts, resource rightsizing. Быстрый ROI для клиента.'
  },
  {
    num: 5,
    block: 'API Gateway',
    impact: '🟡 Улучшает DX',
    impactColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    complexity: 'Низкая',
    complexityColor: 'bg-emerald-500/20 text-emerald-400',
    timeline: 'Q2 2026',
    timelineColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    description: 'Kong/Traefik/Ory интеграция. Rate limiting, auth, API versioning.'
  },
  {
    num: 6,
    block: 'Testing (расширение)',
    impact: '🟡 Доверие к фабрике',
    impactColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    complexity: 'Средняя',
    complexityColor: 'bg-yellow-500/20 text-yellow-400',
    timeline: 'Q1 2026',
    timelineColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'Integration tests, property-based tests, chaos testing. Гарантия качества.'
  },
  {
    num: 7,
    block: 'Migration Tooling',
    impact: '🟡 Открывает сегмент №4',
    impactColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    complexity: 'Высокая',
    complexityColor: 'bg-red-500/20 text-red-400',
    timeline: 'Q2–Q3 2026',
    timelineColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    description: 'Legacy migration wizards, dual-write, reconciliation. Банки — наш сегмент.'
  },
  {
    num: 8,
    block: 'Health Check (P0)',
    impact: '🟡 Входной продукт',
    impactColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    complexity: 'Низкая',
    complexityColor: 'bg-emerald-500/20 text-emerald-400',
    timeline: 'Q1 2026',
    timelineColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'Быстрая проверка инфраструктуры на compliance gaps. Lead magnet для продаж.'
  },
  {
    num: 9,
    block: 'Versioning',
    impact: '🟢 MRR-модель',
    impactColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    complexity: 'Низкая',
    complexityColor: 'bg-emerald-500/20 text-emerald-400',
    timeline: 'Q2 2026',
    timelineColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    description: 'Семантическое версионирование модулей, changelog, upgrade paths. Основа для MRR.'
  }
];

export function Roadmap() {
  const { language } = useLanguage();

  const tr = language === 'en' ? {
    badge: 'Priority Map — 9 Strategic Blocks',
    title: 'Final Priority Map',
    subtitle: 'From Factory v2.0 to Platform Company. Each block is either a sales blocker or an MRR driver.',
    headers: { num: '#', block: 'Block', impact: 'Sales Impact', complexity: 'Complexity', timeline: 'When to do' },
    legend: { impact: 'Impact:', blocker: 'Blocker', accelerator: 'Accelerator', mrr: 'MRR Driver', complexity: 'Complexity:', low: 'Low', medium: 'Medium', high: 'High', timeline: 'Timeline:', now: 'Now', q1: 'Q1 2026', q2: 'Q2 2026', q3: 'Q3 2026' },
    summary: { title: '📊 Summary', blockers: '3 sales blockers', accelerators: '5 accelerators', mrr: '1 MRR driver', total: '9 strategic blocks' }
  } : {
    badge: 'Карта приоритетов — 9 стратегических блоков',
    title: 'Итоговая карта приоритетов',
    subtitle: 'От Factory v2.0 к Platform Company. Каждый блок — это либо блокер продаж, либо MRR-драйвер.',
    headers: { num: '№', block: 'Блок', impact: 'Влияние на продажи', complexity: 'Сложность', timeline: 'Когда делать' },
    legend: { impact: 'Влияние:', blocker: 'Блокер', accelerator: 'Ускоритель', mrr: 'MRR-драйвер', complexity: 'Сложность:', low: 'Низкая', medium: 'Средняя', high: 'Высокая', timeline: 'Сроки:', now: 'Сейчас', q1: 'Q1 2026', q2: 'Q2 2026', q3: 'Q3 2026' },
    summary: { title: '📊 Итоговая сводка', blockers: '3 блокера продаж', accelerators: '5 ускорителей', mrr: '1 MRR-драйвер', total: '9 стратегических блоков' }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6"
        >
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <span className="text-amber-400 text-sm font-medium">{tr.badge}</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">{tr.title}</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">{tr.subtitle}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-red-400">3</div>
          <div className="text-xs text-gray-400 mt-1">{tr.summary.blockers}</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400">5</div>
          <div className="text-xs text-gray-400 mt-1">{tr.summary.accelerators}</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-emerald-400">1</div>
          <div className="text-xs text-gray-400 mt-1">{tr.summary.mrr}</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-cyan-400">9</div>
          <div className="text-xs text-gray-400 mt-1">{tr.summary.total}</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-8"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-12">{tr.headers.num}</th>
                <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{tr.headers.block}</th>
                <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{tr.headers.impact}</th>
                <th className="text-center py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{tr.headers.complexity}</th>
                <th className="text-center py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{tr.headers.timeline}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {priorities.map((item, i) => (
                <motion.tr
                  key={item.num}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      item.impact.includes('🔴') ? 'bg-red-500/20 text-red-400' :
                      item.impact.includes('🟡') ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {item.num}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-100">{item.block}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${item.impactColor}`}>
                      {item.impact}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-3 py-1 rounded text-xs ${item.complexityColor}`}>
                      {item.complexity}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${item.timelineColor}`}>
                      {item.timeline}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
