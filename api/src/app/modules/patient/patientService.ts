import httpStatus from "http-status";
import ApiError from "../../../errors/apiError";
import bcrypt from 'bcrypt';
import Patient from "./patient.model";
import AuthUser from "../auth/auth.model";
import { IPatient } from './patient.interface';
import { IAuth } from "../auth/auth.interface";

export const create = async (payload: any): Promise<any> => {
    try {

        console.log(payload.firstName);
        const { password, ...othersData } = payload;
       
        const patient = await Patient.create({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email
        });
       
        console.log(patient);
            if (patient) {
                // Check Email existing
                const existEmail = await AuthUser.findOne({ email: payload.email });
                console.log(existEmail);
                if (existEmail) {
                    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Email Already Exist !!")
                } else {
                    const authdata = await AuthUser.create({
                        
                            email: patient.email,
                            password: payload.password && await bcrypt.hashSync(payload.password, 12),
                            role: 'patient',
                            userId: patient._id
                       
                    });
                    console.log(authdata);
                    return {
                        patient,
                        authdata,
                    };
                }
            }
       
    } catch (error: any) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message)
    }
};