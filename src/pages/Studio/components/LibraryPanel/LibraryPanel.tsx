// src/pages/Studio/components/LibraryPanel/LibraryPanel.tsx
import React from 'react';
import styles from './LibraryPanel.module.scss';

// Usamos tipos de oscilador 'fat' que são compatíveis com o PolySynth.
export const INSTRUMENTS = {
  saw: { name: 'Saw Synth', type: 'fatsawtooth' },
  sine: { name: 'Sine Synth', type: 'fatsine' },
  square: { name: 'Square Synth', type: 'fatsquare' },
  drumkit: { name: 'Drum Kit', type: 'sampler' },
} as const;

export type InstrumentType = keyof typeof INSTRUMENTS;

interface LibraryPanelProps {
  onAddTrack: (instrument: InstrumentType) => void;
}

const LibraryPanel: React.FC<LibraryPanelProps> = ({ onAddTrack }) => {
  return (
    <aside className={styles.libraryPanel}>
      <div className={styles.header}>
          <h3>Instrumentos</h3>
      </div>
      <div className={styles.instrumentList}>
        {Object.entries(INSTRUMENTS).map(([key, { name }]) => (
          <button 
            key={key} 
            onClick={() => onAddTrack(key as InstrumentType)}
            className={styles.instrumentButton}
          >
            + {name}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default LibraryPanel;