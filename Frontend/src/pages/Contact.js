import React, { useState, useEffect, useRef } from "react";
import svg from "../images/contact.svg";
import "../css/Contact.css";
import Alert from "../components/Alert";
import emailjs from "@emailjs/browser";

function Contact({setProgress}) {

  useEffect(()=>{
    setProgress(10)
    setTimeout(()=>{
    setProgress(100)
    },500)
  },[setProgress])


  const initialVlaues = { name: "", emailId: "",message:"" };

  const [formValues, setFormValues] = useState(initialVlaues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Username is required!";
    }
    if (!values.emailId) {
      errors.emailId = "Email Id is required!";
    }
    if (!values.message) {
      errors.message = "Message is required!";
    }

    return errors;
  };


  const form = useRef();
  useEffect(() => {
    setTimeout(() => {}, 500);
  }, []);

  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const sendEmail = (e) => {
    e.preventDefault();

    setFormErrors(validate(formValues));
    setIsSubmit(true);


    if (formValues.name.length === 0 && isSubmit) {
      showAlert(formErrors.name, "error");
      return;
    } else if (formValues.emailId.length === 0 && isSubmit) {
      showAlert(formErrors.emailId, "error");
      return;
    }else if (formValues.message.length === 0 && isSubmit) {
      showAlert(formErrors.message, "error");
      return;
    }
    
    if(formValues.name.length > 0 && 
      formValues.emailId.length > 0 &&
      formValues.message.length > 0 && isSubmit){

    emailjs
      .sendForm(
        "service_ke40cac",
        "template_2gqg0rd",
        form.current,
        "h2m7l49m1sSvt4nct"
      )
      .then(
        (result) => {
          document.getElementById("form-contact").reset();
          showAlert(
            "Mail sent successfully. Thank you for getting in touch!",
            "success"
          ); // Show the success modal
        },
        (error) => {
          showAlert("Mail not sent", "error");
        }
      );


      formValues.name = "";
      formValues.emailId = "";
      formValues.message = "";
    }
  };


  return (
    <div id="Contact_main">
      <div id="left">
        <form id="form-contact" ref={form} onSubmit={sendEmail}>
          <h1>Keep in touch.</h1>
          <label htmlFor="name">Name :</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            autoComplete="off"
          />
          <label htmlFor="email">Email id :</label>
          <input
            type="email"
            name="emailId"
            id="email"
            value={formValues.email}
            onChange={handleChange}
            autoComplete="off"
          />
          <label htmlFor="message">message :</label>
          <textarea
            id="message"
            name="message"
            value={formValues.message}
            onChange={handleChange}
            rows={4}
            autoComplete="off"
          ></textarea>

          <button type="submit">Send</button>
        </form>
      </div>
      <div id="right">
        <img className="img" alt="contact-Svg" src={svg} />
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
  );
}

export default Contact;
