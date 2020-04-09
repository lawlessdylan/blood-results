/**
 * @Author: dylanlawless
 * @Date:   2020-01-15T09:52:42+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-04-09T20:42:56+01:00
 */
 import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import './App.css';

import MyNav from './Nav';


import Signup from './auth/Signup';
import Signup2 from './auth/Signup2';
import Login from './auth/Login';

import Home from './patient/Home';
import EditUser from './patient/EditUser';
import TestResults from './patient/TestResults';

import DoctorTestOrders from './doctor/DoctorTestOrders';
import CreateResult from './doctor/CreateResult';
import CreatePatient from './doctor/CreatePatient';
import ViewPatient from './doctor/ViewPatient';
import ViewPatients from './doctor/ViewPatients';
import OrderTest from './doctor/OrderTest';



import axios from 'axios';





import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect

} from "react-router-dom";

const BrowserHistory = require('browser-history').default;
var CryptoJS = require("crypto-js");

class App extends React.Component{

    constructor(props) {
        super(props);

        this.state= {

            loggedIn: localStorage.getItem('jwtToken') !== null,
            user:{
                name: '',
                info: {    honorific: ''}

            },

            isDoctor: false,
            doctorName: '',
            page: window.location,
        };

    }
    whatPage = () => {
        this.setState((state, props) => ({
            page: state.page
        }));
    }

    authHandler = () => {
        this.setState((state, props) => ({
            loggedIn: state.loggedIn ? false : true
        }));


    }

     UNSAFE_componentWillMount() { //unsafe warning in console

        const loggedIn = this.state.loggedIn;

        if(loggedIn === true){
            const token =  localStorage.getItem("jwtToken")
            const tokenParts = token.split(".")
            const encodedPayLoad = tokenParts[1]
            const rawPayLoad = atob(encodedPayLoad)
            const user = JSON.parse(rawPayLoad)
            this.setState({

              user: user


            })


            if(user.role.role_name === "Doctor"){
                // console.log("User is a Doctor")
                this.setState((state, props) => ({
                    isDoctor: true,
                    doctorName: user.name
                }));

                } else {
                    console.log("User has a user role");
                    this.setState((state, props) => ({
                        isDoctor: false
                    }));
                }
            }



        };

        componentDidMount(){
            const loggedIn = this.state.loggedIn;
            if(loggedIn === true){
                axios.get(process.env.REACT_APP_BACKEND +'/user/' + this.state.user._id)
                .then(response => {


                    const encryptedName = CryptoJS.AES.decrypt(response.data.name.toString(), response.data.password)
                    const decryptedName = encryptedName.toString(CryptoJS.enc.Utf8);

                  this.setState({
                    user : {
                        name: decryptedName,
                        _id: response.data._id,
                        info: {

                            honorific: response.data.info.honorific
                        }
                    }
                  })
                  // console.log(response);

                })
                .catch((error) => {
                    console.log(error);
                })
            }

        }





render(){

    const isDoctor = this.state.isDoctor;
    const doctorName = this.state.doctorName;
    // console.log(isDoctor);
    const loggedIn = this.state.loggedIn;
    const user = this.state.user;
    const page = this.state.page;


    return(
        <Router history={BrowserHistory}>
            <MyNav doctorName={doctorName} user={user} page={page}  isDoctor={isDoctor} loggedIn={loggedIn} onLogout={this.authHandler} />
            <Switch>
                <Route path="/login"  component={Login} />
                <Route user={user} path="/signup"  component={Signup} />
                <Route user={user} path="/signup2"  component={Signup2} />

                {(isDoctor) ? (
                    <>
                    <Route path="/home"  component={DoctorTestOrders}>
                        {isDoctor ? <DoctorTestOrders doctorName={doctorName} user={user} isDoctor={isDoctor} loggedIn={loggedIn} /> : <Redirect to="/home" />}
                    </Route>

                    <Route path="/orderTest"  component={OrderTest}>
                        {isDoctor ? <OrderTest doctorName={doctorName} user={user} isDoctor={isDoctor} loggedIn={loggedIn} /> : <Redirect to="/home" />}
                    </Route>

                    <Route path="/createPatient"  component={CreatePatient}>
                        {isDoctor ? <CreatePatient  user={user}/> : <Redirect to="/login" />}
                    </Route>


                    <Route path="/createResult/:id" component={CreateResult}>
                          {isDoctor ? <CreateResult user={user}/> : <Redirect to="/login" />}
                    </Route>

                    <Route path="/viewPatient/:id" component={ViewPatient}>
                          {isDoctor ? <ViewPatient  user={user}/> : <Redirect to="/login" />}
                    </Route>

                    <Route path="/viewPatients" component={ViewPatients}>
                          {isDoctor ? <ViewPatients  user={user}/> : <Redirect to="/login" />}
                    </Route>




                    </>
                ):(
                    <>
                    {(loggedIn) ? (
                        <>
                        <Route path="/home"  component={TestResults}>
                              <TestResults isDoctor={isDoctor} loggedIn={loggedIn} user={user}/>
                        </Route>


                                      <Route exact path="/editUser" component={EditUser} >
                                              {loggedIn ? <EditUser user={user} /> : <Redirect to="/editUser" />}
                                      </Route>
                                      </>
                    ):(
                        <Route path="/home"  component={Home}>
                              <Home isDoctor={isDoctor} loggedIn={loggedIn} user={user}/>
                        </Route>
                    )}
                    </>
                )}




              </Switch>
        </Router>



   );
 }
}
 export default App;
