// src/pages/Studio/components/PianoRoll/PianoRoll.tsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './PianoRoll.module.scss';
import type { AudioGraph } from '../Timeline/Timeline';
import { INSTRUMENTS, type InstrumentType } from '../LibraryPanel/LibraryPanel';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = [5, 4, 3, 2];
const NUM_STEPS = 16;

interface PianoRollProps {
  audioGraph: AudioGraph | null;
  isPlaying: boolean;
  bpm: number;
  instrument: InstrumentType;
}

const PianoRoll: React.FC<PianoRollProps> = ({ audioGraph, isPlaying, bpm, instrument }) => {
  const [activeNotes, setActiveNotes] = useState<Record<string, boolean>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioGraph) return;
    if (isPlaying) {
      if (audioGraph.audioContext.state === 'suspended') audioGraph.audioContext.resume();
      const timePerStep = (60 * 1000) / bpm / 4;
      intervalRef.current = window.setInterval(() => {
        setCurrentStep(prevStep => {
          const nextStep = (prevStep + 1) % NUM_STEPS;
          OCTAVES.forEach(octave =>
            NOTES.forEach(note => {
              const noteName = `${note}${octave}`;
              if (activeNotes[`${noteName}-${nextStep}`]) {
                playNote(noteName, audioGraph, instrument);
              }
            })
          );
          return nextStep;
        });
      }, timePerStep);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCurrentStep(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, activeNotes, audioGraph, bpm, instrument]);

  const toggleNote = (noteName: string, step: number) => {
    setActiveNotes(prev => ({ ...prev, [`${noteName}-${step}`]: !prev[`${noteName}-${step}`] }));
  };

  const playNote = (noteName: string, graph: AudioGraph, instr: InstrumentType) => {
    const { audioContext, gainNode: destinationNode } = graph;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    const octave = parseInt(noteName.slice(-1));
    const note = noteName.slice(0, -1);
    const noteIndex = NOTES.indexOf(note);
    const freq = 440 * Math.pow(2, (octave - 4) + (noteIndex - 9) / 12);
    
    oscillator.type = INSTRUMENTS[instr].type; // USA O INSTRUMENTO SELECIONADO
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

    oscillator.connect(gain);
    gain.connect(destinationNode);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  return (
    <div className={styles.pianoRollContainer}>
      <div className={styles.grid}>
        {OCTAVES.flatMap(octave =>
          NOTES.map(note => {
            const noteName = `${note}${octave}`;
            const isBlackKey = note.includes('#');
            return (
              <div key={noteName} className={`${styles.row} ${isBlackKey ? styles.blackKeyRow : ''}`}>
                <div className={styles.keyLabel}>{noteName}</div>
                {Array.from({ length: NUM_STEPS }, (_, step) => {
                  const id = `${noteName}-${step}`;
                  return (
                    <div
                      key={id}
                      className={`${styles.cell} ${activeNotes[id] ? styles.active : ''} ${currentStep === step ? styles.cursor : ''}`}
                      onClick={() => toggleNote(noteName, step)}
                    />
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PianoRoll;