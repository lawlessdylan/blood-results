/**
 * @Author: dylanlawless
 * @Date:   2019-11-07T12:38:26+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-04-10T10:27:47+01:00
 */



import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button, ListGroup } from 'react-bootstrap';
import Moment from 'react-moment';
import '../styles/results.css';

import {
  LineChart, Line, XAxis, YAxis,Label, Tooltip, Legend, AreaChart, Area
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

let results = props.results.reverse();
let testName = props.result.test_id.test_name;
let patientId = props.result.patient_id._id;
let isDoctor = props.isDoctor;


if(isDoctor){
    var docName = props.doctorName;
} else {
    var docName = props.result.doctor_id.name
}


    results = results.filter(function(result) {

                return result.test_id.test_name.match(testName) && result.patient_id._id.match(patientId);


            })
            if(props.result.status === 'Sent'){
                props.result.status = 'Received'
            }
            if(testName === 'HbA1c'){
                var maxRange = 60;
                var idealRange = "Below 42 mmol/mol";

                if(props.decryptedResult < 42){
                    var test_range = "Normal"
                    var test_range_style = 'normal-result'
                } else if( props.decryptedResult > 42 && props.decryptedResult < 47){
                    var test_range = "Above Average"
                    var test_range_style = 'low-result'
                } else{
                    var test_range = "High"
                    var test_range_style = 'high-result'
                }
            }



        if(testName === 'Thyroid'){
            var maxRange = 10;
            var idealRange = "0.5 - 4.15 mU/L";
            if(props.decryptedResult < 0.5){


                var test_range = "Low"
                var test_range_style = 'high-result'
            } else if( props.decryptedResult > 0.5 && props.decryptedResult < 4.15){
                var test_range = "Normal"
                var test_range_style = 'normal-result'
            } else{
                var test_range = "High"
                var test_range_style = 'high-result'
            }

        }


                if(testName === 'Vitamin B12'){
                    var maxRange = 1000;
                    var idealRange = "197 - 771 ng/L";

                    if(props.decryptedResult < 197){
                        var test_range = "Low"
                        var test_range_style = 'high-result'
                    } else if( props.decryptedResult > 197 && props.decryptedResult < 771){
                        var test_range = "Normal"
                        var test_range_style = 'normal-result'
                    } else{
                        var test_range = "High"
                        var test_range_style = 'high-result'
                    }

                }






   return (
       <div>

       <Button className="nav-button" onClick={handleShow}>
         View Result
       </Button>
       <Modal className="result-modal" show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>

         <Modal.Header className="result-modal-header">

         <Modal.Title className="result-test-title">
         {props.result.test_id.test_name} Result

         </Modal.Title>
                  <div className="test-range" className={test_range_style}>{test_range}</div>

         </Modal.Header>
         <Modal.Body>

         <div className="row result-list-row">
         <div className="list-div col-4">
             <ListGroup >
               <ListGroup.Item className="create-list-item">Date Of Result: </ListGroup.Item>
               <ListGroup.Item className="create-list-item">Doctor: </ListGroup.Item>
               <ListGroup.Item className="create-list-item">Status: </ListGroup.Item>
               <ListGroup.Item className="create-list-item">Ideal Range: </ListGroup.Item>
               <ListGroup.Item className="create-list-item">Result: </ListGroup.Item>


             </ListGroup>
         </div>
             <div className="list-div list-div-right col-8">
                 <ListGroup className="list-content">
                   <ListGroup.Item className="create-list-item">
                        <Moment className="" format="DD/MM/YYYY">{props.result.date}</Moment>
                   </ListGroup.Item>
                   <ListGroup.Item className="create-list-item">Dr. {docName} </ListGroup.Item>
                   <ListGroup.Item className="create-list-item">{props.result.status} </ListGroup.Item>
                   <ListGroup.Item className="create-list-item">{idealRange} </ListGroup.Item>
                   <ListGroup.Item className="create-list-item">{props.decryptedResult} {props.testUnit} </ListGroup.Item>




                 </ListGroup>
             </div>
         </div>



            {(results.length >1 ) ? (

                <div className="results-chart">

                <AreaChart width={440} height={220} data={ results.map((result) => {
                    const encryptedResult = CryptoJS.AES.decrypt(result.test_result.toString(), result.patient_id._id)
                    const decryptedResult = encryptedResult.toString(CryptoJS.enc.Utf8);

                    const date = moment(result.date).format("MMM Do YY");
                    // if(this.state.decryptedResult > 4){
                    //     this.state.decryptedResult = 4;
                    // }

                    if(result._id != null){

                        return(

                            {
                              date: `${date}`, HbA1c: `${decryptedResult}`,
                          }
                    )}
                })}
                margin={{top: 30, right: 60, left: -18, bottom: 5}}>


                   <XAxis dataKey="date"/>
                   <YAxis  domain={[0, maxRange]}/>
                   <Tooltip/>
                   <Area type='monotone' dataKey='HbA1c' stroke='#cf3c3c' fill='#cf3c3c' />
                 </AreaChart>
             </div>

            ):(
                <></>
            )}



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
