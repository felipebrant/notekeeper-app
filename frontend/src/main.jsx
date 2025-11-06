import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. Importa o BrowserRouter para gerir a navegação
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
// 2. Importa o nosso CSS para que os estilos funcionem em toda a app
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. "Abraça" toda a aplicação com o BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);