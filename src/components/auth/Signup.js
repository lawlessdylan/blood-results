/**
 * @Author: dylanlawless
 * @Date:   2020-01-16T09:56:47+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-19T17:12:32+00:00
 */



import React, {
    Component
} from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import '../styles/forms.css';
import drop from '../../images/drop.png';
 import error from '../../images/error.png';

import {
    Link
} from "react-router-dom";

class Signup extends Component {


      constructor(props) {
        super(props);

        this.state = {
                back_user: '',
                email: '',
                name: '',
                dob: '',
                weight: '',
                address: '',
                name: '',
                honorific: '',
             phone_num: '',
             password: '',
             confirmPassword: '',

             emailError: '',
             phone_numError: '',
             passwordError: '',
             confirmPasswordError: '',

             user: {}

        };



      }

      handleInputChange = e => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;






        this.setState((state, props) => ({
            [name]: value
      }) );
          if(this.state.email.includes('@')){
               this.setState({
                   emailError : ''
               });

          }
          if(this.state.phone_num.length >=7 ){
               this.setState({
                   phone_numError : ''
               });

          }
          if(this.state.password.length >=4 ){
               this.setState({
                   passwordError : ''
               });

          }
          if(this.state.password === this.state.confirmPassword ){
               this.setState({
                   confirmPasswordError : ''
               });

          }


      };



      onSubmit = e => {
        e.preventDefault();

        const isValid = this.validate()

        if(isValid){
            this.props.history.push({
                pathname: '/signup2',
                state: {

                    user: {
                         name: this.state.name,
                          dob: this.state.dob,
                          weight: this.state.weight,
                          address: this.state.address,
                          honorific: this.state.honorific,
                        email: this.state.email,
                        phone_num: this.state.phone_num,
                        password: this.state.password,
                        confirmPassword: this.state.confirmPassword
                    }
                }

              })
        } else {
            console.log("Something is not valid");
        }



      };

      validate = () => {
         let emailError = "";
         let phone_numError = "";
         let passwordError = "";
         let confirmPasswordError = "";

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


         if(emailError || phone_numError || passwordError || confirmPasswordError) {
             this.setState({ emailError, phone_numError, passwordError, confirmPasswordError });
             return false;
         }

         return true;
     };


      componentDidMount(){

          if (this.props.location.state !=  null){

                        this.setState((state, props) => ({
                              name :this.props.location.state.user.name,
                              dob :this.props.location.state.user.dob,
                              weight :this.props.location.state.user.weight,
                              address :this.props.location.state.user.address,
                              honorific :this.props.location.state.user.honorific,
                              email :this.props.location.state.user.email,
                              phone_num :this.props.location.state.user.phone_num,
                              password :this.props.location.state.user.password,
                              confirmPassword :this.props.location.state.user.confirmPassword,

                      })
                      );
    } else {
        this.setState((state, props) => ({
              name : '',
              dob : '',
              weight : '',
              address : '',
              honorific : '',
              email : '',
              phone_num : '',
              password : '',
              confirmPassword : '',

      })
      );
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
                <div className="col-md-6 signin-col">
                <Card className="signin-card">
                     <Card.Body>
                       <Card.Title className="title-card-auth">Sign up</Card.Title>


                       <Form onSubmit={this.onSubmit}>

                              <Form.Group>


                                <Form.Control className="form-input-auth" type="text" placeholder=" "
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.handleInputChange}
                                  />

                                  <span className="floating-label">Email</span>
                              </Form.Group>
                                    <span className="error-message"> {this.state.emailError}</span>

                              <Form.Group>
                              <Form.Control className="form-input-auth" type="text" placeholder=" "
                                  name="phone_num"
                                  value={this.state.phone_num}
                                  onChange={this.handleInputChange}
                                />
                                <span className="floating-label">Phone number</span>

                              </Form.Group>
                              <span className="error-message">{this.state.phone_numError}</span>
                              <Form.Group>

                              <Form.Control className="form-input-auth" type="password" placeholder=" "
                                   name="password"
                                   value={this.state.password}
                                   onChange={this.handleInputChange}
                               />
                               <span className="floating-label">Password</span>
                              </Form.Group>
                               <span className="error-message">{this.state.passwordError}</span>
                              <Form.Group>

                              <Form.Control className="form-input-auth" type="password" placeholder=" "
                                    name="confirmPassword"
                                     value={this.state.confirmPassword}
                                    onChange={this.handleInputChange}
                                  />

                                   <span className="floating-label">Confirm password</span>
                             </Form.Group>
                             <span className="error-message">{this.state.confirmPasswordError}</span>



                                        <Button variant="primary" className="nav-button-home button-submit-auth" type="submit">
                                            Continue
                                        </Button>



                                    <Link to={{pathname: "/login" }}>
                                        <Button variant="primary" className="nav-button-home form-button-red">
                                          Already have an account?
                                        </Button>

                                    </Link>



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

export default Signup;
