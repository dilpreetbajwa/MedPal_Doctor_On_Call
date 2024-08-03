import { Schema, model } from 'mongoose';
const paymentSchema = new Schema ({
       appointmentId: { type: String, required: false },
       paymentMethod: { type: String, required: false },
       paymentType: { type: String, required: false },
        DoctorFee: { type: Number, required: false },
        bookingFee: { type: Number, required: false },
        vat: { type: Number, required: false },
        totalAmount: { type: Number , required: false},
    },
    { timestamps: true }
);


// creating the model
const Payment = model('Payment', paymentSchema);

export default Payment;