export const AppointmentsFilterable = ['searchTerm', 'appointmentTime','status']
export const AppointmentsSearchable = ['appointmentTime','status', 'purpose']
import { model, Schema, Model, Document } from 'mongoose';

export interface IAppointment extends Document {
    email: string;
    firstName: string;
    lastName: string;
    trackingId:string;
    patientId:string;
    doctorId:string;
  }

  