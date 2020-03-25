/**
 * @Author: dylanlawless
 * @Date:   2020-01-18T14:59:15+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-18T12:43:04+00:00
 */




const mongoose = require('mongoose');
var CryptoJS = require("crypto-js");

const TestOrderSchema = new mongoose.Schema({

    test_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Test'
    },
    patient_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    doctor_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },

    date: {
        type: Date,
        required: true
    },

    status: {
        type: String
    }

});





const TestOrder = mongoose.model('TestOrder', TestOrderSchema);

module.exports = TestOrder;
