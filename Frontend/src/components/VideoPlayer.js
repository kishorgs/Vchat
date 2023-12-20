import React from 'react'

const VideoPlayer = ({username,user_id}) => {

  return (
    <div className="video-player">
        <span className='username'>{username}</span>
        <video id={user_id} className='video-player' autoPlay playsInline></video>
    </div>
  )
}

export default VideoPlayer
