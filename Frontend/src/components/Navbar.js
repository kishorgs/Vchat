import React,{useState} from 'react'
import '../css/Navbar.css'
import { Link, Outlet } from 'react-router-dom'

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  /*
  const [isOpen, setOpen] = useState(false);
  const [isOpen,setIsOpen]=useState(false)
  const handlenav=()=>{
    setIsOpen(!isOpen)
  }
  const closeNav = () => {
    setIsOpen(false);
  };

  */

  return (
    <>
    <nav className="navbar-header">
        <div className="logo"><a href="/"><span>V</span>chat</a></div>
        <ul className={`navlinks ${isOpen ? "active":""}`}>
            <li><Link to='/' onClick={toggleNavbar}>Home</Link></li>
            <li><Link to='/about' onClick={toggleNavbar}>About Us</Link></li>
            <li><Link to='/contact' onClick={toggleNavbar}>Contact</Link></li>
        </ul>
        <div id="btns">
          <a href='/Create-Room' ><button id="create-btn" onClick={toggleNavbar}>Create Meeting</button></a>
          <a href='/Join-Room' ><button id="Join-btn" onClick={toggleNavbar}>Join Meeting</button></a>
        </div>
        
    </nav>
    <Outlet/>
    </>
  )
}

export default Navbar
