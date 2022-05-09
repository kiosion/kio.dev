import React, { useEffect, useState } from 'react';

const ErrorPage = (props?: any) => {
  const [error, setError] = useState((props && props.error) ? props.error : 'unknown');

  useEffect(() => {
    setError(props.error);
  }, [props.error]);

  const errorToString = (error: string) => {
    switch (error) {
    case '404':
      return 'Page not found';
    case '500':
      return 'Internal server error';
    default:
      return 'Unknown error';
    }
  };

  return (
    <div>
            Error: {error && (error + ' ' + errorToString(error))}
    </div>
  );
};

export default ErrorPage;
