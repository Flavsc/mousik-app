// src/pages/Studio/components/PianoRoll/PianoRoll.tsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './PianoRoll.module.scss';
import { INSTRUMENTS, type InstrumentType } from '../LibraryPanel/LibraryPanel';
import { getInstrument } from '../../../../services/audioService';
import * as Tone from 'tone';

export type Track = {
  id: number;
  instrument: InstrumentType;
  notes: Record<string, boolean>;
};

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = [5, 4, 3, 2];
const NUM_STEPS = 16;
const DRUM_MAP: Record<string, string> = { 'C3': 'kick', 'D3': 'snare', 'E3': 'hat' };

interface PianoRollProps {
  isPlaying: boolean;
  bpm: number;
  tracks: Track[];
  activeTrackId: number | null;
  onNotesChange: (trackId: number, newNotes: Record<string, boolean>) => void;
  setActiveTrackId: (id: number | null) => void;
  onRemoveTrack: (id: number) => void;
}

const PianoRoll: React.FC<PianoRollProps> = ({ isPlaying, bpm, tracks, activeTrackId, onNotesChange, setActiveTrackId, onRemoveTrack }) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const loopRef = useRef<Tone.Sequence | null>(null);
  const activeTrack = tracks.find(t => t.id === activeTrackId);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
    if (isPlaying) {
      loopRef.current = new Tone.Sequence((time, step) => {
        Tone.Draw.schedule(() => setCurrentStep(step), time);
        tracks.forEach(track => {
          Object.keys(track.notes).forEach(noteId => {
            const [noteName, noteStep] = noteId.split('-');
            if (parseInt(noteStep) === step && track.notes[noteId]) {
              const instrument = getInstrument(track.instrument);
              instrument?.triggerAttackRelease(noteName, '8n', time);
            }
          });
        });
      }, Array.from({ length: NUM_STEPS }, (_, i) => i), '16n').start(0);

      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
      loopRef.current?.dispose();
      setCurrentStep(-1);
    }
    return () => {
      Tone.Transport.stop();
      loopRef.current?.dispose();
    };
  }, [isPlaying, bpm, tracks]);

  const toggleNote = (noteName: string, step: number) => {
    if (!activeTrack) return;
    const id = `${noteName}-${step}`;
    const newNotes = { ...activeTrack.notes, [id]: !activeTrack.notes[id] };
    onNotesChange(activeTrack.id, newNotes);
  };

  const clearAllNotes = () => {
    if (!activeTrack) return;
    onNotesChange(activeTrack.id, {});
  };

  const copyNotes = () => {
    if (!activeTrack) return;
    navigator.clipboard.writeText(JSON.stringify(activeTrack.notes));
  };

  const pasteNotes = async () => {
    if (!activeTrack) return;
    try {
      const text = await navigator.clipboard.readText();
      const notes = JSON.parse(text);
      onNotesChange(activeTrack.id, notes);
    } catch (err) {
      console.error("Falha ao colar notas:", err);
    }
  };

  return (
    <div className={styles.pianoRollContainer}>
      <div className={styles.toolbar}>
        <div className={styles.trackSelector}>
          {tracks.map(track => (
            <div key={track.id} className={styles.trackTab}>
              <button onClick={() => setActiveTrackId(track.id)} className={track.id === activeTrackId ? styles.activeTrack : ''}>
                {INSTRUMENTS[track.instrument].name}
              </button>
              <button onClick={() => onRemoveTrack(track.id)} className={styles.removeTrackButton}>×</button>
            </div>
          ))}
        </div>
        <div className={styles.tools}>
          <button onClick={copyNotes} disabled={!activeTrack}>Copiar</button>
          <button onClick={pasteNotes} disabled={!activeTrack}>Colar</button>
          <button onClick={clearAllNotes} disabled={!activeTrack}>Limpar</button>
        </div>
      </div>
      <div className={styles.grid}>
        {OCTAVES.flatMap(octave =>
          NOTES.map(note => {
            const noteName = `${note}${octave}`;
            const isDrumKey = activeTrack?.instrument === 'drumkit' && DRUM_MAP[noteName];
            if (activeTrack?.instrument === 'drumkit' && !isDrumKey) return null;

            return (
              <div key={noteName} className={`${styles.row} ${note.includes('#') ? styles.blackKeyRow : ''}`}>
                <div className={styles.keyLabel}>{isDrumKey ? DRUM_MAP[noteName] : noteName}</div>
                <div className={styles.noteCells}>
                  {Array.from({ length: NUM_STEPS }, (_, step) => (
                    <div
                      key={`${noteName}-${step}`}
                      className={`${styles.cell} ${activeTrack?.notes[`${noteName}-${step}`] ? styles.active : ''} ${currentStep === step ? styles.cursor : ''}`}
                      onClick={() => toggleNote(noteName, step)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PianoRoll;