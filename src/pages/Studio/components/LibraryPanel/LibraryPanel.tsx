// src/pages/Studio/components/LibraryPanel/LibraryPanel.tsx
import React, { useRef } from 'react';
import styles from './LibraryPanel.module.scss';
import type { AudioGraph } from '../Timeline/Timeline';

// Definição dos nossos instrumentos
export const INSTRUMENTS = {
  saw: { name: 'Saw Synth', type: 'sawtooth' },
  sine: { name: 'Sine Synth', type: 'sine' },
  square: { name: 'Square Synth', type: 'square' },
} as const; // 'as const' para ter tipos mais estritos

export type InstrumentType = keyof typeof INSTRUMENTS;

interface LibraryPanelProps {
  onFileSelect: (file: File) => void;
  onSynthSelect: (instrument: InstrumentType) => void;
  audioGraph: AudioGraph | null;
}

const LibraryPanel: React.FC<LibraryPanelProps> = ({ onFileSelect, onSynthSelect, audioGraph }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <aside className={styles.libraryPanel}>
      <div className={styles.header}>
        <h3>Biblioteca</h3>
      </div>
      <div className={styles.actions}>
        <button onClick={handleUploadClick} className={styles.uploadButton}>
          Upload
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="audio/mp3, audio/wav"
        />
      </div>
      
      <div className={styles.header}>
          <h3>Instrumentos</h3>
      </div>
      <div className={styles.instrumentList}>
        {Object.entries(INSTRUMENTS).map(([key, { name }]) => (
          <button 
            key={key} 
            onClick={() => onSynthSelect(key as InstrumentType)}
            className={styles.instrumentButton}
            disabled={!audioGraph}
          >
            {name}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default LibraryPanel;