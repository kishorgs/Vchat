import React, { useState } from 'react'
import '../css/Navbar.css'
import { Link, Outlet } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
    <nav className="navbar-header">
        <div className="logo"><a href="/"><span>V</span>chat</a></div>
        <ul className="navlinks">
            <li><Link to='/' >Home</Link></li>
            <li><Link to='/about' >About Us</Link></li>
            <li><Link to='/contact' >Contact</Link></li>
        </ul>
        <div id="btns">
          <button id="create-btn">Create meeting</button>
          <button id="Join-btn">Join meeting</button>
        </div>
    </nav>
    <Outlet/>
    </>
  )
}

export default Navbar
