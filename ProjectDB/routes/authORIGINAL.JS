/**
 * @Author: dylanlawless
 * @Date:   2020-01-28T13:08:21+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-02-29T15:10:11+00:00
 */
 let User = require("../models/User");

const passport = require('passport');
const settings = require('../config/passport')(passport);
const jwt = require('jsonwebtoken');

const router = require('express').Router();



router.post('/register', (req, res) => {
    const { body } = req;
    const { password } = body;

    let { email } = body;
    let { name } = body;
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
        newUser.name = name;
        newUser.password = newUser.generateHash(password);

        newUser.save((err, user) => {
            if(err) {
                return res.json({
                    success: false,
                    message: 'Error: Server error.'
                });
            }
            return res.json({
                    success: true,
                    message: 'Account created for user'
            });

        });

    });

});


router.post('/login', (req, res) => {
    const { body } = req;
    const { password } = body;

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



    User.findOne({email}, (err, user) => {
        if(err) throw err;

        if(!user) {
            res.status(401).json({success: false, message: 'Authentication failed. User not found.'});
        }

        else{

            if (user.validPassword(password)){
                let token = jwt.sign(user.toJSON(), process.env.API_SECRET);
                res.json({success: true, token: 'JWT' + token});
            }
            else{
                res.status(401).json({success: false, message: 'Authentication failed. Wrong person'});
            }

        }

});

});

router.route("/user/:id").put(passport.authenticate('jwt', { session: false }), (req, res) => {
    const token = getToken(req.headers);
    const userId = req.params.id;
    const newUser = req.body;

    if(token){

      if(!user.name) {
          return res.status(400).json({
              message: "User name cannot be blank"
          });
      }

      if(!user.age) {
          return res.status(400).json({
              message: "User age cannot be blank"
          });
      }
      if(!user.weight) {
          return res.status(400).json({
              message: "User weight cannot be blank"
          });
      } ,
      if(!user.honorific) {
          return res.status(400).json({
              message: "User honorific cannot be blank"
          });
      }

      if(!user.address) {
          return res.status(400).json({
              message: "User address cannot be blank"
          });
      }

      User.findByIdAndUpdate(userId, user, {new: true})
        .then(user => {
            if(!user) {
                return res.status(404).json({
                    message: "User not found with id" + userId
                });
            }
            res.json(user);
        }).catch(err => {

            if(err.kind === 'ObjectId') {
                return res.status(404).json({
                        message: "User not found with id " + userId
                });
            }
            return res.status(500).json({
                    message: "Error updating user with id " + userId
            });
        });

}

else {
    return res.status(403).json({success: false, message: 'Unauthorized'})

}


});




module.exports = router;
