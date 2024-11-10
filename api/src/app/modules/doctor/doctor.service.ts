import Doctor from './doctor.model';
import { IDoctor, IDoctorCreation } from './doctor.interface';
import bcrypt from 'bcrypt';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';
import { DoctorSearchableFields, IDoctorFilters } from './doctor.interface';
import calculatePagination, { IOption } from '../../../shared/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { Request } from 'express';
import { IUpload } from '../../../interfaces/file';
import { CloudinaryHelper } from '../../../helpers/uploadHelper';
import moment from 'moment';
import { EmailtTransporter } from '../../../helpers/emailTransporter';
import * as path from 'path';
import config from '../../../config';
import UserVerification from '../../models/userverification.model';
import AuthUser from '../auth/auth.model';
const { v4: uuidv4 } = require('uuid');

const sendVerificationEmail = async (data: IDoctor) => {
    const currentUrl =
        process.env.NODE_ENV === 'production' ? config.backendLiveUrl : config.backendLocalUrl;
    const uniqueString = uuidv4() + data.id;
    const uniqueStringHashed = await bcrypt.hashSync(uniqueString, 12);
    const url = `${currentUrl}user/verify/${data.id}/${uniqueString}`;
    const expiresDate = moment().add(6, 'hours');
    const verficationData = await UserVerification.create({
        userId: data.id,
        expiresAt: expiresDate.toDate(),
        uniqueString: uniqueStringHashed,
    });

    if (verficationData) {
        const pathName = path.join(__dirname, '../../../../template/verify.html');
        const obj = { link: url };
        const subject = 'Email Verification';
        const toMail = data.email;
        try {
            await EmailtTransporter({ pathName, replacementObj: obj, toMail, subject });
        } catch (err) {
            console.log(err);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to send email !');
        }
    }
};

const create = async (payload: IDoctorCreation): Promise<IDoctor> => {
    const {
        password,
        firstName,
        lastName,
        email,
        designation,
        specialization,
        price,
        clinicAddress,
        clinicName,
        gender,
        biography,
    } = payload;

    if (
        !password ||
        !firstName ||
        !lastName ||
        !email ||
        !designation ||
        !price ||
        !clinicAddress ||
        !clinicName ||
        !gender ||
        !biography
    ) {
        console.log('invalid values');
        throw new Error('Invalid values !!');
    }

    const existEmail = await AuthUser.findOne({ email: email });

    if (existEmail) {
        throw new Error('Email Already Exist !!');
    }
    const doctor = await Doctor.create({
        firstName,
        lastName,
        email,
        designation,
        specialization,
        price,
        clinicAddress,
        clinicName,
        gender,
        biography,
    });

    await AuthUser.create({
        email: doctor.email,
        password: bcrypt.hashSync(password, 12),
        role: 'doctor',
        userId: doctor.id,
    });

    if (doctor.id) {
        await sendVerificationEmail(doctor);
    }

    return doctor;
};

const getAllDoctors = async (filters: any, options: IOption): Promise<IGenericResponse<IDoctor[]>> => {
    const { limit, page, skip } = calculatePagination(options);
    const { searchTerm, max, min, specialist, gender } = filters;
    const andCondition: any = [];

    if (searchTerm) {
        andCondition.push({
            $expr: {
                $regexMatch: {
                    input: { $concat: ['$firstName', ' ', '$lastName'] },
                    regex: new RegExp(searchTerm, 'i'),
                },
            },
        });
    }

    if (min || max) {
        andCondition.push({
            $and: [{ price: { $lt: parseInt(max) } }, { price: { $gt: parseInt(min) } }],
        });
    }

    if (specialist) {
        andCondition.push({
            services: { $regex: new RegExp(specialist, 'i') },
        });
    }

    if (gender) {
        andCondition.push({ gender });
    }

    const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

    const result = await Doctor.find(whereCondition).skip(skip).limit(limit);

    const total = await Doctor.countDocuments(whereCondition);

    const resultdata = {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };

    return resultdata;
};

const getDoctor = async (id: string): Promise<IDoctor | null> => {
    const result = await Doctor.findOne({
        _id: id,
    });
    return result;
};

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
};

const updateDoctor = async (req: Request): Promise<any> => {
    const file = req.file as IUpload;
    const id = req.params.id as string;
    const user = JSON.parse(req.body.data);

    if (file) {
        const uploadImage = await CloudinaryHelper.uploadFile(file);

        if (uploadImage) {
            user.img = uploadImage.secure_url;
        } else {
            throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Failed to Upload Image');
        }
    }
    console.log(user.img);

    const result = await Doctor.findOneAndUpdate({ _id: id }, { $set: { ...user } }, { upsert: true });
    return result;
};

export const DoctorService = {
    create,
    updateDoctor,
    deleteDoctor,
    getAllDoctors,
    sendVerificationEmail,
    getDoctor,
};
