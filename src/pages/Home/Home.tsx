import React from 'react';
import styles from './Home.module.scss';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        CAOS <br />
        MUSICAL
      </h1>
      <p className={styles.subtitle}>
        MOUSIK é uma plataforma web brutalista que transforma sons em arte visual complexa. Crie música diretamente no navegador enquanto um visualizador dinâmico reflete cada som e manipulação em tempo real.
      </p>

      <div className={styles.decorativeText}>
        // Plataforma de Experimentação Audiovisual
      </div>
    </div>
  );
};

export default Home;