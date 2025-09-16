// src/components/common/RecordingProgress/RecordingProgress.tsx
import React from 'react';
import styles from './RecordingProgress.module.scss';

interface RecordingProgressProps {
  progress: number;
}

const RecordingProgress: React.FC<RecordingProgressProps> = ({ progress }) => {
  const roundedProgress = Math.min(100, Math.round(progress));

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3>Gravando em progresso...</h3>
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${roundedProgress}%` }}
          />
        </div>
        <p>{roundedProgress}%</p>
      </div>
    </div>
  );
};

export default RecordingProgress;