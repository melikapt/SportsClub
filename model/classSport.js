const Joi = require('joi');
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    title: {
        type: String,
        min: 2,
        max: 255,
        required: true
    },
    daysOfHolding: [{
        type: String,
        enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        required: true
    }],
    timeOfHolding: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    coach: {
        firstName: {
            type: String,
            min: 2,
            max: 255,
            required: true
        },
        lastName: {
            type: String,
            min: 2,
            max: 255,
            required: true
        }

    }
})

const SportClass = mongoose.model('sportclass', classSchema);

function validate(sportClass) {
    const schema = Joi.object({
        title: Joi.string().min(2).max(255).required(),
        daysOfHolding: Joi.array().items(Joi.string().valid('Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')).required(), 
        timeOfHolding: Joi.string().required().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        duration: Joi.string().required().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        coach: Joi.object({
            firstName: Joi.string().min(2).max(255).required(),
            lastName: Joi.string().min(2).max(255).required()
        }).required()
    })
    return schema.validate(sportClass);
}

module.exports = { SportClass, validate };