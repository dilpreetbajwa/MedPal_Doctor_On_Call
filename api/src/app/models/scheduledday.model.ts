import { Schema, model } from 'mongoose';

const ScheduleDaySchema = new Schema ({
    startTime: { type: String, required: false },
    endTime: { type: String, required: false },
    },
    { timestamps: true }
);


// creating the model
const ScheduleDay = model('ScheduleDay', ScheduleDaySchema);

export default ScheduleDay;