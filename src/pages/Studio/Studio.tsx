// src/pages/Studio/Studio.tsx
import React, { useState, useEffect } from 'react';
import styles from './Studio.module.scss';
import type WaveSurfer from 'wavesurfer.js';
import { getAudioContext } from '../../services/audioService';
import type { AudioGraph } from './components/Timeline/Timeline';
import type { InstrumentType } from './components/LibraryPanel/LibraryPanel';

import LibraryPanel from './components/LibraryPanel/LibraryPanel';
import Timeline from './components/Timeline/Timeline';
import TransportControls from './components/TransportControls/TransportControls';
import EffectsPanel from './components/EffectsPanel/EffectsPanel';
import PianoRoll from './components/PianoRoll/PianoRoll';

const Studio: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [audioGraph, setAudioGraph] = useState<AudioGraph | null>(null);
  const [studioMode, setStudioMode] = useState<'audio' | 'synth'>('synth');
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120); // Estado do BPM
  const [instrument, setInstrument] = useState<InstrumentType>('saw'); // Estado do Instrumento

  useEffect(() => {
    const audioContext = getAudioContext();
    const gainNode = audioContext.createGain();
    const analyserNode = audioContext.createAnalyser();
    gainNode.connect(analyserNode);
    analyserNode.connect(audioContext.destination);
    setAudioGraph({ audioContext, gainNode, analyserNode, sourceNode: null });
  }, []);

  const handleTimelineReady = (ws: WaveSurfer, sourceNode: MediaElementAudioSourceNode) => {
    setWavesurfer(ws);
    setAudioGraph(prev => prev ? { ...prev, sourceNode } : null);
  };

  const switchToAudioMode = (file: File) => {
    if (isPlaying) setIsPlaying(false);
    setAudioFile(file);
    setStudioMode('audio');
  };

  const switchToSynthMode = (instrument: InstrumentType) => {
    if (isPlaying) setIsPlaying(false);
    setInstrument(instrument);
    setAudioFile(null);
    wavesurfer?.empty();
    setStudioMode('synth');
  };

  return (
    <div className={styles.studioLayout}>
      <div className={styles.library}>
        <LibraryPanel onFileSelect={switchToAudioMode} onSynthSelect={switchToSynthMode} audioGraph={audioGraph} />
      </div>
      <div className={styles.transport}>
        <TransportControls 
          wavesurfer={wavesurfer} 
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          isSynthMode={studioMode === 'synth'}
          audioGraph={audioGraph}
          bpm={bpm}
          onBpmChange={setBpm}
        />
      </div>
      <div className={styles.timeline}>
        {studioMode === 'audio' ? (
          <Timeline audioFile={audioFile} audioGraph={audioGraph} onReady={handleTimelineReady} />
        ) : (
          <PianoRoll audioGraph={audioGraph} isPlaying={isPlaying} bpm={bpm} instrument={instrument} />
        )}
      </div>
      <div className={styles.effects}>
        <EffectsPanel audioGraph={audioGraph} />
      </div>
    </div>
  );
};

export default Studio;