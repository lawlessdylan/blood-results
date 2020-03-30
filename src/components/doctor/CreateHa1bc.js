/**
 * @Author: dylanlawless
 * @Date:   2020-01-16T09:51:11+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-30T12:34:48+01:00
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
 import { Card, Form, Col, Button, Row} from 'react-bootstrap';

 import '../styles/results.css';

 var CryptoJS = require("crypto-js");


 class CreateHa1bc extends Component {

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

                          axios.get(process.env.REACT_APP_BACKEND + `/testOrder/${id}`)
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
                        doctor_id: this.state.doctor._id,
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
                             this.props.history.push('/testOrders')

                     }

           render(){

               console.log(this.state.patient_id._id);

               return (

                   <div className = "container" >
                       <h4 className="small-title">Create result.</h4>
                       <div className="center-div col-8">
                         <Form onSubmit={this.onSubmit}>
                       <Card className="create-result">

                          <Card.Body className="">

                                  <div className="result-test-type">
                                      Test type: {this.state.test_id.test_name}
                                  </div>
                                  <span className="result-test-type">Patient info:</span>
                                      <div>Name: {this.state.patient_id.name}</div>
                                      <div>Date of birth: {this.state.patient_id.info.dob}</div>
                                      <div>Weight: {this.state.patient_id.info.weight} kg</div>


                                <span className="result-test-type">Date of test:</span> <Moment className="" format="D/MM/YYYY">{this.state.date}</Moment>

                                 <Form.Group as={Row}>
                                 <Form.Label column sm="2">
                                      Hba1c level
                                 </Form.Label>
                                   <Col sm="3">
                                 <Form.Control type="number" step="0.01" placeholder="Hba1c level"
                                     name="test_result"
                                     onChange={this.handleInputChange}
                                   />
                               </Col>
                               <Form.Label column sm="2">
                                    %
                               </Form.Label>
                               </Form.Group>
                               <span className="error-message">{this.state.resultError}</span>




                          </Card.Body>
                          <Card.Footer className="card-footer">

                          <Button onClick={this.goBack} variant="primary" className="nav-button form-button">
                           Cancel
                          </Button>
                          <div className="result-submit">

                        <ConfirmModal key={this.state.result} result={this.state.result} isValid={this.state.isValid} />
                        </div>
                            </Card.Footer>

                      </Card>
                       </Form>
                       </div>


                   </div>


               );

           }


           }
 export default withRouter(CreateHa1bc);
