// src/services/audioService.ts
import * as Tone from 'tone';
import { INSTRUMENTS, type InstrumentType } from '../pages/Studio/components/LibraryPanel/LibraryPanel';

const instrumentInstances = new Map<InstrumentType, any>();
let areInstrumentsLoading = false;

export const getInstrument = (type: InstrumentType) => {
  return instrumentInstances.get(type);
};

// A função agora aceita o nó ao qual os instrumentos devem se conectar
export const preloadInstruments = async (destinationNode: Tone.ToneAudioNode, callback: () => void) => {
  if (instrumentInstances.size > 0 || areInstrumentsLoading) {
    if (!areInstrumentsLoading) {
      callback();
    }
    return;
  }

  console.log("A pré-carregar instrumentos...");
  areInstrumentsLoading = true;

  try {
    const loadPromises = Object.entries(INSTRUMENTS).map(async ([key, info]) => {
      const type = key as InstrumentType;
      if (instrumentInstances.has(type)) return;

      let instrument: any;

      if (type === 'drumkit') {
        instrument = await new Promise<Tone.Sampler>((resolve, reject) => {
          const sampler = new Tone.Sampler({
            urls: { C3: "/samples/drumkit/kick.wav", D3: "/samples/drumkit/snare.wav", E3: "/samples/drumkit/hat.wav" },
            baseUrl: window.location.origin,
            onload: () => resolve(sampler),
            onerror: (error) => reject(error)
          }).connect(destinationNode); // Conecta ao nó fornecido
        });
      } else if (type === 'bass') {
        instrument = new Tone.MonoSynth({
            oscillator: { type: "fmsine" },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.8 },
            filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 1, baseFrequency: 100, octaves: 3 }
        }).connect(destinationNode); // Conecta ao nó fornecido
      } else if (type === 'guitar') {
        instrument = new Tone.PluckSynth({
            attackNoise: 0.8,
            dampening: 4000,
            resonance: 0.7
        }).connect(destinationNode); // Conecta ao nó fornecido
      } else if (type === 'lead') {
        instrument = new Tone.FMSynth({
            harmonicity: 3,
            modulationIndex: 10,
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.8 },
            modulationEnvelope: { attack: 0.1, decay: 0.3, sustain: 0.2, release: 0.5 }
        }).connect(destinationNode); // Conecta ao nó fornecido
      } else {
        const polySynth = new Tone.PolySynth(Tone.Synth).connect(destinationNode); // Conecta ao nó fornecido

        let oscillatorType = 'fatsawtooth';
        if (type === 'sine') oscillatorType = 'fatsine';
        if (type === 'square') oscillatorType = 'fatsquare';

        polySynth.set({
            oscillator: { type: oscillatorType as any },
            envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 }
        });
        instrument = polySynth;
      }

      instrumentInstances.set(type, instrument);
      console.log(`${info.name} carregado.`);
    });

    await Promise.all(loadPromises);
    areInstrumentsLoading = false;
    console.log("Todos os instrumentos foram pré-carregados.");
    callback();
  } catch (error) {
    console.error("Falha ao pré-carregar um ou mais instrumentos.", error);
    areInstrumentsLoading = false;
    callback();
  }
};