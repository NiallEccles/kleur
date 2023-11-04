import React, { useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css';
import Nav from '../../components/nav';
import Gradient from '../../components/gradient';

export default function Index() {
  const [palette, setPalette] = useState([]);
  const [name, setName] = useState();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);

      const paletteColours = params.get('p');
      const formattedColours = paletteColours
        .split(',')
        .map((colour) => `#${colour}`);

      setPalette(formattedColours);

      const paletteName = params.get('name');
      setName(paletteName);
    }
  }, []);

  return (
    <div className={styles.container}>
      <Nav />
      <div className="flex justify-center">
        <div>
          <Gradient colours={palette} />
          <div className="px-8">
            <span className="tag">{name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
