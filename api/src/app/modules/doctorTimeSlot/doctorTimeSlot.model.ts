import { Schema, model } from 'mongoose';
import { IDoctorTimeSlott } from './doctorTimeSlot.interface';


const DoctorTimeSlotSchema = new Schema ({

    doctorId: { type: String, ref: 'Doctor', required: false },
    day: { type: String, required: false },
    timeSlot: [{
        type: Schema.Types.ObjectId,
        ref: 'ScheduleDay',
    }],
    weekDay: { type: String, required: false },
    maximumPatient: { type: String, required: false },
        
    },
    { timestamps: true }
);


// creating the model
const DoctorTimeSlot = model<IDoctorTimeSlott>('DoctorTimeSlot', DoctorTimeSlotSchema);

export default DoctorTimeSlot;