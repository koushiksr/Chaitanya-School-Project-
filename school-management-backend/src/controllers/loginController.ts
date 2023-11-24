const loginService = require('../services/loginService');

exports.login = async (req: any, res: { json: (arg0: any) => void; }) => {
     const login = await loginService.login();
     res.json(login);
};