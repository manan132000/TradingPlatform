import React from 'react';
import { useState } from "react";
import axios from "axios";
import '../../src/css/Login.css'
import '../css/Signup.css'
import {useNavigate, Navigate } from "react-router-dom";
import image from '../images/signup-image.png'
import { useCookies } from 'react-cookie';
//import bcrypt from 'bcrypt'

const ROOT_URL = "http://127.0.0.1:5000"
//const salt = bcrypt.genSaltSync(5)

function Signup(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignedIn,setIsSignedIn]=useState(false);
  const [username,setUsername]=useState("");
  const [threwError,setThrewError]=useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [validUser,setValidUser] = useState(true);
  const [validEmail,setValidEmail] = useState(true);
  const [validPass,setValidPass] = useState(true);
  const usernameRegex = /^[a-zA-Z0-9]*$/;
  const emailRegex = /\S+@\S+\.\S+/;
  const [cookies, setCookie, ] = useCookies(['user'])
  let navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if(!password)
    {
      setValidPass(false);
    }
    else if(password)
    {
      setValidPass(true);
    }
      setValidEmail(emailRegex.test(email));
      setValidUser(usernameRegex.test(username));
      if(!username)
    {
      setValidUser(false);
    }
    if(!email)
    {
      setValidEmail(false);
    }
    if(password && validEmail && validEmail && email && username)
    {
      let signupData = {
        email: email,
        password: password,
        username: username
      };
      
      await axios
      .post(ROOT_URL + "/signup", {
        email: signupData.email,
        password: signupData.password,
        username:signupData.username
      })
      .then((response) => {
        if (response.data.status === 'SUCCESS'){
          setCookie('DematId', response.data.demat_id, { path: '/' });
          props.fxn(true);
          setIsSignedIn(true);
        } else if(response.data.status === 'ALREADY EXISTS') {
          setAlreadyExists(true);
        }
        else{
          setThrewError(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  };

  function changeUserField(e)
  {
    setUsername(e.target.value);
    setValidUser(usernameRegex.test(username));
    console.log("IS valid : ", validUser);
  }

  function changeEmailField(e)
  {
    setEmail(e.target.value);
    setValidEmail(emailRegex.test(email));
    console.log("IS valid : ", validEmail);
  }

  if(cookies.DematId) {
        console.log("SESSION LOGIN");
        props.fxn(true);
        navigate("/home");
  }
  else {

    return (

      <div>
          <div className='image-div'>
            <img src={image} alt=''/>
        </div>
        <div className="signup-div">
          <div className="form-heading">
            Create a new account
          </div>
          <form className='signup-form'>
          <div className="mb-3 login-field">
              <label htmlFor="" className="form-label">Email-id</label>
              <input value={email} onChange={changeEmailField} type="email" className="form-control" />
              {!(validEmail) && <p className="invalid-field">please enter a valid Email</p>}
          </div>
          <div className="mb-3 login-field">
              <label htmlFor="" className="form-label">Password</label>
              <input value={password} onChange={(e) => { setPassword(e.target.value);}} type="password" className="form-control" />
              {!(validPass) && <p className="invalid-field">please enter a valid password</p>}
          </div>
          <div className="mb-3 login-field">
              <label htmlFor="" className="form-label">Username</label>
              <input value={username} onChange={changeUserField} type="text" className="form-control" />
              {!(validUser) && <p className="invalid-field">please enter a valid username</p>}
          </div>
      
          <button onClick={handleSignup} type="submit" className="btn btn-primary submit-btn">Sign Up</button>
          </form>
          {alreadyExists && <div className="text-center login-error">User already exists.</div>}
          {isSignedIn && <Navigate to="/home" /> }
        </div>
          {threwError && <div className="signupError">Please try again.</div>}
      </div>
    )
  }
}

export default Signup;