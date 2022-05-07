import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './index.scss';
import './cursor.ts';

// Main app
const container: HTMLElement = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);
//ReactDOM.render(<App />, document.getElementById('root'));
