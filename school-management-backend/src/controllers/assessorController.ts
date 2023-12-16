import Login from "../models/loginModel";
import Assessor from "../models/assessorModel";
import Student from "../models/studentModel";
import School from "../models/schoolModel";
const nodemailer = require("nodemailer");
const Mailgen = require('mailgen');
const fs = require('fs');
const path = require('path');

exports.create = async (req: any, res: any) => {
     try {
          let isMailSend = false;
          const { email, name, } = req.body;
          const school = await Assessor.findOne({ email });
          const login = await Login.findOne({ email: email });

          if (!school && !login) {
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
                              name: name,
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

                    // genarating html maill
                    let mail = MailGenerator.generate(response)
                    let message = {
                         from: process.env.ADMIN_MAIL_TO_SEND_PASSWORD,
                         to: email,
                         subject: "Assessor password",
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
               const assessorIDGenarate = async () => {
                    let name = req.body.name;
                    let phno = req.body.phNO;
                    try {
                         const latestSchool = await Assessor.findOne().sort({ createdAt: -1 }).exec();
                         const temp_id = latestSchool ? latestSchool.assessorID : 'ABCDE00000'
                         let newString = name.toUpperCase().slice(0, 3) + phno.toUpperCase().slice(0, 2) + (parseInt(temp_id.slice(-5)) + 1).toString().padStart(5, '0');
                         if (newString) {
                              req.body.assessorID = newString
                         }
                    } catch (error) {
                         console.error(error);
                    }
               }
               await SendEmailToSchool()
               await assessorIDGenarate()
               if (req.body.assessorID && req.body.password) {
                    const newSchool = await Assessor.create(req.body);
                    const logEntry = await Login.create({ email: email, password: randomPassword, role: 'assessor' });
                    if (newSchool) {
                         return res.status(200).send(true)
                    }
               }
          }
          if (school || login) {
               return res.status(200).send(false)
          }
          return res.status(404).send(null)
     } catch (error) {
          console.error(error)
     }
}
exports.sendPdfToStudent = async (req: any, res: any) => {
     try {
          const email = req.params.email
          let pdfData: any
          if (req.file) {
               pdfData = req.file.buffer;
          } else {
               console.log("no file");
          }
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
               const attachment = {
                    filename: `${req.params.name}.pdf`,
                    content: pdfData,
                    encoding: 'base64',
               };
               //mail format
               let response = {
                    body: {
                         name: req.params.name,
                         intro: "Your Report Is Attached To This Mail!",
                         action: {
                              button: {
                                   text: 'Visit Our Website',
                                   link: process.env.school_Dashboard,
                              },
                         }
                    }
               }

               // genarating html maill
               let message
               try {
                    let mail = MailGenerator.generate(response)
                    message = {
                         from: process.env.ADMIN_MAIL_TO_SEND_PASSWORD,
                         to: email,
                         subject: `${req.params.name} Assessment Report`,
                         html: mail,
                         attachments: [attachment],
                    }
               } catch (error) {
                    if (error instanceof Error) {
                         console.error('Error occurred while generating the HTML email:');
                         console.error(error.message);
                    } else {
                         console.error('An unknown error occurred:', error);
                    }
               }
               // sending mail
               transporter.sendMail(message).then((error: { message: any; }, info: { response: any; }) => {
                    if (error) {
                         console.error('Error occurred while sending the email:');
                         console.error(error.message);
                    } else {
                         console.log('Email sent successfully!');
                         console.log('Response:', info.response);
                    }
                    console.log({ msg: "you should receive an email" })
                    res.status(200).send(true)
               }).catch((error: any) => {
                    console.log(error);
                    res.status(400).send(false)
               })

          }

          await SendEmailToSchool()
     } catch (error) {
          console.log(error);
          res.status(400).send(false)
     }
}

exports.getAll = async (req: any, res: any) => {
     try {
          const school = await Assessor.find();
          if (!school) {
               return res.status(401).json({ message: 'there is no data in database' });
          }
          res.json(school);
     } catch (error) {
          console.error(error)
     }
}
exports.getAllSchools = async (req: any, res: any) => {
     try {
          const school = await School.find();
          if (!school) {
               return res.status(401).json({ message: 'there is no data in database' });
          }

          const pdfFilePath = "../../public/Sample _main_empty_copy.pdf"
          const pdfBuffer = fs.readFileSync(path.join(__dirname, pdfFilePath));
          const pdfBytes = pdfBuffer.toString('base64');
          res.send({ school, pdfBytes });
     } catch (error) {
          console.error('Error fetching schools or sending the PDF:', error);
          res.status(500).json({ message: 'Internal Server Error' });
     }
}
exports.getAllStudents = async (req: any, res: any) => {
     try {
          const school = await Student.find();
          if (!school) {
               return res.status(401).json({ message: 'there is no data in database' });
          }
          res.json(school);
     } catch (error) {
          console.error(error)
     }
}

exports.edit = async (req: any, res: any) => {
     try {
          const {
               name,
               address,
               phNO,
               email
          } = req.body;
          const result = await Assessor.updateOne(
               { _id: Object(req.params.id) },
               {
                    $set: {
                         name,
                         address,
                         phNO,
                         email
                    }
               }
          );
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
     } catch (error) {
          console.error(error)
     }
};

exports.delete = async (req: any, res: any) => {
     try {
          const result = await Assessor.deleteOne({ _id: Object(req.params.id) });
          if (result.deletedCount === 1) {
               console.log('Document deleted successfully');
               res.json({ message: 'deleted successfully' });
          } else {
               console.log('Document not found or not deleted');
               res.json({ message: 'Failed to delete assessor' });
          }
     } catch (error) {
          console.error(error)
     }
}
