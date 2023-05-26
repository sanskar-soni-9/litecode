import React from 'react'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'

import './Navbar.scss'

const Navbar = () => {
  return (
    <div className='navBar'>
      <Link to='/'>
        <img src={logo} alt='logo' />
        <p>LiteCode</p>
      </Link>
      <Link to='/problemset/all'><p>Problems</p></Link>
      <Link to='signup'><p>Sign Up</p></Link>
      <Link to='login'><p>Log In</p></Link>
    </div>
  )
}

export default Navbar
