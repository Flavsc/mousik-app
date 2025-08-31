// src/pages/Studio/components/Timeline/Timeline.tsx
import React, { useEffect, useRef } from 'react';
import styles from './Timeline.module.scss';
import WaveSurfer from 'wavesurfer.js';
// A importação de 'getAudioContext' foi removida daqui, pois não era utilizada.

// A interface que exportamos permanece a mesma, mas sourceNode pode ser nulo
export type AudioGraph = {
  audioContext: AudioContext;
  sourceNode: MediaElementAudioSourceNode | null;
  gainNode: GainNode;
  analyserNode: AnalyserNode;
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

    const { audioContext } = audioGraph;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(137, 156, 135, 0.5)', // Mantendo sua paleta de cores
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
      const mediaElement = ws.getMediaElement();
      const sourceNode = audioContext.createMediaElementSource(mediaElement);
      
      // Conecta esta fonte à cadeia de áudio principal que já existe
      sourceNode.connect(audioGraph.gainNode);

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