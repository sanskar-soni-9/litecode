import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './Constants/Navbar/Navbar'
import HomePage from './Components/HomePage/HomePage'
import Signup from './Components/Signup/Signup'
import Login from './Components/Login/Login'
import AllProblems from './Components/AllProblems/AllProblems'
import ProblemPage from './Components/ProblemPage/ProblemPage'
import './App.css'


function App() {
  const [isUser, setIsUser] = useState(!!localStorage.getItem('token'))

  return (
    <Router>
      <Navbar isUser={isUser} setIsUser={setIsUser} />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/problemset/all' element={<AllProblems />} />
        <Route path='/problem/:id' element={<ProblemPage isUser={isUser} />} />
      </Routes>
    </Router>
  )
}

export default App
