/**
 * @Author: dylanlawless
 * @Date:   2020-01-16T09:51:11+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-26T19:27:42+00:00
 */
 import React, {
     Component
 } from 'react';

 import axios from 'axios';

 import Moment from 'react-moment';

 import { Card, Table, Button, Nav, Navbar, Form } from 'react-bootstrap';
 import '../styles/results.css';
 import drop from '../../images/drop.png';
 import { Link } from 'react-router-dom';

 import ResultsModal from '../patient/ResultsModal';
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
            encryptedPatientName : '',
            decryptedPatientName  : '',
            showSent: false,
            showNew: true,
            fullAmount: 0,
            users: [],
             searchString: '',

          };
           this.handleChange = this.handleChange.bind(this);
           this.sortTableAZ = this.sortTableAZ.bind(this);
           this.sortTableZA = this.sortTableZA.bind(this);
           this.sortTableOldNew = this.sortTableOldNew.bind(this);
           this.sortTableNewOld = this.sortTableNewOld.bind(this);
            }

        componentDidMount() {

              axios.get(`http://localhost:5000/user/doctor/${this.props.user._id}/testOrders`)
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

              axios.get(`http://localhost:5000/user/doctor/${this.props.user._id}/results`)
              .then(response => {


                this.setState((state, props) => ({
                    sentResults: response.data.reverse(),
                }));


                        this.state.sentResults.map((result) => {
                             const encryptedPatientName = CryptoJS.AES.decrypt(result.patient_id.name.toString(), result.patient_id.password)
                             const decryptedPatientName = encryptedPatientName.toString(CryptoJS.enc.Utf8);
                             result.patient_id.name = decryptedPatientName

                         })
              })
              .catch((error) => {
                  console.log(error);
              })


          }


          showSentOrders = () => {
                  this.setState({
                      showSent: true,
                      showNew: false

                  });
          }
          showNewOrders = () => {
                  this.setState({
                      showSent: false,
                      showNew: true
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


                 <Card.Header className="card-header">

                 <Nav variant="tabs" defaultActiveKey="#first">
                 <Nav.Item>
                    <Nav.Link onClick={this.showNewOrders.bind(true)} className="side-nav-link">

                        New ({this.state.testOrders.length})

                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link onClick={this.showSentOrders.bind(true)} className="side-nav-link" >
                        Sent orders

                    </Nav.Link>
                </Nav.Item>

                </Nav>


                 </Card.Header>
                    <Card.Body className="dashboard row">


                        <div className="col-12 results-div">

                        <Table className="results-table" hover>

                        <thead >
                            <tr>
                              <th className="first-row">Test type</th>
                              <th>Patient name</th>
                              <th>Date</th>
                              <th>Status</th>

                               <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>



                                { this.state.showNew && (
                                    <>
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
                                                    <Link  to={`/create${test_name}/${testOrder._id}`}>
                                                        <Button className="nav-button">
                                                           Create result
                                                        </Button>
                                                    </Link>
                                                    </td>
                                               ) : (
                                               <td></td>
                                           )}

                                        </tr>

                                        )}
                                    })}

                                </>

                            )}

                            { this.state.showSent && (
                                <>
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
                                                        <ResultsModal key={result._id} results={sentResults} result={result} decryptedResult={this.state.decryptedResult} />

                                                    </td>

                                              </tr>

                                      )}


                                  })}
                                  </>
                                  ) }



                            </tbody>

                        </Table>

                        </div>


                    </Card.Body>
                </Card>
                 </div>


             </div>


         );
     }
 }

 export default DoctorTestOrders;
