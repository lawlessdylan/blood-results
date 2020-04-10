/**
 * @Author: dylanlawless
 * @Date:   2019-11-07T12:38:26+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-04-10T16:02:30+01:00
 */


import React, {useState, Component} from 'react';

import Modal from 'react-bootstrap/Modal';
import { Button, ListGroup } from 'react-bootstrap';
import axios from 'axios';

 import '../styles/tests.css';


var CryptoJS = require("crypto-js");


  class ConfirmPatientOrder extends Component {

      constructor(props) {
          super(props);

          this.handleChange = this.handleChange.bind(this);
           this.selectDropdownItem = this.selectDropdownItem.bind(this);
          this.submit = this.submit.bind(this);
          this.state = {

            loggedIn: localStorage.getItem("jwtToken") !== null,

            patients: [],
            show: false,
            searchString: '',
            selectedUser: '',
            testOrder: {},
            patientError: '',
            newTestorder: false,

            };

         }

      componentDidMount() {


          axios.get(process.env.REACT_APP_BACKEND +'/user')
          .then(response => {

              this.setState({
                  patients: response.data
              })
          })
          .catch((error) => {
              console.log(error);
          })
      }


          handleChange() {
              this.setState({
                  searchString: this.refs.search.value
              });
              console.log(this.state.patients);
          }


          validate = () => {
             let patientError = "";

             if(this.state.selectedUser ===  ''){
                    patientError = 'Patient not found.';
             }

             if(patientError) {
                 this.setState({ patientError });
                 return false;
             }


             return true;
         };



                  handleShow = () => {
                      if(this.state.show === false){
                          this.setState({
                            show: true
                          })

                      } else {
                          this.setState({
                            show: false
                          })
                      }

                  }
                  handleClose = () => {

                          this.setState({

                            selectedUser: '',
                            patientError: '',
                            searchString: '',

                            show: false

                  })


                  }

                  submit = e => {
                    e.preventDefault();

                    const isValid = this.validate()

                    if(isValid){

                        var newTestOrder = true
                        this.props.callbackFromConfirm(newTestOrder)
                    // const name = this.state.patients.name;
                    console.log(this.state.selectedUser);


                    const testOrder = {
                    patient_id:   this.state.selectedUser,
                    test_id: this.props.test_id,
                    doctor_id: this.props.doctor_id,
                    date: new Date(),
                    status: "Pending"

                }

                    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
                    axios.post(process.env.REACT_APP_BACKEND +'/testOrder', testOrder)
                      .then(res => {
                          console.log(res.data);
                          this.setState(state => ({ newTestorder: true }));
                          this.handleClose()
                      })
                      .catch(err => {
                          console.log(err);
                      });
                  }



                }

                // callbackToOrder () {
                //
                // }


                selectDropdownItem(email){

                    this.setState({
                        searchString: email
                    })

                }

render(){


    let search = this.state.searchString.trim().toLowerCase();
    let patients = this.state.patients;
    if (search.length > 0) {
        patients = patients.filter(function(patient) {
                return patient.email.toLowerCase().match(search);
            });
        }

        patients.map((patient) => {
               if(search === patient.email){
                        this.state.selectedUser = patient._id

                }

         })


   return (

     <div>

     <Button className="nav-button card-button" onClick={this.handleShow}>
         Order Test
      </Button>

     <Modal className="my-modal" show={this.state.show} onHide={this.handleClose} aria-labelledby="contained-modal-title-vcenter" centered>

       <Modal.Header closeButton>

       <Modal.Title>Order for Patient</Modal.Title>
       </Modal.Header>

           <Modal.Body className="order-modal">

           <div>Who would you like to order this test for?</div>

           <div>

           <input
                  className="patient-search"
                  type="text"
                  value={this.state.searchString}
                  ref="search"
                  onChange={this.handleChange}
                  placeholder="Search by patient's email address"
            />
            <ListGroup className="search-list">

                {patients.map((patient) => {

                    if(patient._id != null && patient.role.role_name === 'Patient' ){


                        return(


                              <ListGroup.Item className="pointer-cursor" key={patient._id} value={patient.email} onClick={() => this.selectDropdownItem(patient.email)}>{patient.email}</ListGroup.Item>


                    )

                    };
                })}




            </ListGroup>
           </div>
            <span className=""> {this.state.patientError}</span>
           </Modal.Body>



       <Modal.Footer>
       <Button variant="primary" className="nav-button cancel-modal" onClick={this.handleClose}>
        Cancel
       </Button>
           <Button target="blank"className="nav-button" variant="primary"  onClick={this.submit}>
            Confirm Order
           </Button>
       </Modal.Footer>
     </Modal>


    </div>
   );
}
 }

 export default ConfirmPatientOrder;
