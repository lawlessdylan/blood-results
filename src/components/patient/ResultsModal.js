/**
 * @Author: dylanlawless
 * @Date:   2019-11-07T12:38:26+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-26T11:06:16+00:00
 */



import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import Moment from 'react-moment';
import '../styles/results.css';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,Label, Tooltip, Legend,
} from 'recharts';
import axios from 'axios';





var CryptoJS = require("crypto-js");
var moment = require('moment');

 function ResultsModal(props) {

   const [show, setShow] = useState(false);

   const handleClose = () => {

     setShow(false);

   };
   const handleShow = () => {
     setShow(true);

};
// var encryptedResult = props.result.test_result; var result = CryptoJS.AES.decrypt(encryptedResult.toString(), 'secret key 123');

let results = props.results;
let testName = props.result.test_id.test_name;
let patientId = props.result.patient_id._id;

 results = results.filter(function(result) {

             return result.test_id.test_name.match(testName) && result.patient_id._id.match(patientId);


         })

   return (
       <div>

       <Button className="nav-button"   onClick={handleShow}>
         View more
       </Button>
       <Modal className="result-modal" show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>

         <Modal.Header closeButton>

         <Modal.Title className="result-test-title">{props.result.test_id.test_name} result</Modal.Title>
         </Modal.Header>
         <Modal.Body>

            Date of result: <Moment className="" format="D/MM/YYYY">{props.result.date}</Moment> <br/>
            Doctor: Dr. {props.result.doctor_id.name} <br />
            Status: {props.result.status} <br />
            Result: {props.decryptedResult}




            <div className="x-label">Hb1ac</div>
             <div className="results-chart">
        <LineChart
        width={450}
        height={250}
        data={ results.map((result) => {
             const encryptedResult = CryptoJS.AES.decrypt(result.test_result.toString(), result.patient_id._id)
             const decryptedResult = encryptedResult.toString(CryptoJS.enc.Utf8);
             const date= moment(result.date).format("MMM Do YY");
             // if(this.state.decryptedResult > 4){
             //     this.state.decryptedResult = 4;
             // }
             if(result._id != null){

                 return(

                     {
                       date: `${date}`, Hb1ac: `${decryptedResult}`,
                     }
             )}
         })}


        >
        <CartesianGrid strokeDasharray="3 3" />
           <XAxis dataKey="date">

           </XAxis>
           <YAxis dataKey="Hb1ac"  domain={[0, 10]}>

           </YAxis>
           <Tooltip />
           <Legend />
               <Line type="monotone" dataKey="Hb1ac" stroke="#cf3c3c" activeDot={{ r: 9 }} />

        </LineChart>
        </div>

         </Modal.Body>


         <Modal.Footer>
         <Button className="nav-button" onClick={handleClose}>
           Close
         </Button>

         </Modal.Footer>
       </Modal>

    </div>
   );
 }

 export default ResultsModal;
