// const _ = require('lodash');
const Joi = require('joi');
const express = require('express');
const { User } = require('../model/user');
const router = express.Router();

/**
     * @openapi
     * '/signin':
     *  post:
     *     tags:
     *     - Signin Controller
     *     summary: Admin login
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - nationalCode
     *            properties:
     *              nationalCode:
     *                type: string
     *                default: 1220569987
     *     responses:
     *      200:
     *        description: Loggedin
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
router.post('/', async (req, res) => {
    try {
        const payload = req.body;
        const { error } = validate(payload.nationalCode);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ nationalCode: payload.nationalCode });
        if (!user) return res.status(404).send('Invalid user');

        const token = user.generateToken();

        return res.status(200).send(token);
    } catch (error) {
        console.log(error);
    }
})

function validate(nationalCode) {
    const schema = Joi.string().min(10).max(10).required();
    return schema.validate(nationalCode);
}

module.exports = router;