import React, {useState} from 'react'
import {Link, Outlet} from 'react-router-dom'
import axios from "axios";
import TableRow from './TableRow';
import '../css/Home.css'
import '../css/MainSection.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie'
import Alerts from './Alerts';
const ROOT_URL = "http://127.0.0.1:5000"

function Home(props) {

  const [isActive, setIsActive] = useState([true, false, false, false, false, false, false]);
  const [stockName, setStockName] = useState("");
  const [stockList,setStockList] = useState([{}]);
  const [dataFound, setDataFound] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState('false');
  const [didSearch,setDidSearch] = useState(false);
  
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
  //           <ToastContainer /> 
  //         }
  //     } 
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });



  function handleClickNavbarBtn(e) {
    var activeBtnId = e.target.id;
    var arr = [false, false, false, false, false, false, false]
    arr[activeBtnId] = true;
    setIsActive(arr);
    setDidSearch(false);
  }

  function handleClickMenu() {
    // setIsNavbarVisible(true);
    var navbar = document.getElementById('navbar');
    // var hamburgerIcon = document.getElementById('hamburger-icon');
    // var crossIcon = document.getElementById('cross-icon');
    var navbarStyle = navbar.style.display;
    if(navbarStyle === 'none'){
      navbar.style.display = 'inline-block';
      navbar.classList.add('navbar-visible');
    }
    else{
      navbar.style.display = 'none';
    }
    // hamburgerIcon.style.visibility = 'hidden'
    // crossIcon.style.visibility = 'visible'
  }

  function displaySearch(forEach)
  {
    return (
      <TableRow
        key = {forEach.Symbol}
        symbol = {forEach.Symbol}
        first =  {forEach.Name} 
        second = {forEach.Sector} 
        third = {forEach.Symbol} 
        showFourthCol =  {false}
        navigateToStock = {true}
        showDeleteOption = {false}
        onClickFxn = {props.onChangeName}
        setDidSearch = {setDidSearch}
        isAlerts = {false}
      />);
  }

  
  const handleSearch = async (e) =>{
    e.preventDefault();
    setDidSearch(true);
    // console.log(didSearch);
    let searchData = {user_input_1 : stockName};
    console.log(stockName);
    await axios
    .post(ROOT_URL + "/searchStocks", {user_input : searchData.user_input_1})
    .then((response)=>{
      console.log((response.data.list).length);
      const len = (response.data.list).length;
      if (len === 0){
       console.log("STOCK DATA NOT FOUND") 
       //setNoData(true);
       setDataFound(false);
      }
      else if(len){
        console.log("data recieved"); 
        setDataFound(true);
        //setNoData(false);
        setStockList(response.data.list);
      }
    })
  };

  function filterIt()
  {
    //const slicedArray = array.slice(0, n);
    setStockList(preValue => {
      return preValue.slice(0,5);
    })
  }

  return (
    <div style={{height: '100%'}}>
        <div className='navbar-menu-icon'>
          <i onClick={handleClickMenu} id='hamburger-icon' className="fas fa-bars hamburger-icon"/>
          {/* <i onClick={handleClickMenu} id='cross-icon' className="fas fa-times cross-icon"/> */}
        </div>
        <div className='navbar' id='navbar'>
        <Link onClick={handleClickNavbarBtn} id='0' className='navbar-btn' to="/home" style={{backgroundColor: isActive[0] && '#ff654d', color: isActive[0] && 'white'}} >
            Home
          </Link>
          <Link onClick={handleClickNavbarBtn} id='1' className='navbar-btn' to="/home/user" style={{backgroundColor: isActive[1] && '#ff654d', color: isActive[1] && 'white'}} >
            User Account
          </Link>
          <Link onClick={handleClickNavbarBtn} id='2' className='navbar-btn' to="/home/portfolio" style={{backgroundColor: isActive[2] && '#ff654d', color: isActive[2] && 'white'}}>
            Portfolio
          </Link>
          <Link onClick={handleClickNavbarBtn} id='3' className='navbar-btn' to="/home/watchlist" style={{backgroundColor: isActive[3] && '#ff654d', color: isActive[3] && 'white'}}>
            Watchlist
          </Link>
          <Link onClick={handleClickNavbarBtn} id='4' className='navbar-btn' to="/home/transactions" style={{backgroundColor: isActive[4] && '#ff654d', color: isActive[4] && 'white'}}>
            Transactions
          </Link>
          <Link onClick={handleClickNavbarBtn} id='5' className='navbar-btn' to="/home/analytics" style={{backgroundColor: isActive[5] && '#ff654d', color: isActive[5] && 'white'}}>
            Analytics
          </Link>
          <Link onClick={handleClickNavbarBtn} id='6' className='navbar-btn' to="/home/alerts" style={{backgroundColor: isActive[6] && '#ff654d', color: isActive[6] && 'white'}}>
            Alerts
          </Link>
        </div>

        <div className='main-section home'>
          <div className='search-form-div'>
            <form className="form ">
              <input className="form-control mr-sm-2 search-bar search-stock-input" value = {stockName} onChange={(e) => { setStockName(e.target.value);}} type="search" placeholder="Search for company" aria-label="Search" />
              <button className="search-stock-btn" type="submit" onClick = {handleSearch}>Search</button>
              <button className="search-stock-btn" onClick = {filterIt}>Show Top 5</button>
            </form>
          </div>
        <br />
        <br />
        <br />
      { didSearch &&  dataFound && <table className="table table-dark stock-list-table">
      <thead>
        <tr>
          {/* <th className='p-3 '></th> */}
          <th className='p-3 '>Name</th>
          <th className='p-3 '>Sector</th>
          <th className='p-3 '>Symbol</th>
          {/* <th className='p-3 '>Low</th> */}
        </tr>
        </thead>
        <tbody>
        {stockList.map(displaySearch)}
        </tbody>
      </table>}

      {
        didSearch && !(dataFound) && <h3> No data found for {stockName}</h3>
      }
        
        {/* <input className='search-bar' type='text' placeholder='Search for company'/>
        <button className='search-btn' type='submit'>Search</button> */}
        
        
        </div>
        {/* <Alerts /> */}
        <Outlet/>
        
    </div>
    );
}

export default Home;
