import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter, Route, Routes } from 'react-router-dom';
import PageOpener from './PageOpener';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Removing StringMode as it was interfering with PageOpener (it would open the page twice as the render happens twice).
// TODO: consider bringing back strict mode.
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

root.render(<App />)
;
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
