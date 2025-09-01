// src/pages/Studio/components/TransportControls/TransportControls.tsx
import React from 'react';
import styles from './TransportControls.module.scss';
import { type Track } from '../PianoRoll/PianoRoll';
import Slider from '../../../../components/common/Slider/Slider';
import * as Tone from 'tone';

const PlayIcon = () => <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>;
const PauseIcon = () => <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;

interface TransportControlsProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  bpm: number;
  onBpmChange: (newBpm: number) => void;
  tracks: Track[];
}

const TransportControls: React.FC<TransportControlsProps> = ({ isPlaying, setIsPlaying, bpm, onBpmChange, tracks }) => {
  
  const handlePlayPause = async () => {
    // CORREÇÃO: Garante que o AudioContext está ativo antes de tocar
    if (Tone.context.state === 'suspended') {
      await Tone.start();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    Tone.getDestination().volume.value = Tone.gainToDb(newVolume);
  };

  const handleExport = () => {
    if (tracks.length === 0) {
      alert("Adicione algumas notas antes de exportar!");
      return;
    }
    alert("Funcionalidade de exportação em desenvolvimento!");
  };

  return (
    <div className={styles.transportContainer}>
      <button onClick={handlePlayPause} className={styles.playButton}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      
      <div className={styles.bpmControl}>
        <label>BPM</label>
        <input 
          type="number" 
          value={bpm}
          onChange={(e) => onBpmChange(parseInt(e.target.value, 10) || 120)}
          min="60"
          max="240"
        />
      </div>

      <div className={styles.volumeControl}>
        <Slider label="Volume" defaultValue={0.5} onChange={handleVolumeChange} />
      </div>

      <button onClick={handleExport} className={styles.exportButton}>Exportar</button>
    </div>
  );
};

export default TransportControls;