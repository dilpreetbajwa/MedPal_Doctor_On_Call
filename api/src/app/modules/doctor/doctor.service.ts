import Doctor from "./doctor.model";
import { IDoctor } from "./doctor.interface";
import bcrypt from 'bcrypt';
import ApiError from "../../../errors/apiError";
import httpStatus from "http-status";
import { DoctorSearchableFields, IDoctorFilters } from "./doctor.interface";
import calculatePagination, { IOption } from "../../../shared/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { Request } from "express";
import { IUpload } from "../../../interfaces/file";
import { CloudinaryHelper } from "../../../helpers/uploadHelper";
import moment from "moment";
import { EmailtTransporter } from "../../../helpers/emailTransporter";
import * as path from "path";
import config from "../../../config";
import UserVerification from "../../models/userverification.model";
import AuthUser from "../auth/auth.model";
const { v4: uuidv4 } = require('uuid');

const sendVerificationEmail = async (data: IDoctor) => {
    const currentUrl = process.env.NODE_ENV === 'production' ? config.backendLiveUrl : config.backendLocalUrl;
    const uniqueString = uuidv4() + data.id;
    const uniqueStringHashed = await bcrypt.hashSync(uniqueString, 12);
    const url = `${currentUrl}user/verify/${data.id}/${uniqueString}`
    const expiresDate = moment().add(6, 'hours')
    const verficationData = await UserVerification.create({
       
            userId: data.id,
            expiresAt: expiresDate.toDate(),
            uniqueString: uniqueStringHashed
        
    })
    if (verficationData) {
        const pathName = path.join(__dirname, '../../../../template/verify.html',)
        const obj = {link: url};
        const subject = "Email Verification"
        const toMail = data.email;
        try{
            await EmailtTransporter({pathName, replacementObj: obj, toMail, subject})
        }catch(err){
            console.log(err);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to send email !');
        }
    }
}

const create = async (payload: any): Promise<any> => {
    
        const { password, ...othersData } = payload;
        const existEmail = await AuthUser.findOne({ email: payload.email  });
        console.log(payload);
        console.log(existEmail);
        if (existEmail) {
            throw new Error("Email Already Exist !!")
        }
        const doctor = await Doctor.create({ 
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email });
        await AuthUser.create({
                email: doctor.email,
                password: payload.password && await bcrypt.hashSync(payload.password, 12),
                role: 'doctor',
                userId: doctor.id
            
        });
        return doctor

      
    // if (data.id) {
    //     await sendVerificationEmail(data)
    // }
    // return data;

}

const getAllDoctors = async (filters: any, options: IOption): Promise<IGenericResponse<IDoctor[]>> => {
    const { limit, page, skip } = calculatePagination(options);
    const { searchTerm, max, min, specialist, ...filterData } = filters;
   
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            $or: DoctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    $options: 'i'
                }
            }))
        })
    }


    // if (Object.keys(filterData).length > 0) {
    //     andCondition.push({
    //         $and: Object.entries(filterData).map(([key, value]) => ({
    //             [key]: { equals: value }
    //         }))
    //     })
    // }

    if (min || max) {
        andCondition.push({
             $or: [ { price: { $lt : min } }, { price : { $gt: max } } ] 
        })
    }

    if (specialist) {
        andCondition.push({
            services:specialist
        })
    }

    const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
    console.log(whereCondition);
    const result = await Doctor.find({
        $and:{
            ...filterData
        }
    }
        
   
);
   
    const total = await Doctor.countDocuments({ whereCondition });
    
    const resultdata =  {
        meta: {
            page,
            limit,
            total,
        },
        data: result
    }
    
    return resultdata;
}

const getDoctor = async (id: string): Promise<IDoctor | null> => {
    const result = await Doctor.findOne({       
            _id: id       
    });
    return result;
}

const deleteDoctor = async (id: string): Promise<any> => {
    // const result = await prisma.$transaction(async (tx) => {
    //     const patient = await tx.doctor.delete({
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

const updateDoctor = async (req: Request): Promise<any> => {
    const file = req.file as IUpload;
    const id = req.params.id as string;
    const user = JSON.parse(req.body.data);

    if (file) {
        const uploadImage = await CloudinaryHelper.uploadFile(file);

        if (uploadImage) {
            user.img = uploadImage.secure_url
        } else {
            throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Failed to Upload Image');
        }
    }
    console.log(user.img);
    
    const result = await Doctor.findOneAndUpdate(
        { _id: id },
        { $set: { ...user } },
        { upsert: true }
        
    )
    return result;
}

export const DoctorService = {
    create,
    updateDoctor,
    deleteDoctor,
    getAllDoctors,
    getDoctor
}