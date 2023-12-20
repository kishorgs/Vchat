import React, { useState,useEffect, useContext } from "react";
import "../css/CreateMeeting.css";
import Alert from "../components/Alert";
import {useNavigate} from 'react-router-dom'
import { useSocket } from "../context/SocketProvider";
import chatContext from "../context/context";

function JoinMeeting({setProgress}) {

  useEffect(()=>{
    setProgress(10)
    setTimeout(()=>{
    setProgress(100)
  },500)
    
      },[setProgress])

  const initialVlaues = { name: "", roomId: "" };

  const [formValues, setFormValues] = useState(initialVlaues);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const socket = useSocket();
  const context = useContext(chatContext);
  const {setUsername,setRoomId,streamRef} = context;

  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));

    if (formValues.name.length === 0) {
      showAlert(formErrors.name, "error");
    } else if (formValues.roomId.length === 0) {
      showAlert(formErrors.roomId, "error");
    } else if (formValues.roomId.length !== 6) {
      showAlert(formErrors.roomId, "error");
    }

    if (formValues.name.length >= 0 && formValues.roomId.length >= 0){

      let name = formValues.name;
      let roomid = formValues.roomId;

      socket.emit("room:join",{name,roomid});

     
      setUsername(name);
      setRoomId(roomid);

      formValues.name = "";
      formValues.roomId = "";

      
      
      navigate(`/chat-room/${roomid}`);
      
      
      setProgress(100)
    }
  };

  useEffect(()=>{
    const getMedia =  async() => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
    };
    getMedia();
  },[streamRef])


  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Username is required!";
    }
    if (!values.roomId) {
      errors.roomId = "Room Id is required!";
    }

    if (values.roomId.length !== 6) {
      errors.roomId = "Room Id should be six characters!";
    }

    return errors;
  };

  return (
    <div id="Create-main">
      <form id="frame" onSubmit={handleSubmit}>
        <h1>Join Video Chat Room</h1>
        <label htmlFor="name">Name :</label>
        <input
          type="text"
          id="name"
          placeholder="Enter Name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          autoComplete="off"
        />
        <label htmlFor="Room-id">Room id :</label>
        <input
          type="text"
          id="Room-id"
          placeholder="Enter six character id"
          name="roomId"
          value={formValues.roomId}
          onChange={handleChange}
          autoComplete="off"
        />
        <button>Join Room</button>
      </form>

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
  );
}

export default JoinMeeting;
