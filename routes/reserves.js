const moment = require('moment');
const { SportClass } = require('../model/classSport');
const { Reserve, validate } = require('../model/reserve');
const adminChecker = require('../middleware/adminChecker');
const express = require('express');
const { User } = require('../model/user');
const router = express.Router();

/**
     * @openapi
     * '/reserve':
     *  post:
     *     tags:
     *     - Reserves Controller
     *     summary: Create a reservation
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
     *              - classId
     *              - userId
     *              - price
     *              - payDate
     *            properties:
     *              classId:
     *                type: string
     *                default: 6755c4fb2550de132ec42a9e 
     *              userId:
     *                type: string
     *                default: 6755dc9c66f5f7f5ce649cf0
     *              price:
     *                type: number
     *                default: 1500000
     *              payDate:
     *                type: date
     *                default: 2023-12-16
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
router.post('/', adminChecker, async (req, res) => {
    try {
        const payload = req.body;
        const { error } = validate(payload);
        if (error) return res.status(400).send(error.details[0].message);

        const sportClass = await SportClass.findById({ _id: payload.classId });
        if (!sportClass) return res.status(404).send(`Class with ${payload.classId} doesn't exist.`);

        const user = await User.findById({ _id: payload.userId });
        if (!user) return res.status(404).send(`User not found.`);

        const payDateInMoment = moment(payload.payDate);

        const newReserve = new Reserve({
            ...payload,
            sportClass: {
                _id: sportClass._id,
                title: sportClass.title
            },
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName
            },
            expireDate: payDateInMoment.add(1, 'months')
        })
        await newReserve.save();
        return res.status(200).send(`${newReserve.sportClass.title} class reserved for ${newReserve.user.firstName} ${newReserve.user.lastName}`);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

/**
     * @openapi
     * '/reserve/get-reservations/{id}':
     *  get:
     *     tags:
     *     - Reserves Controller
     *     summary: Get a reservation by userId
     *     parameters:
     *      - name: id
     *        in: path
     *        description: The id of the user
     *        required: true
     *        type: string
     *        default: 6755b468ac2a4a4595b23341
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
router.get('/get-reservations/:id', adminChecker, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id });
        if (!user) return res.status(404).send(`User not found.`);

        const reservations = await Reserve.find({ 'user._id': req.params.id })
            .select('-__v');

        return res.status(200).send(reservations);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

/**
     * @openapi
     * '/reserve/get-reservations-of-class/{classId}':
     *  get:
     *     tags:
     *     - Reserves Controller
     *     summary: Get a reservation by classId
     *     parameters:
     *      - name: classId
     *        in: path
     *        description: The id of the class
     *        required: true
     *        type: string
     *        default: 67555b3aba7e325f9d9e4ab4
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
router.get('/get-reservations-of-class/:classId', adminChecker, async (req, res) => {
    try {
        const sportClass = await SportClass.findById({ _id: req.params.classId });
        if (!sportClass) return res.status(404).send(`Not found sportclass with ${req.params.classId}`);

        const reservations = await Reserve.find({ 'sportClass._id': req.params.classId })
            .select('-__v');
        return res.status(200).send(reservations);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

/**
     * @openapi
     * '/reserve/get-all-reservations':
     *  get:
     *     tags:
     *     - Reserves Controller
     *     summary: Get all reservations 
     *     parameters:
     *      - name: token
     *        in: header
     *        description: an authorization header
     *        required: true
     *        type: string
     *        default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzU1YzFmM2JhNDQ5ZDQwMmZlZjFlMjMiLCJmaXJzdE5hbWUiOiJhZG1pbiIsImxhc3ROYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzM2NzQxMjh9.mMnWH2-i9sHBv9VZxyicY4-sNrjajz3mnBBGNp-x_rE
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
router.get('/get-all-reservations', adminChecker, async (req, res) => {
    try {
        const reservations = await Reserve.find()
            .select('-__v');
        return res.status(200).send(reservations);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

/**
     * @openapi
     * '/reserve/cancel-reservation/{id}':
     *  delete:
     *     tags:
     *     - Reserves Controller
     *     summary: Delete reservation by id
     *     parameters:
     *      - name: id
     *        in: path
     *        description: The unique Id of the reservation
     *        required: true
     *        default: 6755a9706d9b395769d0398c
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
router.delete('/cancel-reservation/:id', adminChecker, async (req, res) => {
    try {
        const cancel = await Reserve.findByIdAndDelete({ _id: req.params.id });
        if (!cancel) return res.status(404).send(`Reservation with ${req.params.id} doesn't exist.`)
        return res.status(200).send(`Reservation of ${cancel.sportClass.title} class for ${cancel.user.firstName} ${cancel.user.lastName} successfully canceled.`);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

module.exports = router;