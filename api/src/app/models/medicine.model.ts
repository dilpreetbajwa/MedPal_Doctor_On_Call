
import { Schema, model } from 'mongoose';
const prescriptionSchema = new Schema ({
        prescriptionId: { type: String, required: false },
        medicine: { type: String, required: false },
        dosage: { type: String, required: false },
        frequency: { type: String, required: false },
        duration: { type: String , required: false},
    },
    { timestamps: true }
);


// creating the model
const Prescription = model('Prescription', prescriptionSchema);

export default Prescription;