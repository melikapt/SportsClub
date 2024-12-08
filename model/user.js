const config=require('config');
const jwt =require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
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
    nationalCode: {
        type: String,
        min: 10,
        max: 10,
        unique: true,
        required: true
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user',
        // required:true
    },
    phone: {
        type: String,
        max: 8,
    },
    birthDate: {
        type: Date
    },
    dateOfMembership: {
        type: Date,
        // default: Date.now,
        // required: true
    }
    // listOfClasses:[{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'classSport'
    // }]
});

userSchema.methods.generateToken = function(){
    return jwt.sign({_id:this._id,firstName:this.firstName,lastName:this.lastName,role:this.role},
        config.get('jwtPrivateKey')
    )
}

const User = mongoose.model('user', userSchema);

function validate(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(255).required(),
        lastName: Joi.string().min(2).max(255).required(),
        nationalCode: Joi.string().min(10).max(10).required(),
        // role:Joi.string().valid('admin','user').default('user'),//.required(),
        phone: Joi.string().max(8),
        birthDate: Joi.date(),
        dateOfMembership: Joi.date().default(Date.now()).required()
    });
    return schema.validate(user);
}

module.exports = { User, validate };