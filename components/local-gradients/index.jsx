import React, { useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css';
import Gradient from '../gradient';

export default function LocalGradients() {
  const [localGradients, setLocalGradients] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localStorage = JSON.parse(window.localStorage.getItem('gradients'));
      setLocalGradients(localStorage);
    }
  }, []);

  return localGradients != null ? (
    <>
      <h2 className="text-2xl font-bold ml-5">My Gradients</h2>
      <div className={styles.paletteGrid}>
        {localGradients.length > 0
          // eslint-disable-next-line max-len
          ? localGradients.map((gradient) => <Gradient key={gradient.name} colours={gradient.controls} name={gradient.name} />)
          : ''}
      </div>
    </>
  ) : (
    ''
  );
}
