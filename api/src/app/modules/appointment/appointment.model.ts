import { Schema, model } from 'mongoose';
import { IAppointment } from './appointment.interface';

const appointmentSchema = new Schema ({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        bloodGroup: { type: String, required: true },
        mobile: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        gender: { type: String, required: true },
        country: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        img: { type: String, required: true },
    },
    { timestamps: true }
);


// creating the model
const Appointment = model<IAppointment>('Appointment', appointmentSchema);

export default Appointment;
