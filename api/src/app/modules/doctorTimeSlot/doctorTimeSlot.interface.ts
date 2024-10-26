import { Document } from 'mongoose';
import { IScheduleDay } from '../../models/scheduledday.model';

export interface IDoctorTimeSlot extends Document {
  doctorId: string;
  day: string;
  timeSlot: IScheduleDay[];
  weekDay?: string;
  maximumPatient?: string;
  }