import React from 'react';

// @ts-expect-error
const dataset = import.meta.env.SANITY_STUDIO_DATASET || 'production';

export const BrandLogo = () => (
  dataset === 'production'
    ?
      <>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <b>kio.dev Studio</b>
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
      </>
    :
      <>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <b>kio.dev Studio</b>
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
      </>
);
