import React from 'react';
import { getImageDimensions } from '@sanity/asset-utils';
import { urlFor } from '../../client';

export const ImageComponent = ({ value }: any) => {
  const { width, height } = getImageDimensions(value);
  return (
    <div className="contentBody__imageWrapper">
      <img 
        src={urlFor(value).width(800).fit('max').auto('format').url()}
        alt={value.alt || ' '}
        loading="lazy"
        style={{
          aspectRatio: (width / height).toFixed(2),
        }}
      />
    </div>
  );
};
