/**
 * @Author: dylanlawless
 * @Date:   2020-01-16T09:51:11+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-31T19:55:51+01:00
 */
 import React, {
     Component
 } from 'react';

 import axios from 'axios';

 import { Card, CardDeck, Button, Collapse,  Table, Nav, Navbar} from 'react-bootstrap';
 import drop from '../../images/drop.png';
  import down from '../../images/down-arrow.png';
    import up from '../../images/up.png';
import Moment from 'react-moment';
 import ResultsModal from './ResultsModal';
 import ResultsCollapse from './ResultsCollapse';




 import ConfirmOrderModal from './ConfirmOrderModal';

 import '../styles/results.css';
 import '../styles/tests.css';
 import { useState } from 'react';

  var CryptoJS = require("crypto-js");

 class TestResults extends Component {


     constructor(props) {
         super(props);




          this.state = {
            tests: [],
            loggedIn: localStorage.getItem("jwtToken") !== null,
            user: '',
            testOrder: {
                patient_id: this.props.user._id,
                test_id: '',
                doctor_id: '',
                date: new Date(),
                status: "Pending"
            },

              open: false,
              setOpen: false,

              openResult: false,
              setOpenResult: false,


              user: this.props.user ,
              results: [],
              test_results: [],
              testOrders: [],
              results_id: '',
              match_id: '',
              decryptedResult: '',
              encryptedResult: '',
              allTestOrders: [],
              showResults: true,
              showPending: false,
              showTestOrders: false,
              isDoctor: this.props.isDoctor,
              loggedIn: this.props.loggedIn

          };

          this.underline = this.underline.bind(this);


        }

        componentDidMount() {

              /* GET request for tests */


              axios.get(process.env.REACT_APP_BACKEND +'/test')
              .then(response => {

                this.setState({
                  tests: response.data,
                })
              })
              .catch((error) => {
                  console.log(error);
              })

                            if(this.state.loggedIn){

              axios.get(process.env.REACT_APP_BACKEND +`/user/${this.state.user._id}/results`)
              .then(response => {

                this.setState({
                  results: response.data.reverse()
                })
                console.log(response);
              })
              .catch((error) => {
                  console.log(error);
              })

              axios.get(process.env.REACT_APP_BACKEND +`/user/${this.state.user._id}/testOrders`)
              .then(response => {

                this.setState((state, props) => ({
                    testOrders: response.data.reverse(),
                    allTestOrders: response.data
                }));
              })
              .catch((error) => {
                  console.log(error);
              })
          }

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
          setOpenResult = () => {
              if(this.state.openResult === false){
                  this.setState({
                    openResult: true
                  })
              } else {
                  this.setState({
                    openResult: false
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


              showResultsTable = () => {
                      this.setState({
                          showResults: true,
                          showPending: false,
                          showTestOrders: false,
                          underlineReceived: true
                      });


              }
              showPendingTable = () => {
                      this.setState({
                          showPending: true,
                          showResults :false,
                          showTestOrders: false,
                          underlinePending: true,
                          underlineHistory: false
                      });

              }
              showAllTable = () => {
                      this.setState({
                          showPending: true,
                          showResults :true,
                          showTestOrders: false,

                      });



              }
              showAllTestOrders = () => {
                      this.setState({
                          showPending: false,
                          showResults :false,
                          showTestOrders: true,
                          underlineHistory: true,
                          underlinePending: false
                      });

              }

              underline(){
                  if(this.state.showPending === true){
                      console.log("Showing pending results");
                  }
              }



     render() {


          const loggedIn = this.props.loggedIn;
          const isDoctor = this.props.isDoctor;

         return (
 <div className = "container" >
             {(!isDoctor) ? (
                <div>






                 <div className="title-animation">
                     <h4 className="small-title-tests">Available tests</h4>
                 </div>

                        <div className="row card-group">
                            <CardDeck>

                            {this.state.tests.map((test) => {

                                if(test._id != null){

                                    return(

                                        <Card key={test._id} className="col-lg-4 test-card">

                                         <Card.Body className="test-card-body">
                                         <div className="row test-heading">

                                             <Card.Title>
                                                   <div className="test-logo"><Card.Img className="my-logo" src={drop} /> </div>
                                                    <div className="test-title">
                                                        {test.test_name}
                                                    </div>
                                              </Card.Title>
                                          </div>
                                              <Collapse in={this.state.open}>
                                           <div className="card-collapse">
                                           <span className="test-desc">
                                                    {test.test_description}
                                            </span>
                                            <div className="test-points">
                                                Tests for:
                                                <ul className="test-list">
                                                    {test.tests_for.map((tests_for) =>
                                                        <div key={tests_for._id}>
                                                            <li className="tests-for-li">{tests_for.tests_for}</li>
                                                        </div>
                                                    )}
                                                </ul>
                                            </div>
                                            <ConfirmOrderModal isLoggedIn={this.state.loggedIn} patient_id={this.props.user._id} doctor_id={test.test_doctor._id} test_id={test._id} />
                                           </div>
                                               </Collapse>
                                         </Card.Body>
                                         <Card.Footer className="card-footer">

                                         <div
                                                         onClick={this.setOpen.bind(true)}
                                                        aria-controls="example-collapse-text"
                                                        aria-expanded={this.state.open}>
                                                {(!this.state.open) ? (
                                                        <img className="down-arrow" src={down}></img>
                                                ):(

                                                        <img className="down-arrow" src={up}></img>
                                                    )}
                                            </div>


                                         </Card.Footer>
                                        </Card>

                                        )}

                                    })}

                                    </CardDeck>


                              </div>

                              <div className="test-results-dashboard col-12">
                       <h4 className="small-title-tests">Results</h4>
                  <Card className="results-dashboard">
                     <Card.Body className="dashboard row">

                         <div className="col-12 results-div">
                               {(loggedIn && this.state.results.length > 0) ? (
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
                           { this.state.showPending && (
                               <>

                           {this.state.testOrders.map((testOrder) => {



                               if(testOrder._id != null){
                                   return(

                                           <tr key={testOrder._id}>

                                               <td className="first-row">{testOrder.test_id.test_name}</td>
                                               <td>Dr. {testOrder.doctor_id.name}</td>
                                               <td><Moment className="" format="D/MM/YYYY">{testOrder.date}</Moment></td>
                                               <td>{testOrder.status}</td>
                                               <td></td>
                                               <td></td>

                                         </tr>

                               )} else {
                                   return(
                                   <h1>EMPTY</h1>
                               )}

                           })}
                           </>

                           ) }




                           { this.state.showResults && (
                               <>
                                 {this.state.results.map((result) => {
                                      const encryptedResult = CryptoJS.AES.decrypt(result.test_result.toString(), this.state.user._id)
                                      const decryptedResult = encryptedResult.toString(CryptoJS.enc.Utf8);

                                     if(result._id != null){

                                         return(

                                             <>
                                             <tr key={result._id}>
                                                 <td className="first-row">{result.test_id.test_name}</td>
                                                 <td>Dr. {result.doctor_id.name}</td>
                                                 <td><Moment className="" format="D/MM/YYYY">{result.date}</Moment></td>
                                                 <td>Received</td>
                                                 <td>{decryptedResult}</td>

                                                 <td><ResultsCollapse result={result}/></td>


                                             </tr>


                                                  </>
                                     )}



                                 })}
                                 </>
                                 ) }
                                 { this.state.showTestOrders && (
                                     <>

                                 {this.state.allTestOrders.map((testOrder) => {
                                     var showButton = false;
                                     if (testOrder.status === 'Received'){
                                         var showButton = true;
                                     }

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
                                 </>
                             )}
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
                                                  <h4 className="empty-message">Your results will be displayed here</h4>
                                                  </>
                                              )}


                         </div>


                     </Card.Body>
                 </Card>

                  </div>




                            </div>


             ):(
                 <>



                 </>
             )}
             <div className="blob test-blob">

             <svg xlinkHref="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 350">
                 <path d="M156.4,339.5c31.8-2.5,59.4-26.8,80.2-48.5c28.3-29.5,40.5-47,56.1-85.1c14-34.3,20.7-75.6,2.3-111 c-18.1-34.8-55.7-58-90.4-72.3c-11.7-4.8-24.1-8.8-36.8-11.5l-0.9-0.9l-0.6,0.6c-27.7-5.8-56.6-6-82.4,3c-38.8,13.6-64,48.8-66.8,90.3c-3,43.9,17.8,88.3,33.7,128.8c5.3,13.5,10.4,27.1,14.9,40.9C77.5,309.9,111,343,156.4,339.5z"/>
             </svg>
             </div>
             <div className="title-animation">
                 <h4 className="home-title-tests">Blood Drop</h4>
                 </div>
             <div className="text-animation">
                 <span className="centre-text-tests">A private and secure way to manage<br /> your blood test results.</span>
             </div>
                 </div>
         );
     }
 }

 export default TestResults;
