import React,{useState,useEffect, useContext} from 'react'
import '../css/ChatRoom.css'
import { FaUserAlt,FaMicrophone,FaVideo,FaVideoSlash } from "react-icons/fa";
import {MdCallEnd,MdMessage} from "react-icons/md";
import { FaMicrophoneSlash } from "react-icons/fa6";
import Message from '../components/Message';
import Users from '../components/Users';
import MessageBox from '../components/MessageBox';
import { useSocket } from '../context/SocketProvider';
import chatContext from '../context/context';

function ChatRoom() {

  const Socket = useSocket();

  const context = useContext(chatContext);
  const {setRecivedMessage,recivedMessage} = context


  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("data", data);
      setRecivedMessage((prevMessages) => [
        ...prevMessages,
        { username: data.name, message: data.message, type: "recived-msg" },
      ]);
    };
    Socket.on("reciveMessage", handleReceiveMessage);
    return () => {
      Socket.off("reciveMessage", handleReceiveMessage);
    };
  }, [Socket]);

    const [msgClick,setMsgClick] = useState(false);
    const [userClick,setUserClick] = useState(false);
    const [videoClick,setVideoClick] = useState(true);
    const [audioClick,setAudioClick] = useState(true);


    const msgHandleClick = (e) =>{
        setMsgClick(!msgClick);
        setUserClick(false);

    }

    const userHandleClick = (e) =>{
      setUserClick(!userClick);
      setMsgClick(false);
    }

    const videoHandleClick = (e) =>{
      setVideoClick(!videoClick);
      document.getElementById("cam").classList.toggle("active");
    }

    const audioHandleClick = (e) =>{
      setAudioClick(!audioClick);
      document.getElementById("mic").classList.toggle("active");
    }


  return (
    <div className='chat-screen'>
        <div className='user-screen'>

          <div className="btn-grp">
            <button className="end-btn">
                <MdCallEnd/>
            </button>
            <button onClick={userHandleClick} className="user-btn">
                <FaUserAlt />
            </button>
            <button onClick={msgHandleClick} className="msg-btn">
                <MdMessage />
            </button>
            <button onClick={audioHandleClick} id="mic" className="msg-btn">
                { audioClick ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </button>
            <button onClick={videoHandleClick} id="cam" className="msg-btn">
                { videoClick ? <FaVideo /> : <FaVideoSlash /> } 
            </button>
          </div>
            
        </div>
        <div id='chat-box' className='chat-box'>
           {userClick && <Users/> } 
           { msgClick && recivedMessage.map((data,index)=>{
              return <MessageBox key={index} username={data.username} message={data.message} type={data.type}/>
           })}
          <div className="chat-bottom">
          {msgClick && <Message/> } 
          </div>
        </div>
    </div>
  )
}

export default ChatRoom
