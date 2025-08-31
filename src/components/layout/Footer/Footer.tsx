import React from 'react';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  // O conteúdo a ser repetido no letreiro
  const tickerContent = "A ESTÉTICA SONORA EM FORMA VISUAL — MOUSIK — ";

  return (
    <footer className={styles.footer}>
      <div className={styles.tickerWrapper}>
        <div className={styles.tickerContent}>
          {/* Repetimos o conteúdo para garantir o preenchimento contínuo */}
          <span>{tickerContent}</span>
          <span>{tickerContent}</span>
          <span>{tickerContent}</span>
          <span>{tickerContent}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;