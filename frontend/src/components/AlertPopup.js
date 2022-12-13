import React, {useEffect, useState} from 'react'
import Cookies from 'js-cookie'
import axios from "axios";

import '../css/Popup.css';
const ROOT_URL = "http://127.0.0.1:5000"

function AlertPopup(props) {
    const [price, setPrice]=useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        props.setTrigger(false)
        await axios
        .post(ROOT_URL + "/addAlert", {
          // demat_id: "4207ec3c-70b2-4d15-8157-83f37a0b6040",
          demat_id: Cookies.get('DematId'),
          stockTicker: props.ticker,
          currentPrice: props.marketPrice,
          price: price
        })
        .then((response) => {
          if (response.data.status === 'SUCCESS'){
             
              alert("added to ALERTS")
          }
          else if (response.data.status === 'stock not in our list')
                alert ('stock not in our list')
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(()=>{
            setPrice('')
          });
      };
    
  return props.trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="popup-submit-btn" onClick={handleSubmit}>
          Submit
        </button>
        <button className="popup-close-btn" onClick={() => props.setTrigger(false)}>
            <i class="far fa-times-circle"></i>
        </button>
        <label className='popup-form-label'>Ticker</label>
            <input className='popup-input-field' value = {props.ticker} readOnly type="text"></input>
        <label className='popup-form-label'  >Enter price</label>
            <input className='popup-input-field'  value = { price} onChange={(e) => {setPrice(e.target.value)}} type="text"></input>
            
      </div>
    </div>
  ) : (
    ""
  );
}

export default AlertPopup;