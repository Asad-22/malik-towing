import type { SiteSetting } from '@/lib/types';

export function createSettingsReader(settings: SiteSetting[]) {
  const values = new Map(settings.map((setting) => [setting.key, setting.value]));

  return {
    text(key: string): string {
      const value = values.get(key);
      return typeof value === 'string' ? value : '';
    },
    list(key: string): string[] {
      const value = values.get(key);
      if (!Array.isArray(value)) return [];
      return value.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
    },
    flag(key: string): boolean {
      return values.get(key) === true;
    },
    number(key: string): number {
      const value = values.get(key);
      return typeof value === 'number' ? value : Number.NaN;
    },
  };
}

export type SettingsReader = ReturnType<typeof createSettingsReader>;
