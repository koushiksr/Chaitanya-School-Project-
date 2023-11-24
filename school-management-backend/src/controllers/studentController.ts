import Login from "../models/loginModel"
import School from "../models/schoolModel"
import Student from "../models/studentModel"
const nodemailer = require("nodemailer");
const Mailgen = require('mailgen');


exports.getStudentAdmin = async (req: any, res: any) => {
     // console.log(req.params.id);

     const result = await Student.find({ email: req.params.id })
     // console.log('student admin', result);

     return res.send(result)
}
exports.create = async (req: any, res: any) => {
     let isMailSend = false;
     const { email, candidateName } = req.body;
     // const school = await School.findOne({ email });
     const student = await Student.findOne({ email })
     const inLogin = await Login.findOne({ email: email, role: 'student' })
     // console.log(!student, !inLogin);

     if (!student && !inLogin) {
          // genarate random password
          function generateRandomPassword(length: number) {
               const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
               let password = "";
               for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * charset.length)
                    password += charset.charAt(randomIndex);
               }
               return password;
          }
          const randomPassword = generateRandomPassword(10)

          //send randomly genarated password to  school mail
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
                    name: candidateName,
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
                              link: process.env.student_Dashboard,
                         },
                         outro: "Looking forward to do more business"
                    }
               }
          }

          // genarating html maill
          let mail = MailGenerator.generate(response)
          let message = {
               from: process.env.ADMIN_MAIL_TO_SEND_PASSWORD,
               to: email,
               subject: "Your password",
               html: mail
          }
          // sending mail
          transporter.sendMail(message).then(() => {
               console.log({ msg: "you should receive an email", email })
               isMailSend = true;
          }).catch((error: any) => {
          })
          req.body.password = randomPassword

          //schoolId genarating 
          let studentCity = req.body.residenceCity;
          let gender = req.body.gender;
          try {
               const latestStudent = await Student.findOne().sort({ createdAt: -1 }).exec();
               const temp_id = latestStudent.candidateID
               let newString = studentCity.toUpperCase().slice(0, 3) + gender.toUpperCase().slice(0, 1) + (parseInt(temp_id.slice(-7)) + 1).toString().padStart(7, '0');
               req.body.candidateID = newString
               // console.log(req.body.candidateID);
          } catch (error) {
               console.error(error);
          }


          const newStudent = await Student.create(req.body)
          if (newStudent) {
               const studentCredentials = await Login.create({ email: email, password: randomPassword, role: 'student' })
               if (studentCredentials) { return res.status(200).send(true) }
          }
     }
     if (student) {
          return res.status(200).send(false)
     }
     return res.status(404).send(null)
}

exports.getAllStudent = async (req: any, res: any) => {
     // console.log({ schoolID: req.params.schoolID },'in get all student');

     const student = await Student.find({ schoolID: req.params.schoolID })
// console.log(student);

     if (!student) {
          return res.status(401).json({ message: 'there is no data in database' })
     }
     res.json(student)
}

exports.editStudent = async (req: any, res: any) => {

     const {
          candidateName,
          candidateID,
          gender,
          dob,
          age,
          class: candidateClass,
          dominantSide,
          parentName,
          parentMobileNo,
          alternateNo,
          email,
          residenceArea,
          residenceCity,
     } = req.body
     const result = await Student.updateOne(
          { _id: Object(req.params.id) },
          {
               $set: {
                    candidateName,
                    candidateID,
                    gender,
                    dob,
                    age,
                    class: candidateClass,
                    dominantSide,
                    parentName,
                    parentMobileNo,
                    alternateNo,
                    email,
                    residenceArea,
                    residenceCity,
               }
          }
     )
     if (result.nModified === 1) {
          console.log('Document updated successfully')
     } else {
          console.log('Document not found or not updated')
     }
     res.send(result)
}

exports.deleteStudent = async (req: any, res: any) => {
     try {
          // console.log(req.params.id);

          const result1 = await Student.deleteOne({ email: req.params.id })
          const result2 = await Login.deleteOne({ email: req.params.id, role: 'student' })
          // console.log(result1);
          // console.log(result2);

          if (result1.deletedCount === 1 && result2.deletedCount === 1) {
               console.log('Document deleted successfully')
               res.json({ message: 'deleted successfully' })
          } else if (result1.deletedCount === 1 || result2.deletedCount === 1) {
               console.log('partially deleted');
               res.json({ message: 'partially deleted' })
          } else {
               console.log('Document not found or not deleted')
               res.json({ message: 'Document not found or not deleted' })
          }
     } catch (error) {
          res.json({ message: 'something went wrong' })
     }

}
