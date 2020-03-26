/**
 * @Author: dylanlawless
 * @Date:   2020-01-16T09:51:11+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-26T13:55:24+00:00
 */
 import React, {
     Component
 } from 'react';
 import ResultsModal from './ResultsModal';
 import axios from 'axios';

 import Moment from 'react-moment';

 import { Card, Table, Nav, Navbar} from 'react-bootstrap';
 import '../styles/results.css';
 import drop from '../../images/drop.png';


 var CryptoJS = require("crypto-js");

 // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
 // var plaintext = bytes.toString(CryptoJS.enc.Utf8);
 // console.log("decrypted text", plaintext);



 class Results extends Component {

     constructor(props) {
         super(props);

          this.underline = this.underline.bind(this);

          this.state = {
            loggedIn: localStorage.getItem("jwtToken") !== null,

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

          };

        }

        componentDidMount() {
              axios.get(`http://localhost:5000/user/${this.state.user._id}/results`)
              .then(response => {

                this.setState({
                  results: response.data.reverse()
                })

              })
              .catch((error) => {
                  console.log(error);
              })

              axios.get(`http://localhost:5000/user/${this.state.user._id}/testOrders`)
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

         this.getMatch()
             this.underline()
         return (

             <div className = "container" >
                 <h4 className="small-title">Results</h4>
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

                                

                                <Nav defaultActiveKey="/home" className="flex-column">
                                        <Nav.Link onClick={this.showAllTable.bind(true)} className="side-nav-link">
                                            <div className="link-div" style={this.state.showResults && this.state.showPending ?  {borderBottom: '2px solid #525252'}  : {}}>
                                                View all
                                            </div>
                                        </Nav.Link>
                                        <Nav.Link onClick={this.showResultsTable.bind(true)} className="2 side-nav-link" >
                                        <div className="link-div" style={this.state.showResults && !this.state.showPending? {borderBottom: '2px solid #525252'}  : {}}>
                                            Received
                                        </div>


                                            </Nav.Link>
                                        <Nav.Link onClick={this.showPendingTable.bind(true)}  className="3 side-nav-link">
                                        <div className="link-div" style={!this.state.showResults && this.state.showPending? {borderBottom: '2px solid #525252'}  : {}}>
                                            Pending
                                        </div>


                                            </Nav.Link>
                                        <Nav.Link  onClick={this.showAllTestOrders.bind(true)} className="4 side-nav-link">

                                        <div className="link-div" style={this.state.showTestOrders? {borderBottom: '2px solid #525252'}  : {}}>
                                            Order history
                                        </div>

                                            </Nav.Link>
                                </Nav>

                                </div>
                        </div>

                        <div className="col-9 results-div">
                        <Table hover>
                        <thead className="table-header">
                            <tr>
                              <th>Test type</th>
                              <th>Doctor name</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Result</th>
                              <th>Actions</th>
                            </tr>
                          </thead>

                          <tbody >

                          { this.state.showPending && (
                              <>

                          {this.state.testOrders.map((testOrder) => {



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
                                    this.state.encryptedResult = CryptoJS.AES.decrypt(result.test_result.toString(), this.state.user._id)
                                    this.state.decryptedResult = this.state.encryptedResult.toString(CryptoJS.enc.Utf8);

                                    if(result._id != null){

                                        return(


                                            <tr key={result._id}>
                                                <td>{result.test_id.test_name}</td>
                                                <td>Dr. {result.doctor_id.name}</td>
                                                <td><Moment className="" format="D/MM/YYYY">{result.date}</Moment></td>
                                                <td>Received</td>
                                                <td>{this.state.decryptedResult}</td>
                                                <td>
                                                    <ResultsModal key={result._id} result={result} userId={this.state.user._id} results={this.state.results} decryptedResult={this.state.decryptedResult} />
                                                </td>

                                            </tr>

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

                        </Table>

                        </div>


                    </Card.Body>
                </Card>

                 </div>



             </div>


         );
     }
 }

 export default Results;
