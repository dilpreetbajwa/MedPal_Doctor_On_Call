import { Schema, model, Document } from 'mongoose';

export interface IScheduleDay extends Document {
    startTime: string;
    endTime: string;
}

const ScheduleDaySchema = new Schema ({
    startTime: { type: String, required: false },
    endTime: { type: String, required: false },
    },
    { timestamps: true }
);


// creating the model
const ScheduleDay = model('ScheduleDay', ScheduleDaySchema);

export default ScheduleDay;