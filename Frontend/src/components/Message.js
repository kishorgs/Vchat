import React, { useContext, useState } from 'react'
import { LuSend } from "react-icons/lu";
import "../css/Message.css"
import chatContext from '../context/context';
import { useSocket } from '../context/SocketProvider';

function Message() {
  const Socket = useSocket();

    const [message,setmessage]=useState('');

    const context = useContext(chatContext);
    const {username,roomId,setRecivedMessage,recivedMessage} = context;

  
    const handleClick=()=>{
        Socket.emit("sendMessage",{
          message:message,
          username:username,
          roomId:roomId
        })
        setRecivedMessage((prevMessages) => [
          ...prevMessages,
          { username: username, message: message, type: "sent-msg" },
        ]);
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
