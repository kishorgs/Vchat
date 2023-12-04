import React from 'react'
import '../css/ChatRoom.css'
import Webcam from "react-webcam";

import {MdCallEnd} from "react-icons/md";

function ChatRoom() {

    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const [capturing, setCapturing] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
  
    

    const handleStartCaptureClick = React.useCallback(() => {
      setCapturing(true);
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/mp4"
      });
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
    }, [webcamRef, setCapturing, mediaRecorderRef]);
  
    const handleDataAvailable = React.useCallback(
      ({ data }) => {
        if (data.size > 0) {
          setRecordedChunks((prev) => prev.concat(data));
        }
      },
      [setRecordedChunks]
    );
  

  return (
    <div className='chat-screen'>
        <div className='user-screen'>
        <Webcam audio={false} ref={webcamRef} width={920} height={700}/>
        
            <button className="end-btn">
                <MdCallEnd/>
            </button>
        </div>
        <div className='your-screen'>

        </div>
    </div>
  )
}

export default ChatRoom
  
