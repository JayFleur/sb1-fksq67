import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PlayerInput from './components/PlayerInput'
import BanPhase from './components/BanPhase'
import Results from './components/Results'

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Parallel TCG Deck System</h1>
          <Routes>
            <Route path="/" element={<PlayerInput playerNumber={1} />} />
            <Route path="/player2/:id" element={<PlayerInput playerNumber={2} />} />
            <Route path="/ban/:id" element={<BanPhase />} />
            <Route path="/results/:id" element={<Results />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App