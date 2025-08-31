import React from "react";
import styles from "./Footer.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <a href="#">FAQ</a>
        <a href="#">Suporte</a>
        <a href="#">Termos</a>
        <a href="#">Contato</a>
      </div>
      <div className={styles.signature}>
        “A estética sonora em forma visual”
      </div>
    </footer>
  );
};

export default Footer;
