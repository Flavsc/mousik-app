// src/pages/Studio/Studio.tsx
import React, { useState, useEffect } from 'react';
import styles from './Studio.module.scss';
import { type InstrumentType } from './components/LibraryPanel/LibraryPanel';
import { type Track } from './components/PianoRoll/PianoRoll';
import { preloadInstruments } from '../../services/audioService';
import * as Tone from 'tone';

import LibraryPanel from './components/LibraryPanel/LibraryPanel';
import TransportControls from './components/TransportControls/TransportControls';
import EffectsPanel, { effectsInput } from './components/EffectsPanel/EffectsPanel';
import PianoRoll from './components/PianoRoll/PianoRoll';
import Visualizer from './components/Visualizer/Visualizer';

const Studio: React.FC = () => {
  const [areInstrumentsLoaded, setAreInstrumentsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false); // Estado de gravação agora é centralizado
  const [bpm, setBpm] = useState(120);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [activeTrackId, setActiveTrackId] = useState<number | null>(null);

  useEffect(() => {
    const startAudioAndLoad = async () => {
      await Tone.start();
      console.log("AudioContext do Tone.js iniciado");
      preloadInstruments(effectsInput, () => {
        setAreInstrumentsLoaded(true);
      });
    };
    startAudioAndLoad();
  }, []);

  const addTrack = (instrument: InstrumentType) => {
    const newTrack: Track = { id: Date.now(), instrument, notes: {} };
    setTracks(prev => [...prev, newTrack]);
    setActiveTrackId(newTrack.id);
  };

  const removeTrack = (trackId: number) => {
    setTracks(prev => {
      const remainingTracks = prev.filter(track => track.id !== trackId);
      if (activeTrackId === trackId) {
        setActiveTrackId(remainingTracks.length > 0 ? remainingTracks[0].id : null);
      }
      return remainingTracks;
    });
  };

  const updateTrackNotes = (trackId: number, newNotes: Record<string, boolean>) => {
    setTracks(prev =>
      prev.map(track =>
        track.id === trackId ? { ...track, notes: newNotes } : track
      )
    );
  };

  if (!areInstrumentsLoaded) {
    return <div className={styles.loadingScreen}>A carregar instrumentos...</div>;
  }

  return (
    <div className={styles.studioLayout}>
      <div className={styles.library}>
        <LibraryPanel onAddTrack={addTrack} />
      </div>
      <div className={styles.transport}>
        <TransportControls
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          bpm={bpm}
          onBpmChange={setBpm}
          tracks={tracks}
        />
      </div>
      <div className={styles.pianoRoll}>
        <PianoRoll
          isPlaying={isPlaying}
          isRecording={isRecording}
          bpm={bpm}
          tracks={tracks}
          activeTrackId={activeTrackId}
          onNotesChange={updateTrackNotes}
          setActiveTrackId={setActiveTrackId}
          onRemoveTrack={removeTrack}
        />
      </div>
      <div className={styles.visualizer}>
        <Visualizer />
      </div>
      <div className={styles.effects}>
        <EffectsPanel />
      </div>
    </div>
  );
};

export default Studio;