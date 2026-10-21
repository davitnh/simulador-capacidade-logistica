import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import CapacitySlider from './CapacitySlider';
import {
  INPUT_KEYS,
  LABELS,
  PRESETS,
  SUBJECTS,
  calculateSimulation,
} from '../lib/simulation';
import type {
  InputKey,
  PresetName,
  SimulationResult,
  SimulationValues,
} from '../lib/simulation';

const number = new Intl.NumberFormat('pt-BR');

const SLIDER_LABELS: Record<InputKey, string> = {
  demand: 'Pedidos recebidos',
  collect: 'Capacidade de coleta',
  hub: 'Capacidade dos hubs',
  fleet: 'Capacidade da frota',
  partners: 'Capacidade dos parceiros',
};

function getMessage(result: SimulationResult) {
  if (result.state === 'backlog') {
    if (result.limitingStages.length > 1) {
      return `Mais de uma etapa limita o fluxo a ${number.format(result.effectiveCapacity)} pedidos por dia. Mantido o volume por três dias, o backlog estimado chega a ${number.format(result.backlog)} pedidos.`;
    }
    const stage = result.limitingStages[0];
    return `${SUBJECTS[stage]} o fluxo a ${number.format(result.effectiveCapacity)} pedidos por dia. Mantido o volume por três dias, o backlog estimado chega a ${number.format(result.backlog)} pedidos.`;
  }
  if (result.state === 'limit') {
    return 'A operação atende à demanda diária, mas uma ou mais etapas estão sem folga. Um aumento de pedidos pode gerar backlog.';
  }
  return 'Todas as etapas conseguem atender à demanda diária neste cenário. Continue monitorando as capacidades durante o pico.';
}

export default function CapacitySimulator() {
  const [values, setValues] = useState<SimulationValues>({ ...PRESETS.peak });
  const [activePreset, setActivePreset] = useState<PresetName | null>('peak');
  const result = useMemo(() => calculateSimulation(values), [values]);
  const scale = Math.max(1, ...INPUT_KEYS.map((key) => values[key]));

  const selectPreset = (preset: PresetName) => {
    setValues({ ...PRESETS[preset] });
    setActivePreset(preset);
  };

  const updateValue = (key: InputKey, value: number) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setActivePreset(null);
  };

  const status = result.state === 'backlog'
    ? result.limitingStages.length > 1
      ? 'Atenção: múltiplas etapas'
      : `Atenção: ${LABELS[result.limitingStages[0]].toLowerCase()}`
    : result.state === 'limit'
      ? 'Operação no limite'
      : 'Capacidade suficiente';

  const chartLabel = INPUT_KEYS.map((key) => `${LABELS[key]}: ${number.format(values[key])} pedidos por dia`).join('; ');

  return (
    <main className="simulator" aria-label="Simulador de capacidade logística">
      <div className="simulator-grid">
        <section className="controls" aria-labelledby="controls-title">
          <div className="panel-topline">
            <span className="eyebrow">Simulador de capacidade</span>
            <span className="scenario-label">Cenário ilustrativo</span>
          </div>
          <h1 id="controls-title">Teste um cenário de pico</h1>
          <p className="controls-description">Valores em pedidos por dia. Ajuste cada capacidade.</p>

          <div className="presets" role="group" aria-label="Cenários predefinidos">
            <button type="button" className={`preset${activePreset === 'peak' ? ' is-active' : ''}`} aria-pressed={activePreset === 'peak'} onClick={() => selectPreset('peak')}>Pico de demanda</button>
            <button type="button" className={`preset${activePreset === 'balanced' ? ' is-active' : ''}`} aria-pressed={activePreset === 'balanced'} onClick={() => selectPreset('balanced')}>Operação equilibrada</button>
          </div>

          <div className="sliders">
            {INPUT_KEYS.map((key) => (
              <CapacitySlider key={key} id={key} label={SLIDER_LABELS[key]} value={values[key]} onChange={(value) => updateValue(key, value)} />
            ))}
          </div>
        </section>

        <section className="results" aria-labelledby="results-title">
          <div className="results-topline">
            <span className="results-eyebrow" id="results-title">Leitura do cenário</span>
            <span className={`status${result.state === 'ok' ? ' is-ok' : result.state === 'limit' ? ' is-limit' : ''}`}>{status}</span>
          </div>

          <div className="chart-heading">
            <h2>Demanda e capacidade por etapa</h2>
            <span>pedidos/dia</span>
          </div>
          <div className="flow-bars" role="img" aria-label={chartLabel}>
            {INPUT_KEYS.map((key) => {
              const bottleneck = result.state === 'backlog' && key !== 'demand' && result.limitingStages.includes(key);
              const barStyle = { '--bar-width': `${(values[key] / scale) * 100}%` } as CSSProperties;
              return (
                <div className={`flow-row${bottleneck ? ' is-bottleneck' : ''}`} key={key}>
                  <span className="flow-row-label">{LABELS[key]}</span>
                  <span className="flow-track" aria-hidden="true"><span className="flow-fill" style={barStyle} /></span>
                  <strong className="flow-row-value">{number.format(values[key])}</strong>
                </div>
              );
            })}
          </div>

          <div className="result-summary" aria-live="polite" aria-atomic="true">
            <div className="metric metric-backlog">
              <span className="metric-label">Backlog estimado em 3 dias</span>
              <strong>{number.format(result.backlog)}</strong>
              <span className="metric-unit">pedidos acumulados</span>
            </div>
            <div className="metric metric-capacity">
              <span className="metric-label">Capacidade efetiva</span>
              <strong>{number.format(result.effectiveCapacity)}</strong>
              <span className="metric-unit">pedidos por dia</span>
            </div>
          </div>
          <p className="insight">{getMessage(result)}</p>
        </section>
      </div>

      <p className="disclaimer">Simulação ilustrativa. Demanda e capacidades constantes por três dias, sem recuperação de pendências. Não representa resultados da Envoy ou de seus clientes.</p>
    </main>
  );
}
