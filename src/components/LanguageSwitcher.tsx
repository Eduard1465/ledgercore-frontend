import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded text-sm ${language === 'en' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400'}`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ru')}
        className={`px-3 py-1 rounded text-sm ${language === 'ru' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400'}`}
      >
        RU
      </button>
    </div>
  );
}
