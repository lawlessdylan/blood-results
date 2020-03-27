/**
 * @Author: dylanlawless
 * @Date:   2020-01-16T09:55:58+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-27T14:20:59+00:00
 */
 import React, {
     Component
 } from 'react';
 import { Card, Form, Button} from 'react-bootstrap';
 import '../styles/forms.css';
 import axios from 'axios';


 import {
   withRouter
 } from 'react-router-dom'

 var CryptoJS = require("crypto-js");

 class EditUser extends Component {

       constructor(props) {
         super(props);
         this.handleInputChange = this.handleInputChange.bind(this);
         this.goBack = this.goBack.bind(this);

         this.state = {
            name: '',
            weight: '',
            dob: '',
            address: '',
            phone_num: '',
            honorific: '',
            password: '',
            user: {},

            nameError: '',
            weightError: '',
            dobError: '',
            phone_numError: '',
            addressError: '',

        }


       }

       handleInputChange = e => {
     const target = e.target;
     const value = target.type === 'checkbox' ? target.checked : target.value;
     const name = target.name;

     console.log(`Input name ${name}. Input value ${value}.`);

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
              dobError : ''
          });

     }
     if(this.state.phone_num.length >=7 ){
          this.setState({
              phone_numError : ''
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
        const user = {
            name:  CryptoJS.AES.encrypt(this.state.name, this.state.password).toString(),
            phone_num:  CryptoJS.AES.encrypt(this.state.phone_num, this.state.password).toString(),
            info: {
                weight: CryptoJS.AES.encrypt(this.state.weight, this.state.password).toString(),
                dob:  CryptoJS.AES.encrypt(this.state.dob, this.state.password).toString(),
                address: CryptoJS.AES.encrypt(this.state.address, this.state.password).toString(),
                honorific: this.state.honorific,
            }

        }

        console.log(user);
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
        axios.put(process.env.REACT_APP_BACKEND + `/user/${this.props.user._id}`, user )
     .then(res => {

          console.log(res.data);
            window.location="/"
        })
       .catch(err => console.log(err));
   }
    }



    componentDidMount(){

        axios.get(process.env.REACT_APP_BACKEND + '/user/' + this.props.user._id)
        .then(response => {
            const encryptedAddress = CryptoJS.AES.decrypt(response.data.info.address.toString(), response.data.password)
            const decryptedAddress = encryptedAddress.toString(CryptoJS.enc.Utf8);

            const encryptedDob = CryptoJS.AES.decrypt(response.data.info.dob.toString(), response.data.password)
            const decryptedDob = encryptedDob.toString(CryptoJS.enc.Utf8);

            const encryptedWeight = CryptoJS.AES.decrypt(response.data.info.weight.toString(), response.data.password)
            const decryptedWeight = encryptedWeight.toString(CryptoJS.enc.Utf8);

            const encryptedName = CryptoJS.AES.decrypt(response.data.name.toString(), response.data.password)
            const decryptedName = encryptedName.toString(CryptoJS.enc.Utf8);

            const encryptedPhoneNum = CryptoJS.AES.decrypt(response.data.phone_num.toString(), response.data.password)
            const decryptedPhoneNum = encryptedPhoneNum.toString(CryptoJS.enc.Utf8);

          this.setState({

            name: decryptedName,
            weight: decryptedWeight,
            address: decryptedAddress,
            dob: decryptedDob,
            honorific: response.data.info.honorific,
            phone_num: decryptedPhoneNum,
            password: response.data.password
          })
          console.log(response);
        })
        .catch((error) => {
            console.log(error);
        })


    }

    validate = () => {
       let nameError = "";
       let weightError = "";
       let addressError = "";
       let phone_numError = "";
       let dobError = "";

       if(this.state.name.length < 1){
              nameError = 'Name cannot be blank';
       }
       if(this.state.dob === ""){
              dobError = 'DOB cannot be blank';
       }
       if(this.state.weight.length < 1){
              weightError = 'Weight cannot be blank';
       }
       if(this.state.address.length < 1){
              addressError = 'Address cannot be blank';
       }
       if(this.state.phone_num.length < 8){
              phone_numError = 'Invalid phone number';
       }

       if(nameError || dobError || addressError || phone_numError || weightError) {
           this.setState({ nameError, dobError, addressError,  weightError, phone_numError});
           return false;
       }

       return true;
   };

        goBack(){
            this.props.history.push('/home')

    }

     render() {

         return (
             <div className="edit-user-main">
             <div className = "container" >
                 <div className="center-div col-md-6 submit-form">
                 <Card className="signin-card">
                      <Card.Body>
                        <Card.Title className="title-card-edit">Edit profile</Card.Title>

                        <Form onSubmit={this.onSubmit}>


                        <Form.Group>


                        <Form.Control className="form-input-auth" type="text" placeholder=" "
                            name="name"
                            value={this.state.name}
                            onChange={this.handleInputChange}
                          />

                           <span className="floating-label">Full name</span>

                        </Form.Group>
                             <span className="error-message">{this.state.nameError}</span>
                               <Form.Group>
                               <Form.Control className="form-input-auth" type="date" required="required" placeholder="Date of Birth"
                                   name="dob"
                                   value={this.state.dob}
                                   onChange={this.handleInputChange}
                                 />

                               </Form.Group>
                                    <span className="error-message">{this.state.dobError}</span>
                               <Form.Group>
                               <Form.Control className="form-input-auth" type="text" placeholder="Phone number"
                                   name="phone_num"
                                   value={this.state.phone_num}
                                   onChange={this.handleInputChange}
                                 />

                               </Form.Group>
                               <span className="error-message">{this.state.phone_numError}</span>
                               <Form.Group>
                               <Form.Control className="form-input-auth" type="text" placeholder="Weight (kg)"
                                   name="weight"
                                   value={this.state.weight}
                                   onChange={this.handleInputChange}
                                 />

                               </Form.Group>

                                    <span className="error-message">{this.state.weightError}</span>

                               <Form.Group>
                               <Form.Control className="form-input-auth" type="text" placeholder="Address"
                                   name="address"
                                   value={this.state.address}
                                   onChange={this.handleInputChange}
                                 />

                               </Form.Group>

                                    <span className="error-message">{this.state.addressError}</span>



                                      <Button onClick={this.goBack} variant="primary" className="nav-button-home button-left" >
                                        Cancel
                                      </Button>
                                       <Button variant="primary" className="nav-button-home button-submit-auth" type="submit">
                                            Confirm
                                       </Button>

                               </Form>

                      </Card.Body>

                    </Card>

                 </div>
                 </div>
             </div>
         );
     }
 }

 export default withRouter(EditUser);
