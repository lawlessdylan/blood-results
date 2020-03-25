/**
 * @Author: dylanlawless
 * @Date:   2020-01-18T14:59:15+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-04T16:46:04+00:00
 */




 const mongoose = require('mongoose');


 const ResultSchema = new mongoose.Schema({

   doctor_id: {
       type: mongoose.Types.ObjectId,
         ref: 'User'
     },
    patient_id: {
     type: mongoose.Types.ObjectId,
     ref: 'User'
    },
    test_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Test'
    },
    test_order_id: {
        type: mongoose.Types.ObjectId,
        ref: 'TestOrder'
    },
    date: {
      type: Date,
      required: true
    },
    test_result: {
        type: String,
        required: true
    },
    status: {
      type: String,
      required: true
    }
 });

 const Result = mongoose.model('Result', ResultSchema);

 module.exports = Result;
