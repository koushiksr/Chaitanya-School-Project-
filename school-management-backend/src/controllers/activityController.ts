import Activity from "../models/activityModel";
import Login from "../models/loginModel";
import Student from "../models/studentModel";
const Mailgen = require('mailgen');
const nodemailer = require("nodemailer");



exports.create = async (req: any, res: any) => {
     // console.log(req.body);
     let isMailSend = false;
     const { formData, schoolID, candidateID } = req.body;
     // const bodyData = formData.AssessmentDate
     const student = await Student.findOne({ candidateID });
     // console.log(student);

     // const inLogin = await Login.findOne({ email: Email });
     // console.log(Email, student, inLogin);

     if (student) {
          const details = await Student.aggregate([
               {
                    $match: { candidateID }
               },
               {
                    $lookup: {
                         from: "schools",
                         localField: "schoolID",
                         foreignField: "schoolID",
                         as: "schoolInfo"
                    }
               },
               {
                    $unwind: "$schoolInfo"
               },
               {
                    $unset: ["createdAt", "updatedAt", "__v", "schoolInfo.createdAt", "schoolInfo.updatedAt", "schoolInfo.__v"]
               },
               {
                    $project: {
                         _id: 0,
                         Name: "$candidateName",
                         ID: "$candidateID",
                         Gender: "$gender",
                         DOB: "$dob",
                         Age: "$age",
                         Class: "$candidateClass",
                         DominantSide: "$dominantSide",
                         ParentName: "$parentName",
                         ParentMobileNo: "$parentMobileNo",
                         AlternateNo: "$alternateNo",
                         email: "$email",
                         ResidenceArea: "$residenceArea",
                         ResidenceCity: "$residenceCity",
                         SchoolName: "$schoolInfo.schoolName",
                         SchoolID: "$schoolInfo.schoolID",
                         SchoolContactName: "$schoolInfo.contactName",
                         SchoolContactNumber: "$schoolInfo.contactNo",
                         SchoolContactEmailID: "$schoolInfo.schoolEmail",
                    }
               }
          ])

          details[0].AssessmentDate = formData.AssessmentDate
          await Activity.create(details)
               .then(async (createdActivity: any) => {
                    let config = {
                         service: 'gmail',
                         auth: {
                              user: 'technohmsit@gmail.com',
                              pass: 'jsug tain gbtm iyks'
                         }
                    }
                    let transporter = await nodemailer.createTransport(config);
                    let MailGenerator = new Mailgen({
                         theme: "default",
                         product: {
                              name: "Admin",
                              link: 'https://mailgen.js/'
                         }
                    })

                    let response = {
                         body: {
                              name: "Assessor",
                              intro: `${student.candidateName}  Is Created Assignment`,
                              action: {
                                   instructions: 'To visit website to assign date, click the link below:',
                                   button: {
                                        text: 'Visit Our Website',
                                        link: 'https://www.example.com',
                                   },
                                   outro: "thanks for attention"
                              }
                         }
                    }

                    let mail = await MailGenerator.generate(response)

                    let message = {
                         from: 'technohmsit@gmail.com',
                         to: process.env.ASSESSOR,
                         subject: "activity created",
                         html: mail
                    }

                    await transporter.sendMail(message).then(() => {
                         console.log({ msg: "you should receive an email" })
                         isMailSend = true;
                    }).catch((error: any) => {
                    })

                    if (isMailSend) {
                         return res.status(201).json({
                              message: 'Activity created successfully', activity: createdActivity
                         })
                    }
               })
               .catch((error: { message: any; }) => {
                    res.status(500).json({ error: 'Internal Server Error', details: error.message });
               });
     } else {
          res.status(404).send(null)
     }
}
exports.createbyAssesser = async (req: any, res: any) => {
     let isMailSend = false;
     const { formData, schoolID, candidateID } = req.body;
     const student = await Student.findOne({ candidateID });
     if (student) {
          const details = await Student.aggregate([
               {
                    $match: { candidateID }
               },
               {
                    $lookup: {
                         from: "schools",
                         localField: "schoolID",
                         foreignField: "schoolID",
                         as: "schoolInfo"
                    }
               },
               {
                    $unwind: "$schoolInfo"
               },
               {
                    $unset: ["createdAt", "updatedAt", "__v", "schoolInfo.createdAt", "schoolInfo.updatedAt", "schoolInfo.__v"]
               },
               {
                    $project: {
                         _id: 0,
                         Name: "$candidateName",
                         ID: "$candidateID",
                         Gender: "$gender",
                         DOB: "$dob",
                         Age: "$age",
                         Class: "$candidateClass",
                         DominantSide: "$dominantSide",
                         ParentName: "$parentName",
                         ParentMobileNo: "$parentMobileNo",
                         AlternateNo: "$alternateNo",
                         email: "$email",
                         ResidenceArea: "$residenceArea",
                         ResidenceCity: "$residenceCity",
                         SchoolName: "$schoolInfo.schoolName",
                         SchoolID: "$schoolInfo.schoolID",
                         SchoolContactName: "$schoolInfo.contactName",
                         SchoolContactNumber: "$schoolInfo.contactNo",
                         SchoolContactEmailID: "$schoolInfo.schoolEmail",
                    }
               }
          ])

          details[0].AssessmentDate = formData.AssessmentDate
          await Activity.create(details)
               .then(async (createdActivity: any) => {
                    let config = {
                         service: 'gmail',
                         auth: {
                              user: 'technohmsit@gmail.com',
                              pass: 'jsug tain gbtm iyks'
                         }
                    }
                    let transporter = await nodemailer.createTransport(config);
                    let MailGenerator = new Mailgen({
                         theme: "default",
                         product: {
                              name: "Admin",
                              link: 'https://mailgen.js/'
                         }
                    })

                    let response = {
                         body: {
                              name: student.candidateName,
                              intro: "Assessor Is Created Your Assignment",
                              action: {
                                   instructions: 'To visit website to assign date, click the link below:',
                                   button: {
                                        text: 'Visit Our Website',
                                        link: 'https://www.example.com',
                                   },
                                   outro: "thanks for attention"
                              }
                         }
                    }

                    let mail = await MailGenerator.generate(response)

                    let message = {
                         from: 'technohmsit@gmail.com',
                         to: student.email,
                         subject: "activity created",
                         html: mail
                    }

                    await transporter.sendMail(message).then(() => {
                         console.log({ msg: "you should receive an email" })
                         isMailSend = true;
                    }).catch((error: any) => {
                    })
                    if (isMailSend) {
                         req.body.formData.ongoing = false
                         const result = await Activity.updateOne(
                              { _id: createdActivity[0]._id },
                              {
                                   $set: req.body.formData
                              }
                         );
                         if (result.matchedCount === 1) {
                              console.log('Date updated successfully');
                         } else {
                              console.log('Date not found or not updated');
                         }
                         return res.status(201).json({
                              message: 'Activity created successfully', activity: result
                         })
                    }
               })
               .catch((error: { message: any; }) => {
                    res.status(500).json({ error: 'Internal Server Error', details: error.message });
               });
     } else {
          res.status(404).send(null)
     }
}

