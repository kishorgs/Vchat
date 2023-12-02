import React from 'react'
import svg from '../images/about us.svg'
import '../css/About.css'

function About() {
  return (
    <div id='About_main'>
        <div id="left">
            <h1>Get to know about us<span>.</span></h1>
            <p><span>Vchat</span> is video chatting aplication that can be used to do video meeting and online classed.
                This is a easy to use and simple platform where users can create and join a meet room this will give users 
                a personalized expireince. In todays Tech world it is very important to use a video chatting application.
                Hear it will be running on the basis of real time so it would be a great platform where users can do simple chitchat 
                to a video conference client meetings.
            </p>
        </div>
        <div id="right">
            <img className="img" src={svg}/>
        </div>
      
    </div>
  )
}

export default About
