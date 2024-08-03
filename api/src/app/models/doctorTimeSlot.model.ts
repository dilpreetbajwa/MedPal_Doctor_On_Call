import { Schema, model } from 'mongoose';
import { IDoctorTimeSlott } from './doctorTimeSlot.interface';


const DoctorTimeSlotSchema = new Schema ({

    doctorId: { type: String, required: true },
    day: { type: String, required: true },
    timeSlot: [{
        type: Schema.Types.ObjectId,
        ref: 'ScheduleDay',
    }],
    weekDay: { type: String, required: true },
    maximumPatient: { type: String, required: true },
        
    },
    { timestamps: true }
);


// creating the model
const DoctorTimeSlot = model<IDoctorTimeSlott>('DoctorTimeSlot', DoctorTimeSlotSchema);

export default DoctorTimeSlot;