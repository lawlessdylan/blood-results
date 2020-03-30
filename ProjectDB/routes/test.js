/**
 * @Author: dylanlawless
 * @Date:   2020-01-18T15:00:26+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-18T11:20:58+00:00
 */



const router = require('express').Router();

let Test = require('../models/Test');

router.route('/').get((req, res) => {
  Test.find().populate('test_doctor')
       .then(tests => res.json(tests))
       .catch(err => res.status(400).json('Error: ' + err));

});

router.route("/:id").get((req, res) => {
  const testId = req.params.id;

  res.json({message: "You are trying to get test order : ", testId});

});

router.route("/").post((req, res) => {

    const test = req.body;

      const newTest = new Test(test);

      newTest.save()
          .then(data => {
              res.json(data);
            })
          .catch(err => res.status(400).json('Error: ' + err));

});





router.route("/").put((req, res) => {

    const testId = req.params.id;
    const newTest = req.body;


      Test.findByIdAndUpdate(testId, newTest, {new: true})
        .then(test => {
            if(!test) {
                return res.status(404).json({
                    message: "Test not found with id" + testId
                });
            }
            res.json(test);
        }).catch(err => {

            if(err.kind === 'ObjectId') {
                return res.status(404).json({
                        message: "Test not found with id " + testId
                });
            }
            return res.status(500).json({
                    message: "Error updating test with id " + testId
            });
        });





});





module.exports = router;
