/**
 * @Author: dylanlawless
 * @Date:   2020-01-16T09:51:11+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-05T09:46:30+00:00
 */
 import React, {
     Component
 } from 'react';

 import axios from 'axios';

 import { Card, CardDeck, Button} from 'react-bootstrap';
 import drop from '../../images/drop.png';


 import ConfirmOrderModal from './ConfirmOrderModal';

 import '../styles/tests.css';


 class Tests extends Component {


     constructor(props) {
         super(props);


          this.state = {
            tests: [],
            loggedIn: localStorage.getItem("jwtToken") !== null,
            user: '',
            testOrder: {
                patient_id: this.props.user._id,
                test_id: '',
                doctor_id: '',
                date: new Date(),
                status: "Pending"
            }

          };

        }

        componentDidMount() {

              /* GET request for tests */

              axios.get('http://localhost:5000/test')
              .then(response => {

                this.setState({
                  tests: response.data,
                })
              })
              .catch((error) => {
                  console.log(error);
              })

          }

          onSubmit = e => {
            e.preventDefault();
                this.setState((state, props) => ({
              testOrder: {
                  doctor_id: this.state.doctor._id,
                  patient_id: this.state.patient_id,
                  test_id: this.state.test_id,
                  date: this.state.date,
                  status: "Sent"
              }
          }));



          };





     render() {
         return (


             <div className = "container" >
             <div className="title-animation">
                 <h4 className="small-title">Tests</h4>
             </div>

                    <div className="row card-group">
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
                                       <div>
                                       <span className="test-desc">
                                                {test.test_description}
                                        </span>
                                        <div className="test-points">
                                            Tests for:
                                            <ul className="test-list">
                                                {test.tests_for.map((tests_for) =>
                                                    <div key={tests_for._id}>
                                                        <li className="tests-for-li">{tests_for.tests_for}</li>
                                                    </div>
                                                )}
                                            </ul>
                                        </div>
                                       </div>
                                     </Card.Body>
                                     <Card.Footer className="card-footer">
                                        <ConfirmOrderModal patient_id={this.props.user._id} doctor_id={test.test_doctor._id} test_id={test._id} />
                                     <Button className="nav-button">View more</Button>

                                     </Card.Footer>
                                    </Card>

                                    )}

                                })}

                                </CardDeck>
                          </div>
             </div>
         );
     }
 }

 export default Tests;
