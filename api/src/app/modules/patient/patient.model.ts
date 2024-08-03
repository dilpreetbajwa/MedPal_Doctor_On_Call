import { Schema, model } from 'mongoose';
import { IPatient } from './patient.interface';


const patientSchema = new Schema ({
    
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        password: { type: String, required: false },
        bloodGroup: { type: String, required: false },
        mobile: { type: String, required: false },
        city: { type: String, required: false },
        state: { type: String, required: false },
        zipCode: { type: String, required: false },
        gender: { type: String, required: false },
        country: { type: String, required: false },
        email: { type: String, required: true, unique: true },
        address: { type: String, required: false },
        img: { type: String, required: false },
    },
    { timestamps: true }
);


// creating the model
const Patient = model<IPatient>('Patient', patientSchema);

export default Patient;