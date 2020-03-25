/**
 * @Author: dylanlawless
 * @Date:   2020-01-18T15:00:26+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-02-18T17:53:22+00:00
 */



const router = require('express').Router();

const passport = require('passport');
const settings = require('../config/passport')(passport);

let Result = require('../models/Result');

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
  Result.find().populate('doctor_id').populate('patient_id').populate('test_id')
       .then(results => res.json(results))
       .catch(err => res.status(400).json('Error: ' + err));

});

router.route("/:id").get((req, res) => {
  const resultId = req.params.id;
  res.json({message: "You are trying to get result: ", resultId});

});

router.route("/").post(passport.authenticate('jwt', { session: false }), (req, res) => {
    const token = getToken(req.headers);
    const result = req.body;

    if(token) {
        if(!result.doctor_id) {
            return res.status(400).json({
                message: "Result doctor_id cannot be blank"
            });
        }
        if(!result.patient_id) {
            return res.status(400).json({
                message: "Result's patient_id cannot be blank"
            });
        }
        if(!result.test_id) {
            return res.status(400).json({
                message: "Result's test_id cannot be blank"
            });
        }
        if(!result.test_order_id) {
            return res.status(400).json({
                message: "Result's test_id cannot be blank"
            });
        }
        if(!result.date) {
            return res.status(400).json({
                message: "Result's date cannot be blank"
            });
          }
          if(!result.status) {
              return res.status(400).json({
                  message: "Result's status two cannot be blank"
              });
            }



          const newResult = new Result(result);

          newResult.save()
            .then(data => {
              res.json(data)
            })
            .catch(err => res.status(400).json('Error: ' + err));

        } else {
          return res.status(403).json({success: false, message: 'Unauthorized'})
        }

});


router.route("/:id").put((req, res) => {
  const resultId = req.params.id;
  const result = req.body;

  console.log("Editing result: ", resultId, " to be ", result);
  res.json({message: "You are trying to edit a result: ", resultId});
  // res.json(data);

});

router.route("/:id").delete((req, res) => {
  const resultId = req.params.id;

  console.log("Deleting result with id: ", resultId);
  res.json({message: "You are trying to delete a result: ", resultId});

  // res.json(data);
});


module.exports = router;
