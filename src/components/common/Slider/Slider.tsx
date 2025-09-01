// src/components/common/Slider/Slider.tsx
import React from 'react';
import styles from './Slider.module.scss';

interface SliderProps {
  label: string;
  value?: number; // value agora é opcional
  defaultValue?: number; // Nova prop
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const Slider: React.FC<SliderProps> = ({ label, value, defaultValue, onChange, min = 0, max = 1, step = 0.01, disabled = false }) => {
  return (
    <div className={styles.sliderContainer}>
      <label className={styles.label}>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        defaultValue={defaultValue} // Adicionado aqui
        onChange={onChange}
        className={styles.slider}
        disabled={disabled}
      />
    </div>
  );
};

export default Slider;