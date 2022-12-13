import React from 'react';
import {useNavigate} from "react-router-dom";
import '../css/TableRow.css'
import axios from 'axios'
import Cookies from 'js-cookie';

const ROOT_URL = "http://127.0.0.1:5000";

function TableRow(props)
{
    let navigate = useNavigate();

    function handleRowClick() {
        if(!props.showFourthCol && !props.isAlerts)
            props.setDidSearch(false);
        
        if(props.navigateToStock){
            props.onClickFxn(props.symbol);
            navigate('/home/stock');
        }
    }

    const handleDeleteWatchlist = async () => {
        await axios
        .post(ROOT_URL + "/deleteFromWatchlist", {
          demat_id: Cookies.get('DematId'),
          stockTicker: props.symbol
        })
        .then((response) => {
          if (response.data.status === 'SUCCESS'){
              console.log("deleted from watchlist")
              let stockData = props.stockData;
              
              props.setStockData(stockData);
              props.setIsLoading(true);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      };

      const handleDeleteAlerts = async () => {
        await axios
        .post(ROOT_URL + "/deleteAlert", {
          demat_id: Cookies.get('DematId'),
          stockTicker: props.symbol,
          alert_id: props.alert_id
        })
        .then((response) => {
          if (response.data.status === 'SUCCESS'){
              console.log("deleted from alerts")
              props.setAlerts(props.alerts);
              props.setIsLoading(true);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      };

      function handleDelete() {
        if (props.isAlerts) {
          handleDeleteAlerts();
        } else {
          handleDeleteWatchlist();
        }
      }
    return (
    <tr className='table-row'>
        <td onClick={handleRowClick} className='stock-name px-3 py-2 centre-td' >{props.first}</td>
        <td className='px-3 py-2 centre-td'>{props.second}</td>
        <td className='px-3 py-2 centre-td'>{props.third}</td>
        {props.showFourthCol && <td className='px-3 py-2 centre-td'>{props.fourth}</td>}
        
        {props.showDeleteOption && <td className='delete-btn centre-td' onClick={handleDelete}>
        
            <i className="fas fa-trash"></i>
        </td>}
        
    </tr>
    );
}

export default TableRow;