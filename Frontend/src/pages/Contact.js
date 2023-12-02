import React from 'react'
import svg from '../images/contact.svg'
import '../css/Contact.css'

function Contact() {
  return (
    <div id='Contact_main'>
        <div id="left">
            <div id="form">
                <h1>
                    Keep in touch.
                </h1>
                <label for="name">Name :</label>
                <input type="text" id="name"/>
                <label for="email">Email id :</label>
                <input type="email" id="email"/>
                <label for="message">message :</label>
                <textarea id="message" rows={4}></textarea>

                <button>Send</button>
            </div>
            
        </div>
        <div id="right">
            <img className="img" src={svg}/>
        </div>
      
    </div>
  )
}

export default Contact
