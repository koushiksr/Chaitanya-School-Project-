import Activity from "../models/activityModel";
import Login from "../models/loginModel";
import Student from "../models/studentModel";
const Mailgen = require('mailgen');
const nodemailer = require("nodemailer");



exports.create = async (req: any, res: any) => {
     let isMailSend = false;
     const { Email } = req.body;
     const student = await Student.findOne({ email: Email });
     const inLogin = await Login.findOne({ email: Email });
     // console.log(Email, student, inLogin);

     if (student && inLogin) {
          // const newStudent = await Activity.create(req.body);
          // return res.status(200).send(true)     
          Activity.create(req.body)
               .then((createdActivity: any) => {
                    let config = {
                         service: 'gmail',
                         auth: {
                              user: 'technohmsit@gmail.com',
                              pass: 'jsug tain gbtm iyks'
                         }
                    }
                    let transporter = nodemailer.createTransport(config);
                    let MailGenerator = new Mailgen({
                         theme: "default",
                         product: {
                              name: "Student Activity",
                              link: 'https://mailgen.js/'
                         }
                    })

                    let response = {
                         body: {
                              name: req.body.Name,
                              intro: `${req.body.Name}  Is Created Assignment`,
                              // table: {
                              //      data: [
                              //           {
                              //                // Password: randomPassword,
                              //                description: "Use this password for further login",
                              //           }
                              //      ]
                              // },
                              action: {
                                   instructions: 'To visit website to assign date, click the link below:',
                                   button: {
                                        text: 'Visit Our Website',
                                        link: 'https://www.example.com', // Your website link
                                   },
                                   outro: "thanks for attention"
                              }
                         }
                    }

                    let mail = MailGenerator.generate(response)

                    let message = {
                         from: 'technohmsit@gmail.com',
                         to: 'koushiksr1999@gmail.com',
                         subject: "activity created",
                         html: mail
                    }

                    // transporter.sendMail(message).then(() => {
                    //      console.log({ msg: "you should receive an email" })
                    //      isMailSend = true;
                    // }).catch((error: any) => {
                    // })
                    res.status(201).json({ message: 'Activity created successfully', activity: createdActivity });
               })
               .catch((error: { message: any; }) => {
                    res.status(500).json({ error: 'Internal Server Error', details: error.message });
               });

     } else {
          // if (!student) {
          //      return res.status(200).send(false)
          // }
          res.status(404).send(null)
     }
}

exports.getAll = async (req: any, res: any) => {
     const student = await Activity.find({ SchoolID: req.params.schoolID, ID: req.params.candidateID })
     if (!student) {
          return res.status(404).json({ message: 'there is no data in database' });
     }
     res.json(student);
}

exports.getAllActivityBySchoolID = async (req: any, res: any) => {
     const activity = req.params.activity;
     const rating = parseFloat(req.params.rating);
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
          if (!studentFiltered) {
               return res.status(404).json({ message: 'there is no data in database' });
          } else {
               res.json(studentFiltered);
          }
     } else {
          const student = await Activity.find({ SchoolID: schoolID });
          if (!student) {
               return res.status(404).json({ message: 'there is no data in database' });
          } else {
               res.json(student);
          }
     }
}
exports.getLast4ActivityBycandidateID = async (req: any, res: any) => {
     const activity = req.params.activity;
     const candidateID = req.params.candidateID;
     console.log(activity, candidateID);

     try {
          if (activity) {
               const studentFiltered = await Activity.aggregate([
                    { $match: { ID: candidateID } },
                    { $sort: { createdAt: -1 } },
                    { $limit: 4 },
                    { $project: { [activity]: 1, _id: 0 } }
               ]);
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
     const result = await Activity.updateOne(
          { _id: Object(req.params.id) },
          {
               $set: req.body
          }
     );
     if (result.matchedCount === 1) {
          console.log('Date updated successfully');
     } else {
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
