import '../src/css/App.css';
import { BrowserRouter, Routes, Route, Navigate,Link } from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home'
import UserAccount from './components/UserAccount'
import Portfolio from './components/Portfolio'
import Watchlist from './components/Watchlist'
import Transactions from './components/Transactions'
import Analytics from './components/Analytics'
import Alerts from './components/Alerts'
import Signup from './components/Signup';
import Logout from './components/Logout';
import React, {useState} from 'react';
import StockInfo from './components/StockInfo';
import axios from 'axios'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ROOT_URL = "http://127.0.0.1:5000"

function App() {
  const [loggedIn,setLoggedIn] = useState(false);
  const [ticker, setTicker] = useState('');
  
  // function callToasty()
  // { console.log("INSIDE HERE");
  //   toast('Wow so easy!', {
  //     position: "top-right",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     });
  //     console.log("Toasty shld be called");
  // }
  // if(loggedIn)
  // {
  //   axios
  //   .post(ROOT_URL + "/showAlerts", {
  //     demat_id: Cookies.get('DematId')
  //   })
  //   .then((response) => {
  //     if (response.data.status === 'SUCCESS'){
  //         console.log(response.data.alerts);
  //         if(response.data.alerts[0].isGreater)
  //         { 
  //           callToasty();
            
  //         }
  //     } 
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });

  // }


  return (
      
      <BrowserRouter>
        <nav className ="navbar-2">
          <div className ="container-xxl">
          {loggedIn && <Link className='logout-btn btn' to="/logout">Logout</Link>}
          </div>
        </nav>
          <Routes>
              <Route exact path="/" element={loggedIn ? <Navigate to="/home" /> : <Login fxn={setLoggedIn} />}/>
              <Route path="/home" element={loggedIn ? <Home onChangeName={(newName)=>{setTicker(newName)}}/> : <Login fxn={setLoggedIn} />}>
                <Route path="user" element={loggedIn ? <UserAccount /> : <Login fxn={setLoggedIn} />}/>
                <Route path="portfolio" element={loggedIn ? <Portfolio onChangeName={(newName)=>{setTicker(newName)}} /> : <Login fxn={setLoggedIn} />} />
                <Route path="watchlist" element={loggedIn ? <Watchlist onChangeName={(newName)=>{setTicker(newName)}} /> : <Login fxn={setLoggedIn} />} />
                <Route path="transactions" element={loggedIn ? <Transactions /> : <Login fxn={setLoggedIn} /> } />
                <Route path="analytics" element={loggedIn ? <Analytics /> : <Login fxn={setLoggedIn} />} />
                <Route path="alerts" element={loggedIn ? <Alerts onChangeName={(newName)=>{setTicker(newName)}}/> : <Login fxn={setLoggedIn} />} />
                <Route path="stock" element={loggedIn ? <StockInfo ticker={ticker} /> : <Login fxn={setLoggedIn} />} />
              </Route>
              {/* <Route path="/signup" element={<Signup fxn={setLoggedIn} />} /> */}
              <Route path="/signup" element={loggedIn ? <Home /> : <Signup fxn={setLoggedIn} />} />
              <Route path="/logout" element={<Logout fxn={setLoggedIn} />} />
              {/* <Route path="/logout" element={loggedIn ? <Signup /> : <Login fxn={setLoggedIn} />} />
               */}
          </Routes>
        </BrowserRouter>
        
  );
}

export default App;