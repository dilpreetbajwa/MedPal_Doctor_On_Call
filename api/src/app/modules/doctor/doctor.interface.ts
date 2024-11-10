import { Document } from 'mongoose';

export interface IDoctor extends Document {
    email: string;
    firstName: string;
    lastName: string;
    bloodGroup: String;
    mobile: String;
    city: String;
    state: String;
    zipCode: String;
    gender: String;
    country: String;
    address: String;
    img: String;
    phone: String;
    dob: String;
    biography: String;
    clinicName: String;
    clinicAddress: String;
    clinicImages: String;
    postalCode: String;
    price: number;
    services: String;
    specialization: String;
    degree: String;
    college: String;
    completionYear: String;
    experience: String;
    designation: String;
    award: String;
    awardYear: String;
    registration: String;
    year: String;
    experienceHospitalName: String;
    expericenceStart: String;
    expericenceEnd: String;
    verified: Boolean;
}

export type IDoctorFilters = {
    searchTerm?: string;
    firstName?: string;
    gender?: string;
    city?: string;
    max?: string;
    min?: string;
    specialist?: string;
};

export interface IDoctorCreation {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    designation: string;
    specialization: string;
    price: number;
    clinicAddress: string;
    clinicName: string;
    services: string;
    gender: string;
    biography: string;
}

export const IDoctorFiltersData = [
    'searchTerm',
    'firstName',
    'lastName',
    'gender',
    'city',
    'max',
    'min',
    'specialist',
];
export const IDoctorOptions = ['limit', 'page', 'sortBy', 'sortOrder'];

export const DoctorSearchableFields = ['firstName', 'lastName', 'address', 'specialization', 'degree'];
