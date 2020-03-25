/**
 * @Author: dylanlawless
 * @Date:   2019-11-07T12:38:26+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-22T17:59:56+00:00
 */


import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import axios from 'axios';

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
    axios.post('http://localhost:5000/result', props.result)
      .then(res => {


              const testOrder = {
                  status:  "Sent",

              }



              axios.put(`http://localhost:5000/testOrder/${props.result.test_order_id}`, testOrder )
           .then(res => {

              })
             .catch(err => console.log(err));

             console.log("Sent");
         })
      .catch(err => {
          console.log(err);
      });


  }


};



   return (

     <div>

        <Button className="nav-button" type="submit" onClick={handleShow}>
            Send result
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
              Send result
             </Button>
         </Modal.Footer>
       </Modal>

    </div>
   );
 }

 export default ConfirmModal;
