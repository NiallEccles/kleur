import React from 'react';
import styles from '../../../styles/Home.module.css';
import NewPalette from '../../../components/new-palette';
import Nav from '../../../components/nav';

export default function PaletteNew() {
  return (
    <div className={styles.container}>
      <Nav />
      <NewPalette />
    </div>
  );
}
