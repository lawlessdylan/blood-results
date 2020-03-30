/**
 * @Author: dylanlawless
 * @Date:   2019-11-07T12:38:26+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-29T21:48:01+01:00
 */



import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button, Collapse  } from 'react-bootstrap';
import Moment from 'react-moment';
import '../styles/results.css';






var CryptoJS = require("crypto-js");
var moment = require('moment');

 function ResultsCollapse(props) {

    const [open, setOpen] = useState(false);



    let result = props.result;


   return (
       <>

            <Button className="nav-button"
              onClick={() => setOpen(!open)}
              aria-controls="example-collapse-text"
              aria-expanded={open}
            >
              View Result
            </Button>



            <Collapse in={open}>

                <p>Hello dknfksjdnfksdb fmnsb fjhd sj j jjb jh jh jh </p>
            </Collapse>


            

          </>
   );
 }

 export default ResultsCollapse;
