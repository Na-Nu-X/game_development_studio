/**
 * Pricing model for the co-development scope estimator.
 * All numbers are orientational and can be tuned per client here.
 */

export type ProjectTypeId = 'codev' | 'port' | 'prototype' | 'art';
export type EngineId = 'ue5' | 'unity' | 'custom';
export type RoleId = 'leadDev' | 'gameplayDev' | 'engineDev' | 'techArtist' | 'artist' | 'animator' | 'designer' | 'qa' | 'producer';

export interface ProjectTypeOption {
  readonly id: ProjectTypeId;
  readonly label: string;
  readonly hint: string;
  readonly rateMultiplier: number;
  /** Role weights in priority order – used to split the team size. */
  readonly roles: readonly (readonly [RoleId, number])[];
}

export interface EngineOption {
  readonly id: EngineId;
  readonly label: string;
  readonly rateMultiplier: number;
}

/** Blended monthly cost of one dedicated specialist (EUR, excl. VAT). */
export const BASE_MONTHLY_RATE_EUR = 5800;

export const TEAM_SIZE = { min: 2, max: 12, default: 4 } as const;

export const DURATIONS = [
  { months: 3, discount: 0 },
  { months: 6, discount: 0.03 },
  { months: 12, discount: 0.06 },
  { months: 18, discount: 0.09 },
] as const;

export type DurationMonths = (typeof DURATIONS)[number]['months'];

export const PROJECT_TYPES: readonly ProjectTypeOption[] = [
  {
    id: 'codev',
    label: 'Co-development / Rozšírenie tímu',
    hint: 'Seniorní vývojári priamo vo vašej pipeline',
    rateMultiplier: 1,
    roles: [
      ['leadDev', 0.4],
      ['techArtist', 0.2],
      ['gameplayDev', 0.2],
      ['qa', 0.1],
      ['producer', 0.1],
    ],
  },
  {
    id: 'port',
    label: 'Konzolový port (PS5 / Xbox / Switch)',
    hint: 'Optimalizácia, platformové funkcie a certifikácia',
    rateMultiplier: 1.08,
    roles: [
      ['engineDev', 0.45],
      ['qa', 0.25],
      ['techArtist', 0.15],
      ['producer', 0.15],
    ],
  },
  {
    id: 'prototype',
    label: 'Hrateľný prototyp / Vertical Slice',
    hint: 'Od nápadu k hrateľnému dôkazu pre vydavateľa',
    rateMultiplier: 1.12,
    roles: [
      ['gameplayDev', 0.3],
      ['designer', 0.2],
      ['artist', 0.2],
      ['techArtist', 0.1],
      ['animator', 0.1],
      ['producer', 0.1],
    ],
  },
  {
    id: 'art',
    label: '3D Art & Asset produkcia',
    hint: 'Prostredia, postavy, animácie a VFX',
    rateMultiplier: 0.86,
    roles: [
      ['artist', 0.5],
      ['animator', 0.2],
      ['techArtist', 0.2],
      ['producer', 0.1],
    ],
  },
];

export const ENGINES: readonly EngineOption[] = [
  { id: 'ue5', label: 'Unreal Engine 5', rateMultiplier: 1 },
  { id: 'unity', label: 'Unity', rateMultiplier: 0.95 },
  { id: 'custom', label: 'Vlastný engine', rateMultiplier: 1.15 },
];

export function roleLabel(role: RoleId, engine: EngineId): string {
  const lang = engine === 'unity' ? 'Unity C#' : 'C++';
  switch (role) {
    case 'leadDev':
      return `Senior ${lang} Dev`;
    case 'gameplayDev':
      return engine === 'unity' ? 'Gameplay C# Dev' : 'Gameplay C++ Dev';
    case 'engineDev':
      return engine === 'unity' ? 'Senior Unity Engine Dev' : 'Senior Engine C++ Dev';
    case 'techArtist':
      return 'Tech Artist';
    case 'artist':
      return '3D Artist';
    case 'animator':
      return 'Animátor';
    case 'designer':
      return 'Game Designer';
    case 'qa':
      return 'QA';
    case 'producer':
      return 'Producent';
  }
}

/**
 * Splits `size` people across weighted roles using the largest remainder
 * method, so the composition always sums exactly to the team size.
 */
export function composeTeam(
  roles: readonly (readonly [RoleId, number])[],
  size: number,
): { role: RoleId; count: number }[] {
  const raw = roles.map(([role, weight]) => ({ role, exact: weight * size }));
  const result = raw.map((r) => ({ role: r.role, count: Math.floor(r.exact), remainder: r.exact - Math.floor(r.exact) }));
  let missing = size - result.reduce((sum, r) => sum + r.count, 0);
  const byRemainder = [...result].sort((a, b) => b.remainder - a.remainder);
  for (const entry of byRemainder) {
    if (missing <= 0) break;
    entry.count += 1;
    missing -= 1;
  }
  return result.filter((r) => r.count > 0).map(({ role, count }) => ({ role, count }));
}

export function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}
