/**
 * @Author: dylanlawless
 * @Date:   2020-01-16T09:55:58+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-04-09T20:39:00+01:00
 */
 import React, {
     Component
 } from 'react';
 import { Card, Form, Button, Col, Row, Modal} from 'react-bootstrap';
 import '../styles/forms.css';
 import axios from 'axios';
 import drop from '../../images/drop.png';
 import {
     Link,
     withRouter
 } from "react-router-dom";

 var CryptoJS = require("crypto-js");

 class Signup2 extends Component {

       constructor(props) {
         super(props);

          this.goBack = this.goBack.bind(this);
          this.handleShow = this.handleShow.bind(this);
          this.handleClose = this.handleClose.bind(this);
          this.changeStatus = this.changeStatus.bind(this);
          this.cancelModel = this.cancelModel.bind(this);


         this.state = {
                name: '',
                dob: '',
                weight: '',
               address: '',
               email: '',
               honorific: '',
               phone_num: '',
               password: '',
               confirmPassword: '',

               nameError: '',
               weightError: '',
               ageError: '',
               addressError: '',


             user: {
                 name: this.props.location.state.user.name,

                 email: this.props.location.state.user.email,
                 phone_num: this.props.location.state.user.phone_num,
                 password:  this.props.location.state.user.password,
                 confirmPassword: this.props.location.state.user.confirmPassword,


             },
             pinCode: '',
             pinNeeded: false,
             setShow: false,
             show: false,
             checked: false

       }}

       handleInputChange = e => {
         const target = e.target;
         const value = target.type === 'checkbox' ? target.checked : target.value;
         const name = target.name;



         this.setState({
           [name]: value
         });

         if(this.state.name !== ''){
              this.setState({
                  nameError : ''
              });

         }
         if(this.state.address !== ''){
              this.setState({
                  addressError : ''
              });

         }
         if(this.state.dob !== ''){
              this.setState({
                  ageError : ''
              });

         }
         if(this.state.weight !== ''){
              this.setState({
                  weightError : ''
              });

         }
       };


      onSubmit = e => {
        e.preventDefault();

        const isValid = this.validate()

        if(isValid){
            // test_result: CryptoJS.AES.encrypt(this.state.test_result, this.state.patient_id._id).toString() ,
            // test_result: CryptoJS.AES.encrypt(this.state.test_result, this.state.patient_id._id).toString() ,
        const user = {
          email: this.state.user.email,
          name: this.state.name,
          phone_num: this.state.user.phone_num,
          info: {
              dob: this.state.dob,
              address: this.state.address,
              weight: this.state.weight,
              honorific: this.state.honorific,
          },
          pinNeeded: this.state.pinNeeded,
          pinCode: this.state.pinCode,
          password: this.state.user.password,
          confirmPassword: this.state.user.confirmPassword,
        }

        console.log(user);

     axios.post(process.env.REACT_APP_BACKEND +'/account/register/user/', user)
     .then(res => {
          console.log(res.data);
          if(res.data.success === true){

          this.props.history.push({
              pathname: '/login',
              state: {email: this.state.user.email, password: this.state.user.password}

            })
           }
        })

        .catch((err) => {
            if(err.response.status === 401) {
                this.setState({ message: 'Register failed.' });
            }
        });
    }

    }

          validate = () => {
             let nameError = "";
             let weightError = "";
             let addressError = "";
             let ageError = "";

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

             if(nameError || ageError || addressError || weightError) {
                 this.setState({ nameError, ageError, addressError,  weightError});
                 return false;
             }

             return true;
         };

    componentDidMount(){


        this.setState((state, props) => ({
            name :this.props.location.state.user.name,
            dob :this.props.location.state.user.dob,
            address :this.props.location.state.user.address,
            weight :this.props.location.state.user.weight,
            honorific :this.props.location.state.user.honorific


        })
      );
      if(this.state.honorific === ''){
          this.setState({
            honorific: 'Mr. '
          });
      }
    };
    goBack(){
        this.props.history.goBack({

        });
    }
    changeStatus() {
       // This throws: Uncaught TypeError: Cannot read property 'state' of undefined

       console.log('status changed');
       this.setState({
         checked:true,
         pinNeeded: true
       });

       if(this.state.checked === true){
           this.setState({
             checked:false,
             pinNeeded: false,
             pinCode: ''
           });
       }
        console.log(this.state.checked);
   }
   cancelModel(){
       this.handleClose()
       this.changeStatus()
  };


     handleClose(){
      this.setState({
        show:false
      });

    };

    handleShow() {
        if(this.state.checked === true){
            this.setState({
              show:false
            });
        } else {
        this.setState({
          show:true
        });
    }

 };



     render() {

         return (
                 <div className="signin-main">
             <div className = "container" >
                 <div className="row">
             <div className="col-md-6 left-side">

             <div className="left-content">
                <img className="signin-logo" src={drop} alt="logo" />
                     <div className="side-title-signin">
                        Blood Drop
                    </div>
                    </div>

             </div>
             <div className="col-md-6 right-side">
             <Card className="signin-card">
                  <Card.Body>
                    <Card.Title className="title-card-auth login-title">Sign up</Card.Title>

                        <Form onSubmit={this.onSubmit}>


                        <Form.Group as={Row}>
                        <Col sm={4}>

                        <Form.Label></Form.Label>
                            <Form.Control name="honorific" className="dropdown-auth" as="select" value={this.state.honorific}  onChange={this.handleInputChange}>
                              <option value="Mr. ">Mr.</option>
                              <option value="Ms. ">Ms.</option>
                              <option value="Mrs. ">Mrs.</option>
                              <option value=" ">Other</option>
                             </Form.Control>
                        </Col>
                        <Col sm={8}>

                        <Form.Control sm={9} className="form-input-auth" type="text" placeholder=" "
                            name="name"
                            value={this.state.name}
                            onChange={this.handleInputChange}
                          />
                           <span className="floating-label">Name</span>
                          </Col>


                        </Form.Group>
                         <span className="error-message">{this.state.nameError}</span>

                         <Form.Group>
                         <Form.Control className="form-input-auth" type="date"
                             name="dob"
                             value={this.state.dob}
                             onChange={this.handleInputChange}
                           />
                            <span className="floating-label">Date of birth</span>
                         </Form.Group>
                         <span className="error-message">{this.state.ageError}</span>


                               <Form.Group>
                               <Form.Control className="form-input-auth" type="text" placeholder=" "
                                   name="weight"
                                   value={this.state.weight}
                                   onChange={this.handleInputChange}
                                 />
                                  <span className="floating-label">Weight (kg)</span>
                               </Form.Group>
                               <span className="error-message">{this.state.weightError}</span>
                               <Form.Group>
                               <Form.Control className="form-input-auth" type="text" placeholder=" "
                                   name="address"
                                   value={this.state.address}
                                   onChange={this.handleInputChange}
                                 />
                                  <span className="floating-label">Address</span>
                               </Form.Group>
                               <span className="error-message">{this.state.addressError}</span>
                               <Form.Group className="two-step-group">
                                <Form.Label className="two-step-check">  Enable two step verification? </Form.Label>
                                       <Form.Check
                                            onChange={this.changeStatus}
                                         name="pinCode"
                                         onClick={this.handleShow}
                                         checked={this.state.checked}

                                       />
                                   </Form.Group>

                               <Modal backdrop="static" className="my-modal" show={this.state.show} onHide={this.handleClose} aria-labelledby="contained-modal-title-vcenter" centered>

                                 <Modal.Header>

                                 <Modal.Title>Verification pin</Modal.Title>
                                 </Modal.Header>
                                 <Modal.Body>

                                 <div>Please enter a 6-digit pin code:</div>

                                 <Form.Group>
                                    <Form.Label>  </Form.Label>
                                    <Form.Control className="form-input-two-step pin-input" type="text" placeholder="Six-digit code"
                                        name="pinCode"
                                         onChange={this.handleInputChange}
                                      />
                                 </Form.Group>


                                 </Modal.Body>


                                <Modal.Footer>
                                     <Button variant="primary" className="nav-button cancel-modal" onClick={this.cancelModel}>
                                      Cancel
                                     </Button>

                                     <Button target="blank"className="nav-button" variant="primary" onClick={this.handleClose} type="submit">
                                      Confirm
                                     </Button>
                                 </Modal.Footer>
                               </Modal>


                                <Link to={{pathname: "/signup",
                                    state: {
                                        user: {
                                            name: this.state.name,
                                            dob: this.state.dob,
                                            weight: this.state.weight,
                                            address: this.state.address,
                                            honorific: this.state.honorific,
                                            email: this.props.location.state.user.email,
                                            phone_num: this.props.location.state.user.phone_num,
                                            password:  this.props.location.state.user.password,
                                            confirmPassword: this.props.location.state.user.confirmPassword,
                                        }

                                            }
                                        }}>
                                 <Button variant="primary" className="nav-button-home button-left">
                                        Back
                                    </Button>

                                </Link>


                                       <Button variant="primary" className="nav-button-home button-submit-auth" type="submit">
                                            Sign up
                                       </Button>

                               </Form>

                      </Card.Body>

                    </Card>
                    </div>
                 </div>
                 </div>
             </div>
         );
     }
 }

 export default withRouter(Signup2);
