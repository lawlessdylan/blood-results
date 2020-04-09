/**
 * @Author: dylanlawless
 * @Date:   2020-01-15T20:35:16+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-04-09T20:41:37+01:00
 */
import React, {
    Component

} from 'react';
import axios from 'axios';

import '../styles/home.css';
import { Button, Card, CardDeck, Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import drop from '../../images/drop.png';
 import down from '../../images/down-arrow.png';
   import up from '../../images/up.png';
class Home extends Component {
    constructor(props){
        super(props);



        this.state = {

                loggedIn: localStorage.getItem("jwtToken") !== null,
                user: '',
                tests: [],
                open: true
        }
    }
    componentDidMount(){
        axios.get(process.env.REACT_APP_BACKEND +'/test')
        .then(response => {

          this.setState({
            tests: response.data,
          })
        })
        .catch((error) => {
            console.log(error);
        })

    }
    setOpen = () => {
        if(this.state.open === false){
            this.setState({
              open: true
            })
        } else {
            this.setState({
              open: false
            })
        }

    }


    render() {

        return (
            <div className="main-div">


                <div className="container">

                    <div className="row">

                    <div>
                         <h4 className="small-title-tests-home">Available tests</h4>
                    <CardDeck>

                    {this.state.tests.map((test) => {

                        if(test._id != null){

                            return(

                                <Card key={test._id} className="col-lg-4 test-card-home">

                                 <Card.Body className="test-card-home-body">
                                 <div className="row test-heading">

                                     <Card.Title>
                                           <div className="test-logo-home"><Card.Img className="my-logo-home" src={drop} /> </div>
                                            <div className="test-title-home">
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
                                                <div key={tests_for._id}>
                                                    <li className="tests-for-li">{tests_for.tests_for}</li>
                                                </div>
                                            )}
                                        </ul>
                                    </div>
                                   </div>
                                       </Collapse>
                                 </Card.Body>

                                </Card>

                                )}

                            })}

                            </CardDeck>
                            </div>


                        <div className="col-12">
                        <div className="blob">

                        <svg xlinkHref="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 350">
                            <path d="M156.4,339.5c31.8-2.5,59.4-26.8,80.2-48.5c28.3-29.5,40.5-47,56.1-85.1c14-34.3,20.7-75.6,2.3-111 c-18.1-34.8-55.7-58-90.4-72.3c-11.7-4.8-24.1-8.8-36.8-11.5l-0.9-0.9l-0.6,0.6c-27.7-5.8-56.6-6-82.4,3c-38.8,13.6-64,48.8-66.8,90.3c-3,43.9,17.8,88.3,33.7,128.8c5.3,13.5,10.4,27.1,14.9,40.9C77.5,309.9,111,343,156.4,339.5z"/>
                        </svg>
                        </div>

                        <div className="title-animation">
                            <h4 className="home-title">Blood Drop</h4>
                            </div>
                        <div className="text-animation">
                            <span className="centre-text">A private and secure way to manage<br /> your blood test results.</span>
                        </div>

                        </div>
                    </div>

                </div>
            </div>

        );
    }
}

export default Home;
