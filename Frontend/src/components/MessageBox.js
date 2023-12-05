import React from 'react'
import "../css/Messagebox.css"

function MessageBox({username,message,type}) {
  return (
    <div className={`message-box ${type}`}>
      <div className="name">name</div>
      <div className="msg">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore quas ut repellat, error excepturi eaque dignissimos! Optio perferendis natus placeat officiis id reiciendis.</div>
      <div className="time">10:26</div>
    </div>
  )
}

export default MessageBox
