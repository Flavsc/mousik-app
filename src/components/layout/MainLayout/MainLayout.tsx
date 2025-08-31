import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import styles from './MainLayout.module.scss'; // Importe o SCSS do MainLayout

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isStudioPage = location.pathname === '/studio';

  return (
    <>
      <Navbar />
      {/* Adiciona uma classe condicionalmente */}
      <main className={isStudioPage ? styles.noPadding : ''}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;