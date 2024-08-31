import { Schema, model } from 'mongoose';
import { IAppointment } from './appointment.interface';

const appointmentSchema = new Schema ({
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
        address: { type: String, required: false },
        img: { type: String, required: false },
        trackingId:{ type: String, required: false },
        patientId:{ type: String, ref: "Patient" },
        doctorId:{ type: String, ref: "Doctor" }
    },
    { timestamps: true }
);

// creating the model
const Appointment = model<IAppointment>('Appointment', appointmentSchema);

export default Appointment;
