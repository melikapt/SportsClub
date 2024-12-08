const { User } = require('../model/user');
const config = require('config');
const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
    try {
        const token = req.headers.token;
        if (!token) return res.status(401).send('Unauthorized');

        jwt.verify(token, config.get('jwtPrivateKey'), async (err, decoded) => {
            if (err) return res.status(403).send('Invalid token!');
            const user = await User.findById({ _id: decoded._id });
            if (decoded.role !== 'admin' || !user) return res.status(403).send(`Access denied`);
            else next();
        })
    } catch (error) {
        console.log(error);
    }
}