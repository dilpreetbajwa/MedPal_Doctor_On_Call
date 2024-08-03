import { Schema, model } from 'mongoose';
const userverificationSchema = new Schema ({
    userId: { type: String, required: false },
    uniqueString: { type: String, required: false },
    expiresAt: { type: String, required: false }
    },
    { timestamps: true }
);


// creating the model
const UserVerification = model('UserVerification', userverificationSchema);

export default UserVerification;
