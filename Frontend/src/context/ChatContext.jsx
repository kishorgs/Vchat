import React, { useRef, useState } from 'react'
import chatContext from './context'

function ChatContext(props) {
  const [username,setUsername] = useState("");
  const [roomId,setRoomId] = useState("");
  const [roomname,setroomname] = useState("")
  const streamRef = useRef(null);
  const [recivedMessage,setRecivedMessage]=useState([{username:'',message:'',type:''}]);
  return (
    <chatContext.Provider value={{username,setUsername,roomId,setRoomId,recivedMessage,setRecivedMessage,roomname,setroomname,streamRef}}>
        {props.children}
    </chatContext.Provider>
  )
}

export default ChatContext
