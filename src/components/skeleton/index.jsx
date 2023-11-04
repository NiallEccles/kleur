import React from 'react';
import Link from 'next/link';
import styles from './Skeleton.module.css';

// eslint-disable-next-line react/prop-types
export default function Skeleton({ route }) {
  return (
    <Link href={route}>
      <button type="button" className={styles.skeleton}>
        <h3 className="font-bold">Create your own</h3>
      </button>
    </Link>
  );
}
