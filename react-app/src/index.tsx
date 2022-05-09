import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './cursor.ts';

// Main app
const container: HTMLElement = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);
