// import React from "react";
import '../css/Popup.css';
import React, {useEffect, useState} from 'react'
// import '../css/StockInfo.css'
import axios from "axios";
import {ClipLoader} from 'react-spinners'
import Cookies from 'js-cookie'
import Chart from "react-google-charts";
import { ContactsOutlined } from '@material-ui/icons';
// import StockInfoPopup from "./StockInfoPopup";

const ROOT_URL = "http://127.0.0.1:5000"

function StockInfoPopup(props) {
  console.log(props.ticker)

  const [number,setNumber]=useState('')
  const [price, setPrice]=useState('')
  const [optionVisible, setOptionVisible]=useState(true)
  const [marketPriceChosen, setMarketPriceChosen]=useState(false)
  const [option, setOption]=useState('')
  // const [minPrice,setMinPrice]=useState('')
  // const [maxPrice,setMaxPrice]=useState('')
  
  const handleBuy = async (e) => {
    // e.preventDefault();
    await axios
    .post(ROOT_URL + "/buyStock", {
      "demat_id": Cookies.get('DematId'),
      "stockCode": props.ticker,
      "number": number,
      "maxPrice":price,
      "option": option
    })
    .then((response) => {
      if (response.data.status === 'SUCCESS'){
          
          alert("Request sent");
          setNumber('');
          setPrice('');
      } 
      else{
        alert(response.data.status);
      }
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(()=>{
      // setNumber(0);
      // setMaxPrice('');
      setNumber('');
      setPrice('');
    });
  };
  
  const handleSell = async (e) => {
    // e.preventDefault();
    
    await axios
    .post(ROOT_URL + "/sellStock", {
      "demat_id": Cookies.get('DematId'),
      'stockCode': props.ticker,
      'number':number,
      'minPrice':price,
      "option": option
    })
    .then((response) => {
      if (response.data.status === 'SUCCESS'){
          alert("Request Sent")
         
      }
      else{
        alert(response.data.status);
      }
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(()=>{
     
      setNumber('');
      setPrice('');
      // setMinPrice('');
    });
  };

  function handleSubmit(){
    console.log("entered Handle click")
    if(props.type == "Buy") {
      // setMaxPrice(price)
      // console.log("max", maxPrice)
      handleBuy()
    }
      
    else {
      // setMinPrice(price)
      handleSell();
    }
    setOptionVisible(true)
    props.setTrigger(false)
    setMarketPriceChosen(false)
    setOption('')
  }

  function handleClose() {
    props.setTrigger(false)
    setOptionVisible(true)
    setMarketPriceChosen(false)
    setOption('')
  }

  function handleMarketClick() {
    setOptionVisible(false)
    setMarketPriceChosen(true)
    setOption("Market")
  }

  function handleCustomClick() {
    setOption("Custom")
    setOptionVisible(false)
  }
  console.log("price ",  price)
  if (props.trigger) {
    if (optionVisible){
      return (<div className="popup">
      <div className="popup-inner">
        <button className="popup popup-submit-btn first-button" onClick={handleMarketClick}>
          {props.type} at Market price
        </button>
        <button className="popup popup-submit-btn second-button" onClick={handleCustomClick }>
          {props.type} at custom price
        </button>
        {/* <button className="popup popup-submit-btn third-button" onClick={handleSubmit}>
          {props.type} at something
        </button> */}
        <button className="popup-close-btn" onClick={handleClose}>
            <i class="far fa-times-circle"></i>
        </button>
        {/* {props.children} */}
       
      </div>
    </div>)
    } else {
      return  (
        <div className="popup">
          <div className="popup-inner">
            <button className="popup-submit-btn" onClick={handleSubmit}>
              Submit
            </button>
            <button className="popup-close-btn" onClick={handleClose}>
                <i class="far fa-times-circle"></i>
            </button>
            {/* {props.children} */}
            <label className='popup-form-label'  >Enter price</label>
            <input className='popup-input-field' readonly= {marketPriceChosen} value = {marketPriceChosen? props.marketPrice: price} onChange={(e) => {setPrice(e.target.value)}} type="text"></input>
            <label className='popup-form-label'>Enter number of stocks</label>
            <input className='popup-input-field' value = {number} onChange={(e) => {setNumber(e.target.value)}} type="text"></input>
          </div>
        </div>
      )
  }
}

  else {
    return ("")
  }
  
}

export default StockInfoPopup;