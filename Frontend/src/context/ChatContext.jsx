import React, { useState } from 'react'
import chatContext from './context'

function ChatContext(props) {
  const [username,setUsername] = useState("");
  const [roomId,setRoomId] = useState("");
  const [recivedMessage,setRecivedMessage]=useState([{username:'',message:'',type:''}]);
  return (
    <chatContext.Provider value={{username,setUsername,roomId,setRoomId,recivedMessage,setRecivedMessage}}>
        {props.children}
    </chatContext.Provider>
  )
}

export default ChatContext
