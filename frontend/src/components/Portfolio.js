import '../css/Portfolio.css'
import '../css/MainSection.css'
import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import TableRow from './TableRow';
const ROOT_URL = "http://127.0.0.1:5000"


Chart.register(ArcElement);



var xValues = ["Core", "Money Market Funds", "Holdings", "Cash"];
var yValues = [50, 15, 15, 20];
var barColors = [
  "#b91d47",
  "#00aba9",
  "#2b5797",
  "#e8c3b9",
  "#1e7145"];

  const data = {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
  }

const options = {
  plugins: {
      title: {
          display: true,
          text: 'Available to withdraw',
          color:'#ddd',
          font: {
              size:24,
              weight: 100
          },
          padding:{
              top:30,
              bottom:30
          },
          responsive:true,
          animation:{
              animateScale: true,
          }
      }
  }
}

function Portfolio (props) {

  
  const [stockData,setStockData] = useState([]);
  const [gotData,setGotData] = useState(false);
  //const [dataFound, setDataFound] = useState(false);
  const [didSearch,setDidSearch] = useState(false);
  const [validData,setValidData] = useState(false);

  // axios
  // .post(ROOT_URL + "/showPortfolio",{
  //   demat_id: Cookies.get('DematId')
  // })
  // .then((response) => {
  //   if (response.data.status === "SUCCESS"){
  //       console.log(response.data.portfolio);
  //       setStockData(response.data.portfolio)
  //   } 
  // })
  // .catch(function (error) {
  //   console.log("error",error);
  // });


  useEffect(()=>{
    if(!gotData)
    { 
      axios
  .post(ROOT_URL + "/showPortfolio",{
    demat_id: Cookies.get('DematId')
  })
  .then((response) => {
    if (response.data.status === "SUCCESS"){
        console.log("RES",response.data.portfolio);
        setStockData(response.data.portfolio)
        setGotData(true);
    }
    if((response.data.portfolio).length) 
    {
      //console.log("GOT VALID DATA")
      setValidData(true);
    }
  })
  .catch(function (error) {
    console.log("error",error);
  });
    }
    
    
  },[stockData,gotData]);

  


  function displaySearch(forEach)
   { 
  //   0: {cost: 10, number_of_stocks: 3, stockTicker: 'AAPL'}
    return (
      <TableRow
        key = {forEach.stockTicker}
        symbol = {forEach.stockTicker}
        first =  {forEach.stockTicker} 
        second = {forEach.number_of_stocks} 
        third = {(forEach.cost)*(forEach.number_of_stocks)} 
        showFourthCol =  {false}
        navigateToStock = {true}
        showDeleteOption = {false}
        onClickFxn = {props.onChangeName}
        setDidSearch = {setDidSearch}
      />);
  }
  


  return (
    <div className='main-section'>  
      <div className='row'>
        <div className='chart-div'>
          <Doughnut data={data} options={options}/>
        </div>
        
        <div className='p-1 portfolio-table-div'>
          {validData && <table className="table table-dark">
          <thead>
            <tr>
              <th className='p-3'>Ticker</th>
              <th className='p-3'>Number of stocks</th>
              <th className='p-3'>Cost</th>
            </tr>
            </thead>
            <tbody>
            {stockData.map(displaySearch)}
            </tbody>
          </table>}
          </div>
        </div>
    </div>
    
  )
}

export default Portfolio;
