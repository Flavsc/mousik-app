// src/components/common/Slider/Slider.tsx
import React from 'react';
import styles from './Slider.module.scss';

interface SliderProps {
  label: string;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean; // CORREÇÃO: Adicione a prop disabled
}

const Slider: React.FC<SliderProps> = ({ label, value, onChange, min = 0, max = 1, step = 0.01, disabled = false }) => {
  return (
    <div className={styles.sliderContainer}>
      <label className={styles.label}>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={styles.slider}
        disabled={disabled} // CORREÇÃO: Passe a prop para o input
      />
    </div>
  );
};

export default Slider;