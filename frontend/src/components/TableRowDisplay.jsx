import React from 'react';
import {useNavigate} from "react-router-dom";
import '../css/TableRow.css'
import axios from 'axios'
import Cookies from 'js-cookie';

function tableRowDisplay(props)
{
    return ( <tr className='table-row'>
    <td>
        {props.first}
    </td>
    <td>
        {props.second}
    </td>
    <td>
        {props.third}
    </td>
    </tr>);
       
    
}

export default tableRowDisplay;