/**
 * @Author: dylanlawless
 * @Date:   2020-01-16T09:55:58+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-04-10T16:06:28+01:00
 */
 import React, {
     Component
 } from 'react';

 import { Card, Form, Button, Modal, InputGroup} from 'react-bootstrap';
 import '../styles/forms.css';

 import {
     Link
 } from "react-router-dom";
 import axios from 'axios';
 import drop from '../../images/drop.png';
 import error from '../../images/error.png';

 class Login extends Component {

     constructor(props) {
        super(props);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.cancelModel = this.cancelModel.bind(this);
        this.submitTwoStep = this.submitTwoStep.bind(this);

        this.state = {
          email: '',
          password: '',
          pinNeeded: false,

          setShow: false,
          show: false,
          checked: false,
           loginError: '',
           emailError: '',
           passwordError: '',


        };


      }

          componentDidMount(){



            if (this.props.location.state !=  null){
                console.log(this.props.location.state.email);
                this.setState((state, props) => ({
                    email :this.props.location.state.email,
                    password :this.props.location.state.password,

                })
                    );
      } else {
          this.setState((state, props) => ({
              email :'',
              password :'',

          })
              );

        }
    }

      handleInputChange = e => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
          [name]: value,
          loginError : ''
        });
        if(this.state.email !== ""){
             this.setState({
                 emailError : ''
             });

        }
        if(this.state.password !== "" ){
             this.setState({
                 passwordError : ''
             });

        }
      };

      onSubmit = e => {
        e.preventDefault();





                const isValid = this.validate()

                if(isValid){

        const user = {
          email: this.state.email,
          password: this.state.password
        }




        if(user.email === '' || user.password === '') {
            console.log("Cannot have blank email or password");
        } else {

        axios.post(process.env.REACT_APP_BACKEND +'/account/login/user/', user)
          .then(res => {

            this.setState({
              user: res.data
            })

            if(this.state.user.pinNeeded === true){
                console.log("Pin needed");
                this.setState({
                  show:true
                });
                 this.nameInput.focus();
            }
            else {
                axios.post(process.env.REACT_APP_BACKEND +'/account/login/user/', user)
                    .then(res => {
                        // save token in local storage
                localStorage.setItem('jwtToken', res.data.token);
                window.location = '/'

            })
                .catch((err) => {
                    if(err.response.status === 401) {
                        this.setState({ message: 'Login failed. Username or password not match' });
                    }
                });

            }


          })
          .catch((err) => {
               let loginError = "";
            if(err.response.status === 401) {
                let loginError = 'Invalid email or password';
                if(loginError) {
                    this.setState({ loginError });
                    return false;
                }
                return true;

              this.setState({ message: 'Login failed. Username or password not match' });
            }
          });


      }
  }
      };


        submitTwoStep(){

            const user = {
              email: this.state.email,
              password: this.state.password,
              pinCode: this.state.pinCode
            }

            axios.post(process.env.REACT_APP_BACKEND +'/account/login/user/twoStep', user)
                .then(res => {
                    // save token in local storage
                    localStorage.setItem('jwtToken', res.data.token);

                    window.location = '/'


        })
            .catch((err) => {

                if(err.response.status === 401) {
                    this.setState({ message: 'Login failed. Username or password not match' });
                     let loginError = "Invalid";
                    this.setState({loginError });
                    return false;
                }



            });

       };

       validate = () => {
          let emailError = "";
          let passwordError = "";


          if(this.state.email ===  ""){
                 emailError = 'Email cannot be blank';
          }
          if(this.state.password === ""){
                 passwordError = 'Password cannot be blank';
          }

          if(emailError || passwordError) {
              this.setState({ emailError, passwordError });
              return false;
          }


          return true;
      };


        handleClose(){
         this.setState({
           show:false
         });

       };
       cancelModel(){
           this.handleClose()
      };

       handleShow() {
           this.setState({
             show:true
           });
       };



     render() {

         return (

             <div className = " login-main" >
             <div className = "container container-login" >
             <div className="row">
             <div className="col-12 test-div">
             <div className="row">

             <div className="col-md-6 left-side">

             <div className="left-content">
                <img className="login-logo" src={drop} alt="logo"/>
                     <div className="side-title">
                        Blood Drop
                    </div>
                    </div>

             </div>
                 <div className="col-6 right-side">
                 <Card className="login-card">
                      <Card.Body>
                        <Card.Title className="title-card-auth login-title">Sign in</Card.Title>
                        <div className="login-error">{this.state.loginError}</div>
                        <Form onSubmit={this.onSubmit}>
                               <Form.Group>

                                   <Form.Control className="form-input-auth" type="email" placeholder=" "
                                       name="email"
                                       value={this.state.email}
                                       onChange={this.handleInputChange}
                                     />
                                          <span className="floating-label">Email</span>

                                 </Form.Group>
                                 <span className="error-message"> {this.state.emailError}</span>
                               <Form.Group>
                                <Form.Control className="form-input-auth password-input" type="password" placeholder=" "
                                      name="password"
                                      value={this.state.password}
                                      onChange={this.handleInputChange}
                                    />
                                     <span className="floating-label">Password</span>
                               </Form.Group>
                               <span className="error-message"> {this.state.passwordError}</span>

                                  <Modal backdrop="static" className="my-modal" show={this.state.show}
                                  onHide={this.handleClose}   centered>

                                    <Modal.Header className="">

                                    <Modal.Title >Verification pin</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body className="">

                                    <div>Please enter your six-digit pin code.</div>

                                    <Form.Group>
                                       <Form.Label>  </Form.Label>
                                       <Form.Control ref={(input) => { this.nameInput = input; }}  className="form-input-two-step pin-input" type="password" maxLength="6"
                                           name="pinCode"
                                            onChange={this.handleInputChange}

                                         />
                                    </Form.Group>


                                    </Modal.Body>


                                   <Modal.Footer className="">
                                        <Button variant="primary" className="nav-button" onClick={this.cancelModel}>
                                         Cancel
                                        </Button>

                                        <Button target="blank"className="nav-button"  onClick={this.submitTwoStep}>
                                         Confirm
                                        </Button>
                                    </Modal.Footer>
                                  </Modal>
                                  <Link to={{pathname: "/signup" }}>
                                      <Button variant="primary" className="nav-button-home form-button-red">
                                        Don't have an account?
                                      </Button>

                                  </Link>

                                       <Button variant="primary" className="nav-button-home button-submit-auth" type="submit">
                                        Sign in
                                       </Button>
                                      {/*  <Button variant="pri mary" className="nav-button-home button-google" type="submit">
                                            <img src={google} className="google-signin" alt="Google logo"/>Sign in with Google
                                       </Button>
                                       */}
                               </Form>
                      </Card.Body>
                    </Card>

                    </div>
                    </div>
                 </div>
                </div>
                </div>
             </div>

         );
     }
 }

 export default Login;
