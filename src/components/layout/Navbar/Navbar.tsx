import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.scss';

const Navbar: React.FC = () => {
  return (
    <header className={styles.navbar}>
      <NavLink to="/" className={styles.logo}>
        MOUSIK_
      </NavLink>
      <nav>
        <NavLink
          to="/"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          data-text="Home"
        >
          Home
        </NavLink>
        <NavLink
          to="/studio"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          data-text="Studio"
        >
          Studio
        </NavLink>
        <NavLink
          to="/gallery"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          data-text="Galeria"
        >
          Galeria
        </NavLink>
         <NavLink
          to="/about"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          data-text="Sobre"
        >
          Sobre
        </NavLink>
         <NavLink
          to="/account"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          data-text="Conta"
        >
          Conta
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;