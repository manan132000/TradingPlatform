import React, {useEffect, useState} from 'react'
import '../css/StockInfo.css'
import axios from "axios";
import {ClipLoader} from 'react-spinners'
import Cookies from 'js-cookie'
import Chart from "react-google-charts";
import StockInfoPopup from "./StockInfoPopup";
import {useNavigate} from "react-router-dom";
import AlertPopup from "./AlertPopup";

// import Popup from 'reactjs-popup'

const ROOT_URL = "http://127.0.0.1:5000"

function StockInfo(props) {
  let navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [number,setNumber]=useState('')
    const [minPrice,setMinPrice]=useState('')
    const [maxPrice,setMaxPrice]=useState('')
    const [transType,setTransType]=useState('')
    const [buttonPopup, setButtonPopup] = useState(false);
    const [alertButtonPopup, setAlertButtonPopup] = useState(false)
   
    const stock = {day_low:0,
                    day_high:0,
                    regular_market_price:0,
                    candlestick:[]};

    const [stockData, setStockData] = useState(stock)
    // const [stockVal, setStockVal] = useState([])
    // console.log(stock.day_low);
    useEffect(() => {
      if(isLoading){
    axios
    .post(ROOT_URL + "/getStock", {
      ticker_symbol: props.ticker
    })
    .then((response) => {
      if (response.data.status === 'SUCCESS'){
        setIsLoading(false);
        setStockData({day_low: response.data.stock.day_low,
                        day_high: response.data.stock.day_high,
                        regular_market_price: response.data.stock.regular_market_price,
                        candlestick: response.data.candleStick});
        console.log("stockData", stockData)
        console.log("Response", response.data.candleStick)
      } 
    })
    .catch(function (error) {
      console.log(error);
    });
    }}, [props.ticker,isLoading]);


  // const handleBuy = async (e) => {
  //   e.preventDefault();
  //   await axios
  //   .post(ROOT_URL + "/buyStock", {
  //     "demat_id": Cookies.get('DematId'),
  //     "stockCode": props.ticker,
  //     "number": number,
  //     "maxPrice":maxPrice
  //   })
  //   .then((response) => {
  //     if (response.data.status === 'SUCCESS'){
          
  //         alert("Request sent");
  //     } 
  //     else{
  //       alert(response.data.status);
  //     }
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   })
  //   .then(()=>{
  //     setNumber(0);
  //     setMaxPrice('');
  //   });
  // };

  // const handleSell = async (e) => {
  //   e.preventDefault();
    
  //   await axios
  //   .post(ROOT_URL + "/sellStock", {
  //     "demat_id": Cookies.get('DematId'),
  //     'stockCode': props.ticker,
  //     'number':number,
  //     'minPrice':minPrice
  //   })
  //   .then((response) => {
  //     if (response.data.status === 'SUCCESS'){
  //         alert("Request Sent")
  //     }
  //     else{
  //       alert(response.data.status);
  //     }
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   })
  //   .then(()=>{
  //     setNumber(0);
  //     setMinPrice('');
  //   });
  // };

  const handleAdd = async (e) => {
    e.preventDefault();
    
    await axios
    .post(ROOT_URL + "/addToWatchlist", {
      // demat_id: "4207ec3c-70b2-4d15-8157-83f37a0b6040",
      demat_id: Cookies.get('DematId'),
      stockTicker: props.ticker,
    })
    .then((response) => {
      if (response.data.status === 'SUCCESS'){
          console.log("added to watchlist")
          alert("added to watchlist")
      }
      else if(response.data.status==='already in wl'){
        alert("stock already in watchlist!");
      } 
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  function handleBuyClick(){
    setButtonPopup(true)
    setTransType("Buy")
  }

  function handleSellClick(){
    setButtonPopup(true)
    setTransType("Sell")
  }


  var data = [["Time", "Low", "Close", "Open", "High"]];
  for (var i = 0; i < stockData.candlestick.length; i+=10)
  {
    data.push(stockData.candlestick[i])
  }

  // data.push(stockData.candlestick);
  console.log("stockData2", data);

    if(isLoading) {
        return (
        <div className='main-section'>
            <div className='loader'>
                <ClipLoader color='white' size={50}/>
            </div>  
        </div>)
    } else {
        return (<div className='main-section'>
        <div className="candlesticks-chart-div">
          <Chart
            width={'100%'}
            height={450}
            chartType="CandlestickChart"
            loader={<div>Loading Chart</div>}
            data={data}
            options={{
              legend: 'none',
              backgroundColor: '#1f2227',
              vAxis: {
                textStyle:{color: '#ddd'}
              },
              hAxis: {
                textStyle:{color: '#ddd'}
              }  
            }}
            rootProps={{ 'data-testid': '1' }}
          />             
        </div>  
        <div className='stock-info-div'>
          <p>Symbol: {props.ticker}</p>
          <p>Day low: {stockData.day_low} </p>
          <p>Day High: {stockData.day_high} </p>
          <p>Regular Market Price: {stockData.regular_market_price}</p>
          
          <button className='stock-info-btn black-font' onClick={handleAdd}>Add to watchlist</button>
          <button className='stock-info-btn black-font' onClick={() => {setAlertButtonPopup(true)}}>Create an alert</button>
          <AlertPopup  marketPrice = {stockData.regular_market_price } ticker = {props.ticker} trigger={alertButtonPopup} setTrigger={setAlertButtonPopup} />
      
     
          <button className='buy-btn' onClick={handleBuyClick}>Buy</button>
          <button className='sell-btn' onClick={handleSellClick}>Sell</button>
          <StockInfoPopup marketPrice = {stockData.regular_market_price } ticker = {props.ticker} trigger={buttonPopup} setTrigger={setButtonPopup} type={transType}/>
      
         
        </div>
    </div>
    )
    }

}

export default StockInfo