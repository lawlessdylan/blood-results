/**
 * @Author: dylanlawless
 * @Date:   2020-04-08T13:28:09+01:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-04-10T16:06:48+01:00
 */
 /**
  * @Author: dylanlawless
  * @Date:   2020-01-16T09:51:11+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-04-10T16:06:48+01:00
  */
  import React, {
      Component
  } from 'react';

  import axios from 'axios';

  import Moment from 'react-moment';

  import { Card, Table, Button, Nav, Navbar, Form, ListGroup } from 'react-bootstrap';
  import '../styles/results.css';
  import drop from '../../images/drop.png';
  import { Link , withRouter} from 'react-router-dom';

  import ResultsModal from '../patient/ResultsModal';

  import OrderTest from './OrderTest';

  import CreatePatient from './CreatePatient';
  var CryptoJS = require("crypto-js");


  class ViewPatients extends Component {

      constructor(props) {
          super(props);


           this.state = {

             loggedIn: localStorage.getItem("jwtToken") !== null,

              searchString: '',
              patients: [],
              newTestOrder: false,
              loading: true,
           };
            this.handleChange = this.handleChange.bind(this);
            this.newTestCallback = this.newTestCallback.bind(this);
            this.sortTableAZ = this.sortTableAZ.bind(this);
            this.sortTableZA = this.sortTableZA.bind(this);

             }

         componentDidMount() {


             axios.get(process.env.REACT_APP_BACKEND +`/user`)
             .then(response => {
                 let patients = response.data;
                 patients.map((patient) => {
                      const encryptedPatientName = CryptoJS.AES.decrypt(patient.name.toString(), patient.password)
                      const decryptedPatientName = encryptedPatientName.toString(CryptoJS.enc.Utf8);
                      patient.name = decryptedPatientName

                  })
                  this.setState((state, props) => ({
                      patients: patients.slice().sort((a, b) => a.name.localeCompare(b.name)),
                      loading: false
                  }));
                console.log(response.data);

             })
             .catch((error) => {
                 console.log(error);
             })





           }






               handleChange() {
                   this.setState({
                       searchString: this.refs.search.value
                   });
               }

               sortTableAZ(){

                        this.setState({

                            patients :  this.state.patients.slice().sort((a, b) => a.name.localeCompare(b.name))
                        })

               }
               sortTableZA(){

                        this.setState({
                            patients :  this.state.patients.slice().sort((a, b) => a.name.localeCompare(b.name)).reverse(),

                        })
               }



               newTestCallback = (newTestOrder) => {
                         this.setState({
                             newTestOrder: newTestOrder
                         })
                         console.log("New test order: " + newTestOrder);
               }



      render() {
            let patients = this.state.patients;
             let search = this.state.searchString.trim().toLowerCase();

             if (search.length > 0) {
                 patients = patients.filter(function(patient) {

                         return patient.name.toLowerCase().match(search);

                     });
                 }

                 if(this.state.loading){
                    return(<></>)
                 } else{

          return (

              <div className = "container" >




                  <div className="main-results col-12">

                   <h4 className="small-title-tests">Patients</h4>
                 <Navbar className="navbar-patients">


                     <Nav className="mr-auto results-nav">

                  <input
                         className="results-search"
                         type="text"
                         value={this.state.searchString}
                         ref="search"
                         onChange={this.handleChange}
                         placeholder="Search by patient name"
                     />

                     </Nav>
                     <Form className="results-nav-form" inline>
                     <Link  to={`/createPatient`}>
                     <Button className="nav-button">
                        Register Patient
                     </Button>
                     </Link>

                     </Form>

                 </Navbar>
                 <Form className="results-filter-div">

                     <Form.Check inline className="sortCheck" type="radio"
                        name="phone_num"
                       label='A - Z'

                        onClick={this.sortTableAZ}
                        defaultChecked
                      />

                    <Form.Check inline className="sortCheck" type="radio"
                        name="phone_num"
                        label='Z - A'

                        onClick={this.sortTableZA}
                      />
                     </Form>

                  <Card className="results-dashboard">



                     <Card.Body className="dashboard row">

                         <div className="col-12 results-div">
                         <Table className="results-table" hover>



                                       <thead >
                                           <tr>
                                                <th className="first-row">Patient name</th>
                                                <th>Email address</th>
                                                <th>Phone No.</th>
                                                <th>DOB</th>
                                                <th>Actions</th>

                                           </tr>
                                         </thead>
                                         <tbody>

                                         {patients.map((patient) => {

                                             if(patient._id != null && patient.role.role_name === 'Patient'){


                                                 const encryptedDob = CryptoJS.AES.decrypt(patient.info.dob.toString(), patient.password)
                                                 const decryptedDob = encryptedDob.toString(CryptoJS.enc.Utf8)

                                                 const encryptedPhone = CryptoJS.AES.decrypt(patient.phone_num.toString(), patient.password)
                                                 const decryptedPhone = encryptedPhone.toString(CryptoJS.enc.Utf8)

                                                 return(

                                                     <tr key={patient._id}>
                                                     <td className="first-row">
                                                         <Link className="patient-link" to={`/viewPatient/${patient._id}`}>
                                                            {patient.info.honorific}{patient.name}
                                                         </Link>
                                                     </td>
                                                     <td>
                                                        {patient.email}
                                                    </td>
                                                    <td>
                                                       {decryptedPhone}
                                                   </td>
                                                     <td>
                                                         <Moment className="" format="D/MM/YYYY">{decryptedDob}</Moment>
                                                    </td>
                                                    <td className="last-td">
                                                    <Link  to={`/viewPatient/${patient._id}`}>
                                                    <Button className="nav-button">
                                                       View Patient
                                                    </Button>
                                                    </Link>
                                                   </td>

                                                     </tr>

                                             )

                                             };
                                         })}
                                         </tbody>




                         </Table>

                         </div>


                     </Card.Body>
                 </Card>


                 <h4 className="small-title-tests">Available tests</h4>
                <OrderTest callbackFromParent={this.newTestCallback} fromViewPatient={false} />


                  </div>
                  <div className="blob test-blob">

                  <svg xlinkHref="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 350">
                      <path d="M156.4,339.5c31.8-2.5,59.4-26.8,80.2-48.5c28.3-29.5,40.5-47,56.1-85.1c14-34.3,20.7-75.6,2.3-111 c-18.1-34.8-55.7-58-90.4-72.3c-11.7-4.8-24.1-8.8-36.8-11.5l-0.9-0.9l-0.6,0.6c-27.7-5.8-56.6-6-82.4,3c-38.8,13.6-64,48.8-66.8,90.3c-3,43.9,17.8,88.3,33.7,128.8c5.3,13.5,10.4,27.1,14.9,40.9C77.5,309.9,111,343,156.4,339.5z"/>
                  </svg>
                  </div>
                  <div className="title-animation">
                      <h4 className="home-title-tests">Blood Drop</h4>
                      </div>
                  <div className="text-animation">
                      <span className="centre-text-tests">A private and secure way to manage<br /> your blood test results.</span>
                  </div>


              </div>


          );
      }
      }
  }

  export default withRouter(ViewPatients);
