import React from 'react'

const VideoPlayer = ({username}) => {
  return (
    <div className="video-player">
        <span className='username'>{username}</span>
        <video className='video-player' autoPlay playsInline></video>
    </div>
  )
}

export default VideoPlayer
