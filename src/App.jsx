import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'

import DigitalClassroom from './pages/classroom/DigitalClassroom'
import Login from './pages/login/Login'
import Register from './pages/login/Register'
import ForgotPassword from './pages/login/ForgotPassword'
import ResetPassword from './pages/login/ResetPassword'
import TrainerDashboard from './pages/classroom/TrainerDashboard'

function App() {
  
  return (

    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/classroom" element={<DigitalClassroom />} />
          <Route path="/trainer" element={<TrainerDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
    
  )
}

export default App
