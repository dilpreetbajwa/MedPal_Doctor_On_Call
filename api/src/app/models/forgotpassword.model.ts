import { Schema, model } from 'mongoose';
const forgotpasswordSchema = new Schema ({
    userId: { type: String, required: false },
    uniqueString: { type: String, required: false },
    expiresAt: { type: String, required: false },
    },
    { timestamps: true }
);


// creating the model
const ForgotPassword = model('ForgotPassword', forgotpasswordSchema);

export default ForgotPassword;