/**
 * @Author: dylanlawless
 * @Date:   2020-02-13T14:02:56+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-19T16:20:19+00:00
 */

let User = require("../models/User");

let Role = require("../models/Role")

const passport = require('passport');
const settings = require('../config/passport')(passport);
const jwt = require('jsonwebtoken');
const router = require('express').Router();



router.post('/register/user', (req, res) => {
    const { body } = req;
    const { password } = body;

    let { email } = body;
    let { name } = body;
    let { phone_num } = body;


    let {info} = body;
    let { pinCode } = body;
    let { pinNeeded } = body;
    let { confirmPassword } = body;


    if(!email) {
        return res.json({
            success: false,
            message: 'Error: Email cannot be blank.'
        });
    }

    if(!name) {
        return res.json({
            success: false,
            message: 'Error: Name cannot be blank.'
        });
    }

    if(!phone_num) {
        return res.json({
            success: false,
            message: 'Error: Phone number cannot be blank.'
        });
    }



    if(confirmPassword != password){
        return res.json({
            success: false,
            message: 'Error: Passwords do not match.'
        });
    }

    if(!password){
        return res.json({
            success: false,
            message: 'Error: Password cannot be blank.'
        });
    }
    email = email.toLowerCase();
    email = email.trim();




    User.find({
        email: email
    }, (err, previousUsers) => {
        if(err) {
            return res.json({
                success: false,
                message: 'Error: Server error.'
            });
        } else if (previousUsers.length>0){
            return res.json({
                success: false,
                message: 'Error: Account already exists.'
            });
        }

        const newUser = new User();
            newUser.email = email;


            newUser.pinNeeded = pinNeeded;
            newUser.pinCode = newUser.generateHash(pinCode);
            newUser.password = newUser.generateHash(password);
            newUser.confirmPassword = newUser.generateHash(confirmPassword);

            newUser.name =  newUser.encryptData(name, newUser.password );
            newUser.phone_num =  newUser.encryptData(phone_num, newUser.password );

            newUser.info.dob =  newUser.encryptData(info.dob, newUser.password);
            newUser.info.weight =  newUser.encryptData(info.weight, newUser.password );
            newUser.info.address =  newUser.encryptData(info.address, newUser.password );
            newUser.info.honorific = info.honorific;
            // newUser.info.age =  newUser.encryptAge(info.age, newUser.password );
            // newUser.info.weight =  newUser.encryptWeight(info.weight, newUser.password );



            newUser.save((err, user) => {
                if(err) {
                    return res.json({
                        success: false,
                        message: 'Error: Server error.',


                    });

                }
                return res.json({
                        success: true,
                        message: 'Account created for user',
                        user: newUser
                });

            });

    });

});


router.post('/login/user', (req, res) => {
    const { body } = req;
    const { password } = body;
    const { pinCode } = body;

    const { pinNeeded } = body;


    let { email } = body;

    if(!email) {
        return res.json({
            success: false,
            message: 'Error: Email cannot be blank.'
        });
    }
    if(!password){
        return res.json({
            success: false,
            message: 'Error: Password cannot be blank.'
        });
    }


    email = email.toLowerCase();

    User.findOne({email}, (err, user)=> {
        if(err) throw err;


        if(!user) {
            res.status(401).json({success: false, message: 'Authentication failed. User not found.'});
        }

        else{

            if (user.validPassword(password)){
                if(user.pinNeeded === true){
                    res.json({success: true, role: user.role, pinNeeded: user.pinNeeded});

                } else {

                    let token = jwt.sign(user.toJSON(), process.env.API_SECRET);
                    res.json({success: true, token: 'JWT ' + token, role: user.role});
                }

            }
            else{
                res.status(401).json({success: false, message: 'Authentication failed. Wrong person'});
            }

        }



}).populate('role');

});


router.post('/login/user/twoStep', (req, res) => {
    const { body } = req;
    const { password } = body;
    const { pinCode } = body;


    let { email } = body;

    if(!email) {
        return res.json({
            success: false,
            message: 'Error: Email cannot be blank.'
        });
    }
    if(!password){
        return res.json({
            success: false,
            message: 'Error: Password cannot be blank.'
        });
    }




    email = email.toLowerCase();



    User.findOne({email}, (err, user)=> {
        if(err) throw err;


        if(!user) {
            res.status(401).json({success: false, message: 'Authentication failed. User not found.'});
        }

    else{

        if (user.validPassword(password) && user.validPinCode(pinCode)){

            let token = jwt.sign(user.toJSON(), process.env.API_SECRET);
            res.json({success: true, token: 'JWT ' + token, role: user.role});
        }
        else{
            res.status(401).json({success: false, message: 'Authentication failed. Wrong person'});
        }

    }







}).populate('role');

});

router.route('/roles').get((req, res) => {
  Role.find()
       .then(roles => res.json(roles))
       .catch(err => res.status(400).json('Error: ' + err));

});






module.exports = router;
