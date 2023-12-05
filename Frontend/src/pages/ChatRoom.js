import React,{useState} from 'react'
import '../css/ChatRoom.css'
import { FaUserAlt } from "react-icons/fa";
import {MdCallEnd,MdMessage} from "react-icons/md";
import Message from '../components/Message';
import Users from '../components/Users';
import MessageBox from '../components/MessageBox';

function ChatRoom() {

    const [msgClick,setMsgClick] = useState(false);
    const [userClick,setUserClick] = useState(false);

    

    const msgHandleClick = (e) =>{
        setMsgClick(!msgClick);
        setUserClick(false);

    }

    const userHandleClick = (e) =>{
      setUserClick(!userClick);
      setMsgClick(false);
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
          </div>
            
        </div>
        <div id='chat-box' className='chat-box'>
           {userClick && <Users/> } 
           {msgClick && <MessageBox type='recived-msg'/> }
           {msgClick && <MessageBox type='sent-msg'/> }
          <div className="chat-bottom">
          {msgClick && <Message/> } 
          </div>
        </div>
    </div>
  )
}

export default ChatRoom
