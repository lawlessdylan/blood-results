// /**
//  * @Author: dylanlawless
//  * @Date:   2020-01-18T15:00:26+00:00

//  */
//
//
//
// const router = require('express').Router();
//
// let TestOder = require('../models/TestOrder');
//
//
// router.route('/').get((req, res) => {
//   Doctor.find()
//        .then(doctors => res.json(doctors))
//        .catch(err => res.status(400).json('Error: ' + err));
//
// });
//
// router.route("/:id").get((req, res) => {
//
//   const doctorId = req.params.id;
//
//     Doctor.findById(doctorId)
//         .then(result => {
//             if(!result){
//                 return res.status(404).json({
//                         message: "Doctor not found with id " + doctorId
//                 });
//             }
//             res.json(result);
//         })
//
//         .catch(err =>{
//             if(err.kind === 'ObjectId') {
//                 return res.status(404).json({
//                         message: "Doctor not found with id " + doctorId
//                 });
//             }
//             return res.status(500).json({
//                     message: "Error retrieving Doctor with id " + doctorId
//             });
//         });
//
// });
//
//
// router.route("/").post((req, res) => {
//   const doctor = req.body;
//   //validate doctor
//   console.log('Adding new doctor: ', doctor);
//
//   const newDoctor = new Doctor(doctor);
//
//   newDoctor.save()
//           .then(() => {
//             res.json('Doctor added!');
//           })
//           .catch(err => res.status(400).json('Error: ' + err));
//
//   // res.json({message: "You are trying to post a movie: ", movie});
//   //return updated list
//   // res.json(data);
// });
//
// router.route("/:id").put((req, res) => {
//   const doctorId = req.params.id;
//   const doctor = req.body;
//
//   console.log("Editing doctor: ", doctorId, " to be ", doctor);
//   res.json({message: "You are trying to edit a doctor: ", doctorId});
//   // res.json(data);
//
// });
//
// router.route("/:id").delete((req, res) => {
//   const doctorId = req.params.id;
//
//   console.log("Deleting doctor with id: ", doctorId);
//   res.json({message: "You are trying to delete a doctor: ", doctorId});
//
//   // res.json(data);
// });
//
//
//

//
//
//
//
//
// module.exports = router;
