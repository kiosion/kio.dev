import React from 'react';

export const CodeblockComponent = ({ value }: any) => {
  return (
    <div className="contentBody__code--block">
      <code>
        {value.code}
      </code>
    </div>
  );
};
