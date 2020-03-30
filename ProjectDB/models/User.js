/**
 * @Author: dylanlawless
 * @Date:   2020-01-18T14:59:15+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-19T16:20:26+00:00
 */



const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var CryptoJS = require("crypto-js");

const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone_num: {
    type: String,
    required: true
},
    role: {
        type: mongoose.Types.ObjectId,
        ref: 'Role',
        default: '5e53c622f2c98f22e839e9df'
    },
    info : {
        weight: { type: String },
        dob: { type: String },
        address: { type: String },
        honorific: { type: String, default: 'Mr. ' },
        licence_num: { type: String },
        surgery_name: { type: String },
        surgery_address: { type: String }
    },
    pinNeeded: {
        type: Boolean,
        default: false
    },
    pinCode: {
            type: String,
            maxLength: 6,
            default: ''
        },


    password: {
      type: String,
      required: true,
      minlength: 5
  },
    confirmPassword: {
      type: String,
      required: true,
      minlength: 5

      },
    isDeleted: {
      type: Boolean,
      default: false

     },
     signUpDate: {
       type: Date,
       default: Date.now()
    }
});


UserSchema.path('pinCode').required(function() {
  return this.pinNeeded === true
})

UserSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.generateHash = function(pinCode){
    return bcrypt.hashSync(pinCode, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};
UserSchema.methods.validPinCode = function(pinCode){
    return bcrypt.compareSync(pinCode, this.pinCode);
};


UserSchema.methods.encryptData = function(data, password){
    return CryptoJS.AES.encrypt(data, password).toString()
};

UserSchema.methods.encryptDOB = function(data, password){
    return CryptoJS.AES.encrypt(data, password).toString()
};


const User = mongoose.model('User', UserSchema);

module.exports = User;
