import { Document } from 'mongoose';

export interface IDoctorTimeSlot extends Document {
    email: string;
    firstName: string;
    lastName: string;
    bloodGroup?:  String;
    mobile?: String;
    city?: String;
    state?:String;
    zipCode?: String;
    gender?: String;
    country?:  String;
    address?: String;
    img?: String;
  }