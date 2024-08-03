import { Document } from 'mongoose';

export interface IAuth extends Document {
    
    email?: string;
    userId?: string;
    role?: string;
    password?:string;

  }