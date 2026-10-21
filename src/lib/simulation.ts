export const INPUT_KEYS = ['demand', 'collect', 'hub', 'fleet', 'partners'] as const;
export const STAGE_KEYS = ['collect', 'hub', 'fleet', 'partners'] as const;

export type InputKey = (typeof INPUT_KEYS)[number];
export type StageKey = (typeof STAGE_KEYS)[number];
export type PresetName = 'peak' | 'balanced';

export type SimulationValues = Record<InputKey, number>;
export type ScenarioState = 'backlog' | 'limit' | 'ok';

export interface SimulationResult {
  effectiveCapacity: number;
  backlog: number;
  limitingStages: StageKey[];
  state: ScenarioState;
}

export const MAX_ORDERS = 20_000;
export const DAYS = 3;

export const PRESETS: Record<PresetName, SimulationValues> = {
  peak: { demand: 10_000, collect: 11_000, hub: 7_000, fleet: 10_000, partners: 12_000 },
  balanced: { demand: 10_000, collect: 12_000, hub: 11_500, fleet: 11_000, partners: 12_000 },
};

export const LABELS: Record<InputKey, string> = {
  demand: 'Pedidos',
  collect: 'Coleta',
  hub: 'Hubs',
  fleet: 'Frota',
  partners: 'Parceiros',
};

export const SUBJECTS: Record<StageKey, string> = {
  collect: 'A coleta limita',
  hub: 'Os hubs limitam',
  fleet: 'A frota limita',
  partners: 'Os parceiros limitam',
};

export function calculateSimulation(values: SimulationValues): SimulationResult {
  const lowestCapacity = Math.min(...STAGE_KEYS.map((key) => values[key]));
  const effectiveCapacity = Math.min(values.demand, lowestCapacity);
  const limitingStages = STAGE_KEYS.filter((key) => values[key] === lowestCapacity);

  return {
    effectiveCapacity,
    backlog: Math.max(0, values.demand - effectiveCapacity) * DAYS,
    limitingStages,
    state: lowestCapacity < values.demand ? 'backlog' : lowestCapacity === values.demand ? 'limit' : 'ok',
  };
}
