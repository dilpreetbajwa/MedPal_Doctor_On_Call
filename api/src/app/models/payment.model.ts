import { Schema, model } from 'mongoose';
const paymentSchema = new Schema ({
       appointmentId: { type: String, required: false },
       paymentMethod: { type: String, required: false },
       paymentType: { type: String, required: false },
        DoctorFee: { type: String, required: false },
        bookingFee: { type: String, required: false },
        vat: { type: String, required: false },
        totalAmount: { type: String , required: false},
    },
    { timestamps: true }
);


// creating the model
const Payment = model('Payment', paymentSchema);

export default Payment;