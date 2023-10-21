/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import styles from './new-gradient.module.css';
import ColourPicker from '../colour-picker';
import PaletteManager from '../palette-manager';
import { useUpdateControl } from '../../customHooks/useUpdateControl';
import { PAGES } from '../../public/shared.constants';

export default function NewGradient() {
  const {
    controls,
    setControls,
    updateSingleControl,
    removeControl,
    createControl,
  } = useUpdateControl(['#E23E57', '#88304E', '#522546', '#311D3F']);

  const [currentControl, setCurrentControl] = useState(0);

  const [previewGradient, setPreviewGradient] = useState(false);

  const [name, setName] = useState(null);

  const router = useRouter();

  const [isVisible, setIsVisible] = useState(false);

  setTimeout(() => {
    setIsVisible(true);
  }, 300);

  return (
    <motion.div initial={false} animate={{ opacity: isVisible ? 1 : 0 }}>
      <div className="my-8 py-5 sm:py-15 rounded-3xl">
        <h1 className="text-5xl sm:text-7xl font-bold text-center">
          Create Gradient
        </h1>
      </div>
      <div className={styles.paletteContainer}>
        <div className={styles.options}>
          <input
            type="text"
            placeholder="Gradient name"
            className="input w-full font-semibold max-w-xs bg-gray-300 text-black placeholder-gray-800"
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="button"
            className={`btn btn-active mt-4 w-auto ${
              previewGradient ? '' : 'btn-ghost'
            }`}
            onClick={() => setPreviewGradient(!previewGradient)}
          >
            Preview
            {' '}
            {previewGradient ? 'On' : 'Off'}
          </button>
          <button
            type="button"
            className={`btn btn-active btn-ghost mt-4 w-full ${styles.addIcon}`}
            onClick={createControl}
          >
            Add Sliver
          </button>
          <button
            type="button"
            className={`btn mt-4 w-full ${styles.createButton}`}
            onClick={() => createPalette(controls, name, router)}
          >
            Create Gradient
          </button>
        </div>

        <div className={styles.colourPickerContainer}>
          <PaletteManager
            controls={controls}
            setCurrentControl={setCurrentControl}
            removeControl={removeControl}
            setControls={setControls}
            currentControl={currentControl}
            updateSingleControl={updateSingleControl}
            previewGradient={previewGradient}
          />

          {currentControl > -1 && (
          <ColourPicker
            controls={controls}
            updateSingleControl={updateSingleControl}
            currentControlIndex={currentControl}
          />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function createPalette(controls, name, router) {
  const prevLocalStorage = localStorage.getItem('gradients') === null
    ? []
    : JSON.parse(localStorage.getItem('gradients'));

  // const createdAt = new Date().getTime();

  const newGradient = [...prevLocalStorage, { controls, name }];

  localStorage.setItem('gradients', JSON.stringify(newGradient));

  router.push(PAGES.HOME);
}
// eslint-disable-next-line no-unused-vars
function previewOn() {
  return (
    <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45.9 32">
      <path d="M22.95,24.35c2.33,0,4.31-.82,5.92-2.45,1.62-1.63,2.42-3.6,2.42-5.9s-.82-4.31-2.45-5.92c-1.63-1.62-3.6-2.43-5.9-2.43-2.33,0-4.31,.82-5.92,2.45-1.62,1.63-2.43,3.6-2.43,5.9,0,2.33,.82,4.31,2.45,5.92,1.63,1.62,3.6,2.43,5.9,2.43Zm0-3.55c-1.33,0-2.47-.48-3.4-1.42-.93-.95-1.4-2.07-1.4-3.38s.48-2.47,1.42-3.4c.95-.93,2.07-1.4,3.38-1.4s2.47,.48,3.4,1.42c.93,.95,1.4,2.07,1.4,3.38,0,1.33-.48,2.47-1.42,3.4-.95,.93-2.07,1.4-3.38,1.4Zm0,11.2c-5.03,0-9.61-1.48-13.73-4.45-4.12-2.97-7.19-6.82-9.22-11.55C2.03,11.27,5.11,7.42,9.22,4.45,13.34,1.48,17.92,0,22.95,0s9.61,1.48,13.72,4.45c4.12,2.97,7.19,6.82,9.23,11.55-2.03,4.73-5.11,8.58-9.23,11.55-4.12,2.97-8.69,4.45-13.72,4.45Z" />
    </svg>
  );
}
