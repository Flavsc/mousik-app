// src/pages/Studio/components/EffectsPanel/EffectsPanel.tsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './EffectsPanel.module.scss';
import Slider from '../../../../components/common/Slider/Slider';
import type { AudioGraph } from '../Timeline/Timeline';

interface EffectsPanelProps {
  audioGraph: AudioGraph | null;
}

const EffectsPanel: React.FC<EffectsPanelProps> = ({ audioGraph }) => {
  // Refs para os nós de áudio
  const filterNode = useRef<BiquadFilterNode | null>(null);
  const distortionNode = useRef<WaveShaperNode | null>(null);
  const delayNode = useRef<DelayNode | null>(null);
  const feedbackNode = useRef<GainNode | null>(null);

  // Estados para os parâmetros dos efeitos
  const [filterFreq, setFilterFreq] = useState(20000);
  const [distortionAmount, setDistortionAmount] = useState(0);
  const [delayTime, setDelayTime] = useState(0);
  const [delayFeedback, setDelayFeedback] = useState(0);

  useEffect(() => {
    if (audioGraph) {
      const { audioContext, sourceNode, analyserNode, gainNode } = audioGraph;

      // Cria os nós de áudio se ainda não existirem
      if (!filterNode.current) filterNode.current = audioContext.createBiquadFilter();
      if (!distortionNode.current) distortionNode.current = audioContext.createWaveShaper();
      if (!delayNode.current) delayNode.current = audioContext.createDelay();
      if (!feedbackNode.current) feedbackNode.current = audioContext.createGain();

      // Configura os parâmetros
      filterNode.current.type = "lowpass";
      filterNode.current.frequency.value = filterFreq;
      
      delayNode.current.delayTime.value = delayTime;
      feedbackNode.current.gain.value = delayFeedback;

      // Curva de distorção
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i * 2) / 255 - 1;
        curve[i] = ((Math.PI + distortionAmount) * x) / (Math.PI + distortionAmount * Math.abs(x));
      }
      distortionNode.current.curve = curve;
      distortionNode.current.oversample = '4x';

      // Conecta a cadeia de áudio:
      // source -> filter -> distortion -> analyser -> gain -> destination
      //            ^            |
      //            |<- delay <--|
      if (sourceNode) sourceNode.disconnect();
      analyserNode.disconnect();
      gainNode.disconnect();

      const mainChain = sourceNode || analyserNode; // Usa source se existir
      
      mainChain.connect(filterNode.current);
      filterNode.current.connect(distortionNode.current);
      distortionNode.current.connect(analyserNode);
      analyserNode.connect(gainNode);

      // Rota do Delay
      distortionNode.current.connect(delayNode.current);
      delayNode.current.connect(feedbackNode.current);
      feedbackNode.current.connect(delayNode.current); // Feedback loop
      feedbackNode.current.connect(analyserNode); // Envia o som do delay para a cadeia principal

      gainNode.connect(audioContext.destination);
    }
  }, [audioGraph, filterFreq, distortionAmount, delayTime, delayFeedback]);

  return (
    <aside className={styles.effectsPanel}>
      <div className={styles.header}><h3>Efeitos</h3></div>
      <div className={styles.effect}>
        <Slider label="Filtro (Freq)" min={100} max={20000} value={filterFreq} onChange={(e) => setFilterFreq(parseFloat(e.target.value))} disabled={!audioGraph} />
      </div>
      <div className={styles.effect}>
        <Slider label="Distorção" min={0} max={100} value={distortionAmount} onChange={(e) => setDistortionAmount(parseFloat(e.target.value))} disabled={!audioGraph} />
      </div>
      <div className={styles.effect}>
        <Slider label="Delay Time" min={0} max={1} value={delayTime} onChange={(e) => setDelayTime(parseFloat(e.target.value))} disabled={!audioGraph} />
        <Slider label="Delay Feedback" min={0} max={0.9} value={delayFeedback} onChange={(e) => setDelayFeedback(parseFloat(e.target.value))} disabled={!audioGraph} />
      </div>
    </aside>
  );
};

export default EffectsPanel;