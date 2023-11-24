const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
import Login from '../models/loginModel';

const secretKey = 'Abcdef@Dev';

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
          res.status(403).json({ result: 'Unauthorized: User is not an admin' });
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

        if (decoded && decoded.role === 'school'||decoded.role === 'student') {
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

