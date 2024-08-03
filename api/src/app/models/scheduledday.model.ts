import { Schema, model } from 'mongoose';
const prescriptionSchema = new Schema ({
    startTime: { type: String, required: false },
    endTime: { type: String, required: false },
    doctorTimeSlotId: { type: String, required: false },
    },
    { timestamps: true }
);


// creating the model
const Prescription = model('Prescription', prescriptionSchema);

export default Prescription;