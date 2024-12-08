const Joi = require('joi');
const _ = require('lodash');
const { User } = require('../model/user');
const express = require('express');
const router = express.Router();

/**
     * @openapi
     * '/signup/create-admin':
     *  post:
     *     tags:
     *     - Admin Controller
     *     summary: Create a admin
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - firstName
     *              - lastName
     *              - nationalCode
     *              - phone
     *              - birthDate
     *            properties:
     *              firstName:
     *                type: string
     *                default: admin 
     *              lastName:
     *                type: string
     *                default: admin
     *              nationalCode:
     *                type: string
     *                default: 1220569987
     *              phone:
     *                type: string
     *                default: 22536575
     *              birthDate:
     *                type: string
     *                default: 1984-08-14
     *     responses:
     *      200:
     *        description: Created
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
router.post('/create-admin', async (req, res) => {
    try {
        const payload = req.body;
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ nationalCode: payload.nationalCode });
        if (user) return res.status(400).send(`User with ${payload.nationalCode} already exist`);

        const newUser = new User({ ...payload, role: 'admin' });
        await newUser.save();

        return res.status(200).send({ user: _.pick(newUser, ['firstName', 'lastName']), message: `Admin successfully registered.` });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

function validate(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(255).required(),
        lastName: Joi.string().min(2).max(255).required(),
        nationalCode: Joi.string().min(10).max(10).required(),
        phone: Joi.string().max(8),
        birthDate: Joi.date(),
    });
    return schema.validate(user);
}

module.exports = router;