// src/pages/Studio/components/TransportControls/TransportControls.tsx
import React, { useState, useEffect } from 'react';
import styles from './TransportControls.module.scss';
import type WaveSurfer from 'wavesurfer.js';
import type { AudioGraph } from '../Timeline/Timeline';
import Slider from '../../../../components/common/Slider/Slider';
import TimeDisplay from '../TimeDisplay/TimeDisplay';

const PlayIcon = () => <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>;
const PauseIcon = () => <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;

interface TransportControlsProps {
  wavesurfer: WaveSurfer | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  isSynthMode: boolean;
  audioGraph: AudioGraph | null;
  bpm: number; // Nova prop
  onBpmChange: (newBpm: number) => void; // Nova prop
}

const TransportControls: React.FC<TransportControlsProps> = ({ wavesurfer, isPlaying, setIsPlaying, isSynthMode, audioGraph, bpm, onBpmChange }) => {
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!wavesurfer) return;
    const subscriptions = [
      wavesurfer.on('play', () => setIsPlaying(true)),
      wavesurfer.on('pause', () => setIsPlaying(false)),
      wavesurfer.on('finish', () => setIsPlaying(false)),
      wavesurfer.on('audioprocess', (time) => setCurrentTime(time)),
      wavesurfer.on('ready', () => setDuration(wavesurfer.getDuration())),
    ];
    return () => {
      subscriptions.forEach(unsub => unsub());
    };
  }, [wavesurfer, setIsPlaying]);

  const handlePlayPause = () => {
    if (isSynthMode) {
      setIsPlaying(!isPlaying);
    } else {
      wavesurfer?.playPause();
    }
  };
  
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (wavesurfer) wavesurfer.setVolume(newVolume);
    if (audioGraph) audioGraph.gainNode.gain.value = newVolume;
  };

  return (
    <div className={styles.transportContainer}>
      <button 
        onClick={handlePlayPause} 
        className={styles.playButton} 
        disabled={isSynthMode ? !audioGraph : !wavesurfer}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      
      {!isSynthMode && <TimeDisplay currentTime={currentTime} duration={duration} />}
      
      {/* Controle de BPM */}
      <div className={styles.bpmControl}>
        <label>BPM</label>
        <input 
          type="number" 
          value={bpm}
          onChange={(e) => onBpmChange(parseInt(e.target.value, 10))}
          min="60"
          max="240"
        />
      </div>

      <div className={styles.volumeControl}>
        <Slider label="Volume" value={volume} onChange={handleVolumeChange} />
      </div>
    </div>
  );
};

export default TransportControls;