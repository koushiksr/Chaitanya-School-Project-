import Admin from "../models/adminModel";
// const adminService = require('../services/adminService');

exports.getAdmin = async (req: any, res: any) => {
     const result = await Admin.find();
     // console.log(result)
     return res.send(result)
}