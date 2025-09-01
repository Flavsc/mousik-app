// src/pages/Studio/components/EffectsPanel/EffectsPanel.tsx
import React, { useState, useEffect } from 'react'; // useRef removido
import styles from './EffectsPanel.module.scss';
import Slider from '../../../../components/common/Slider/Slider';
import * as Tone from 'tone';

// Nós de efeitos globais do Tone.js, conectados à saída principal
const filter = new Tone.Filter(20000, "lowpass").toDestination();
const distortion = new Tone.Distortion(0).connect(filter);
const reverb = new Tone.Reverb({ decay: 1.5, wet: 0 }).connect(distortion);

// O ponto de entrada para todos os sons agora se conecta ao reverb (o início da cadeia de efeitos)
export const effectsInput = new Tone.Channel().connect(reverb);

const EffectsPanel: React.FC = () => {
  const [filterFreq, setFilterFreq] = useState(20000);
  const [distortionAmount, setDistortionAmount] = useState(0);
  const [reverbWet, setReverbWet] = useState(0);

  useEffect(() => { filter.frequency.value = filterFreq; }, [filterFreq]);
  useEffect(() => { distortion.distortion = distortionAmount / 100; }, [distortionAmount]);
  useEffect(() => { reverb.wet.value = reverbWet; }, [reverbWet]);

  return (
    <aside className={styles.effectsPanel}>
      <div className={styles.header}><h3>Efeitos Master</h3></div>
      <div className={styles.effect}>
        <Slider label="Filtro (Freq)" min={100} max={20000} value={filterFreq} onChange={(e) => setFilterFreq(parseFloat(e.target.value))} />
      </div>
      <div className={styles.effect}>
        <Slider label="Distorção" min={0} max={100} value={distortionAmount} onChange={(e) => setDistortionAmount(parseFloat(e.target.value))} />
      </div>
      <div className={styles.effect}>
        <Slider label="Reverb Mix" min={0} max={1} step={0.01} value={reverbWet} onChange={(e) => setReverbWet(parseFloat(e.target.value))} />
      </div>
    </aside>
  );
};

export default EffectsPanel;