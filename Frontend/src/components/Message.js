import React, { useState } from 'react'
import { LuSend } from "react-icons/lu";
import "../css/Message.css"

function Message() {
    const [message,setmessage]=useState('');

    const handleClick=()=>{


    }


  return (
    <>
    <div className='message'>
      <input type='text' value={message} onChange={(e)=>{setmessage(e.target.value)}} placeholder='Message' name="message"/>
      <button onClick={handleClick} className="send-btn"><LuSend /></button>
    </div>
    </>
  )
}

export default Message
