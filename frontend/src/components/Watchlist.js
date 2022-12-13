import React, { useEffect, useState } from 'react'
import '../css/Watchlist.css'
import '../css/MainSection.css'
import TableRow from './TableRow';
import axios from 'axios'
import {ClipLoader} from 'react-spinners'
import Cookies from 'js-cookie'

const ROOT_URL = "http://127.0.0.1:5000"

function Watchlist(props) {
  
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if(isLoading) {
    axios
    .post(ROOT_URL + "/showWatchlist", {
      // demat_id: "4207ec3c-70b2-4d15-8157-83f37a0b6040",
      demat_id: Cookies.get('DematId')
    })
    .then((response) => {
      if (response.data.status === 'SUCCESS'){
          setIsLoading(false);
          setStockData(response.data.watchlist)
          console.log(response.data.watchlist);
      } 
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  }, [stockData,isLoading]);

  
function display(forEach)
{
  return (
  <TableRow 
    // key = {forEach.key}
    // name =  {forEach}
    symbol = {forEach.symbol}
    first = {forEach.symbol}
    second = {forEach.market_price} 
    third = {forEach.day_high} 
    fourth = {forEach.day_low}  
    showFourthCol = {true}
    navigateToStock = {true}
    stockData = {stockData}
    setStockData = {setStockData}
    showDeleteOption = {true}
    setIsLoading = {setIsLoading}
    onClickFxn = {props.onChangeName}
    isAlerts = {false}
  />);
}
  
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
      <div className='main-section watchlist'>
        <h1 className='pb-5 watchlist-heading'>My Watchlist</h1>
        <div className='p-1 watchlist-table-div'>
        <table className="table table-dark">
        <thead>
          <tr>
            <th className='p-3 '>Ticker</th>
            <th className='p-3 '>Current</th>
            <th className='p-3 '>High</th>
            <th className='p-3 '>Low</th>
            <th className='p-3 '></th>
          </tr>
          </thead>
          <tbody>
          {stockData.map(display)}
          </tbody>
        </table>
        </div>
      </div>
    )
  }
  
  
  
}

export default Watchlist