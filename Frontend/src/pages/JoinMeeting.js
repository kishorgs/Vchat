import React, { useState,useEffect } from "react";
import "../css/CreateMeeting.css";
import Alert from "../components/Alert";

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
  const [isSubmit, setIsSubmit] = useState(false);

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
    } else if (formValues.roomId.length === 0 && isSubmit) {
      showAlert(formErrors.roomId, "error");
    } else if (formValues.roomId.length !== 6 && isSubmit) {
      showAlert(formErrors.roomId, "error");
    } 

    if (formValues.name.length >= 0 && formValues.roomName.length >= 0 && isSubmit){
      formValues.name = "";
      formValues.roomName = "";
    }
  };

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
