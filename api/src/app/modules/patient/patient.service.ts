import Patient  from "../patient/patient.model";
import { create } from "./patientService";
import { IUpload } from "../../../interfaces/file";
import { Request } from "express";
import { CloudinaryHelper } from "../../../helpers/uploadHelper";
import ApiError from "../../../errors/apiError";
import httpStatus from "http-status";
import  { IPatient }  from "./patient.interface"; 

const createPatient = async (payload: any): Promise<IPatient> => {
    const result = await create(payload)
    return result;
}

const getAllPatients = async (): Promise<any> => {
    const result = await Patient.find();
    return result;
}

const getPatient = async (id: string): Promise<any> => {
    console.log(id);
    const result = await Patient.findOne({
            _id: id      
    });
    return result;
}

const deletePatient = async (id: string): Promise<any> => {
    // const result = await prisma.$transaction(async (tx) => {
    //     const patient = await tx.patient.delete({
    //         where: {
    //             id: id
    //         }
    //     });
    //     await tx.auth.delete({
    //         where: {
    //             email: patient.email
    //         }
    //     })
    // });
    // return result;
}

// : Promise<Patient>
const updatePatient = async (req: Request): Promise<any> => {
    const file = req.file as IUpload;
    const id = req.params.id as string;
    const user = JSON.parse(req.body.data)
    if (file) {
        const uploadImage = await CloudinaryHelper.uploadFile(file);
        if (uploadImage) {
            user.img = uploadImage.secure_url
        } else {
            throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Failed to updateImage !!')
        }
    }


    const result = await Patient.updateOne(
        { _id: id },
        { $set: { ...user } },
        { upsert: true }
    )
    return result;
}

export const PatientService = {
    createPatient,
    updatePatient,
    getPatient,
    getAllPatients,
    deletePatient
}