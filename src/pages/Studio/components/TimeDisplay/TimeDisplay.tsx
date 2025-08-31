// src/pages/Studio/components/TimeDisplay/TimeDisplay.tsx
import React from 'react';
import styles from './TimeDisplay.module.scss';

interface TimeDisplayProps {
  currentTime: number;
  duration: number;
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({ currentTime, duration }) => {
  return (
    <div className={styles.timeDisplay}>
      <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
    </div>
  );
};

export default TimeDisplay;