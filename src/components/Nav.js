/**
 * @Author: dylanlawless
 * @Date:   2020-01-15T10:04:17+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-04-10T16:06:57+01:00
 */
 import React from 'react';
 import './App.css';
 import { NavLink } from 'react-router-dom';
 import Nav from 'react-bootstrap/Nav'
 import { Navbar, Button} from 'react-bootstrap';
 import drop from '../images/drop.png';

 import { withRouter } from "react-router";
 var CryptoJS = require("crypto-js");

 class MyNav extends React.Component{


             constructor(props) {
                super(props);

                    this.state = {
                    navClass: "",
                    toggler: "dark",
                    toggle:false,
                };
            }


          logout = () => {
              localStorage.removeItem('jwtToken');
              this.props.onLogout();
              window.location = "/login"

          }
          Toggle = () => {
              this.setState({toggle:!this.state.toggle})
          }
          componentDidMount(){
                  this.setState({
                     navClass: '-home',
                     userName: this.props.user.name

             })

          }

          componentDidUpdate(){


              if(this.props.location.pathname === '/login' || this.props.location.pathname === '/' && this.props.loggedIn === false
              || this.props.location.pathname === '/signup' || this.props.location.pathname === '/signup2'
              || this.props.location.pathname === '/editUser'){
                   if(this.state.navClass !== '-home'){
                       this.setState({
                      navClass: '-home',
                      toggler: 'dark'
                  })
              }
            } else {
                if(this.state.navClass === '-home'){
                    this.setState({
                   navClass: '',
                   toggler: 'light'
               })
                // console.log("User in NOT on homepage");
            }
        }}

 render(){
     const loggedIn = this.props.loggedIn;
     const isDoctor = this.props.isDoctor;


     return(


                 <Navbar className={"my-nav" + this.state.navClass} expand="lg"  variant={this.state.toggler}>


                 <Navbar.Brand className="logo-centre " href="/">
                    <img src={drop} className={"my-logo"+ this.state.navClass} alt="logo"/>
                 </Navbar.Brand>
                   <Navbar.Toggle className={"navbar-toggler" + this.state.navClass} />

                   <Navbar.Collapse>
                     <Nav className="mr-auto">

                      {(loggedIn) ? (
                     <div className="navbar-links">


                      {(isDoctor) ? (
                          <div>
                           <NavLink className={"navbar-link"+ this.state.navClass} activeClassName={"chosen" + this.state.navClass} exact to="/">Tests</NavLink>



                           <NavLink className={"navbar-link"+ this.state.navClass} activeClassName={"chosen" + this.state.navClass} exact to="/viewPatients">Patients</NavLink>
                          </div>

                               ) : (
                                   <div>
                                    <NavLink className={"navbar-link"+ this.state.navClass} activeClassName={"chosen" + this.state.navClass} exact to="/">Home</NavLink>
                                   </div>

                                   )}

                      </div>
                  ) : (
                      <>
                      <NavLink className={"navbar-link"+ this.state.navClass} activeClassName={"chosen" + this.state.navClass} exact to="/">Home</NavLink>

                      </>

                      )}
                    </Nav>

                         {(loggedIn) ? (
                             <div >

                                 {(isDoctor) ? (
                                 <div className={"nav-user"+ this.state.navClass}>Dr. {this.props.doctorName}</div>
                             ) : (


                                <NavLink to="/editUser" activeClassName={"chosen"+this.state.navClass} className={"edit-user-link"+ this.state.navClass}>
                                    <div className={"nav-user"+ this.state.navClass}>{this.props.user.info.honorific} {this.props.user.name}</div>
                                </NavLink>
                         )}

                             <NavLink onClick={this.logout} activeClassName="chosen" to="/login">
                                 <Button className={"logout-button nav-button"+ this.state.navClass}>Logout</Button>
                             </NavLink>
                             </div>
                         ) : (
                             <>

                             <div className="navbar-links sign-up-button">
                                     <NavLink className={"navbar-link"+ this.state.navClass} activeClassName={"chosen" + this.state.navClass} to="/login">Log in</NavLink>
                             </div>
                                     <NavLink   to="/signup"><Button className={"nav-button"+ this.state.navClass}>Sign up</Button></NavLink>

                             </>
                         )}

                  </Navbar.Collapse>

                 </Navbar>



     );

 }


 }

 export default withRouter(MyNav);;
