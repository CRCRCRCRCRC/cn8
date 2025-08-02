import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DevAuthPage from './pages/DevAuthPage'
import EnvironmentCheck from './components/EnvironmentCheck'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-gray-900 to-cyber-darker">
        <div className="matrix-bg" id="matrix-bg"></div>
        <EnvironmentCheck onValidationComplete={() => {}} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dev-auth" element={<DevAuthPage />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App