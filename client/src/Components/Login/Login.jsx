import { useState } from 'react'
import { backendUrl } from '../../constants'
import Spinner from '../Spinner/Spinner'
import './Login.scss'

const Login = () => {
  const [email, setEmail] = useState('example@gmail.com')
  const [password, setPassword] = useState('password')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    const res = await fetch(`${backendUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json();
    console.log(data);
    if(data.token) {
      setIsLoading(false);
      setIsLoggedIn(true);
      localStorage.setItem('token', data.token);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      setIsLoading(false);
      setError(data.msg);
    }
  }

  if(error || isLoggedIn) {
    return (
      <div className='login-container'>
      {
        isLoggedIn ? (
          <div className='login-status-container success'>
            <h1>Login successful</h1>
            <p>Redirecting...</p>
          </div> ) : (
          <div className='login-status-container error'>
            <h1>Login failed</h1>
            <p>{error}</p>
          </div>
        )
      }
      </div>
    )
  }

  return !isLoading ? (
    <div className='login-container'>
      <div className='login-form-wrapper'>
        <h1>Login</h1>
        <form onSubmit={e => handleSubmit(e)}>
          <label>
            Email
            <input type='email' placeholder='example@gmail.com' value={email} onChange={e => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type='password' placeholder='password' value={password} onChange={e => setPassword(e.target.value)} required />
          </label>
          <input type='submit' />
        </form>
      </div>
    </div>
  ) : (
    <div className='login-container'>
      <Spinner size='40' />
    </div>
  )
}

export default Login
