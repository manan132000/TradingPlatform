import React, { useEffect, useState } from 'react'
import '../css/Transactions.css'
import '../css/MainSection.css'
import TableRow from './TableRow';
import axios from 'axios'
import Cookies from 'js-cookie'

const ROOT_URL = "http://127.0.0.1:5000"
function Transactions() {
  const [stockData,setStockData] = useState([]);
  const [gotData,setGotData] = useState(false);
  const [validData,setValidData] = useState(false);
  
function display(forEach)
{
  return (
  <TableRow 
    key = {forEach.key}
    first = {forEach.stockCode}
    second =  {forEach.num} 
    third = {forEach.price} 
    showFourthCol = {false}
    navigateToStock = {false}
    showDeleteOption = {false}
    isAlerts = {false}
  />);
}

useEffect(()=>{
  if(!gotData)
  { 
    axios
.post(ROOT_URL + "/showTransaction",{
  demat_id: Cookies.get('DematId')
})
.then((response) => {
  if (response.data.status === "SUCCESS"){
      console.log("RES",response.data.transactions);
      setStockData(response.data.transactions)
      setGotData(true);
  }
  if((response.data.transactions).length)
  {
    // console.log("VALID DATA")
    setValidData(true);
  } 
})
.catch(function (error) {
  console.log("error",error);
});
  }
  
  
},[stockData,gotData]);
  
// buyerDematId: "f39c9a82-97dc-48c3-9f0f-dbc285c1c4cb"
// num: 2
// price: 11
// sellerDematId: "4207ec3c-70b2-4d15-8157-83f37a0b6040"
// stockCode: "NFLX"

  return (
    <div className='main-section transactions'>
      <h1 className='pb-5'>My Transactions</h1>
      <div className='p-1'>
      {validData && <table className="table table-dark">
      <thead>
        <tr>
          
          <th className='p-3 '>Stock Code</th>
          <th className='p-3 '>number</th>
          <th className='p-3 '>price</th>
        </tr>
      </thead>
        <tbody>
        {stockData.map(display)}
        </tbody>
      </table>}
      {!validData && <h3> No Transactions</h3>}
      </div>
    </div>
  )
}

export default Transactions