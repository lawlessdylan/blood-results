/**
 * @Author: dylanlawless
 * @Date:   2019-11-07T12:38:26+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-14T17:48:22+00:00
 */


import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Moment from 'react-moment';

 import '../styles/tests.css';


 function PendingResults() {




   return (

       <tbody className="player-table-body">

       {this.state.testOrders.map((testOrder) => {



           if(testOrder._id != null){
               return(

                       <tr key={testOrder._id}>

                           <td>{testOrder.test_id.test_name}</td>
                           <td>Dr. {testOrder.doctor_id.name}</td>
                           <td><Moment className="" format="D/MM/YYYY">{testOrder.date}</Moment></td>
                           <td>{testOrder.status}</td>
                           <td></td>
                           <td></td>

                     </tr>

           )}

       })}


         </tbody>
   );
 }

 export default PendingResults;
