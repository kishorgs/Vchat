import React from 'react'
import "../css/Messagebox.css"

function MessageBox({username,message,type}) {


  return (
    <div className={`message-box ${type}`}>
      <div className="name">{username}</div>
      <div className="msg">{message}</div>
      <div className="time"></div>
    </div>
  )
}

export default MessageBox
