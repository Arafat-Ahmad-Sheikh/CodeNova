import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from './pages/Home'
import EditorPage from './pages/EditorPage'
import './App.css'
import Navbar from '../components/Navbar'

function App() {
  return (
    <>
    <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/editor/:roomId" element={<EditorPage />}></Route>
        <Route path="/settings" element={<EditorPage />}></Route>
      </Routes>

    </>
  )
}

export default App;