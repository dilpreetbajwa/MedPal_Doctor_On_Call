export const AppointmentsFilterable = ['searchTerm', 'appointmentTime','status']
export const AppointmentsSearchable = ['appointmentTime','status', 'purpose']
import { model, Schema, Model, Document } from 'mongoose';

export interface IAppointment extends Document {
    firstName?: string;
    lastName?: string;
    bloodGroup?: string;
    mobile?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    gender?: string;
    country?: string;
    email?: string;
    address?: string;
    img?: string;
    trackingId?: string;
    patientId?: string; // Reference to Patient
    doctorId?: string;  // Reference to Doctor
    scheduleDate?: string;
    scheduleTime?: string;
    reasonForVisit?: string;
    status: 'pending' | 'completed'; // Enum values
    paymentStatus: 'paid' | 'unpaid'; // Enum values
    prescriptionStatus: 'Issued' | 'notIssued'; // Enum values
    isFollowUp: boolean; // Should be a boolean, not an enum
    patientType?: string;
    createdAt?: Date; // Optional, included by timestamps
    updatedAt?: Date; // Optional, included by timestamps
}