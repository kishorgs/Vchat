import React, { useState,useEffect } from "react";
import "../css/CreateMeeting.css";
import Alert from "../components/Alert";
import {useNavigate} from 'react-router-dom'

function CreateMeeting({setProgress}) {

  useEffect(()=>{
    setProgress(10)
    setTimeout(()=>{
    setProgress(100)
  },500)
    
      },[setProgress])

  const initialVlaues = { name: "", roomName: "" };

  const [formValues, setFormValues] = useState(initialVlaues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [passcode, setPasscode] = useState('');
  const navigate = useNavigate();

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
    setIsSubmit(true);

    if (formValues.name.length === 0 && isSubmit) {
      showAlert(formErrors.name, "error");
      return;
    } else if (formValues.roomName.length === 0 && isSubmit) {
      showAlert(formErrors.roomName, "error");
      return;
    }
    if (formValues.name.length >= 0 && formValues.roomName.length >= 0 && isSubmit){
      formValues.name = "";
      formValues.roomName = "";

      const newPasscode = generateRandomPasscode();
      setPasscode(newPasscode);

      navigate("/chat-room");
      console.log(newPasscode);
    }
  };

  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Username is required!";
    }
    if (!values.roomName) {
      errors.roomName = "Room name is required!";
    }

    return errors;
  };

  const generateRandomPasscode = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let passcode = '';

    passcode += Math.floor(Math.random() * 10); // First digit
    passcode += Math.floor(Math.random() * 10); // second digit

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * (charset.length - 10)) + 10;
      passcode += charset[randomIndex];
    }

    // Shuffle the passcode characters
    passcode = passcode.split('').sort(() => Math.random() - 0.5).join('');

    console.log(passcode);
    return passcode;
  };


  return (
    <div id="Create-main">
      <form id="frame" onSubmit={handleSubmit}>
        <h1>Create Video Chat Room</h1>
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
        <label htmlFor="Room-name">Room Name :</label>
        <input
          type="text"
          id="Room-name"
          placeholder="Enter Room Name"
          name="roomName"
          value={formValues.roomName}
          onChange={handleChange}
          autoComplete="off"
        />
        <button type="submit">Create Room</button>
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

export default CreateMeeting;
