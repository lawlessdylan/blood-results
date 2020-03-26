/**
 * @Author: dylanlawless
 * @Date:   2020-03-06T09:12:10+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-25T16:20:50+00:00
 */
 import React, { PureComponent } from 'react';
 import {
   LineChart, Line, XAxis, YAxis, CartesianGrid,Label, Tooltip, Legend,
 } from 'recharts';
 import axios from 'axios';


 import Moment from 'react-moment';


 var CryptoJS = require("crypto-js");
var moment = require('moment');

 export default class ResultsChart extends PureComponent {


     constructor(props) {
         super(props);



          this.state = {
            loggedIn: localStorage.getItem("jwtToken") !== null,
            user: this.props.user ,
            results: [],

            results_id: '',
            match_id: '',
            decryptedResult: '',
            encryptedResult: '',
            testName: "Ha1bc"

          };

        }
        // testOrders = testOrders.filter(function(testOrder) {
        //
        //         return testOrder.patient_id.name.toLowerCase().match(search);
        //
        //     });
        //
        // results: response.data.filter(function(testOrder) {
        //
        //         return results.test_id.test_name.match(this.state.testName);
        //
        //     })


   componentDidMount() {
         axios.get(`http://localhost:5000/user/${this.state.user._id}/results`)
         .then(response => {
             console.log(response);
           this.setState({
             results: response.data

         })

         })
         .catch((error) => {
             console.log(error);
         })




     }


   render() {
       let results = this.state.results;
       let testName = this.state.testName;

       results = results.filter(function(result) {

                    return result.test_id.test_name.match(testName);


                })

     return (
         <div className = "container" >
             <h4 className="small-title">Results chart</h4>
                         <div className=" col-12">


                         <div className="results-chart">
                         <div className="x-label">Hb1ac</div>
           <LineChart
             width={650}
             height={420}
             data={ results.map((result) => {
                  this.state.encryptedResult = CryptoJS.AES.decrypt(result.test_result.toString(), this.state.user._id)
                  this.state.decryptedResult = this.state.encryptedResult.toString(CryptoJS.enc.Utf8);
                  const date= moment(result.date).format("MMM Do YY");
                  // if(this.state.decryptedResult > 4){
                  //     this.state.decryptedResult = 4;
                  // }
                  if(result._id != null){

                      return(

                          {
                            date: `${date}`, Hb1ac: `${this.state.decryptedResult}`,
                          }
                  )}
              })}

             className="results-chart"
           >
             <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date">

                </XAxis>
                <YAxis dataKey="Hb1ac"  domain={[0, 10]}>

                </YAxis>
                <Tooltip />
                <Legend />
                    <Line type="monotone" dataKey="Hb1ac" stroke="#cf3c3c" activeDot={{ r: 9 }} />

           </LineChart>
           </div>
           </div>
       </div>
     );
   }
 }
