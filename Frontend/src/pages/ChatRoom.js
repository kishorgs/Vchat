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
import Webcam from "react-webcam";
import VideoPlayer from '../components/VideoPlayer';

function ChatRoom() {

  const Socket = useSocket();

  const context = useContext(chatContext);
  const {setRecivedMessage,recivedMessage,roomId} = context

  const[user,setNewuser]=useState([{username:'',stream:''}])
  const[otheruser,setotheruser]=useState([{username:'',stream:''}])


  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("data", data);
      setRecivedMessage((prevMessages) => [
        ...prevMessages,
        { username: data.name, message: data.message, type: "recived-msg" },
      ]);
    };
    


    const handleNewUser =(data)=>{
      console.log('New User Joined',data);
      setNewuser((prevuser)=>[...prevuser,{username:data.username,stream:data.stream}])


    }

    const handleOtheruser=(data)=>{
      console.log(data)
    }

    Socket.on("reciveMessage", handleReceiveMessage);
    Socket.on("newuser", handleNewUser);
    Socket.on("otheruserslist", handleOtheruser);
    return () => {
      Socket.off("reciveMessage", handleReceiveMessage);
      Socket.off("newuser", handleNewUser);
      Socket.off("otheruserslist",handleOtheruser);
    };
  }, [Socket]);

  Socket.emit('otherusers',{roomId:roomId,socketId:Socket.id})

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
        <div className='video-screen'>
          <VideoPlayer username='you'/>
          {user.map((data)=>(
            data.username!=='' && data.stream!=='' ? (<VideoPlayer username={data.username}/>):null
          ))}
          {otheruser.map((data)=>(
            data.username!=='' && data.stream!=='' ? (<VideoPlayer username={data.username}/>):null
          ))}
        </div>

        <div className="video-footer">


              <div className='details'>
                    <h2>Name</h2>
                    <h2>ID</h2>
              </div>

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
            
        </div>
        <div id='chat-box' className='chat-box'>
          <div className="chat-body">
            {userClick && <Users/> } 
            { msgClick && recivedMessage.map((data,index)=>{
                return <MessageBox key={index} username={data.username} message={data.message} type={data.type}/>
            })}
           </div>
          <div className="chat-bottom">
          {msgClick && <Message/> } 
          </div>
        </div>
    </div>
  )
}

export default ChatRoom
