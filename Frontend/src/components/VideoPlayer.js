import React, { useState } from 'react'
import "../css/ChatRoom.css"

const VideoPlayer = ({username,user_id}) => {

  return (
    <div className="video-player">
        <span className='username'>{username}</span>
        <video id={user_id} autoPlay playsInline ></video>
    </div>
  )
}

export default VideoPlayer