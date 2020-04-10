/**
 * @Author: dylanlawless
 * @Date:   2020-01-16T09:51:11+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-04-10T16:03:05+01:00
 */
 import React, {
     Component
 } from 'react';

 import axios from 'axios';

 import Moment from 'react-moment';

 import { Card, Table, Button, Nav, Navbar, Form, ListGroup } from 'react-bootstrap';
 import '../styles/results.css';
 import drop from '../../images/drop.png';
 import { Link , withRouter} from 'react-router-dom';

 import ResultsModal from '../patient/ResultsModal';

 import OrderTest from './OrderTest';

 import CreatePatient from './CreatePatient';
 var CryptoJS = require("crypto-js");


 class DoctorTestOrders extends Component {

     constructor(props) {
         super(props);


          this.state = {

            loggedIn: localStorage.getItem("jwtToken") !== null,
            testOrders: [],
            sentResults: [],
            test_id: {
                test_name: ''
            },
            loading: true,
            encryptedPatientName : '',
            decryptedPatientName  : '',
            showSent: true,
            showNew: true,
            showPatients: false,
            fullAmount: 0,
            users: [],
             searchString: '',
             searchStringSent: '',
             patients: [],
             newTestOrder: false

          };
           this.handleChange = this.handleChange.bind(this);
           this.newTestCallback = this.newTestCallback.bind(this);
           this.sortTableAZ = this.sortTableAZ.bind(this);
           this.sortTableZA = this.sortTableZA.bind(this);
           this.sortTableOldNew = this.sortTableOldNew.bind(this);
           this.sortTableNewOld = this.sortTableNewOld.bind(this);

           this.sortSentTableAZ = this.sortSentTableAZ.bind(this);
           this.sortSentTableZA = this.sortSentTableZA.bind(this);
           this.sortSentTableOldNew = this.sortSentTableOldNew.bind(this);
           this.sortSentTableNewOld = this.sortSentTableNewOld.bind(this);

            }

        componentDidMount() {

            axios.get(process.env.REACT_APP_BACKEND +`/user/doctor/${this.props.user._id}/testOrders`)
            .then(response => {

                let testOrders = response.data;
                testOrders.map((testOrder) => {
                     const encryptedPatientName = CryptoJS.AES.decrypt(testOrder.patient_id.name.toString(), testOrder.patient_id.password)
                     const decryptedPatientName = encryptedPatientName.toString(CryptoJS.enc.Utf8);
                     testOrder.patient_id.name = decryptedPatientName

                 })
                 this.setState((state, props) => ({
                     testOrders: testOrders.reverse(),

                     loading: false

                 }));




            })
            .catch((error) => {
                console.log(error);
            })

              axios.get(process.env.REACT_APP_BACKEND +`/user/doctor/${this.props.user._id}/results`)
              .then(response => {


                  let results = response.data;
                  results.map((result) => {
                       const encryptedPatientName = CryptoJS.AES.decrypt(result.patient_id.name.toString(), result.patient_id.password)
                       const decryptedPatientName = encryptedPatientName.toString(CryptoJS.enc.Utf8);
                       result.patient_id.name = decryptedPatientName

                   })
                   this.setState((state, props) => ({
                       sentResults: results.reverse()
                   }));


                         console.log(response);
              })
              .catch((error) => {
                  console.log(error);
              })

              axios.get(process.env.REACT_APP_BACKEND +`/user`)
              .then(response => {
                  this.setState({
                      patients: response.data
                  })

                  this.state.patients.map((patient) => {
                       const encryptedPatientName = CryptoJS.AES.decrypt(patient.name.toString(), patient.password)
                       const decryptedPatientName = encryptedPatientName.toString(CryptoJS.enc.Utf8);
                       patient.name = decryptedPatientName

                   })
                 console.log(response.data);





              })
              .catch((error) => {
                  console.log(error);
              })



          }



          getTestOrders()  {

          }

          showSentOrders = () => {
                  this.setState({
                      showSent: true,
                      showNew: false,
                      showPatients: false

                  });
          }
          showNewOrders = () => {
                  this.setState({
                      showSent: false,
                      showPatients: false,
                      showNew: true
                  });
              }

              showAllPatients = () => {
                      this.setState({
                          showSent: false,
                          showNew: false,
                          showPatients: true
                      });
                  }



              removeSent(){

                   this.state.testOrders.map((testOrder) => {
                          if(testOrder.status === 'Sent'){
                                   this.state.testOrders = this.state.testOrders.filter(el => el._id !== testOrder._id)

                           }
                    })
              }

              handleChange() {
                  this.setState({
                      searchString: this.refs.search.value
                      });
              }

              sortTableAZ(){

                       this.setState({
                           testOrders :  this.state.testOrders.slice().sort((a, b) => a.patient_id.name.localeCompare(b.patient_id.name)),
                           sentResults :  this.state.sentResults.slice().sort((a, b) => a.patient_id.name.localeCompare(b.patient_id.name))
                       })

              }
              sortTableZA(){

                       this.setState({
                           testOrders :  this.state.testOrders.slice().sort((a, b) => a.patient_id.name.localeCompare(b.patient_id.name)).reverse(),
                           sentResults :  this.state.sentResults.slice().sort((a, b) => a.patient_id.name.localeCompare(b.patient_id.name)).reverse()
                       })
              }

              sortTableOldNew(){

                       this.setState({
                          testOrders :  this.state.testOrders.slice().sort((a, b) => a.date.localeCompare(b.date)),
                          sentResults :  this.state.sentResults.slice().sort((a, b) => a.date.localeCompare(b.date))
                       })

              }
              sortTableNewOld(){

                       this.setState({
                          testOrders :  this.state.testOrders.slice().sort((a, b) => b.date.localeCompare(a.date)),
                          sentResults :  this.state.sentResults.slice().sort((a, b) => b.date.localeCompare(a.date))
                       })

              }

              sortSentTableNewOld(){

                       this.setState({
                          sentResults :  this.state.sentResults.slice().sort((a, b) => b.date.localeCompare(a.date))
                       })

              }
              sortSentTableAZ(){

                       this.setState({
                           sentResults :  this.state.sentResults.slice().sort((a, b) => a.patient_id.name.localeCompare(b.patient_id.name))
                       })

              }
              sortSentTableZA(){

                       this.setState({
                           sentResults :  this.state.sentResults.slice().sort((a, b) => a.patient_id.name.localeCompare(b.patient_id.name)).reverse()
                       })
              }

              sortSentTableOldNew(){

                       this.setState({
                          sentResults :  this.state.sentResults.slice().sort((a, b) => a.date.localeCompare(b.date))
                       })

              }

              sortSentTableNewOld(){

                       this.setState({
                          sentResults :  this.state.sentResults.slice().sort((a, b) => b.date.localeCompare(a.date))
                       })

              }


              newTestCallback = (newTestOrder) => {
                        this.setState({
                            newTestOrder: newTestOrder
                        })
                        console.log("New test order: " + newTestOrder);
              }


              componentDidUpdate(){

                  if(this.state.newTestOrder === true){

                      axios.get(process.env.REACT_APP_BACKEND +`/user/doctor/${this.props.user._id}/testOrders`)
                      .then(response => {


                        this.setState((state, props) => ({
                            testOrders: response.data.reverse(),

                        }));
                        this.setState((state, props) => ({
                        users:
                                this.state.testOrders.map((testOrder) => {
                                     const encryptedPatientName = CryptoJS.AES.decrypt(testOrder.patient_id.name.toString(), testOrder.patient_id.password)
                                     const decryptedPatientName = encryptedPatientName.toString(CryptoJS.enc.Utf8);
                                     testOrder.patient_id.name = decryptedPatientName

                                     if(testOrder._id != null){

                                         return(

                                             {
                                               name: decryptedPatientName
                                             }
                                     )}

                                 })

                             }));

                      })
                      .catch((error) => {
                          console.log(error);
                      })

                  }
              }

    //           myCallback = (dataFromChild) => {
    //     [...we will use the dataFromChild here...]
    // }


     render() {
             this.removeSent();

            let testOrders = this.state.testOrders;
            let search = this.state.searchString.trim().toLowerCase();

            if (search.length > 0) {
                testOrders = testOrders.filter(function(testOrder) {
                        return testOrder.patient_id.name.toLowerCase().match(search);
                    });
                }

                let sentResults = this.state.sentResults;
                if (search.length > 0) {
                    sentResults = sentResults.filter(function(result) {

                            return result.patient_id.name.toLowerCase().match(search);

                        });
                    }




         return (

             <div className = "container" >

                 {this.state.testOrders._id}


                 <div className="main-results col-12">

                 <h4 className="small-title-tests">Test Orders</h4>

                <Navbar>


                    <Nav className="mr-auto results-nav">

                 <input
                        className="results-search"
                        type="text"
                        value={this.state.searchString}
                        ref="search"
                        onChange={this.handleChange}
                        placeholder="Search by patient name"
                    />

                    </Nav>
                    <Form className="results-nav-form" inline>

                                                             <Form.Check  inline className="sortCheck" type="radio"
                                                                name="phone_num"
                                                                label="Most recent"
                                                                onClick={this.sortTableNewOld}
                                                                defaultChecked
                                                              />

                                                                <Form.Check inline className="sortCheck" type="radio"
                                                                    name="phone_num"
                                                                    label="Oldest"
                                                                    onClick={this.sortTableOldNew}
                                                                  />

                                                             <Form.Check inline className="sortCheck" type="radio"
                                                                name="phone_num"
                                                               label='A - Z'
                                                                onClick={this.sortTableAZ}
                                                              />

                                                            <Form.Check inline className="sortCheck" type="radio"
                                                                name="phone_num"
                                                                label='Z - A'

                                                                onClick={this.sortTableZA}
                                                              />

                    </Form>

                </Navbar>

                 <Card className="results-dashboard">


                    <Card.Body className="dashboard row">

                        <div className="col-12 results-div">

                        <Table className="results-table" hover>


                                    <thead className="results-table-head">
                                        <tr>
                                          <th className="first-row">Test type</th>
                                          <th>Patient name</th>
                                          <th>Date</th>
                                          <th>Status</th>

                                           <th>Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody className="results-table-body">

                                {testOrders.map((testOrder) => {

                                    const test_name = testOrder.test_id.test_name.replace(/\s/g, '');


                                    var showButton = false;
                                    if (testOrder.status === 'Pending'){
                                        var showButton = true;
                                    }

                                    if(testOrder._id != null){
                                        return(

                                            <tr key={testOrder._id}>

                                                <td className="first-row">{testOrder.test_id.test_name}</td>

                                                <td>{testOrder.patient_id.info.honorific}{testOrder.patient_id.name}</td>
                                                  <td><Moment className="" format="D/MM/YYYY">{testOrder.date}</Moment></td>

                                                <td>{testOrder.status}</td>
                                                {(showButton) ? (
                                                    <td className="last-td">
                                                    <Link  to={`/createResult/${testOrder._id}`}>
                                                        <Button className="nav-button">
                                                           Create Result
                                                        </Button>
                                                    </Link>
                                                    </td>
                                               ) : (
                                               <td></td>
                                           )}

                                        </tr>

                                        )}
                                    })}




                                        </tbody>





                        </Table>


                        </div>


                    </Card.Body>
                </Card>


                <h4 className="small-title-tests sent-title">Sent Results</h4>


                <Card className="results-dashboard">


                   <Card.Body className="dashboard row">

                       <div className="col-12 results-div">

                           <Table className="results-table" hover>

                                   { this.state.showNew && (
                                       <>

                                         <tbody className="results-table-body">






                                     {sentResults.map((result) => {

                                         this.state.encryptedResult = CryptoJS.AES.decrypt(result.test_result.toString(), result.patient_id._id)
                                         this.state.decryptedResult = this.state.encryptedResult.toString(CryptoJS.enc.Utf8);

                                         if(result._id != null){

                                             return(

                                                 <tr key={result._id}>
                                                     <td className="first-row">{result.test_id.test_name}</td>
                                                     <td>{result.patient_id.info.honorific}{result.patient_id.name}</td>
                                                     <td><Moment className="" format="D/MM/YYYY">{result.date}</Moment></td>
                                                     <td>Received</td>
                                                     <td>
                                                           <ResultsModal key={result._id} isDoctor={this.props.isDoctor} doctorName={this.props.doctorName} results={sentResults} result={result} decryptedResult={this.state.decryptedResult} />

                                                       </td>

                                                 </tr>

                                         )}


                                     })}
                                           </tbody>
                                     </>
                                     ) }




                           </Table>


                       </div>


                   </Card.Body>
               </Card>

                 </div>

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

 export default withRouter(DoctorTestOrders);
