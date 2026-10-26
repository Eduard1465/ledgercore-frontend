import { MemoryEntry } from './types';

export class AgentMemory {
  private entries: MemoryEntry[] = [];

  constructor() {
    this.load();
  }

  private load() {
    try {
      const saved = localStorage.getItem('agent-memory');
      if (saved) this.entries = JSON.parse(saved);
    } catch {}
  }

  private save() {
    try {
      localStorage.setItem('agent-memory', JSON.stringify(this.entries));
    } catch {}
  }

  add(key: string, value: string) {
    const existing = this.entries.findIndex(e => e.key.toLowerCase() === key.toLowerCase());
    if (existing >= 0) {
      this.entries[existing].value = value;
      this.entries[existing].timestamp = new Date();
    } else {
      this.entries.push({ key, value, timestamp: new Date() });
    }
    this.save();
  }

  get(key: string): string | null {
    const entry = this.entries.find(e => e.key.toLowerCase() === key.toLowerCase());
    return entry ? entry.value : null;
  }

  getAll(): MemoryEntry[] {
    return [...this.entries];
  }

  remove(key: string) {
    this.entries = this.entries.filter(e => e.key.toLowerCase() !== key.toLowerCase());
    this.save();
  }

  clear() {
    this.entries = [];
    this.save();
  }

  extractFacts(message: string): { key: string; value: string }[] {
    const facts: { key: string; value: string }[] = [];
    const nameMatch = message.match(/(?:меня зовут|моё имя|my name is|i am|i'm)\s+([A-ZА-Я][a-zа-я]+)/i);
    if (nameMatch) facts.push({ key: 'Имя', value: nameMatch[1] });
    return facts;
  }
}

export const agentMemory = new AgentMemory();
