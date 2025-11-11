import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

// 1. Recebe 'theme' e 'toggleTheme' do App.jsx
export default function Layout({
  user,
  onLogout,
  onOpenTagManager,
  theme,
  toggleTheme,
}) {
  return (
    <div className="app-layout">
      {/* 2. Passa 'theme' e 'toggleTheme' para o Header */}
      <Header user={user} onLogout={onLogout} theme={theme} toggleTheme={toggleTheme} />
      
      <div className="app-body-container">
        <Sidebar onOpenTagManager={onOpenTagManager} />
        
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}