import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Você pode criar este arquivo ou deixá-lo vazio por enquanto
import App from './App'; // Importa o componente principal App
import reportWebVitals from './reportWebVitals'; // Pode ser removido se não for usar

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();