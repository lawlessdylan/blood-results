/**
 * @Author: dylanlawless
 * @Date:   2020-01-16T09:51:11+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-26T16:15:25+00:00
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
 import PendingResults from './PendingResults';


 var CryptoJS = require("crypto-js");

 // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
 // var plaintext = bytes.toString(CryptoJS.enc.Utf8);
 // console.log("decrypted text", plaintext);



 class Results extends Component {

     constructor(props) {
         super(props);



          this.state = {
            loggedIn: localStorage.getItem("jwtToken") !== null,
            user: this.props.user ,
            results: [],
            test_results: [],
            testOrders: [],
            results_id: '',
            match_id: '',
            decryptedResult: '',
            encryptedResult: ''

          };

        }

        componentDidMount() {
              axios.get(`http://localhost:5000/user/${this.state.user._id}/results`)
              .then(response => {

                this.setState({
                  results: response.data
                })

              })
              .catch((error) => {
                  console.log(error);
              })

              axios.get(`http://localhost:5000/user/${this.state.user._id}/testOrders`)
              .then(response => {

                this.setState((state, props) => ({
                    testOrders: response.data
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

                             console.log("Match")

                 }

             })

          )})
    }





     render() {
         this.getMatch()
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

                                        <Nav.Link className="side-nav-link">Received</Nav.Link>
                                        <Nav.Link className="side-nav-link">Pending</Nav.Link>
                                        <Nav.Link className="side-nav-link">All</Nav.Link>
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

                          <tbody className="player-table-body">

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

                              )}

                          })}

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
                                                    <ResultsModal key={result._id} result={result} decryptedResult={this.state.decryptedResult} />
                                                </td>

                                            </tr>

                                    )}


                                })}
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
