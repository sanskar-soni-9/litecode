import { useState } from 'react'
import { backendUrl } from '../../constants'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${backendUrl}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json();
    localStorage.setItem('token', data.token);
  }

  return (
    <div className='signup-container'>
      <h1>Signup</h1>
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
    </div>
  )
}

export default Signup
