import { Schema, model } from 'mongoose';
import { IDoctor } from './doctor.interface';

const doctorSchema = new Schema ({
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        bloodGroup: { type: String, required: false },
        mobile: { type: String, required: false },
        city: { type: String, required: false },
        state: { type: String, required: false },
        zipCode: { type: String, required: false },
        gender: { type: String, required: false },
        country: { type: String, required: false },
        email: { type: String, required: false },
        address:{ type: String, required: false },
        img: { type: String, required: false },
        phone: { type: String, required: false },
        dob : { type: String, required: false },
        biography: { type: String, required: false },
        clinicName:  { type: String, required: false },
        clinicAddress: { type: String, required: false },
        clinicImages :  { type: String, required: false },
        postalCode :{ type: String, required: false },
        price:{ type: String, required: false },
        services: { type: String, required: false },
        specialization: { type: String, required: false },
        degree:{ type: String, required: false },
        college: { type: String, required: false },
        completionYear: { type: String, required: false },
        experience : { type: String, required: false },
        designation: { type: String, required: false },
        award:{ type: String, required: false },
        awardYear:{ type: String, required: false },
        registration:{ type: String, required: false },
        year:{ type: String, required: false },
        experienceHospitalName :{ type: String, required: false },
        expericenceStart:{ type: String, required: false },
        expericenceEnd:{ type: String, required: false },
        verified :{ type: Boolean, required: false }
    },
    { timestamps: true }
);


// creating the model
const Doctor = model<IDoctor>('Doctor', doctorSchema);

export default Doctor;