// src/services/audioService.ts
import * as Tone from 'tone';
import { INSTRUMENTS, type InstrumentType } from '../pages/Studio/components/LibraryPanel/LibraryPanel';

const instrumentInstances = new Map<InstrumentType, Tone.Sampler | Tone.PolySynth>();
let areInstrumentsLoading = false;

export const getInstrument = (type: InstrumentType): Tone.Sampler | Tone.PolySynth | undefined => {
  return instrumentInstances.get(type);
};

export const preloadInstruments = async (callback: () => void) => {
  if (instrumentInstances.size > 0 || areInstrumentsLoading) {
    if (!areInstrumentsLoading) {
      callback();
    }
    return;
  }

  console.log("A pré-carregar instrumentos...");
  areInstrumentsLoading = true;

  const loadPromises = Object.entries(INSTRUMENTS).map(async ([key, info]) => {
    const type = key as InstrumentType;
    if (instrumentInstances.has(type)) return;

    let instrument;
    if (info.type === 'sampler') {
      instrument = await new Promise<Tone.Sampler>((resolve, reject) => {
        const sampler = new Tone.Sampler({
          urls: { 
            // CORREÇÃO: Adicionada a barra '/' no início de cada caminho
            C3: "/samples/drumkit/kick.wav", 
            D3: "/samples/drumkit/snare.wav", 
            E3: "/samples/drumkit/hat.wav" 
          },
          baseUrl: window.location.origin,
          onload: () => {
            console.log('Drum Kit carregado com sucesso!');
            resolve(sampler);
          },
          onerror: (error) => {
            console.error("Erro ao carregar o sampler de bateria. Verifique se os ficheiros estão na pasta 'public/samples/drumkit'", error);
            reject(error);
          }
        }).toDestination();
      });
    } else {
      const polySynth = new Tone.PolySynth(Tone.Synth).toDestination();
      polySynth.set({
        oscillator: {
          type: info.type
        }
      });
      instrument = polySynth;
    }
    instrumentInstances.set(type, instrument);
    console.log(`${info.name} carregado.`);
  });

  try {
    await Promise.all(loadPromises);
    areInstrumentsLoading = false;
    console.log("Todos os instrumentos foram pré-carregados.");
    callback();
  } catch (error) {
    console.error("Falha ao pré-carregar um ou mais instrumentos.", error);
  }
};