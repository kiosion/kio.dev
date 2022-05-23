import React from 'react';
import Hover from '../Utils/Hover/Hover';

const FullPage = () => {
  return (
    <div className="app__errorPage">
      <div className="errorPage__content">
        <div className="errorPage__content-title">Error</div>
        <div className="errorPage__content-message">Well, this is awkward. An unrecoverable error has occured, please reload to continue.</div>
        <div className="errorPage__content-button">
          <Hover>
            <button 
              onClick={() => {
                window.location.href = '/';
              }}
            >Reload</button>
          </Hover>
        </div>
      </div>
        
    </div>
  );
};

export default FullPage;
