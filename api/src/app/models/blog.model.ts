
import { Schema, model } from 'mongoose';
import Doctor from '../doctor/doctor.model'

const authSchema = new Schema ({
     title: { type: String, required: false },
     description: { type: String, required: false },
     img: { type: String, required: true },
     userId : { type: String, required: false },
     user:{
        ref: Doctor
     }
    },
    { timestamps: true }
);


// creating the model
const Auth = model('Auth', authSchema);

export default Auth;