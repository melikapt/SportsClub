const { Reserve } = require('../model/reserve');
const adminChecker = require('../middleware/adminChecker');
const { SportClass, validate } = require('../model/classSport');
const express = require('express');
const router = express.Router();


/**
     * @openapi
     * '/class/create-class':
     *  post:
     *     tags:
     *     - SportClass Controller
     *     summary: Create a class
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
     *              - title
     *              - daysOfHolding
     *              - timeOfHolding
     *              - duration
     *              - coach
     *            properties:
     *              title:
     *                type: string
     *                default: Pilates 
     *              daysOfHolding:
     *                type: array
     *                default: ["Saturday","Monday"]
     *              timeOfHolding:
     *                type: string
     *                default: 16:00
     *              duration:
     *                type: string
     *                default: 1:00
     *              coach:
     *                type: object
     *                default: {"firstName":"raha", "lastName":"arabi"}
     *     responses:
     *      200:
     *        description: Created
     *      400:
     *        description: Bad Request
     *      500:
     *        description: Server Error
     */
router.post('/create-class', adminChecker, async (req, res) => {
    try {
        const payload = req.body;
        const { error } = validate(payload);
        if (error) return res.status(400).send(error.details[0].message);

        const newClass = new SportClass(payload);
        await newClass.save();

        return res.status(200).send(`${newClass.title} class successfully added.`);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

/**
     * @openapi
     * '/class/get-class/{id}':
     *  get:
     *     tags:
     *     - SportClass Controller
     *     summary: Get a detail of a class by id
     *     parameters:
     *      - name: id
     *        in: path
     *        description: The id of the class
     *        required: true
     *        type: string
     *        default: 67555b17ba7e325f9d9e4ab2
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
router.get('/get-class/:id', adminChecker, async (req, res) => {
    try {
        const sportClass = await SportClass.findById({ _id: req.params.id })
            .select('-_id -__v');
        if (!sportClass) return res.status(404).send(`Class with this ${req.params.id} doesn't exist.`);
        return res.status(200).send(sportClass);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

/**
     * @openapi
     * '/class/get-classes':
     *  get:
     *     tags:
     *     - SportClass Controller
     *     summary: Get a detail of all classes 
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
router.get('/get-classes', adminChecker, async (req, res) => {
    try {
        const classes = await SportClass.find()
            .select('-__v');
        return res.status(200).send(classes);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

/**
     * @openapi
     * '/class/update-class/{id}':
     *  put:
     *     tags:
     *     - SportClass Controller
     *     summary: Modify a class
     *     parameters:
     *      - name: id
     *        in: path
     *        description: The id of the class
     *        required: true
     *        type: string
     *        default: 6755c4fb2550de132ec42a9e
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
     *              - title
     *              - daysOfHolding
     *              - timeOfHolding
     *              - duration
     *              - coach
     *            properties:
     *              title:
     *                type: string
     *                default: Box
     *              daysOfHolding:
     *                type: array
     *                default: ["Friday"]
     *              timeOfHolding:
     *                type: string
     *                default: 10:00
     *              duration:
     *                type: string
     *                default: 01:30
     *              coach:
     *                type: object
     *                default: {"firstName":"sahel", "lastName":"salami"}
     *     responses:
     *      200:
     *        description: Modified
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      405:
     *        description: Not Allowed
     *      500:
     *        description: Server Error
     */
router.put('/update-class/:id', adminChecker, async (req, res) => {
    try {
        const payload = req.body;
        const { error } = validate(payload);
        if (error) return res.status(400).send(error.details[0].message);

        const reservedList = await Reserve.find({ 'sportClass._id': req.params.id });
        if (reservedList.length !== 0) return res.status(405).send(`This class already reserved. You can't update it.`);

        const existClass = await SportClass.findByIdAndUpdate({ _id: req.params.id }, payload, { new: true });
        if (!existClass) return res.status(404).send(`Class with ${req.params.id} doesn't exist.`);

        return res.status(200).send(`${existClass.title} class successfully updated.`);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

/**
     * @openapi
     * '/class/delete-class/{id}':
     *  delete:
     *     tags:
     *     - SportClass Controller
     *     summary: Delete class by Id
     *     parameters:
     *      - name: id
     *        in: path
     *        description: The unique Id of the user
     *        required: true
     *        default: 6755c8c44f30600f9311eba7
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
     *      405:
     *        description: Not Allowed
     *      500:
     *        description: Server Error
     */
router.delete('/delete-class/:id', adminChecker, async (req, res) => {
    try {
        const reservedList = await Reserve.find({ 'sportClass._id': req.params.id });
        if (reservedList.length !== 0) return res.status(405).send(`This class already reserved. You can't remove it.`);

        const existClass = await SportClass.findByIdAndDelete({ _id: req.params.id });
        if (!existClass) return res.status(404).send(`Class with ${req.params.id} doesn't exist.`);

        return res.status(200).send(`${existClass.title} class successfully deleted.`)
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})


module.exports = router;