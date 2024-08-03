import { Schema, model } from 'mongoose';
const prescriptionSchema = new Schema ({
        doctorId: { type: String, required: false },
        patientId: { type: String, required: false },
        appointmentId: { type: String, required: false },
        followUpdate: { type: String, required: false },
        instruction: { type: String, required: false },
        isFullfilled: { type: Boolean , required: false},
        isArchived: { type: Boolean, required: false },
        daignosis: { type: String, required: false },
        disease: { type: String, required: false },
        test: { type: String , required: false},
    },
    { timestamps: true }
);


// creating the model
const Prescription = model('Prescription', prescriptionSchema);

export default Prescription;