import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from './pages/Home'
import EditorPage from './pages/EditorPage'
import './App.css'
import Navbar from '../components/Navbar'
import Settings from './pages/Settings'
import React from 'react'
import useThemeStore from '../store/useThemestore'
import { useToast } from '../components/ToastContext'

function App() {
  const theme = useThemeStore((state) => state.theme);
  const { toast } = useToast();

  return (
    <div data-theme={theme} className="min-h-screen w-full flex flex-col">
      {toast.show && (
        <div className="toast toast-top toast-end z-50">
          <div className={`alert alert-${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
      </Routes>
    </div>
  );
}

export default App;