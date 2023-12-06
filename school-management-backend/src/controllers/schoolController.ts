import Login from "../models/loginModel";
import School from "../models/schoolModel";
const nodemailer = require("nodemailer");
const Mailgen = require('mailgen');



exports.getSchoolAdmin = async (req: any, res: any) => {
     const email = req.params.id;
     const admin_login = await Login.findOne({ email });
     const admin_details = await School.findOne({ schoolEmail: email });
     return res.send({ admin_login, admin_details })
}

exports.create = async (req: any, res: any) => {
     let isMailSend = false;
     const { schoolEmail, schoolName, } = req.body;
     const school = await School.findOne({ schoolEmail });
     const login = await Login.findOne({ email: schoolEmail });
     console.log(school, login);


     if (!school && !login) {
          // genarate random password
          function generateRandomPassword(length: number) {
               const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
               let password = "";
               for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * charset.length);
                    password += charset.charAt(randomIndex);
               }
               return password;
          }
          const randomPassword = generateRandomPassword(10);

          //send randomly genarated password to  school mail
          const SendEmailToSchool = async () => {
               let config = {
                    service: 'gmail',
                    auth: {
                         user: process.env.ADMIN_MAIL_TO_SEND_PASSWORD,
                         pass: 'jsug tain gbtm iyks'
                    }
               }
               let transporter = nodemailer.createTransport(config);
               let MailGenerator = new Mailgen({
                    theme: "default",
                    product: {
                         name: "Admin",
                         link: 'https://mailgen.js/'
                    }
               })
               //mail format
               let response = {
                    body: {
                         name: schoolName,
                         intro: "Your Password Is Here!",
                         table: {
                              data: [
                                   {
                                        Password: randomPassword,
                                        description: "Use this password for further login",
                                   }
                              ]
                         },
                         action: {
                              instructions: 'To visit our website, click the link below:',
                              button: {
                                   text: 'Visit Our Website',
                                   link: process.env.school_Dashboard,
                              },
                              outro: "Looking forward to do more business"
                         }
                    }
               }
               // console.log(process.env.school_Dashboard);

               // genarating html maill
               let mail = MailGenerator.generate(response)
               let message = {
                    from: process.env.ADMIN_MAIL_TO_SEND_PASSWORD,
                    to: schoolEmail,
                    subject: "school password",
                    html: mail
               }
               // sending mail
               transporter.sendMail(message).then(() => {
                    console.log({ msg: "you should receive an email" })
                    isMailSend = true;
               }).catch((error: any) => {
               })

          }
          req.body.password = randomPassword;

          // schoolId genarating 
          const schoolIdGenarate = async () => {
               let schoolCity = req.body.schoolCity;
               let syllabusType = req.body.schoolType;
               try {
                    const latestSchool = await School.findOne().sort({ createdAt: -1 }).exec();
                    console.log({ latestSchool });
                    const temp_id = latestSchool ? latestSchool.schoolID : 'ABCDE00000'
                    console.log({ temp_id });
                    let newString = schoolCity.toUpperCase().slice(0, 3) + syllabusType.toUpperCase().slice(0, 2) + (parseInt(temp_id.slice(-5)) + 1).toString().padStart(5, '0');
                    console.log({ newString });
                    if (newString) {
                         req.body.schoolID = newString
                         console.log(req.body.schoolID, 'schoolid');
                    }
               } catch (error) {
                    console.error(error);
               }
          }
          await SendEmailToSchool()
          await schoolIdGenarate()
          // posting data  in both school and login
          console.log(isMailSend, req.body.schoolID, req.body.password);

          if (req.body.schoolID && req.body.password) {
               const newSchool = await School.create(req.body);
               const logEntry = await Login.create({ email: schoolEmail, password: randomPassword, role: 'school' });
               if (newSchool) {
                    return res.status(200).send(true)
               }
          }
     }
     if (school || login) {
          return res.status(200).send(false)
     }
     return res.status(404).send(null)
}


exports.getAllSchool = async (req: any, res: any) => {
     const school = await School.find();
     if (!school) {
          return res.status(401).json({ message: 'there is no data in database' });
     }
     res.json(school);
}

exports.editSchool = async (req: any, res: any) => {
     // console.log(req.body)
     const {
          schoolName,
          schoolID,
          contactName,
          contactNo,
          schoolEmail,
          schoolType,
          principalName,
          principalContact,
          principalEmail,
          classesFrom,
          classesTo,
          totalStudents,
          noOfBoys,
          noOfGirls,
     } = req.body;
     const result = await School.updateOne(
          { _id: Object(req.params.id) },
          {
               $set: {
                    schoolName,
                    schoolID,
                    contactName,
                    contactNo,
                    schoolEmail,
                    schoolType,
                    principalName,
                    principalContact,
                    principalEmail,
                    classesFrom,
                    classesTo,
                    totalStudents,
                    noOfBoys,
                    noOfGirls,
               }
          }
     );
     // console.log(result)
     if (result.modifiedCount === 1) {
          console.log('Document updated successfully');
          res.status(200).send({
               message: 'Document updated successfully',
               result
          })
     }
     else if (result.modifiedCount === 0) {
          console.log('Document not updated ');
          res.status(200).send({
               message: 'Document not updated ',
               result
          })
     } else {
          console.log('Document not found or not updated');
          res.status(404).send({
               message: 'Document not found or not updated',
               result
          })
     }
     // res.status(200).send(result)
};

exports.deleteSchool = async (req: any, res: any) => {
     const result = await School.deleteOne({ _id: Object(req.params.id) });
     if (result.deletedCount === 1) {
          console.log('Document deleted successfully');
          res.json({ message: 'deleted successfully' });
     } else {
          console.log('Document not found or not deleted');
     }
}
