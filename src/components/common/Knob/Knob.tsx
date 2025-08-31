// src/components/common/Knob/Knob.tsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './Knob.module.scss';

interface KnobProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
}

const Knob: React.FC<KnobProps> = ({ label, value, onChange, min = 0, max = 1 }) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging || !knobRef.current) return;

      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
      
      // Mapeia o ângulo para o valor
      let normalizedAngle = angle < -90 ? angle + 450 : angle + 90;
      if (normalizedAngle > 270) normalizedAngle = 270;
      if (normalizedAngle < 0) normalizedAngle = 0;
      
      const newValue = (normalizedAngle / 270) * (max - min) + min;
      onChange(newValue);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, min, max, onChange]);

  const rotation = ((value - min) / (max - min)) * 270 - 135;

  return (
    <div className={styles.knobContainer}>
      <div className={styles.knob} ref={knobRef} onMouseDown={handleMouseDown}>
        <div className={styles.dial} style={{ transform: `rotate(${rotation}deg)` }}></div>
      </div>
      <label className={styles.label}>{label}</label>
    </div>
  );
};

export default Knob;