/**
 * @Author: dylanlawless
 * @Date:   2020-01-16T09:51:11+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-04-10T16:02:36+01:00
 */
 import React, {
     Component,
     Link
 } from 'react';

 import axios from 'axios';
 import ConfirmModal from './ConfirmModal';
 import Moment from 'react-moment';
 import {
   withRouter
 } from 'react-router-dom'
 import { Card, Form, Col, Button, Row, Collapse} from 'react-bootstrap';

 import '../styles/results.css';

 var CryptoJS = require("crypto-js");


 class CreatePatient extends Component {

     constructor(props) {
         super(props);
          this.myRef = React.createRef();
         this.goBack = this.goBack.bind(this);

         this.state = {

           loggedIn: localStorage.getItem("jwtToken") !== null,

                  name: '',
                  dob: '',
                  weight: '',
                 address: '',
                 email: '',
                 honorific: '',
                 phone_num: '',
                 password: '',
                 confirmPassword: '',

                 emailError: '',
                 phone_numError: '',
                 passwordError: '',
                 confirmPasswordError: '',

                 nameError: '',
                 weightError: '',
                 ageError: '',
                 addressError: '',

                 openCreate: false,
                 setOpenCreate: false,

               pinCode: '',
               pinNeeded: false,
               setShow: false,
               show: false,
               checked: false

         }

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

                  if(isValid){
                      // test_result: CryptoJS.AES.encrypt(this.state.test_result, this.state.patient_id._id).toString() ,
                      // test_result: CryptoJS.AES.encrypt(this.state.test_result, this.state.patient_id._id).toString() ,
                  const user = {
                    email: this.state.email,
                    name: this.state.name,
                    phone_num: this.state.phone_num,
                    info: {
                        dob: this.state.dob,
                        address: this.state.address,
                        weight: this.state.weight,
                        honorific: this.state.honorific,
                    },
                    pinNeeded: this.state.pinNeeded,
                    pinCode: this.state.pinCode,
                    password: this.state.password,
                    confirmPassword: this.state.confirmPassword,
                  }

                  console.log(user);

               axios.post(process.env.REACT_APP_BACKEND +'/account/register/user/', user)
               .then(res => {
                    console.log(res.data);
                    if(res.data.success === true){

                        window.location = "/viewPatients"
                     }
                  })

                  .catch((err) => {
                      if(err.response.status === 401) {
                          this.setState({ message: 'Register failed.' });
                      }
                  });

                };
            }




            setOpenCreate = () => {
                if(this.state.openCreate === false){
                    this.setState({
                      openCreate: true
                    })
                    this.myRef.current.scrollIntoView();
                } else {
                    this.setState({
                      openCreate: false
                    })
                }

            }



                validate = () => {
                    let nameError = "";
                    let weightError = "";
                    let addressError = "";
                    let ageError = "";

                   let emailError = "";
                   let phone_numError = "";
                   let passwordError = "";
                   let confirmPasswordError = "";


                   if(this.state.name.length < 1){
                       nameError = 'Name cannot be blank';
                   }
                   if(this.state.dob === ""){
                       ageError = 'DOB cannot be blank';
                   }
                   if(this.state.weight.length < 1){
                       weightError = 'Weight cannot be blank';
                   }
                   if(this.state.address.length < 1){
                       addressError = 'Address cannot be blank';
                   }


                   if(!this.state.email.includes('@')){
                          emailError = 'Invalid email address';
                   }

                   if(this.state.phone_num.length < 8){
                          phone_numError = 'Invalid phone number';
                   }
                   if(this.state.password.length <= 4){
                          passwordError = 'Must be longer than 5 letters';
                   }

                   if(this.state.password !== this.state.confirmPassword){
                      confirmPasswordError = "Passwords don't match";
                   }


                   if(nameError || ageError || addressError || weightError || emailError || phone_numError || passwordError || confirmPasswordError) {
                       this.setState({nameError, ageError, addressError,  weightError, emailError, phone_numError, passwordError, confirmPasswordError });
                       return false;
                   }

                   return true;

               };
                         goBack(){
                             this.props.history.push('/viewPatients')

                     }

           render(){

               // console.log(this.state.patient_id._id);

               return (
                   <>




                   <div className="create-patient-main">
               <div className = "container" >
               <Button onClick={this.goBack} className="nav-button">
                  Go Back
               </Button>
               <h4 className="small-title-create-patient">Register Patient</h4>
                   <div className="row">
               <div className="col-md-6 left-side-create-patient">


               <Card className="create-patient-card">
                    <Card.Body>
                      <Card.Title className="title-card-create-patient">Account</Card.Title>


                      <Form onSubmit={this.onSubmit}>

                             <Form.Group>


                               <Form.Control className="form-input-create-patient" type="text" placeholder=" "
                                   name="email"
                                   value={this.state.email}
                                   onChange={this.handleInputChange}
                                 />

                                 <span className="floating-label">Email</span>
                             </Form.Group>
                                   <span className="error-message"> {this.state.emailError}</span>

                             <Form.Group>
                             <Form.Control className="form-input-create-patient" type="text" placeholder=" "
                                 name="phone_num"
                                 value={this.state.phone_num}
                                 onChange={this.handleInputChange}
                               />
                               <span className="floating-label">Phone number</span>

                             </Form.Group>
                             <span className="error-message">{this.state.phone_numError}</span>
                             <Form.Group>

                             <Form.Control className="form-input-create-patient" type="password" placeholder=" "
                                  name="password"
                                  value={this.state.password}
                                  onChange={this.handleInputChange}
                              />
                              <span className="floating-label">Password</span>
                             </Form.Group>
                              <span className="error-message">{this.state.passwordError}</span>
                             <Form.Group>

                             <Form.Control className="form-input-create-patient" type="password" placeholder=" "
                                   name="confirmPassword"
                                    value={this.state.confirmPassword}
                                   onChange={this.handleInputChange}
                                 />

                                  <span className="floating-label">Confirm password</span>
                            </Form.Group>
                            <span className="error-message">{this.state.confirmPasswordError}</span>

                             </Form>

                    </Card.Body>

                  </Card>


               </div>
               <div className="col-md-6">
               <Card className="create-patient-card">
                    <Card.Body>
                      <Card.Title className="title-card-create-patient">Personal</Card.Title>

                          <Form onSubmit={this.onSubmit}>


                          <Form.Group as={Row}>
                          <Col sm={4}>

                          <Form.Label></Form.Label>
                              <Form.Control name="honorific" className="dropdown-create-patient" as="select" value={this.state.honorific}  onChange={this.handleInputChange}>
                                <option value="Mr. ">Mr.</option>
                                <option value="Ms. ">Ms.</option>
                                <option value="Mrs. ">Mrs.</option>
                                <option value=" ">Other</option>
                               </Form.Control>
                          </Col>
                          <Col sm={8}>

                          <Form.Control sm={9} className="form-input-create-patient" type="text" placeholder=" "
                              name="name"
                              value={this.state.name}
                              onChange={this.handleInputChange}
                            />
                             <span className="floating-label">Name</span>
                            </Col>


                          </Form.Group>
                           <span className="error-message">{this.state.nameError}</span>

                           <Form.Group>
                           <Form.Control className="form-input-create-patient" type="date"
                               name="dob"
                               value={this.state.dob}
                               onChange={this.handleInputChange}
                             />
                              <span className="floating-label">Date of birth</span>
                           </Form.Group>
                           <span className="error-message">{this.state.ageError}</span>


                                 <Form.Group>
                                 <Form.Control className="form-input-create-patient" type="text" placeholder=" "
                                     name="weight"
                                     value={this.state.weight}
                                     onChange={this.handleInputChange}
                                   />
                                    <span className="floating-label">Weight (kg)</span>
                                 </Form.Group>
                                 <span className="error-message">{this.state.weightError}</span>
                                 <Form.Group>
                                 <Form.Control className="form-input-create-patient" type="text" placeholder=" "
                                     name="address"
                                     value={this.state.address}
                                     onChange={this.handleInputChange}
                                   />
                                    <span className="floating-label">Address</span>
                                 </Form.Group>
                                 <span className="error-message">{this.state.addressError}</span>


                                         <Button  ref={this.myRef} variant="primary" className="nav-button button-submit" type="submit">
                                              Register Patient
                                         </Button>

                                 </Form>

                        </Card.Body>

                      </Card>
                      </div>
                   </div>
                   </div>
               </div>

               </>
               );

           }


           }
 export default withRouter(CreatePatient);
