import React from 'react';

export default ({
  children,
  mark
}: {
  children: any;
  mark: { blank: boolean; href: string };
}) => {
  const { blank, href } = mark || {};
  return (
    <a href={href} target={blank ? '_blank' : '_self'} rel="noreferrer">
      {children}
    </a>
  );
};
