import React from 'react';

const dataset = process.env.SANITY_STUDIO_API_DATASET;

const Logo = () => {
  if (dataset === 'dev') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <b>Noether Studio</b>
        <p
          style={{
            margin: '0',
            padding: '0',
            fontSize: 'smaller'
          }}
        >
          Development
        </p>
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <b>Noether Studio</b>
        <p
          style={{
            margin: '0',
            padding: '0',
            fontSize: 'smaller'
          }}
        >
          Production
        </p>
      </div>
    );
  }
};

export default Logo;
