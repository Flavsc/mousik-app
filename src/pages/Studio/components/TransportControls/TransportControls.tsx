// src/pages/Studio/components/TransportControls/TransportControls.tsx
import React, { useState, useRef } from 'react';
import styles from './TransportControls.module.scss';
import { type Track } from '../PianoRoll/PianoRoll';
import Slider from '../../../../components/common/Slider/Slider';
import * as Tone from 'tone';
import RecordingProgress from '../../../../components/common/RecordingProgress/RecordingProgress';

const PlayIcon = () => <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>;
const PauseIcon = () => <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;

interface TransportControlsProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  bpm: number;
  onBpmChange: (newBpm: number) => void;
  tracks: Track[];
}

const TransportControls: React.FC<TransportControlsProps> = ({ isPlaying, setIsPlaying, isRecording, setIsRecording, bpm, onBpmChange, tracks }) => {
  const recorder = useRef<Tone.Recorder | null>(null);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const progressIntervalRef = useRef<number | null>(null);

  const handlePlayPause = async () => {
    if (Tone.context.state === 'suspended') {
      await Tone.start();
    }
    if (isRecording) {
      setIsRecording(false);
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    Tone.getDestination().volume.value = Tone.gainToDb(newVolume);
  };

  const handleExport = async () => {
    if (isRecording || tracks.length === 0) {
      alert("Adicione notas à sequência antes de exportar.");
      return;
    }

    if (!recorder.current) {
        recorder.current = new Tone.Recorder();
        Tone.getDestination().connect(recorder.current);
    }

    setIsRecording(true);
    setIsPlaying(true);
    
    recorder.current.start();

    const NUM_STEPS = 32;
    const sixteenthNoteDuration = Tone.Time('16n').toSeconds();
    const sequenceDurationInSeconds = NUM_STEPS * sixteenthNoteDuration;

    // Inicia um intervalo para atualizar o progresso
    progressIntervalRef.current = window.setInterval(() => {
      const progress = (Tone.Transport.seconds / sequenceDurationInSeconds) * 100;
      setRecordingProgress(progress);
    }, 100); // Atualiza a cada 100ms

    Tone.Transport.scheduleOnce(async () => {
      const recording = await recorder.current?.stop();
      
      Tone.Transport.stop();
      setIsPlaying(false);
      setIsRecording(false);
      setRecordingProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      if (recording) {
        const url = URL.createObjectURL(recording);
        const anchor = document.createElement("a");
        anchor.download = "mousik-export.webm";
        anchor.href = url;
        anchor.click();
        URL.revokeObjectURL(url);
      } else {
        console.error("A gravação falhou.");
      }
    }, sequenceDurationInSeconds);
  };

  return (
    <>
      {isRecording && <RecordingProgress progress={recordingProgress} />}
      <div className={styles.transportContainer}>
        <button onClick={handlePlayPause} className={styles.playButton} disabled={isRecording}>
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
            disabled={isRecording}
          />
        </div>

        <div className={styles.volumeControl}>
          <Slider label="Volume" defaultValue={0.5} onChange={handleVolumeChange} />
        </div>

        <button 
          onClick={handleExport} 
          className={`${styles.exportButton} ${isRecording ? styles.recording : ''}`} 
          disabled={isRecording}
        >
          {isRecording ? 'Gravando...' : 'Exportar'}
        </button>
      </div>
    </>
  );
};

export default TransportControls;