exports.getAllforAssessor = async (req: any, res: any) => {

     const { schoolID, candidateID } = req.params
     const matchData: any = {
          ...(schoolID !== "undefined" && { SchoolID: schoolID }),
          ...(candidateID !== "undefined" && { ID: candidateID }),
     };
     const activity = await Activity.aggregate([{ $match: matchData }]);
     return activity && activity.length
          ? res.json(activity)
          : (activity != null ? res.status(200).json([]) : res.status(404).json({ message: 'something wrong' }));
}

exports.getAll = async (req: any, res: any) => {
     const student = await Activity.find({ SchoolID: req.params.schoolID, ID: req.params.candidateID })
     if (!student) {
          return res.status(404).json({ message: 'there is no data in database' });
     }
     res.json(student);
}
exports.getAllActivityBySchoolID = async (req: any, res: any) => {
     try {
          console.log(req.params);
          const activity = req.params.activity;
          const rating = req.params.rating;
          const schoolID = req.params.schoolID;
          if (activity && rating) {
               const studentFiltered = await Activity.aggregate([
                    {
                         $match: {
                              SchoolID: schoolID,
                              [activity]: rating,
                         },
                    }
               ]);
               console.log({ studentFiltered });
               if (studentFiltered == null) {
                    return res.status(200).json([]);
               } else {
                    res.status(200).json(studentFiltered);
               }
          } else {
               const student = await Activity.find({ SchoolID: schoolID });
               if (!student) {
                    return res.status(404).json({ message: 'there is no data in database' });
               } else {
                    res.json(student);
               }
          }
     } catch (error) {
          console.error(error)
     }
}
exports.getLast4ActivityBycandidateID = async (req: any, res: any) => {
     const activity = req.params.activity;
     const candidateID = req.params.candidateID;
     const SchoolID = req.params.SchoolID;
     console.log(activity, candidateID);
     try {
          if (activity) {
               const studentFiltered = await Activity.aggregate([
                    { $match: { ID: candidateID,SchoolID ,ongoing:false} },
                    { $sort: { createdAt: -1 } },
                    { $limit: 4 },
                    { $project: { [activity]: 1, _id: 0, createdAt: 1 } }
               ]);
               console.log(studentFiltered);
               
               if (!studentFiltered) {
                    return res.status(404).json({ message: 'not found any data ' });
               } else {
                    res.status(200).json(studentFiltered);
               }
          }
     } catch (error) {
          console.log(error);
          res.status(404).send({ message: ' something went wrong' })
     }
}

exports.edit = async (req: any, res: any) => {
     if (req.body.BMI) {
          req.body.ongoing = false
     }
     const result = await Activity.updateOne(
          { _id: Object(req.params.id) },
          {
               $set: req.body
          }
     );
     if (result.matchedCount === 1) {
          console.log('Date updated successfully');
     } else {
          // res.send)

          console.log('Date not found or not updated');
     }
     res.send(result)
};

exports.delete = async (req: any, res: any) => {
     console.log('in delete one in activity')
     if (req.params.id !== 'undefined') {
          const result = await Activity.deleteOne({ _id: Object(req.params.id) });
          if (result.deletedCount === 1) {
               console.log('Document deleted successfully');
               res.json({ message: 'deleted successfully' });
          } else {
               console.log('Document not found or not deleted');
          }
     }

}
