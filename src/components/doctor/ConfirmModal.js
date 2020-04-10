/**
 * @Author: dylanlawless
 * @Date:   2019-11-07T12:38:26+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-04-10T16:02:12+01:00
 */


import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import {
  withRouter
} from 'react-router-dom'
 import '../styles/results.css';


 function ConfirmModal(props) {

   const [show, setShow] = useState(false);

   const handleClose = () => {

     setShow(false);

   };
   const handleShow = () => {
       if(props.isValid == true){
            setShow(true);
       } else{
           setShow(false);
       }

};
var CryptoJS = require("crypto-js");

const sendResults = () => {
    if(props.isValid){
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
    axios.post(process.env.REACT_APP_BACKEND +'/result', props.result)
      .then(res => {


              const testOrder = {
                  status:  "Sent",

              }



              axios.put(process.env.REACT_APP_BACKEND +`/testOrder/${props.result.test_order_id}`, testOrder )
           .then(res => {
               props.history.push('/home')
              })
             .catch(err => console.log(err));

             console.log(props.result);
         })
      .catch(err => {
          console.log(err);
           console.log(props.result);
      });


  }


};



   return (

     <div>

        <Button className="nav-button" type="submit" onClick={handleShow}>
            Confirm Result
         </Button>

       <Modal className="my-modal" show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>

         <Modal.Header closeButton>

         <Modal.Title>Confirm result</Modal.Title>
         </Modal.Header>
         <Modal.Body>

         <div>Please confirm that you want to submit this result.</div>

         </Modal.Body>


         <Modal.Footer>
         <Button variant="primary" className="nav-button cancel-modal" onClick={handleClose}>
          Cancel
         </Button>
             <Button onClick={sendResults} target="blank"className="nav-button" variant="primary" type="submit">
              Send Result
             </Button>
         </Modal.Footer>
       </Modal>

    </div>
   );
 }

 export default withRouter(ConfirmModal);
