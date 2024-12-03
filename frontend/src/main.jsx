// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App'
// import './index.css'
// createRoot(document.getElementById('root')).render(
//     <StrictMode>
//         <App></App>
//     </StrictMode>,
// )
// code trên này bị gọi lại 2 lần các api

import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
    <App />,
);
