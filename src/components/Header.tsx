import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LanguageSwitcher } from './LanguageSwitcher';

interface Preset {
  id: string;
  name: string;
  target_icp: string;
  pain_point: string;
  kill_shot: string;
  spec: any;
}

interface HeaderProps {
  onLoadPreset?: (preset: Preset) => void;
}

export function Header({ onLoadPreset }: HeaderProps) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const presetFiles = ['baas-graduate', 'crypto-mica', 'bank-migration', 'si-delivery'];
    Promise.all(
      presetFiles.map(file =>
        fetch(`/presets/${file}.json`)
          .then(res => res.json())
          .catch(err => console.error(`Failed to load ${file}:`, err))
      )
    ).then(loadedPresets => {
      setPresets(loadedPresets.filter(p => p !== undefined));
    });
  }, []);

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPreset(e.target.value);
  };

  const handleLoadKillShot = () => {
    if (!selectedPreset) return;
    setIsLoading(true);
    const preset = presets.find(p => p.id === selectedPreset);
    if (preset && onLoadPreset) {
      setTimeout(() => {
        onLoadPreset(preset);
        setIsLoading(false);
        const pipelineElement = document.getElementById('pipeline-section');
        if (pipelineElement) {
          pipelineElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-gray-900 text-lg">
              LC
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                LedgerCore Factory
              </h1>
              <p className="text-xs text-gray-500">v2.0 Enterprise</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <div className="flex-1">
              <select
                value={selectedPreset}
                onChange={handlePresetChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="">Выберите сценарий...</option>
                {presets.map(preset => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name} — {preset.target_icp}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              onClick={handleLoadKillShot}
              disabled={!selectedPreset || isLoading}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold text-sm rounded-lg transition-all whitespace-nowrap"
              whileHover={{ scale: selectedPreset ? 1.05 : 1 }}
              whileTap={{ scale: selectedPreset ? 0.95 : 1 }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading...
                </span>
              ) : (
                '🎯 LOAD KILL SHOT'
              )}
            </motion.button>
          </div>

          <LanguageSwitcher />
        </div>

        {selectedPreset && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
          >
            <p className="text-sm text-emerald-400 font-medium mb-1">💡 Kill Shot:</p>
            <p className="text-sm text-gray-300">
              {presets.find(p => p.id === selectedPreset)?.kill_shot}
            </p>
          </motion.div>
        )}
      </div>
    </header>
  );
}
