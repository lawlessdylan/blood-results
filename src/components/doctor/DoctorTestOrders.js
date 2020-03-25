/**
 * @Author: dylanlawless
 * @Date:   2020-01-16T09:51:11+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-25T22:30:01+00:00
 */
 import React, {
     Component
 } from 'react';

 import axios from 'axios';

 import Moment from 'react-moment';

 import { Card, Table, Button, Nav, Form } from 'react-bootstrap';
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

              axios.get(process.env.REACT_APP_BACKEND + `/user/doctor/${this.props.user._id}/testOrders`)
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

              axios.get(process.env.REACT_APP_BACKEND + `/user/doctor/${this.props.user._id}/results`)
              .then(response => {


                this.setState((state, props) => ({
                    sentResults: response.data.reverse(),
                }));
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

                  this.state.testOrders.map((testOrder) => {

                       this.setState({
                           testOrders :  this.state.testOrders.slice().sort((a, b) => a.patient_id.name.localeCompare(b.patient_id.name))
                       })

                   })
              }
              sortTableZA(){

                  this.state.testOrders.map((testOrder) => {

                       this.setState({
                           testOrders :  this.state.testOrders.slice().sort((a, b) => a.patient_id.name.localeCompare(b.patient_id.name)).reverse()
                       })

                   })
              }

              sortTableOldNew(){

                  this.state.testOrders.map((testOrder) => {

                       this.setState({
                          testOrders :  this.state.testOrders.slice().sort((a, b) => a.date.localeCompare(b.date))
                       })

                   })
              }

              sortTableNewOld(){

                  this.state.testOrders.map((testOrder) => {

                       this.setState({
                          testOrders :  this.state.testOrders.slice().sort((a, b) => b.date.localeCompare(a.date))
                       })

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
                        let encryptedPatientName = CryptoJS.AES.decrypt(result.patient_id.name.toString(), result.patient_id.password)
                        let decryptedPatientName = encryptedPatientName.toString(CryptoJS.enc.Utf8)
                            return decryptedPatientName.toLowerCase().match(search);

                        });
                    }



         return (

             <div className = "container" >
                 <h4 className="small-title">test orders.</h4>
                 {this.state.testOrders._id}


                 <div className=" col-12">
                 <Card className="results-dashboard">
                    <Card.Body className="dashboard row">

                        <div className="col-3 side-nav">
                                <div className="results-logo"><Card.Img className="dashboard-logo" src={drop} />
                                </div>
                                <div className="dashboard-title">
                                    Dashboard
                                </div>
                                <div className="dashboard-nav">




                                <input
                                       type="text"
                                       value={this.state.searchString}
                                       ref="search"
                                       onChange={this.handleChange}
                                       placeholder="Search by name"
                                 />



                                <Nav defaultActiveKey="/home" className="flex-column">
                                        <Nav.Link onClick={this.showNewOrders.bind(true)} className="side-nav-link">
                                            <div className="link-div" style={this.state.showNew ?  {color: '#525252', borderBottom: '2px solid #525252'}  : {}}>
                                                New ({this.state.testOrders.length})
                                            </div>
                                        </Nav.Link>
                                        <Nav.Link onClick={this.showSentOrders.bind(true)} className="2 side-nav-link" >
                                        <div className="link-div" style={this.state.showSent ? {color: '#525252', borderBottom: '2px solid #525252'}  : {}}>
                                            Sent orders
                                        </div>
                                    </Nav.Link>


                                </Nav>

                                <div>Sort by: </div>

                                 <Form>
                                 <Form.Group>
                                  <Form.Check  className="" type="radio"
                                     name="phone_num"
                                     label="Most recent"
                                     onClick={this.sortTableNewOld}
                                     defaultChecked
                                   />

                                    </Form.Group>
                                         <Form.Group>
                                         <Form.Check  className="" type="radio"
                                             name="phone_num"
                                             label="Oldest"
                                             onClick={this.sortTableOldNew}

                                           />

                                         </Form.Group>

                                     <Form.Group>
                                      <Form.Check  className="" type="radio"
                                         name="phone_num"
                                        label='A - Z'
                                         onClick={this.sortTableAZ}
                                       />


                                     </Form.Group>

                                     <Form.Group>

                                     <Form.Check  className="" type="radio"
                                         name="phone_num"
                                         label='Z - A'

                                         onClick={this.sortTableZA}
                                       />

                                     </Form.Group>
                                 </Form>

                                </div>

                        </div>
                        <div className="col-9 results-div">

                        <Table hover>

                        <thead >
                            <tr>
                              <th>Test type</th>
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

                                                <td>{testOrder.test_id.test_name}</td>

                                                <td>{testOrder.patient_id.info.honorific}{testOrder.patient_id.name}</td>
                                                  <td><Moment className="" format="D/MM/YYYY">{testOrder.date}</Moment></td>

                                                <td>{testOrder.status}</td>
                                                {(showButton) ? (
                                                    <td>
                                                    <Link to={`/create${test_name}/${testOrder._id}`}>
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
                                      this.state.encryptedPatientName = CryptoJS.AES.decrypt(result.patient_id.name.toString(), result.patient_id.password)
                                      this.state.decryptedPatientName = this.state.encryptedPatientName.toString(CryptoJS.enc.Utf8)

                                      this.state.encryptedResult = CryptoJS.AES.decrypt(result.test_result.toString(), result.patient_id._id)
                                      this.state.decryptedResult = this.state.encryptedResult.toString(CryptoJS.enc.Utf8);

                                      if(result._id != null){

                                          return(


                                              <tr key={result._id}>
                                                  <td>{result.test_id.test_name}</td>
                                                  <td>{result.patient_id.info.honorific}{this.state.decryptedPatientName}</td>
                                                  <td><Moment className="" format="D/MM/YYYY">{result.date}</Moment></td>
                                                  <td>Received</td>

                                                  <td>
                                                      <ResultsModal key={result._id} result={result} decryptedResult={this.state.decryptedResult} />
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
