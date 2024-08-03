import { Schema, model } from 'mongoose';
const authSchema = new Schema ({
        password: { type: String, required: false },
        userId: { type: String, required: false },
        email: { type: String, required: false, unique: true, },
        role: { type: String, enum: [ 'admin', 'patient', 'doctor'] },
    },
    { timestamps: true }
);


// creating the model
const Auth = model('Auth', authSchema);

export default Auth;
