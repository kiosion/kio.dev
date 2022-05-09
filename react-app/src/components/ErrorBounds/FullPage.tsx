import React from 'react';

import Hover from '../Utils/Hover/Hover';

import './FullPage.scss';
const FullPage = () => {
    return (
        <div className="app__errorWrapper-fullPage">
            <div className="errorWrapper__content">
                <div className="errorWrapper__content-title">Error</div>
                <div className="errorWrapper__content-message">Well, this is awkward. An unrecoverable error has occured, please reload to continue.</div>
                <div className="errorWrapper__content-button">
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
}

export default FullPage;
