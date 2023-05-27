import { useState } from 'react'
import { backendUrl } from '../../constants'
import Spinner from '../Spinner/Spinner'
import './Signup.scss'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignedUp, setIsSignedUp] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await fetch(`${backendUrl}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json();
    console.log(data);
    if (data.token) {
      setIsLoading(false);
      setIsSignedUp(true);
      localStorage.setItem('token', data.token);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      setIsLoading(false);
      setError(data.msg);
    }
  }

  if(error || isSignedUp) {
    return (
      <div className='signup-container'>
      {
        isSignedUp ? (
          <div className='signup-status-container success'>
            <h1>Signup successful</h1>
            <p>Redirecting...</p>
          </div> ) : (
          <div className='signup-status-container error'>
            <h1>Signup failed</h1>
            <p>{error}</p>
          </div>
        )
      }
      </div>
    )
  }

  return !isLoading ? (
    <div className='signup-container'>
      <div className='signup-form-wrapper'>
        <h1>Signup</h1>
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
    <div className='signup-container'>
      <Spinner size='40' />
    </div>
  )
}

export default Signup
