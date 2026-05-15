import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CardPage from './pages/CardPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/carte/:id" element={<CardPage />} />
    </Routes>
  )
}
