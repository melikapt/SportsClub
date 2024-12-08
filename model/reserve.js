const Joi = require('joi');
const mongoose = require('mongoose');

const reserveSchema = new mongoose.Schema({
    sportClass: {
        type: new mongoose.Schema({
            title: {
                type: String,
                min: 2,
                max: 255,
                required: true
            }
        }),
        required: true
    },
    user: {
        type: new mongoose.Schema({
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
            },
        }),
        required: true
    },
    price: {
        type: Number,
        min: 500000,
        max: 15000000,
        required: true
    },
    payDate: {
        type: Date,
        default: Date.now(),
        required: true
    },
    expireDate: {
        type: Date,
        required: true
    }
})

const Reserve = mongoose.model('reserve', reserveSchema);

function validate(reserve) {
    const schema = Joi.object({
        classId: Joi.objectId().required(),
        userId: Joi.objectId().required(),
        price: Joi.number().min(500000).max(15000000).required(),
        payDate: Joi.date().required()
    })
    return schema.validate(reserve);
}

module.exports = { Reserve, validate };