const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const Mailgen = require('mailgen');
// const otpGenerator = require('otp-generator');

import Login from '../models/loginModel';

const secretKey = 'Abcdef@Dev';
let prevOTP: number = 0;

export const verifyEmail = async (req: any, res: any) => {
  let isMailSend = false;
  const verified = await Login.findOne({ email: req.params.email })
  if (verified) {
    const generateOTP = () => {
      const min = 100000;
      const max = 999999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const otp = generateOTP();
    prevOTP = otp
    console.log(otp);




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
        name: 'here is your OTP!',
        // intro: "Your OTP Is Here!",
        table: {
          data: [
            {
              OTP: otp,
              description: "Use this OTP for forgot password",
            }
          ]
        },
        action: {
          instructions: 'To visit our website, click the link below:',
          button: {
            text: 'Visit Our Website',
            link: process.env.prodUrl,
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
      to: req.params.email,
      subject: "Your OTP!",
      html: mail
    }
    // sending mail
    transporter.sendMail(message).then(() => {
      console.log({ msg: "you should receive an email" })
      isMailSend = true;
    }).catch((error: any) => {
    })
    return res.status(200).json(true);

  } else {
    res.status(404).json(false);
  }
};

export const verifyOTP = (req: any, res: any) => {
  console.log(req.params.otp, prevOTP, 'otp idt');
  if (prevOTP == req.params.otp) {
    res.status(200).send(true)
  } else {
    console.log('invalid otp');

    res.status(404).send(false)
  }
}
export const resetPassword = async (req: any, res: any) => {
  try {
    const updatedLogin = await Login.findOneAndUpdate(
      { email: req.params.email },
      { $set: { password: req.params.newPassword } },
      { new: true }
    );

    if (updatedLogin) {
      console.log('Password reset successfully:', updatedLogin);
      return res.status(200).json(true);
    } else {
      console.log('Login entry with the specified email not found.');
      return res.status(404).json(false);
    }
  } catch (error) {
    console.error('Error resetting password:', error);
  }
}
router.get('/forgotpassword/:email', verifyEmail);
router.get('/forgotpassword/OTP/:otp', verifyOTP);
router.put('/forgotpassword/resetpassword/:email/:newPassword', resetPassword);

export const verifyAdmin = (req: { headers: { [x: string]: any; }; decoded: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { result: string; }): void; new(): any; }; }; }, next: () => void) => {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];

    jwt.verify(token, secretKey, (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ result: 'Invalid token' });
      } else {
        req.decoded = decoded;

        if (decoded && decoded.role === 'admin') {
          next();
        } else {
          res.status(403).json({ result: 'Unauthorized: User is not an admin' });
        }
      }
    });
  } else {
    res.status(401).json({ result: 'Token is missing' });
  }
};
export const verifyAssessor = (req: { headers: { [x: string]: any; }; decoded: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { result: string; }): void; new(): any; }; }; }, next: () => void) => {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];

    jwt.verify(token, secretKey, (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ result: 'Invalid token' });
      } else {
        req.decoded = decoded;

        if (decoded && decoded.role === 'assessor') {
          next();
        } else {
          res.status(403).json({ result: 'Unauthorized: User is not an assessor' });
        }
      }
    });
  } else {
    res.status(401).json({ result: 'Token is missing' });
  }
};

export const verifySchool = (req: { headers: { [x: string]: any; }; decoded: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { result: string; }): void; new(): any; }; }; }, next: () => void) => {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];

    jwt.verify(token, secretKey, (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ result: 'Invalid token' });
      } else {
        req.decoded = decoded;

        if (decoded && decoded.role === 'school') {
          next();
        } else {
          res.status(403).json({ result: 'Unauthorized: User is not an School' });
        }
      }
    });
  } else {
    res.status(401).json({ result: 'Token is missing' });
  }
};
export const verifySchoolOrStudent = (req: { headers: { [x: string]: any; }; decoded: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { result: string; }): void; new(): any; }; }; }, next: () => void) => {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];

    jwt.verify(token, secretKey, (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ result: 'Invalid token' });
      } else {
        req.decoded = decoded;

        if (decoded && decoded.role === 'school' || decoded.role === 'student') {
          next();
        } else {
          res.status(403).json({ result: 'Unauthorized: User is not an School Or student' });
        }
      }
    });
  } else {
    res.status(401).json({ result: 'Token is missing' });
  }
};
export const verifyStudent = (req: { headers: { [x: string]: any; }; decoded: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { result: string; }): void; new(): any; }; }; }, next: () => void) => {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];
    // console.log(token, ' toennn')

    jwt.verify(token, secretKey, (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ result: 'Invalid token' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({ result: 'Token is missing' });
  }
};

router.post('/', async (req: { body: { email: any; password: any; }; }, res: { json: (arg0: { token: any; role: any; }) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { result?: string; error?: string; }): void; new(): any; }; }; }) => {
  const { email, password } = req.body;

  try {
    const user = await Login.aggregate([
      {
        $match: {
          email: email,
          password: password,
        },
      },
      {
        $project: {
          _id: 0,
          role: 1,
        },
      },
    ]);

    if (user.length > 0) {
      const userRole = user[0].role;
      const token = jwt.sign({ email, role: userRole }, secretKey, { expiresIn: '1d' });

      res.json({ token, role: userRole });
    } else {
      res.status(401).json({ result: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;

