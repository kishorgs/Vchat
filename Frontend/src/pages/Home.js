import React,{useEffect} from 'react'
import '../css/Home.css'
import svg from '../images/meeting.svg'

function Home({setProgress}) {

    useEffect(()=>{
      setProgress(10)
      setTimeout(()=>{
      setProgress(100)
    },500)
      
        },[setProgress])


  return (
    <div id="Home_main">

      <div id="left">
        <h1>
            Welcome to <span>Vchat</span>,  
        </h1>
        <h2>
            simple realtime video chatting application.
        </h2>
        <p>
        Create chat rooms effortlessly and dive into conversations without any barriers. 
        Vchat is designed for seamless communication, making it easy to connect and chat in real time. 
        Join the conversation today and experience the freedom of spontaneous, hassle-free chatting
        </p>
        <a href='/Create-Room'><button>Get Started</button></a>
        
      </div>
      <div id="right">
            <img className="img" alt='Home-Svg' src={svg}/>
      </div>

       
    </div>
    
  )
}

export default Home
