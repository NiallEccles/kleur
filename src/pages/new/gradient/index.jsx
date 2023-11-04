import React from 'react';
import styles from '../../../styles/Home.module.css';
import NewGradient from '../../../components/new-gradient';
import Nav from '../../../components/nav';

export default function GradientNew() {
  return (
    <div className={styles.container}>
      <Nav />
      <NewGradient />
    </div>
  );
}
