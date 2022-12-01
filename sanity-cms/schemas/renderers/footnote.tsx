import React from 'react';

export default (props: any) => (
  <span style={{ textDecoration: 'underline', textDecorationStyle: 'dashed' }}>{props.children}</span>
);
