/**
 * @Author: dylanlawless
 * @Date:   2020-01-16T09:51:11+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-04-10T16:03:18+01:00
 */
 import React, {
     Component,
     Link
 } from 'react';

 import axios from 'axios';
 import ConfirmPatientOrder from './ConfirmPatientOrder';

 import ConfirmOrderModal from '../patient/ConfirmOrderModal';

 import ConfirmFromView from './ConfirmFromView';
 import Moment from 'react-moment';
 import {
   withRouter
 } from 'react-router-dom'
 import { Card, CardDeck, Button, Collapse, Table, Nav, Navbar} from 'react-bootstrap';
 import drop from '../../images/drop.png';
  import down from '../../images/down-arrow.png';
    import up from '../../images/up.png';
 import '../styles/results.css';

 var CryptoJS = require("crypto-js");


 class OrderTest extends Component {

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
                 tests: [],
                 patients: [],
                 searchString: '',

               pinCode: '',
               pinNeeded: false,
               setShow: false,
               show: false,
               checked: false,

               open: false,
               newTestorder: false,
               fromViewPatient: false

         }

        }

        componentWillMount(){

        }



                componentDidMount() {
                    if(this.props.fromViewPatient === true){
                        this.setState({
                            fromViewPatient: true
                        })
                    }

                    axios.get(process.env.REACT_APP_BACKEND +'/test')
                    .then(response => {

                      this.setState({
                        tests: response.data,
                      })
                      console.log(response);
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                    axios.get(process.env.REACT_APP_BACKEND +'/user')
                    .then(response => {

                      this.setState({
                        patients: response.data,
                      })
                      console.log(response);
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
            //
            //     onSubmit = e => {
            //
            // }




            setOpen = () => {
                if(this.state.open === false){
                    this.setState({
                      open: true,
                      newTestOrder: true
                    })

                } else {
                    this.setState({
                      open: false
                    })
                }

            }

            handleChange() {
                this.setState({
                    searchString: this.refs.search.value
                });
            }


                         goBack(){
                             this.props.history.push('/testOrders')

                     }



                testCallback () {
                    var newTestOrder = this.state.newTestOrder
                    this.props.callbackFromParent(newTestOrder)
                }


                callbackFromConfirm = (newTestOrder) => {
                    this.setState({
                            newTestorder: newTestOrder
                    })
                    console.log("Order test " + newTestOrder);
                    this.testCallback()
                }


           render(){
               const search = this.state.searchString;
            let patients = this.state.patient;
               if (search.length > 0) {
                   patients = patients.filter(function(testOrder) {
                           return testOrder.patient_id.name.toLowerCase().match(search);
                       });
                   }

               return (
                   <>
                   <CardDeck>

                   {this.state.tests.map((test) => {

                       if(test._id != null){

                           return(

                               <Card key={test._id} className="col-lg-4 test-card">

                                <Card.Body className="test-card-body">
                                <div className="row test-heading">

                                    <Card.Title>
                                          <div className="test-logo"><Card.Img className="my-logo" src={drop} /> </div>
                                           <div className="test-title">
                                               {test.test_name}
                                           </div>
                                     </Card.Title>
                                 </div>
                                     <Collapse in={this.state.open}>
                                  <div className="card-collapse">
                                  <span className="test-desc">
                                           {test.test_description}
                                   </span>
                                   <div className="test-points">
                                       Tests for:
                                       <ul className="test-list">
                                           {test.tests_for.map((tests_for) =>
                                               <div key={tests_for.tests_for}>
                                                   <li className="tests-for-li">{tests_for.tests_for}</li>
                                               </div>
                                           )}
                                       </ul>
                                   </div>
                                   {(this.state.fromViewPatient)? (
                                          <ConfirmFromView patient={this.props.patient}  isLoggedIn={this.state.loggedIn} doctor_id={test.test_doctor._id} test_id={test._id} />
                                   ):(
                                         <ConfirmPatientOrder callbackFromConfirm={this.callbackFromConfirm}  isLoggedIn={this.state.loggedIn} doctor_id={test.test_doctor._id} test_id={test._id} />
                                   )}

                                  </div>
                                      </Collapse>
                                </Card.Body>
                                <Card.Footer className="card-footer">

                                <div
                                                onClick={this.setOpen.bind(true)}
                                               aria-controls="example-collapse-text"
                                               aria-expanded={this.state.open}>
                                       {(!this.state.open) ? (
                                               <img className="down-arrow" src={down}></img>
                                       ):(

                                               <img className="down-arrow" src={up}></img>
                                           )}
                                   </div>


                                </Card.Footer>
                               </Card>

                               )}

                           })}

                           </CardDeck>





                   </>
               );

           }


           }
 export default OrderTest;
