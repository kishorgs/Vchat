import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import '../css/ChatRoom.css';
import {
  FaUserAlt,
  FaMicrophone,
  FaVideo,
  FaVideoSlash,
  FaCopy
} from 'react-icons/fa';
import { MdCallEnd, MdMessage } from 'react-icons/md';
import { FaMicrophoneSlash } from 'react-icons/fa6';
import Message from '../components/Message';
import Users from '../components/Users';
import MessageBox from '../components/MessageBox';
import { useSocket } from '../context/SocketProvider';
import chatContext from '../context/context';
import VideoPlayer from '../components/VideoPlayer';
import Alert from '../components/Alert';
import Peer from 'simple-peer'

function ChatRoom() {
  
  const Socket = useSocket();

  const context = useContext(chatContext);
  const { setRecivedMessage, recivedMessage, roomId,streamRef } = context;

  const [user, setUsers] = useState([{ username: '',roomId:'',roomname:'',socketId:''}]);
  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);
  const [roomname,setroomname] = useState("")



  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log('data', data);
      setRecivedMessage((prevMessages) => [
        ...prevMessages,
        {
          username: data.name,
          message: data.message,
          type: 'recived-msg',
        },
      ]);
    };

    const handleNewUser = (data) => {
      console.log('New User Joined', data);
      setroomname(data.roomname)
      setUsers((prevUsers) => [
        ...prevUsers,
        { username: data.username,roomId:data.roomid,roomname:data.roomname,socketId:data.socketId },
      ]);
    };

    const handleOtherUsers = (data) => {
      setUsers(data)
    };

    Socket.on('reciveMessage', handleReceiveMessage);
    Socket.on('newuser', handleNewUser);
    Socket.on('otheruserslist', handleOtherUsers);

    return () => {
      Socket.off('reciveMessage', handleReceiveMessage);
      Socket.off('newuser', handleNewUser);
      Socket.off('otheruserslist', handleOtherUsers);
    };
  }, [Socket, setRecivedMessage]);

  

  useEffect(() => {
    Socket.emit('otherusers', { roomId: roomId, socketId: Socket.id });
    Socket.emit('all user', { roomId: roomId, socketId: Socket.id });

    return () => {
      Socket.off('otherusers');
      Socket.off('all user');
    };
  }, [Socket, roomId]);




  const createPeer = useCallback((SignalUser, socketId, stream) => {
    console.log('CreatePeer Function Called')
    console.log("Creating peer for", SignalUser, socketId);
    
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
  
    peer.on("signal", (signal) => {
      console.log("Sending signal to", SignalUser, socketId);
      Socket.emit("sending signal", { SignalUser, socketId, signal });
    });
  
    peer.on("connect", () => console.log("Peer connected"));
    peer.on("error", (err) => console.error("Peer connection error:", err));
  
    return peer;
  }, [Socket]);


  const addPeer = useCallback((incomingSignal, socketId, stream) => {
    console.log("Adding peer for", socketId);
    console.log(stream)
    
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      
      console.log("Returning signal to", socketId);
      

        Socket.emit("returning signal", { signal, socketId });
       
    });
  
    peer.signal(incomingSignal);
  
    peer.on("connect", () => console.log("Peer connected"));
    peer.on("error", (err) => console.error("Peer connection error:", err));
  
    return peer;
  }, [Socket]);

 


  useEffect(()=>{
    document.getElementById('localstream').srcObject = streamRef.current;
  })

  useEffect(() => {
    const handleUserList = (data) => {
      console.log('User list received', data);
      const peers = [];
      data.forEach((user) => {
        const existingPeer = peersRef.current.find((p) => p.peerID === user.socketId);
  
        if (!existingPeer) {
         

            const peer = createPeer(user.socketId, Socket.id, streamRef.current);
            
            peersRef.current.push({
              peerID: user.socketId,
              peer,
            });
            peers.push(peer);
          
        } else {
          console.log('Peer already exists for', user.socketId);
          peers.push(existingPeer.peer);
        }
      });
      setPeers(peers);
    };
  
    Socket.on('user list', handleUserList);
  
    const handleUserJoined = (payload) => {
      console.log('User joined', payload);
      const existingPeer = peersRef.current.find((p) => p.peerID === payload.socketId);
  
      if (!existingPeer) {
        const peer = addPeer(payload.signal, payload.socketId, streamRef.current);
        peersRef.current.push({
          peerID: payload.socketId,
          peer,
        });
        setPeers((users) => [...users, peer]);
      } else {
        console.log('Peer already exists for', payload.socketId);
      }
    };
  
    Socket.on('user joined', handleUserJoined);
  
    const handleReturningSignal = (payload) => {
      console.log('Returning signal', payload);
      const item = peersRef.current.find((p) => p.peerID === payload.id);
      console.log('Signal received for', payload.id);   
      item.peer.signal(payload.signal);
    };
  
    Socket.on('receiving returned signal', handleReturningSignal);

  
    return () => {
      Socket.off('user list', handleUserList);
      Socket.off('user joined', handleUserJoined);
      Socket.off('receiving returned signal', handleReturningSignal);
    };
  }, [Socket, addPeer, createPeer]);
  


  useEffect(() => {
    
        peersRef.current.forEach((peer) => {
          console.log('Peer:', peer);
          peer.peer.on('stream', (stream) => {
            console.log('Received stream for', peer.peerID, stream);
            const videoElement = document.getElementById(`${peer.peerID}`);
            if (videoElement) {
              console.log('Setting stream for', peer.peerID);
              videoElement.srcObject = stream;
            }
          });
  
      });
      
  
});  
 
   
  
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

    const handleCopy = (e) => {
      navigator.clipboard.writeText(roomId);
      showAlert("Room Id copied to clipboard !!!","info");
    }

    const [alert, setAlert] = useState(null);
    const showAlert = (message, type) => {
      setAlert({ message, type });
      setTimeout(() => {
        setAlert(null);
      }, 1500);
    };

  return (
    <div className='chat-screen'>
        <div className='user-screen'>
        <div className='video-screen'>
          <VideoPlayer username='you' user_id='localstream'/>
          {user.map((data,index)=>(
            data.username!=='' && data.stream!=='' ? (<VideoPlayer key={index} username={data.username} user_id={data.socketId}/>):null
          ))}
        
        </div>

        <div className="video-footer">

              <div className='details'>
                    <h2>Room Name : {roomname}</h2>
                    <h2>Room Id : {roomId} <span onClick={handleCopy} className='copy-icon'><FaCopy /></span></h2>
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
        {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => {
            setAlert(null);
          }}
        />
      )}
    </div>
  )
}

export default ChatRoom
