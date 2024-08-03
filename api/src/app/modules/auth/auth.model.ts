import { Schema, model } from 'mongoose';
import { IAuth } from './auth.interface';

const authSchema = new Schema ({

        userId: { type: String },
        email: { type: String },
        role: { type: String },
        password: { type: String},
       
        
    },
    { timestamps: true }
);


// creating the model
const AuthUser = model<IAuth>('AuthUser', authSchema);

export default AuthUser;
