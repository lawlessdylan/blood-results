/**
 * @Author: dylanlawless
 * @Date:   2020-01-18T15:00:26+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-30T12:35:59+01:00
 */



const router = require('express').Router();

let User = require('../models/User');
let Result = require('../models/Result');

let TestOrder = require('../models/TestOrder');

const passport = require('passport');
const settings = require('../config/passport')(passport);

const getToken = (headers) => {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2){
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};



router.route('/').get((req, res) => {
  User.find().populate('role')
       .then(users => res.json(users))
       .catch(err => res.status(400).json('Error: ' + err));

  // res.json({message: "You are trying to see a list of movies"});
});


router.route("/:id").get((req, res) => {

  const userId = req.params.id;

    User.findById(userId).populate('role')
        .then(result => {
            if(!result){
                return res.status(404).json({
                        message: "User not found with id " + userId
                });
            }
            res.json(result);
        })

        .catch(err =>{
            if(err.kind === 'ObjectId') {
                return res.status(404).json({
                        message: "User not found with id " + userId
                });
            }
            return res.status(500).json({
                    message: "Error retrieving User with id " + userId
            });
        });

});




router.route("/:id/results").get((req, res) => {

  const userId = req.params.id;

    User.findById(userId)
        .then(result => {
            if(!result){
                return res.status(404).json({
                        message: "User not found with id " + userId
                });
            }

            Result.find({patient_id: userId}, function(err, userResults) {
                if (err) throw err;

                res.json(userResults);
            }).populate('doctor_id').populate('test_id').populate('patient_id');
        })

        .catch(err =>{
            if(err.kind === 'ObjectId') {
                return res.status(404).json({
                        message: "User not found with id " + userId
                });
            }
            return res.status(500).json({
                    message: "Error retrieving User with id " + userId
            });
        });

});


router.route("/doctor/:id/results").get((req, res) => {

  const userId = req.params.id;

    User.findById(userId)
        .then(result => {
            if(!result){
                return res.status(404).json({
                        message: "User not found with id " + userId
                });
            }

            Result.find({doctor_id: userId}, function(err, doctorResults) {
                if (err) throw err;

                res.json(doctorResults);
            }).populate('patient_id').populate('test_id').populate('user_id');
        })

        .catch(err =>{
            if(err.kind === 'ObjectId') {
                return res.status(404).json({
                        message: "User not found with id " + userId
                });
            }
            return res.status(500).json({
                    message: "Error retrieving User with id " + userId
            });
        });

});



router.route("/:id").delete((req, res) => {
  const userId = req.params.id;

  console.log("Deleting user with id: ", userId);
  res.json({message: "You are trying to delete a user: ", userId});

  // res.json(data);
});


//get doctors test orders
router.route("/:id/testOrders").get((req, res) => {

    const userId = req.params.id;

      User.findById(userId)
          .then(result => {
              if(!result){
                  return res.status(404).json({
                          message: "User not found with id " + userId
                  });
              }
          //if successful return json doctor.


          TestOrder.find({patient_id: userId}, function(err, userTestOrders) {
              if (err) throw err;

              res.json(userTestOrders);
          }).populate('doctor_id').populate('test_id')
      })

      .catch(err =>{
          if(err.kind === 'ObjectId') {
              return res.status(404).json({
                      message: "Doctor not found with id " + userId
              });
          }
          return res.status(500).json({
                  message: "Error retrieving Doctor with id " + userId
          });
      });

});

router.route("/doctor/:id/testOrders").get((req, res) => {

    const doctorId = req.params.id;

      User.findById(doctorId)
          .then(result => {
              if(!result){
                  return res.status(404).json({
                          message: "User not found with id " + doctorId
                  });
              }
          //if successful return json doctor.


          TestOrder.find({doctor_id: doctorId}, function(err, doctorTestOrders) {
              if (err) throw err;

              res.json(doctorTestOrders);
          }).populate('patient_id').populate('test_id')
      })

      .catch(err =>{
          if(err.kind === 'ObjectId') {
              return res.status(404).json({
                      message: "Doctor not found with id " + doctorId
              });
          }
          return res.status(500).json({
                  message: "Error retrieving Doctor with id " + doctorId
          });
      });

});

router.route("/:id").put(passport.authenticate('jwt', { session: false }), (req, res) => {
    const token = getToken(req.headers);
    const userId = req.params.id;
    const user = req.body;

    if(token){

      if(!user.name) {
          return res.status(400).json({
              message: "User name cannot be blank"
          });
      }

      if(!user.info.dob) {
          return res.status(400).json({
              message: "User dob cannot be blank"
          });
      }
      if(!user.info.weight) {
          return res.status(400).json({
              message: "User weight cannot be blank"
          });
      }
      if(!user.info.honorific) {
          return res.status(400).json({
              message: "User honorific cannot be blank"
          });
      }

      if(!user.info.address) {
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
