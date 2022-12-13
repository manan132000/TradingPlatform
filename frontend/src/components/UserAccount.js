import React, { useEffect, useState } from 'react'
import '../css/UserAccount.css'
import '../css/MainSection.css'
import userImg from "../images/user.jpg"
import axios from 'axios'
import Cookies from 'js-cookie'
import DepositPopup from "./DepositPopup";
import {ClipLoader} from 'react-spinners'


const ROOT_URL = "http://127.0.0.1:5000"

function UserAccount() {

    const [buttonPopup, setButtonPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const user = {demat_id: '',
        username: '',
        email: '',
        };
    
    const [userData, setUserData] = useState(user);
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [walletBalance, setWalletBalance] = useState('');
    const [demat_id, setDemat] = useState('');



    useEffect(() => {
        if(isLoading) {
            axios
    .post(ROOT_URL + "/getUserAccount", {
      // demat_id: "4207ec3c-70b2-4d15-8157-83f37a0b6040",
      demat_id: Cookies.get('DematId')
    })
    .then((response) => {
      if (response.data.status === 'SUCCESS'){

         setIsLoading(false);
         setUserData({demat_id: response.data.userProfile.demat_id, 
            username: response.data.userProfile.username, 
            email: response.data.userProfile.email,
            })
          setWalletBalance(response.data.userProfile.walletBalance)  
            
      } 
    })
    .catch(function (error) {
      console.log(error);
    });
       
      }}, [username,isLoading]);
    // const HandleDeposit = async (e) => {
    //     e.preventDefault();
    //     await axios
    //     .post(ROOT_URL + "/addToWallet", {
    //     // demat_id: "4207ec3c-70b2-4d15-8157-83f37a0b6040",
    //     demat_id: Cookies.get('DematId'),
    //     amount: 1000
    //     })
    //     .then((response) => {
    //     if (response.data.status === 'SUCCESS'){
            
            
    //         alert("Cash added to wallet successfully")
    //     } 
    //     })
    //     .catch(function (error) {
    //     alert(error);
    //     });
    // }
    if(isLoading){
        return (
          <div className='main-section'>
            <div className='loader'>
              <ClipLoader color='white' size={50}/>
            </div>  
          </div>
        )
      } else {
  return (
    <div className='main-section user-account'>
        <div className="container user-profile">

                 <div className="row">
                     <div className="col-md-4"> 
                         <div className="">
                             <img className='user-img' src={userImg} alt="userpic"/>
                         </div>
                     </div>

                     <div className="col-md-6"> 
                         <div className="profile-head">
                             <h1>{userData.username}</h1>
                             <h3>Demat ID <span>{userData.demat_id}</span></h3>
                             <ul className="nav nav-tabs">
                              <li className="nav-item">
                                <a className="nav-link user" id="user-tab" data-toggle="tab" href="#user" role="tab" aria-labelledby="user-tab">Personal Info</a>
                              </li>
                              <li className="nav-item">
                                <a className="nav-link fund" id="fund-tab" data-toggle="tab" href="#fund" role="tab">Fund History</a>
                              </li>
                            </ul>
                         </div>
                     </div>

                     <div className="col-md-2">
                         <input type="Submit" className="profile-edit-btn" name="btnAddMore" value="Edit Profile" />
                     </div> 
                 </div>

                 <div className="row">
                     <div className="col-md-4">
                        <div className="acc-info">
                           <p>Account Number : <span>**</span></p>
                           <p>Aadhar card Number : <span>**</span></p>
                           <p>PAN card Number : <span>**</span></p>
                        </div>
                     </div>

                     <div className="col-md-6 pl-5 user-info">
                          <div className="row">
                              <div className="col-md-6">
                                  <label>Username</label>
                              </div>
                              <div className="col-md-6">
                                 <p>{userData.username}</p>
                              </div>
                         </div>

                         <div className="row">
                              <div className="col-md-6">
                                  <label>Email</label>
                              </div>
                              <div className="col-md-6">
                                 <p>{userData.email}</p>
                              </div>
                         </div>

                         <div className="row">
                              <div className="col-md-6">
                                  <label>Password</label>
                              </div>
                              <div className="col-md-6">
                                 <p>***</p>
                              </div>
                         </div>

                         <div className="row">
                              <div className="col-md-6">
                                  <label>Funds</label>
                              </div>
                              <div className="col-md-2">
                                 <p>{walletBalance}</p>
                              </div>
                              <div className="col-md-4">
                                <button className='deposit-btn' onClick={() => setButtonPopup(true)}>DEPOSIT</button>

                                <DepositPopup walletBalance={walletBalance} setWalletBalance={setWalletBalance} trigger={buttonPopup} setTrigger={setButtonPopup}>
                                  
                                </DepositPopup>
                               </div>
                         </div>

                     </div>
                 </div>

        </div>
    </div>
  )
}}

export default UserAccount