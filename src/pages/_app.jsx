import React from 'react';
import '../styles/globals.css';

// eslint-disable-next-line react/prop-types
function MyApp({ Component, pageProps }) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <>
      <Component {...pageProps} />
      <span style={{
        position: 'fixed',
        bottom: '1em',
        right: '1em',
        background: '#2b2b2b',
        color: 'white',
        padding: '0.25em',
      }}
      >
        Experimental
      </span>
    </>
  );
}

export default MyApp;
