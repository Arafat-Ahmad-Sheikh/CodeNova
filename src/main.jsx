import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import React from 'react'
import { ToastProvider } from '../components/ToastContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ToastProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </ToastProvider>
  </StrictMode>,
)