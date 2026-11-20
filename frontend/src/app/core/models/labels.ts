import { GameStatus, InquiryType, JobDepartment } from './api.models';

export const GAME_STATUS_LABELS: Record<GameStatus, string> = {
  vydane: 'Vydané',
  vo_vyvoji: 'Vo vývoji',
  early_access: 'Predbežný prístup',
  oznamene: 'Oznámené',
};

export const DEPARTMENT_LABELS: Record<JobDepartment, string> = {
  programovanie: 'Programovanie',
  art_animacie: 'Art & Animácie',
  dizajn: 'Game Dizajn',
  produkcia: 'Produkcia & QA',
};

export const INQUIRY_TYPE_LABELS: Record<InquiryType, string> = {
  co_development: 'Co-development & Vývoj na mieru',
  publishing: 'Vydavateľský dopyt (Publisher)',
  press: 'Médiá a Press Kit',
  ine: 'Iný dopyt',
};

/** Platform filter codes understood by `GET /api/games/?platform=`. */
export const PLATFORM_FILTERS = [
  { code: 'pc', label: 'PC' },
  { code: 'ps5', label: 'PS5' },
  { code: 'xbox', label: 'Xbox' },
  { code: 'switch', label: 'Switch' },
] as const;

export type PlatformCode = (typeof PLATFORM_FILTERS)[number]['code'];

/** Short engine tag shown on cards. */
export function engineTag(engine: string): string {
  if (engine.startsWith('Unreal')) return 'UE5';
  if (engine.startsWith('Unity')) return 'Unity';
  return 'C++ Engine';
}

/** Compact platform label for badges. */
export function platformShort(platform: string): string {
  if (platform.startsWith('PC')) return 'PC';
  if (platform.startsWith('PlayStation')) return 'PS5';
  if (platform.startsWith('Xbox')) return 'Xbox';
  if (platform.includes('Switch')) return 'Switch';
  return platform;
}
