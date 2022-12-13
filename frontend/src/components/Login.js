import React from 'react'
import '../../src/css/Login.css'
import Form from './Form'
import axios from 'axios'
import {useNavigate} from "react-router-dom";

const ROOT_URL = "http://127.0.0.1:5000"

function Login(props) {

  let navigate2=useNavigate();

  const func = async(e) => {
    await axios
    .post(ROOT_URL + "/checkLoggedIn", {})
    .then((response) => {
      //console.log(response.data);
      
      if (response.data.status === 'Already Logged In'){
        props.fxn(true);
        console.log('hello');
        navigate2("/home");
      }
      
    })
    .catch(function (error) {
      // console.log(error.response);
    });
  }
   

  return (
    <div className='login-div'>
        <Form fxn2={props.fxn} />
    </div>
  )
}

export default Login