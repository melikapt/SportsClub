const { Reserve } = require('../model/reserve');
const adminChecker = require('../middleware/adminChecker');
const _ = require('lodash');
const { User, validate } = require('../model/user');
const express = require('express');
const router = express.Router();

/**
     * @openapi
     * '/user/create-user':
     *  post:
     *     tags:
     *     - User Controller
     *     summary: Create a user
     *     parameters:
     *     - name: token
     *       in: header
     *       description: an authorization header
     *       required: true
     *       type: string
     *       default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzU1YzFmM2JhNDQ5ZDQwMmZlZjFlMjMiLCJmaXJzdE5hbWUiOiJhZG1pbiIsImxhc3ROYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzM2NzQxMjh9.mMnWH2-i9sHBv9VZxyicY4-sNrjajz3mnBBGNp-x_rE
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
     *              - dateOfMembership
     *            properties:
     *              firstName:
     *                type: string
     *                default: melika 
     *              lastName:
     *                type: string
     *                default: paktalat
     *              nationalCode:
     *                type: string
     *                default: 0440448824
     *              phone:
     *                type: string
     *                default: 22598475
     *              birthDate:
     *                type: date
     *                default: 1994-12-14
     *              dateOfMembership:
     *                type: date
     *                default: 2023-12-08
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
router.post('/create-user', adminChecker, async (req, res) => {
    try {
        const payload = req.body;
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ nationalCode: payload.nationalCode });
        if (user) return res.status(400).send(`User with ${payload.nationalCode} already exist`);

        const newUser = new User(payload);
        await newUser.save();

        return res.status(200).send({ user: _.pick(newUser, ['firstName', 'lastName']), message: `User successfully registered.` });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

/**
     * @openapi
     * '/user/get-user/{id}':
     *  get:
     *     tags:
     *     - User Controller
     *     summary: Get a user by id
     *     parameters:
     *      - name: id
     *        in: path
     *        description: The id of the user
     *        required: true
     *        type: string
     *        default: 6755c49e2550de132ec42a9a
     *      - name: token
     *        in: header
     *        description: an authorization header
     *        required: true
     *        type: string
     *        default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzU1YzFmM2JhNDQ5ZDQwMmZlZjFlMjMiLCJmaXJzdE5hbWUiOiJhZG1pbiIsImxhc3ROYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzM2NzQxMjh9.mMnWH2-i9sHBv9VZxyicY4-sNrjajz3mnBBGNp-x_rE
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
router.get('/get-user/:id', adminChecker, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id })
            .select('-__v');
        if (!user) return res.status(404).send(`Not found user.`);

        return res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

/**
     * @openapi
     * '/user/update-user/{id}':
     *  put:
     *     tags:
     *     - User Controller
     *     summary: Modify a user
     *     parameters:
     *      - name: id
     *        in: path
     *        description: The id of the user
     *        required: true
     *        type: string
     *        default: 6755c49e2550de132ec42a9a
     *      - name: token
     *        in: header
     *        description: an authorization header
     *        required: true
     *        type: string
     *        default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzU1YzFmM2JhNDQ5ZDQwMmZlZjFlMjMiLCJmaXJzdE5hbWUiOiJhZG1pbiIsImxhc3ROYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzM2NzQxMjh9.mMnWH2-i9sHBv9VZxyicY4-sNrjajz3mnBBGNp-x_rE
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
     *              - dateOfMembership
     *            properties:
     *              firstName:
     *                type: string
     *                default: melika
     *              lastName:
     *                type: string
     *                default: paktalat
     *              nationalCode:
     *                type: string
     *                default: 0440448824
     *              phone:
     *                type: string
     *                default: 22593723
     *              birthDate:
     *                type: date
     *                default: 1994-12-14
     *              dateOfMembership:
     *                type: date
     *                default: 2023-12-08
     *     responses:
     *      200:
     *        description: Modified
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
router.put('/update-user/:id', adminChecker, async (req, res) => {
    try {
        const payload = req.body;
        const { error } = validate(payload);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findByIdAndUpdate({ _id: req.params.id }, payload);
        if (!user) return res.status(404).send(`User not found.`)

        const reservations = await Reserve.find({ 'user._id': req.params.id });
        if (reservations.length !== 0) {
            await Reserve.updateMany({ 'user._id': req.params.id },
                { $set: { 'user.firstName': payload.firstName, 'user.lastName': payload.lastName } });
        }

        return res.status(200).send(`User successfully updated.`);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

/**
     * @openapi
     * '/user/delete-user/{id}':
     *  delete:
     *     tags:
     *     - User Controller
     *     summary: Delete user by Id
     *     parameters:
     *      - name: id
     *        in: path
     *        description: The unique Id of the user
     *        required: true
     *        default: 6755dc9c66f5f7f5ce649cf0
     *      - name: token
     *        in: header
     *        description: an authorization header
     *        required: true
     *        type: string
     *        default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzU1YzFmM2JhNDQ5ZDQwMmZlZjFlMjMiLCJmaXJzdE5hbWUiOiJhZG1pbiIsImxhc3ROYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzM2NzQxMjh9.mMnWH2-i9sHBv9VZxyicY4-sNrjajz3mnBBGNp-x_rE
     *     responses:
     *      200:
     *        description: Removed
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
router.delete('/delete-user/:id', adminChecker, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete({ _id: req.params.id });
        if (!user) return res.status(404).send(`User not found.`);

        const reservations = await Reserve.find({ 'user._id': req.params.id });
        if (reservations.length !== 0) {
            await Reserve.deleteMany({ 'user._id': req.params.id });
        }

        return res.status(200).send(`User successfully removed.`);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

module.exports = router;