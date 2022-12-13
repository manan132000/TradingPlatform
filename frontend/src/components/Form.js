import { useState } from "react";
import axios from "axios";
import '../../src/css/Form.css'
import {Link, useNavigate} from "react-router-dom";
import { useCookies } from 'react-cookie';
import React from 'react'


const ROOT_URL = "http://127.0.0.1:5000"

function Form(props) {
  const [currentUsername, handlecurrentUsername] = useState("");
  const [currentPassword, handlecurrentPassword] = useState("");
  const [loginError,setLoginError]=useState(false);
  const [validUser,setValidUser] = useState(true);
  const [validPass,setValidPass] = useState(true);
  const usernameRegex = /^[a-zA-Z0-9]*$/;
  const [cookies, setCookie] = useCookies(['user'])
  let navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!currentPassword)
    {
      setValidPass(false);
      console.log("INVALID PASS")
    }
    else if(currentPassword)
    {
      setValidPass(true);
    }
    
    setValidUser(usernameRegex.test(currentUsername));
    if(!currentUsername)
    {
      setValidUser(false);
    }
    if(currentPassword && validUser && currentUsername)
    {
      let loginData = {
        username: currentUsername,
        password: currentPassword,
      };
      await axios
      .post(ROOT_URL + "/login", {
        username: loginData.username,
        password: loginData.password,
      })
      .then((response) => {
        //console.log(response.data);
        
        if (response.data.status === 'SUCCESS'){
          setCookie('DematId', response.data.demat_id, { path: '/' });
          props.fxn2(true);
          navigate("/home");
        }
        else{
          setLoginError(true);
        }

      })
      .catch(function (error) {
        alert("Server error ", error);
        console.log(error);
      });
    }
    

  };

  function changeUserField(e) {
    handlecurrentUsername(e.target.value);
    setValidUser(usernameRegex.test(currentUsername));
    console.log("IS valid : ", validUser);
  }

  if(cookies.DematId) {
        console.log("SHOULD LOGIN");
        props.fxn2(true);
        navigate("/home");
  }
  
  
  else {
    return (
      
        <div className="login-form-div">
          <div className="text-center">
            <p>Log in to your account</p>
          </div>
          
            <form className="login-form">
            <div className="mb-3 login-field">
                <label htmlFor="" className="form-label">Username</label>
                <input value={currentUsername} onChange={changeUserField} type="text" className="form-control" required />
                {!(validUser) && <p className="invalid-field">please enter a valid username</p>}
            </div>
            <div className="mb-3 login-field">
                <label htmlFor="" className="form-label">Password</label>
                <input value={currentPassword} onChange={(e) => { handlecurrentPassword(e.target.value);}} type="password" className="form-control" required />
                {!(validPass) && <p className="invalid-field">please enter a valid password</p>}
            </div>
            <br />
            <button onClick={handleLogin} type="submit" className="btn btn-primary submit-btn">Sign in</button>
            </form>

            {!loginError && <div className="text-center signup-link-div">
              New to this platform? 
              <Link to='/signup' >Sign Up here</Link>
            </div>}
            {loginError && <div className="text-center login-error">Incorrect login credentials. If you are a new user, click <Link to= "/signup">here</Link> to sign up!</div>}
            
        </div>
      
    )
  }

}

export default Form;