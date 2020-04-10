/**
 * @Author: dylanlawless
 * @Date:   2020-01-16T09:51:11+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-04-10T16:02:42+01:00
 */
 import React, {
     Component
 } from 'react';

 import axios from 'axios';
 import ConfirmModal from './ConfirmModal';
 import Moment from 'react-moment';
 import {
   withRouter
 } from 'react-router-dom'
 import { Card, Form, Col, Button, Row, Table, ListGroup } from 'react-bootstrap';

 import '../styles/results.css';

 var CryptoJS = require("crypto-js");


 class CreateResult extends Component {

     constructor(props) {
         super(props);

         this.goBack = this.goBack.bind(this);

         this.state = {

           loggedIn: localStorage.getItem("jwtToken") !== null,
           doctor: '',

            result: {
                doctor_id: '',
                test_id:  '',
                test_order_id:'',
                test_result: '',
                date: '',
                status: ''

            },
                // test_result: '',

           testOrder: [],
           patient_id: {
              _id: '',
             name: '',
             info: {
                honorific:'',
                 dob: '',
                 weight: ''
             }
           },
           test_id: {
             test_name: '',

         },
         isValid: '',
           resultError: ''
         };

        }

        componentWillMount(){
            const loggedIn = this.state.loggedIn;

            if(loggedIn === true){
                const token =  localStorage.getItem("jwtToken")
                const tokenParts = token.split(".")
                const encodedPayLoad = tokenParts[1]
                const rawPayLoad = atob(encodedPayLoad)
                const doctor = JSON.parse(rawPayLoad)
                console.log(doctor)
                this.setState({
                       doctor: doctor
                  })
              }
        }

                componentDidMount() {

                    console.log(this.props);
                        const { id } = this.props.match.params;

                          axios.get(process.env.REACT_APP_BACKEND +`/testOrder/${id}`)
                            .then(response => {
                                const encryptedDob = CryptoJS.AES.decrypt(response.data.patient_id.info.dob.toString(), response.data.patient_id.password)
                                const decryptedDob = encryptedDob.toString(CryptoJS.enc.Utf8);

                                const encryptedWeight = CryptoJS.AES.decrypt(response.data.patient_id.info.weight.toString(), response.data.patient_id.password)
                                const decryptedWeight = encryptedWeight.toString(CryptoJS.enc.Utf8);

                                const encryptedName = CryptoJS.AES.decrypt(response.data.patient_id.name.toString(), response.data.patient_id.password)
                                const decryptedName = encryptedName.toString(CryptoJS.enc.Utf8);


                                console.log(response);
                                this.setState({
                                  _id: response.data._id,
                                  doctor_id: response.data.doctor_id,
                                  patient_id:  {
                                      _id: response.data.patient_id._id,
                                      name: decryptedName,
                                      info: {
                                          honorific: response.data.patient_id.info.honorific,
                                          dob: decryptedDob,
                                          weight: decryptedWeight
                                      }

                                  },
                                  test_id: response.data.test_id,
                                  date: response.data.date,
                                  status: response.data.status
                                })
                            })
                        .catch((error) => {
                          console.log(error);
                        })

                 }

                handleInputChange = e => {
                  const target = e.target;
                  const value = target.type === 'checkbox' ? target.checked : target.value;
                  const name = target.name;

                  if(this.state.test_result !== ''){
                       this.setState({
                           resultError : '',
                           isValid: true
                       });

                  }

                  console.log(`Input name ${name}. Input value ${value}.`);
                  console.log(this.state.isValid);
                  this.setState({
                    [name]: value
                  });


                };

                onSubmit = e => {
                  e.preventDefault();
                  const isValid = this.validate()

                  if(this.state.isValid === true){

                      this.setState((state, props) => ({
                    result: {
                        doctor_id: this.props.user._id,
                        patient_id: this.state.patient_id._id,
                        test_id:  this.state.test_id._id,
                        test_order_id: this.state._id,
                        test_result: CryptoJS.AES.encrypt(this.state.test_result, this.state.patient_id._id).toString(),
                            // test_result: this.state.test_result,
                        date: new Date(),
                        status: "Sent"
                    }

                }));

                console.log(this.state.result);

            }

                };



                          validate = () => {
                             let resultError = "";

                             if(this.state.test_result ==''){
                                    resultError = 'Result is blank';
                                    this.setState({ isValid: false });
                             }


                             if( resultError ) {
                                 this.setState({ resultError });
                                 return false;
                             }

                             return true;
                         };
                         goBack(){
                             this.props.history.push('/')

                     }

           render(){



               console.log(this.props.user._id);

               return (

                   <div className = "container" >


                       <div className="center-div col-8">
                        <Form onSubmit={this.onSubmit}>
                       <Card className="create-result">

                          <Card.Body className="results-body">

                           <Card.Title className="create-card-title">{this.state.test_id.test_name}</Card.Title>


                            <div className="row create-body">
                            <div className="col-7 left-create">

                            <div className="create-subheading">

                                Patient Information
                            </div>
                            <div className="row list-row">
                            <div className="list-div col-4">
                                <ListGroup >
                                  <ListGroup.Item className="create-list-item">Name: </ListGroup.Item>
                                  <ListGroup.Item className="create-list-item">Date Of Birth: </ListGroup.Item>
                                  <ListGroup.Item className="create-list-item">Weight: </ListGroup.Item>

                                </ListGroup>
                            </div>
                                <div className="list-div list-div-right col-8">
                                    <ListGroup className="list-content">
                                      <ListGroup.Item className="create-list-item">{this.state.patient_id.info.honorific} {this.state.patient_id.name}</ListGroup.Item>
                                      <ListGroup.Item className="create-list-item">
                                        <Moment className="" format="DD/MM/YYYY">{this.state.patient_id.info.dob}</Moment>
                                      </ListGroup.Item>
                                      <ListGroup.Item className="create-list-item">{this.state.patient_id.info.weight} kg </ListGroup.Item>

                                    </ListGroup>
                                </div>
                            </div>

                            </div>
                            <div className="col-5 right-create">

                            <div className="create-subheading">

                                Test Information
                            </div>
                            <div className="row list-row">
                                <div className="list-div col-5">
                                    <ListGroup >
                                      <ListGroup.Item className="create-list-item">Test Type: </ListGroup.Item>
                                      <ListGroup.Item className="create-list-item">Date Of Test: </ListGroup.Item>
                                       <ListGroup.Item className="create-list-item">Units: </ListGroup.Item>

                                    </ListGroup>
                                </div>
                                    <div className="list-div list-div-right col-7">
                                        <ListGroup className="list-content">
                                          <ListGroup.Item className="create-list-item">{this.state.test_id.test_name}</ListGroup.Item>
                                          <ListGroup.Item className="create-list-item"><Moment className="" format="D/MM/YYYY">{this.state.date}</Moment></ListGroup.Item>
                                          <ListGroup.Item className="create-list-item">{this.state.test_id.test_unit}</ListGroup.Item>

                                        </ListGroup>
                                    </div>
                                </div>

                                </div>
                                <div className="col-12 bottom-create">

                                <div className="create-subheading">

                                    Result
                                </div>
                                <div className="row list-row">
                                <Form.Group as={Row}>
                                <Form.Label column sm="4">
                                     {this.state.test_id.test_short} Level
                                </Form.Label>
                                  <Col sm="5">
                                <Form.Control type="number" step="0.01" placeholder={this.state.test_id.test_short + " Level"}
                                    name="test_result"
                                    onChange={this.handleInputChange}
                                  />
                              </Col>
                              <Form.Label column sm="3">
                                   {this.state.test_id.test_unit}
                              </Form.Label>
                              </Form.Group>
                                    </div>

                                    </div>
                            </div>


                                              <Button onClick={this.goBack} variant="primary" className="nav-button form-cancel">
                                               Cancel
                                              </Button>
                                              <div className="result-submit">

                                                <ConfirmModal key={this.state.result} result={this.state.result} isValid={this.state.isValid} />
                                              </div>

                          </Card.Body>



                      </Card>

                      </Form>

                       </div>



                   </div>


               );

           }


           }
 export default withRouter(CreateResult);
