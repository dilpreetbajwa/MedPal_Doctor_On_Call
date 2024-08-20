import { Schema, model, Document } from 'mongoose';
// import { IDoctorTimeSlot } from './doctorTimeSlot.interface';
import { IScheduleDay } from '../../models/scheduledday.model';



export interface IDoctorTimeSlot extends Document {
    doctorId: string;
    day: string;
    timeSlot: IScheduleDay[];
    weekDay?: string;
    maximumPatient?: string;
}


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
const DoctorTimeSlot = model<IDoctorTimeSlot>('DoctorTimeSlot', DoctorTimeSlotSchema);

export default DoctorTimeSlot;