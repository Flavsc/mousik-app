import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.scss";

const Navbar: React.FC = () => {
  return (
    <header className={styles.navbar}>
      <NavLink to="/" className={styles.logo}>
        MOUSIK
      </NavLink>
      <nav className={styles.links}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/studio"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Studio
        </NavLink>
        <NavLink
          to="/gallery"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Galeria
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Sobre
        </NavLink>
        <NavLink
          to="/account"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Conta
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
