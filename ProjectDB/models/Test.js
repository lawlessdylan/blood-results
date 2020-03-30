/**
 * @Author: dylanlawless
 * @Date:   2020-01-18T14:59:15+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-02-24T13:01:37+00:00
 */




 const mongoose = require('mongoose');
 const Schema = mongoose.Schema;

 const TestsForSchema = new Schema({
     tests_for: String
 })


 const TestSchema = new Schema({

   test_name: {
     type: String,
     required: true
     },
     test_description: {
       type: String,
       required: true
   },
   tests_for: {
       type: [TestsForSchema],
       required: true
   },
   test_doctor: {
       type: mongoose.Types.ObjectId,
         ref: 'User'
   },

 });

 const Test = mongoose.model('Test', TestSchema);

 module.exports = Test;
