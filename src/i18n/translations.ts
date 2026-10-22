export type Language = 'en' | 'ru';

export const translations = {
  en: {
    nav: { overview: 'Overview', tree: 'File Tree', pipeline: 'Pipeline', architecture: 'Architecture', spec: 'Spec Editor', bootstrap: 'Bootstrap', download: 'Get Infrastructure', platform: 'Platform' },
    tree: { title: 'Project Structure' },
    hero: { badge: 'v1.1 — Production Ready', title1: 'LedgerCore', title2: 'Factory' },
  },
  ru: {
    nav: { overview: 'Обзор', tree: 'Дерево файлов', pipeline: 'Конвейер', architecture: 'Архитектура', spec: 'Редактор Spec', bootstrap: 'Запуск', download: 'Получить инфраструктуру', platform: 'Платформа' },
    tree: { title: 'Структура проекта' },
    hero: { badge: 'v1.1 — Готово к продакшену', title1: 'LedgerCore', title2: 'Factory' },
  }
};
