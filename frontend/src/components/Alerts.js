import React, { useEffect, useState } from 'react'
import '../css/Alerts.css'
import '../css/MainSection.css'
import TableRow from './TableRow';
import axios from 'axios'
import {ClipLoader} from 'react-spinners'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ROOT_URL = "http://127.0.0.1:5000"

function Alerts(props) {
  
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if(isLoading) {
    axios
    .post(ROOT_URL + "/showAlerts", {
      demat_id: Cookies.get('DematId')
    })
    .then((response) => {
      if (response.data.status === 'SUCCESS'){
          setIsLoading(false);
          setAlerts(response.data.alerts)
         
      } 
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  }, [alerts,isLoading]);

  
function display(forEach)
{
  return (
  <TableRow 
    // key = {forEach.key}
    // name =  {forEach}
    symbol = {forEach.stock}
    first = {forEach.stock}
    second = {forEach.price} 
    third = {forEach.isGreater ? <i class="fas fa-arrow-up"></i> : <i class="fas fa-arrow-down"></i>}  
    showFourthCol = {false}
    navigateToStock = {true}
    alert_id = {forEach.alert_id}
    alerts = {alerts}
    setAlerts = {setAlerts}
    showDeleteOption = {true}
    setIsLoading = {setIsLoading}
    isAlerts = {true}
    onClickFxn = {props.onChangeName}
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
        <h1 className='pb-5 alerts-heading'>My Alerts</h1>
        <div className='p-1 alerts-table-div'>
        <table className="table table-dark">
        <thead>
          <tr>
            <th className='p-3 '>Ticker</th>
            <th className='p-3 '>Price</th>
            <th className='p-3 '>Status</th>
            <th className='p-3 '></th>
          </tr>
          </thead>
          <tbody>
          {alerts.map(display)}
          </tbody>
        </table>
        </div>
      </div>
    )
  }
  
}

export default Alerts


// function Alerts()
// {
//   const [toCall,setToCall] = useState(false);
//   function callToasty()
//   { console.log("INSIDE HERE");
//     toast('Wow so easy!', {
//       position: "top-right",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       });
//       console.log("Toasty shld be called");
//   }
//   const notify = () => toast("Wow so easy!");

//   axios
//     .post(ROOT_URL + "/showAlerts", {
//       demat_id: Cookies.get('DematId')
//     })
//     .then((response) => {
//       if (response.data.status === 'SUCCESS'){
//           console.log(response.data.alerts);
//           if(response.data.alerts[0].isGreater)
//           { 
//             setToCall(true); 
//           }
//       } 
//     })
//     .catch(function (error) {
//       console.log(error);
//     });

//     return (
//       <div>
        
//         <button onClick={notify}>Notify!</button>
//         <ToastContainer />
//       </div>
//     );
// }

// export default Alerts