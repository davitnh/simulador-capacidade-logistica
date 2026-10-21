import type { CSSProperties } from 'react';
import { MAX_ORDERS } from '../lib/simulation';
import type { InputKey } from '../lib/simulation';

interface CapacitySliderProps {
  id: InputKey;
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const number = new Intl.NumberFormat('pt-BR');

export default function CapacitySlider({ id, label, value, onChange }: CapacitySliderProps) {
  const rangeStyle = { '--range-fill': `${(value / MAX_ORDERS) * 100}%` } as CSSProperties;

  return (
    <div className="slider-field">
      <div className="slider-heading">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{number.format(value)}</output>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={MAX_ORDERS}
        step={500}
        value={value}
        style={rangeStyle}
        aria-valuetext={`${number.format(value)} pedidos por dia`}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </div>
  );
}
