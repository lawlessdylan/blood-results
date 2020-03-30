/**
 * @Author: dylanlawless
 * @Date:   2020-01-18T15:00:26+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-19T15:22:41+00:00
 */



const router = require('express').Router();

const passport = require('passport');
const settings = require('../config/passport')(passport);

let TestOrder = require('../models/TestOrder');


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



router.route("/:id").get((req, res) => {

  const testOrderId = req.params.id;

    TestOrder.findById(testOrderId).populate('doctor_id').populate('patient_id').populate('test_id')
        .then(testOrder => {
            if(!testOrder){
                return res.status(404).json({
                        message: "Test order not found with id " + testOrderId
                });
            }
            res.json(testOrder);
        })

        .catch(err =>{
            if(err.kind === 'ObjectId') {
                return res.status(404).json({
                        message: "Test order not found with id " + testOrderId
                });
            }
            return res.status(500).json({
                    message: "Error retrieving Test order with id " + testOrderId
            });
        });

});




router.route("/").post(passport.authenticate('jwt', { session: false }), (req, res) => {
    const token = getToken(req.headers);
    const testOrder = req.body;

    if(token) {
        if(!testOrder.doctor_id) {
            return res.status(400).json({
                message: "TestOrder doctor_id cannot be blank"
            });
        }
        if(!testOrder.patient_id) {
            return res.status(400).json({
                message: "TestOrder's patient_id cannot be blank"
            });
        }
        if(!testOrder.test_id) {
            return res.status(400).json({
                message: "TestOrder's test_id cannot be blank"
            });
        }
        if(!testOrder.date) {
            return res.status(400).json({
                message: "TestOrder's date cannot be blank"
            });
        }




          const newTestOrder = new TestOrder(testOrder);

          newTestOrder.save()
            .then(data => {
              res.json(data)
            })
            .catch(err => res.status(400).json('Error: ' + err));

        } else {
          return res.status(403).json({success: false, message: 'Unauthorized'})
        }

});

router.route("/:id").put(passport.authenticate('jwt', { session: false }), (req, res) => {
    const token = getToken(req.headers);
    const testOrderId = req.params.id;
    const testOrder = req.body;

    if(token){

      TestOrder.findByIdAndUpdate(testOrderId, testOrder, {new: true})
        .then(testOrder => {
            if(!testOrder) {
                return res.status(404).json({
                    message: "Test order not found with id" + testOrderId
                });
            }
            res.json(testOrder);
        }).catch(err => {

            if(err.kind === 'ObjectId') {
                return res.status(404).json({
                        message: "TestOrder not found with id " + testOrderId
                });
            }
            return res.status(500).json({
                    message: "Error updating test oder with id " + testOrderId
            });
        });
    }

    else {
        return res.status(403).json({success: false, message: 'Unauthorized'})
    }

});

module.exports = router;
