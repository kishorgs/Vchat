import React,{useState,useRef} from 'react'
import '../css/Navbar.css'
import { Link, Outlet } from 'react-router-dom'
import {FaBars,FaTimes} from "react-icons/fa";

const Navbar = () => {

  const navRef = useRef({});

  const [toggle,settooglenav] = useState(false);

  const showNavbar = () =>{
    document.querySelector('.nav-items').classList.toggle("responsive_nav")
    settooglenav(!toggle);
    // navRef.current.classList.toggle("responsive_nav");
  }


  return (
    <>
    <nav className="navbar-header" res={navRef}>
        <div className="logo"><a href="/"><span>V</span>chat</a></div>
        <div className="nav-items">

        <ul className="navlinks">
            <li><Link to='/' onClick={showNavbar}>Home</Link></li>
            <li><Link to='/about' onClick={showNavbar}>About Us</Link></li>
            <li><Link to='/contact' onClick={showNavbar}>Contact</Link></li>
        </ul>
        <div id="btns">
          <a href='/Create-Room' ><button id="create-btn" onClick={showNavbar}>Create Meeting</button></a>
          <a href='/Join-Room' ><button id="Join-btn" onClick={showNavbar}>Join Meeting</button></a>
        </div>
        </div>
        {toggle && <button className='nav-btn nav-close-btn' onClick={showNavbar}>
          <FaTimes/>
        </button>}
        
        {!toggle && <button className='nav-btn' onClick={showNavbar}>
          <FaBars/>
        </button>}
    </nav>
    
    
    <Outlet/>
    </>
  )
}

export default Navbar
