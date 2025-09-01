// src/pages/Studio/components/Timeline/Timeline.tsx
import React, { useEffect, useRef } from 'react';
import styles from './Timeline.module.scss';
import WaveSurfer from 'wavesurfer.js';

export type AudioGraph = {
  audioContext: AudioContext;
  sourceNode: MediaElementAudioSourceNode | null;
  gainNode: GainNode;
  analyserNode: AnalyserNode;
  effectsInput?: GainNode; // Propriedade opcional para o ponto de entrada dos efeitos
};

interface TimelineProps {
  audioFile: File | null;
  audioGraph: AudioGraph | null;
  onReady: (wavesurfer: WaveSurfer, sourceNode: MediaElementAudioSourceNode) => void;
}

const Timeline: React.FC<TimelineProps> = ({ audioFile, audioGraph, onReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!containerRef.current || !audioGraph) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(137, 156, 135, 0.5)',
      progressColor: '#899c87',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      cursorWidth: 1,
      cursorColor: '#899c87',
      height: 200,
      media: document.createElement('audio'),
    });
    wavesurferRef.current = ws;

    ws.on('ready', () => {
    if (!audioGraph) return;
    const { audioContext, effectsInput } = audioGraph;
    
    const mediaElement = ws.getMediaElement();
    const sourceNode = audioContext.createMediaElementSource(mediaElement);
    
    // Conecta a fonte de áudio diretamente ao PONTO DE ENTRADA DOS EFEITOS
    if (effectsInput) {
      sourceNode.connect(effectsInput);
    }

    onReady(ws, sourceNode);
    });

    return () => {
      ws.destroy();
    };
  }, [audioGraph, onReady]);

  useEffect(() => {
    if (audioFile && wavesurferRef.current) {
      const fileUrl = URL.createObjectURL(audioFile);
      wavesurferRef.current.load(fileUrl);
    }
  }, [audioFile]);

  return (
    <div className={styles.timelineContainer}>
      <div ref={containerRef} className={styles.waveform}>
        {!audioFile && <p>// CARREGUE UM ARQUIVO DE ÁUDIO</p>}
      </div>
    </div>
  );
};

export default Timeline;