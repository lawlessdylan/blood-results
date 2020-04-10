/**
 * @Author: dylanlawless
 * @Date:   2020-04-08T12:19:09+01:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-04-10T16:01:58+01:00
 */
 /**
  * @Author: dylanlawless
  * @Date:   2019-11-07T12:38:26+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-04-10T16:01:58+01:00
  */


 import React, {useState} from 'react';
 import Modal from 'react-bootstrap/Modal';
 import { Button } from 'react-bootstrap';
 import axios from 'axios';

  import '../styles/tests.css';


  function ConfirmFromView(props) {

    const [show, setShow] = useState(false);

    const handleClose = () => {

      setShow(false);

    };
    const handleShow = () => {
      setShow(true);
  };
 var CryptoJS = require("crypto-js");

 const testOrder = {
     patient_id:  props.patient._id,
     test_id: props.test_id,
     doctor_id: props.doctor_id,
     date: new Date(),
     status: "Pending"

  }

 const sendTestOrder = () => {


     axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
     axios.post(process.env.REACT_APP_BACKEND +'/testOrder', testOrder)
       .then(res => {
           console.log(res.data);
           handleClose()
       })
       .catch(err => {
           console.log(err);
       });
 };
    return (

      <div>





                                     <Button className="nav-button card-button" type="submit" onClick={handleShow}>
                                         Order Test
                                      </Button>


        <Modal className="my-modal" show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>

          <Modal.Header closeButton>

          <Modal.Title>Confirm Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>

          <div>Are you sure you want to order this test for <span className="confirm-name">{props.patient.name}</span>?</div>

          </Modal.Body>


          <Modal.Footer>
          <Button variant="primary" className="nav-button cancel-modal" onClick={handleClose}>
           Cancel
          </Button>
              <Button onClick={sendTestOrder} target="blank"className="nav-button" variant="primary" type="submit">
               Order Test
              </Button>
          </Modal.Footer>
        </Modal>

     </div>
    );
  }

  export default ConfirmFromView;
