import { useState } from 'react'
import { backendUrl } from '../../constants'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(`${backendUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json();
    if(data.token) setStatus(true);
    localStorage.setItem('token', data.token);
  }

  return (
    <div className='login-container'>
      {
        status ? <p>Logged in successfully</p> : (
          <>
            <h1>Login</h1>
            <form onSubmit={e => handleSubmit(e)}>
              <label>
                Email:
                <input type='email' placeholder='example@gmail.com' value={email} onChange={e => setEmail(e.target.value)} required />
              </label>
              <label>
                Password:
                <input type='password' placeholder='password' value={password} onChange={e => setPassword(e.target.value)} required />
              </label>
              <input type='submit' />
            </form>
          </>
        )
      }
    </div>
  )
}

export default Login
