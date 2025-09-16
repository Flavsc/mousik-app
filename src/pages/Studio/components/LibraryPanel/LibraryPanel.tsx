// src/pages/Studio/components/LibraryPanel/LibraryPanel.tsx
import React from 'react';
import styles from './LibraryPanel.module.scss';

export const INSTRUMENTS = {
  saw: { name: 'Sintetizador Clássico', type: 'polysynth' },
  sine: { name: 'Sintetizador Etéreo', type: 'polysynth' },
  square: { name: 'Sintetizador 8-bit', type: 'polysynth' },
  bass: { name: 'Baixo Sintetizado', type: 'monosynth' },
  guitar: { name: 'Arpejo de Cordas', type: 'pluck' },
  lead: { name: 'Solo Melódico', type: 'fmsynth' },
  drumkit: { name: 'Bateria', type: 'sampler' },
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