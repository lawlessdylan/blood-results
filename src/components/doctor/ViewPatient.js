/**
 * @Author: dylanlawless
 * @Date:   2020-04-07T21:08:15+01:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-04-10T16:03:55+01:00
 */
 /**
  * @Author: dylanlawless
  * @Date:   2020-01-16T09:51:11+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-04-10T16:03:55+01:00
  */
  import React, {
      Component
  } from 'react';

  import axios from 'axios';

  import { Card, CardDeck, Button, Collapse,  Table, Nav, Navbar, ListGroup} from 'react-bootstrap';
import drop from '../../images/drop.png';
   import down from '../../images/down-arrow.png';
   import up from '../../images/up.png';
   import Moment from 'react-moment';

   import { withRouter} from 'react-router-dom'
import ResultsModal from '../patient/ResultsModal';

import ConfirmFromView from './ConfirmFromView';
import OrderTest from './OrderTest';

import ConfirmPatientOrder from './ConfirmPatientOrder';

  import '../styles/results.css';
  import '../styles/tests.css';
  import { useState } from 'react';

   var CryptoJS = require("crypto-js");

  class ViewPatient extends Component {

      constructor(props) {
          super(props);

           this.state = {
             tests: [],
             loggedIn: localStorage.getItem("jwtToken") !== null,
             user: '',
             patient: {
                 info: {

                 }
             },
             results: [],
             testOrders: [],
             open: false,
             isDoctor: this.props.isDoctor,
             loggedIn: this.props.loggedIn

           };
            this.goBack = this.goBack.bind(this);

         }

         componentDidMount() {

               /* GET request for tests */
               const { id } = this.props.match.params;

               axios.get(process.env.REACT_APP_BACKEND +`/user/${id}`)
               .then(response => {

                   let patient = response.data;

                        const encryptedPatientName = CryptoJS.AES.decrypt(patient.name.toString(), patient.password)
                        const decryptedPatientName = encryptedPatientName.toString(CryptoJS.enc.Utf8);

                        const encryptedPatientWeight = CryptoJS.AES.decrypt(patient.info.weight.toString(), patient.password)
                        const decryptedPatientWeight = encryptedPatientWeight.toString(CryptoJS.enc.Utf8);

                        const encryptedPatientPhone = CryptoJS.AES.decrypt(patient.phone_num.toString(), patient.password)
                        const decryptedPatientPhone = encryptedPatientPhone.toString(CryptoJS.enc.Utf8);

                        const encryptedPatientAddress = CryptoJS.AES.decrypt(patient.info.address.toString(), patient.password)
                        const decryptedPatientAddress = encryptedPatientAddress.toString(CryptoJS.enc.Utf8);

                        patient.name = decryptedPatientName;
                        patient.info.weight = decryptedPatientWeight;
                        patient.phone_num = decryptedPatientPhone;
                        patient.info.address = decryptedPatientAddress;



                    this.setState((state, props) => ({
                        patient: patient
                    }));
                    console.log(this.state.patient);
               })
               .catch((error) => {
                   console.log(error);
               })

               axios.get(process.env.REACT_APP_BACKEND +`/user/${id}/results`)
               .then(response => {

                 this.setState({
                   results: response.data.reverse()
                 })
                 console.log(response);
               })
               .catch((error) => {
                   console.log(error);
               })

               axios.get(process.env.REACT_APP_BACKEND +'/test')
               .then(response => {

                 this.setState({
                   tests: response.data,
                 })
                 console.log(response);
               })


           }

           goBack(){
               this.props.history.push('/viewPatients')

           }

           onSubmit = e => {
             e.preventDefault();
                 this.setState((state, props) => ({
               testOrder: {
                   doctor_id: this.state.doctor._id,
                   patient_id: this.state.patient_id,
                   test_id: this.state.test_id,
                   date: this.state.date,
                   status: "Sent"
               }

            }));


           };

           setOpen = () => {
               if(this.state.open === false){
                   this.setState({
                     open: true

                   })

               } else {
                   this.setState({
                     open: false
                   })
               }

           }

               getMatch(){

                    this.state.testOrders.map((testOrder) => {
                        return(
                       this.state.results.map((result) => {
                           if(result.test_order_id === testOrder._id){
                                    this.state.testOrders = this.state.testOrders.filter(el => el._id !== result.test_order_id)
                                    testOrder.status = "Received"

                                        console.log("Match")
                                    }
                            })
                     )})
                 }



      render() {


          this.getMatch();
           const loggedIn = this.props.loggedIn;
           const isDoctor = this.props.isDoctor;

          return (
              <div className = "container container-view-patient" >
              <div className="test-results-dashboard col-12">

              <div className="row">
              <div className="col-1 button-div">
              <Button onClick={this.goBack} className="nav-button">
                 Go Back
              </Button>
              </div>
              <div className="col-9">
              <Card className="view-patient">


                 <Card.Body className="results-body">

                 <h4 className="small-title-tests">Patient Information</h4>


                   <div className="row view-body">
                   <div className="col-5 left-create">

                   <div className="create-subheading">

                       Personal Information
                   </div>
                   <div className="row list-row">
                   <div className="list-div col-4">
                       <ListGroup >
                         <ListGroup.Item className="create-list-item">Name: </ListGroup.Item>
                         <ListGroup.Item className="create-list-item">DOB: </ListGroup.Item>
                         <ListGroup.Item className="create-list-item">Weight: </ListGroup.Item>

                       </ListGroup>
                   </div>
                       <div className="list-div list-div-right col-8">
                           <ListGroup className="list-content">
                             <ListGroup.Item className="create-list-item">{this.state.patient.info.honorific} {this.state.patient.name}</ListGroup.Item>
                             <ListGroup.Item className="create-list-item">
                               <Moment className="" format="DD/MM/YYYY">{this.state.patient.dob}</Moment>
                             </ListGroup.Item>
                             <ListGroup.Item className="create-list-item">{this.state.patient.info.weight} kg </ListGroup.Item>

                           </ListGroup>
                       </div>
                   </div>

                   </div>
                   <div className="col-7 right-view">

                   <div className="create-subheading">

                       Contact Information
                   </div>
                   <div className="row list-row">
                       <div className="list-div col-5">
                           <ListGroup >
                             <ListGroup.Item className="create-list-item">Email: </ListGroup.Item>
                             <ListGroup.Item className="create-list-item">Phone Number: </ListGroup.Item>
                              <ListGroup.Item className="create-list-item">Address: </ListGroup.Item>

                           </ListGroup>
                       </div>
                           <div className="list-div list-div-right col-7">
                               <ListGroup className="list-content">
                               <ListGroup.Item className="create-list-item">{this.state.patient.email} </ListGroup.Item>
                               <ListGroup.Item className="create-list-item">{this.state.patient.phone_num} </ListGroup.Item>
                               <ListGroup.Item className="create-list-item">{this.state.patient.info.address} </ListGroup.Item>

                               </ListGroup>
                           </div>
                       </div>

                       </div>


                        </div>

                 </Card.Body>


                 </Card>
                 </div>
              </div>
              <h4 className="small-title-tests">Patient Results</h4>
                  <Card className="results-dashboard">
                     <Card.Body className="dashboard row">

                         <div className="col-12 results-div">
                           {(this.state.results.length > 0) ? (
                            <Table className="results-table" hover>

                         <thead className="table-header">
                             <tr>
                              <th className="first-row">Test type</th>
                               <th>Doctor name</th>
                               <th>Date</th>
                               <th>Status</th>
                               <th>Result</th>
                               <th>Actions</th>
                             </tr>
                           </thead>

                            <>
                            <tbody>

                               <>
                                 {this.state.results.map((result) => {
                                      const encryptedResult = CryptoJS.AES.decrypt(result.test_result.toString(), this.state.patient._id)
                                      const decryptedResult = encryptedResult.toString(CryptoJS.enc.Utf8);

                                     if(result._id != null){

                                         return(

                                             <>
                                             <tr key={result._id}>
                                                 <td className="first-row">{result.test_id.test_name}</td>
                                                 <td>Dr. {result.doctor_id.name}</td>
                                                 <td><Moment className="" format="DD/MM/YYYY">{result.date}</Moment></td>
                                                 <td>Received</td>
                                                 <td>{decryptedResult} {result.test_id.test_unit}</td>
                                                 <td>
                                                        <ResultsModal key={result._id} isDoctor={this.props.isDoctor}
                                                        results={this.state.results} user={this.props.user.name} result={result}
                                                        decryptedResult={decryptedResult} testUnit={result.test_id.test_unit} />
                                                    </td>
                                             </tr>

                                             </>
                                         )}

                                 })}
                                 </>

                             </tbody>
                             </>

                         </Table>
                     ) : (


                         <>
                         <Table>

                         <thead className="table-header">
                             <tr>
                                <th className="first-row">Test type</th>
                                <th>Doctor name</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Result</th>
                                <th>Actions</th>
                             </tr>
                           </thead>


                        </Table>
                         <h4 className="empty-message">Patient has no results.</h4>
                         </>
                     )}
                         </div>

                         </Card.Body>
                     </Card>

                </div>
                <h4 className="small-title-tests">Order For Patient</h4>
                   <OrderTest callbackFromParent={this.newTestCallback} patient={this.state.patient} fromViewPatient={true}/>
            </div>



          );
      }
  }

  export default withRouter(ViewPatient);
