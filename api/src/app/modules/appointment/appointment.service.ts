// import { Appointments, Patient, Payment, paymentStatus } from "@prisma/client";
import Appointment from "./appointment.model";
import Patient from "../patient/patient.model";
import Payment from "../../models/payment.model";
import Doctor from "../doctor/doctor.model";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/apiError";
import httpStatus from "http-status";
import moment from 'moment';
import { EmailtTransporter } from "../../../helpers/emailTransporter";
import * as path from 'path';
import config from "../../../config";
import mongoose from "mongoose";

const createAppointment = async (payload: any): Promise<any | null> => {
   
    const { patientInfo, payment } = payload;
    console.log(patientInfo)
    let isUserExist: any | null = null;
    if (patientInfo.email) {
        isUserExist = await Patient.findOne({ email: patientInfo.email }).exec();
        patientInfo['patientId'] = isUserExist._id;
        if (!isUserExist) {
            patientInfo._id = null;
        }
    }
    const isDoctorExist = await Doctor.findById(patientInfo.doctorId);
    if (!isDoctorExist) {
        throw new Error('Doctor Account is not found !!');
    }

    // console.log(isUserExist);
    console.log(patientInfo);

    patientInfo['paymentStatus'] = 'paid'; // Use the appropriate value or enum if defined


    // Generate Tracking ID
    const previousAppointment = await Appointment.findOne().sort({ createdAt: -1 }).limit(1);
    const appointmentLastNumber = (previousAppointment?.trackingId ?? '').slice(-3);
    const lastDigit = (Number(appointmentLastNumber) + 1 || 0).toString().padStart(3, '0');

    const first3DigitName = patientInfo.firstName.slice(0, 3).toUpperCase();
    const year = moment().year();
    const month = (moment().month() + 1).toString().padStart(2, '0');
    const day = (moment().dayOfYear()).toString().padStart(2, '0');
    const trackingId = first3DigitName + year + month + day + lastDigit || '001';

    patientInfo['trackingId'] = trackingId;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const appointment = await Appointment.create([{
            ...patientInfo,
            trackingId,
        }], { session });


        const { paymentMethod, paymentType } = payment;
        const docFee = Number(isDoctorExist.price);
        const vat = (15 / 100) * (docFee + 10);

        if (appointment[0]._id) {
            await Payment.create([{
                appointmentId: appointment[0]._id,
                bookingFee: 10,
                paymentMethod: paymentMethod,
                paymentType: paymentType,
                vat: vat,
                DoctorFee: docFee,
                totalAmount: (vat + docFee),
            }], { session });
        }

        await session.commitTransaction();
        session.endSession();

        console.log(appointment[0])

        // Prepare email and send it
        // const pathName = path.join(__dirname, '../../../../template/appointment.html');
        // const appointmentObj = {
        //     created: moment(appointment[0].createdAt).format('LL'),
        //     trackingId: appointment[0].trackingId,
        //     patientType: appointment[0].patientType,
        //     status: appointment[0].status,
        //     paymentStatus: appointment[0].paymentStatus,
        //     prescriptionStatus: appointment[0].prescriptionStatus,
        //     scheduleDate: moment(appointment[0].scheduleDate).format('LL'),
        //     scheduleTime: appointment[0].scheduleTime,
        //     doctorImg: isDoctorExist.img,
        //     doctorFirstName: isDoctorExist.firstName,
        //     doctorLastName: isDoctorExist.lastName,
        //     specialization: isDoctorExist.specialization,
        //     designation: isDoctorExist.designation,
        //     college: isDoctorExist.college,
        //     patientImg: isUserExist.img,
        //     patientFirstName: isUserExist.firstName,
        //     patientLastName: isUserExist.lastName,
        //     dateOfBirth: moment().diff(moment(isUserExist.dateOfBirth), 'years'),
        //     bloodGroup: isUserExist.bloodGroup,
        //     city: isUserExist.city,
        //     state: isUserExist.state,
        //     country: isUserExist.country
        // };

        // const subject = `Appointment Confirm With Dr ${isDoctorExist.firstName + ' ' + isDoctorExist.lastName} at ${moment(appointment[0].scheduleDate).format('LL')} ${appointment[0].scheduleTime}`;
        // const toMail = `${patientInfo.email},${isDoctorExist.email}`;

        // EmailTransporter({ pathName, replacementObj: appointmentObj, toMail, subject });

        return appointment[0];
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};


// const createAppointment = async (payload: any): Promise<Appointments | null | any> => {

//     const { patientInfo, payment } = payload;
//     if(patientInfo.patientId){
//         const isUserExist = await prisma.patient.findUnique({
//             where: {
//                 id: patientInfo.patientId
//             }
//         })
//         if (!isUserExist) {
//             patientInfo['patientId'] = null
//         }
//     }

//     const isDoctorExist = await prisma.doctor.findUnique({
//         where: {
//             id: patientInfo.doctorId
//         }
//     });

//     if (!isDoctorExist) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!')
//     }
//     patientInfo['paymentStatus'] = paymentStatus.paid;
  
//     const result = await prisma.$transaction(async (tx) => {
//         const previousAppointment = await tx.appointments.findFirst({
//             orderBy: { createdAt: 'desc' },
//             take: 1
//         });
//         const appointmentLastNumber = (previousAppointment?.trackingId ?? '').slice(-3);
//         const lastDigit = (Number(appointmentLastNumber) + 1 || 0).toString().padStart(3, '0');

//         // Trcking Id To be ==> First 3 Letter Of User  + current year + current month + current day + unique number (Matched Previous Appointment).
//         const first3DigitName = patientInfo?.firstName?.slice(0, 3).toUpperCase();
//         const year = moment().year();
//         const month = (moment().month() + 1).toString().padStart(2, '0');
//         const day = (moment().dayOfYear()).toString().padStart(2, '0');
//         const trackingId = first3DigitName + year + month + day + lastDigit || '001';
//         patientInfo['trackingId'] = trackingId;

//         const appointment = await tx.appointments.create({
//             data: patientInfo,
//             include: {
//                 doctor: true,
//                 patient: true
//             }
//         });
//         const { paymentMethod, paymentType } = payment;
//         const docFee = Number(isDoctorExist.price);
//         const vat = (15 / 100) * (docFee + 10)
//         if (appointment.id) {
//             await tx.payment.create({
//                 data: {
//                     appointmentId: appointment.id,
//                     bookingFee: 10,
//                     paymentMethod: paymentMethod,
//                     paymentType: paymentType,
//                     vat: vat,
//                     DoctorFee: docFee,
//                     totalAmount: (vat + docFee),
//                 }
//             })
//         }
//         const pathName = path.join(__dirname, '../../../../template/appointment.html')
//         const appointmentObj = {
//             created: moment(appointment.createdAt).format('LL'),
//             trackingId: appointment.trackingId,
//             patientType: appointment.patientType,
//             status: appointment.status,
//             paymentStatus: appointment.paymentStatus,
//             prescriptionStatus: appointment.prescriptionStatus,
//             scheduleDate:moment(appointment.scheduleDate).format('LL'),
//             scheduleTime:appointment.scheduleTime,
//             doctorImg: appointment?.doctor?.img,
//             doctorFirstName: appointment?.doctor?.firstName,
//             doctorLastName: appointment?.doctor?.lastName,
//             specialization:appointment?.doctor?.specialization,
//             designation:appointment?.doctor?.designation,
//             college:appointment?.doctor?.college,
//             patientImg:appointment?.patient?.img,
//             patientfirstName:appointment?.patient?.firstName,
//             patientLastName:appointment?.patient?.lastName,
//             dateOfBirth: moment().diff(moment(appointment?.patient?.dateOfBirth), 'years'),
//             bloodGroup:appointment?.patient?.bloodGroup,
//             city:appointment?.patient?.city,
//             state:appointment?.patient?.state,
//             country:appointment?.patient?.country
//         }
//         const replacementObj = appointmentObj;
//         const subject = `Appointment Confirm With Dr ${appointment?.doctor?.firstName + ' ' + appointment?.doctor?.lastName} at ${appointment.scheduleDate} + ' ' + ${appointment.scheduleTime}`
//         const toMail = `${appointment.email + ',' + appointment.doctor?.email}`;
//         EmailtTransporter({ pathName, replacementObj, toMail, subject })
//         return appointment;
//     });
//     return result;
// }

// const createAppointmentByUnAuthenticateUser = async (payload: any): Promise<Appointments | null> => {
//     // const { patientInfo, payment } = payload;
//     // if(patientInfo.patientId){
//     //     const isUserExist = await prisma.patient.findUnique({
//     //         where: {
//     //             id: patientInfo.patientId
//     //         }
//     //     })
//     //     if (!isUserExist) {
//     //         patientInfo['patientId'] = null
//     //     }
//     // }

//     // const result = await prisma.$transaction(async (tx) => {
//     //     const previousAppointment = await tx.appointments.findFirst({
//     //         orderBy: { createdAt: 'desc' },
//     //         take: 1
//     //     });

//     //     const appointmentLastNumber = (previousAppointment?.trackingId ?? '').slice(-3);
//     //     const lastDigit = (Number(appointmentLastNumber) + 1).toString().padStart(3, '0')
//     //     // Trcking Id To be ==> UNU - 'Un Authenticate User  + current year + current month + current day + unique number (Matched Previous Appointment).
//     //     const year = moment().year();
//     //     const month = (moment().month() + 1).toString().padStart(2, '0');
//     //     const day = (moment().dayOfYear()).toString().padStart(2, '0');
//     //     const trackingId = 'UNU' + year + month + day + lastDigit || '0001';
//     //     patientInfo['trackingId'] = trackingId;
//     //     patientInfo['doctorId'] = config.defaultAdminDoctor

//     //     const appointment = await tx.appointments.create({
//     //         data: patientInfo,
//     //     });
//     //     const { paymentMethod, paymentType } = payment;
//     //     const vat = (15 / 100) * (60 + 10)
//     //     if (appointment.id) {
//     //         await tx.payment.create({
//     //             data: {
//     //                 appointmentId: appointment.id,
//     //                 bookingFee: 10,
//     //                 paymentMethod: paymentMethod,
//     //                 paymentType: paymentType,
//     //                 vat: vat,
//     //                 DoctorFee: 60,
//     //                 totalAmount: (vat + 60),
//     //             }
//     //         })
//     //     }

//     //     const appointmentObj = {
//     //         created: moment(appointment.createdAt).format('LL'),
//     //         trackingId: appointment.trackingId,
//     //         patientType: appointment.patientType,
//     //         status: appointment.status,
//     //         paymentStatus: appointment.paymentStatus,
//     //         prescriptionStatus: appointment.prescriptionStatus,
//     //         scheduleDate:moment(appointment.scheduleDate).format('LL'),
//     //         scheduleTime:appointment.scheduleTime,
//     //     }
//     //     const pathName = path.join(__dirname, '../../../../template/meeting.html')
//     //     const replacementObj = appointmentObj;
//     //     const subject = `Appointment Confirm at ${appointment.scheduleDate} ${appointment.scheduleTime}`

//     //     const toMail = `${appointment.email}`;
//     //     EmailtTransporter({ pathName, replacementObj, toMail, subject })
//     //     return appointment;
//     // })

//     // return result;
// }

const getAllAppointments = async (): Promise<any[] | null> => {
    const result = await Appointment.find();
    return result;
}

// const getAppointment = async (id: string): Promise<Appointments | null> => {
//     // const result = await prisma.appointments.findUnique({
//     //     where: {
//     //         id: id
//     //     },
//     //     include: {
//     //         doctor: true,
//     //         patient: true
//     //     }
//     // });
//     // return result;
// }

// const getAppointmentByTrackingId = async (data: any): Promise<Appointments | null> => {
//     // const { id } = data;

//     // const result = await prisma.appointments.findUnique({
//     //     where: {
//     //         trackingId: id
//     //     },
//     //     include: {
//     //         doctor: {
//     //             select: {
//     //                 firstName: true,
//     //                 lastName: true,
//     //                 designation: true,
//     //                 college: true,
//     //                 degree: true,
//     //                 img: true
//     //             },
//     //         },
//     //         patient: {
//     //             select: {
//     //                 firstName: true,
//     //                 lastName: true,
//     //                 address: true,
//     //                 city: true,
//     //                 country: true,
//     //                 state: true,
//     //                 img: true
//     //             }
//     //         }
//     //     }
//     // });
//     // return result;
// }

const getPatientAppointmentById = async (user: { userId: string }): Promise<any[] | null> => {
    const { userId } = user;

    console.log(userId);
    // Check if the patient exists
    const isPatient = await Patient.findById(userId).exec();
    console.log(isPatient);
    if (!isPatient) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Patient Account is not found !!');
    }

    // Find all appointments for the patient
    const result = await Appointment.find({ patientId: userId })
        .populate('doctorId', 'firstName lastName') // Populate doctor details
        .exec();

    return result;
};

// const getPatientAppointmentById = async (user: any): Promise<any | null> => {
//     const { userId } = user;
//     const isPatient = await prisma.patient.findUnique({
//         where: {
//             id: userId
//         }
//     })
//     if (!isPatient) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'Patient Account is not found !!')
//     }
//     const result = await prisma.appointments.findMany({
//         where: {
//             patientId: userId
//         },
//         include: {
//             doctor: true
//         }
//     })
//     return result;
// }

// const getPaymentInfoViaAppintmentId = async (id: string): Promise<any> => {
//     // const result = await prisma.payment.findFirst({
//     //     where: {
//     //         appointmentId: id
//     //     },
//     //     include: {
//     //         appointment: {
//     //             include: {
//     //                 patient: {
//     //                     select: {
//     //                         firstName: true,
//     //                         lastName: true,
//     //                         address: true,
//     //                         country: true,
//     //                         city: true
//     //                     }
//     //                 },
//     //                 doctor: {
//     //                     select: {
//     //                         firstName: true,
//     //                         lastName: true,
//     //                         address: true,
//     //                         country: true,
//     //                         city: true
//     //                     }
//     //                 }
//     //             }
//     //         }
//     //     }
//     // });
//     // return result;
// }

// const getPatientPaymentInfo = async (user: any): Promise<Payment[]> => {
// //     const { userId } = user;
// //     const isUserExist = await prisma.patient.findUnique({
// //         where: { id: userId }
// //     })
// //     if (!isUserExist) {
// //         throw new ApiError(httpStatus.NOT_FOUND, 'Patient Account is not found !!')
// //     }
// //     const result = await prisma.payment.findMany({
// //         where: { appointment: { patientId: isUserExist.id } },
// //         include: {
// //             appointment: {
// //                 include: {
// //                     doctor: {
// //                         select: {
// //                             firstName: true,
// //                             lastName: true,
// //                             designation: true
// //                         }
// //                     }
// //                 }
// //             }
// //         }
// //     });
// //     return result;
// // }
// // const getDoctorInvoices = async (user: any): Promise<Payment[] | null> => {
// //     const { userId } = user;
// //     const isUserExist = await prisma.doctor.findUnique({
// //         where: { id: userId }
// //     })
// //     if (!isUserExist) {
// //         throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!')
// //     }
// //     const result = await prisma.payment.findMany({
// //         where: { appointment: { doctorId: isUserExist.id } },
// //         include: {
// //             appointment: {
// //                 include: {
// //                     patient: {
// //                         select: {
// //                             firstName: true,
// //                             lastName: true
// //                         }
// //                     }
// //                 }
// //             }
// //         }
// //     });
// //     return result;
// }

// const deleteAppointment = async (id: string): Promise<any> => {
//     // const result = await prisma.appointments.delete({
//     //     where: {
//     //         id: id
//     //     }
//     // });
//     // return result;
// }

// const updateAppointment = async (id: string, payload: Partial<Appointments>): Promise<Appointments> => {
//     // const result = await prisma.appointments.update({
//     //     data: payload,
//     //     where: {
//     //         id: id
//     //     }
//     // })
//     // return result;
// }

//doctor Side
const getDoctorAppointmentsById = async (user: any, filter: any): Promise<any | null> => {
   

    const { userId } = user;
    const isDoctor = await Doctor.findById(userId);
    console.log(isDoctor);
    console.log(userId);
    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!');
    }
    
    let andCondition: { [key: string]: any } = { doctorId: userId };

    if (filter.sortBy === 'today') {
        const today = moment().startOf('day').toDate();
        const tomorrow = moment(today).add(1, 'days').toDate();
    
        andCondition.scheduleDate = {
            $gte: today,
            $lt: tomorrow,
        };
    }
    
    if (filter.sortBy === 'upcoming') {
        const upcomingDate = moment().startOf('day').add(1, 'days').toDate();
        andCondition.scheduleDate = {
            $gte: upcomingDate,
        };
    }
    
    const whereConditions: { [key: string]: any } = andCondition;
    
    const result = await Appointment.find(andCondition)
    .populate('patientId');
    // .populate({
    //     path: 'prescription',
    //     select: { id: true }
    // });
        console.log(result);
        return result;
}

const getDoctorPatients = async (user: any): Promise<any[]> => {
    const { userId } = user;
    
    // Check if the user is a doctor
    const isDoctor = await Doctor.findById(userId);
    
    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!');
    }

    // Find appointments for the doctor and extract distinct patient IDs
    const appointments = await Appointment.find({ doctorId: userId });
    
    // Extract patient IDs from the appointments
    const patientIds = appointments.map(appointment => appointment.patientId);

    // Find distinct patients based on the extracted IDs
    const patientList = await Patient.find({ _id: { $in: patientIds } });
    return patientList;
}

// const updateAppointmentByDoctor = async (user: any, payload: Partial<Appointments>): Promise<any | null> => {
//     // const { userId } = user;
//     // const isDoctor = await prisma.doctor.findUnique({
//     //     where: {
//     //         id: userId
//     //     }
//     // })
//     // if (!isDoctor) {
//     //     throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!')
//     // }
//     // const result = await prisma.appointments.update({
//     //     where: {
//     //         id: payload.id
//     //     },
//     //     data: payload
//     // })
//     // return result;
// }

export const AppointmentService = {
    createAppointment,
    getAllAppointments,
    // getAppointment,
    // deleteAppointment,
    // updateAppointment,
    getPatientAppointmentById,
    getDoctorAppointmentsById,
    // updateAppointmentByDoctor,
    getDoctorPatients,
    // getPaymentInfoViaAppintmentId,
    // getPatientPaymentInfo,
    // getDoctorInvoices,
    // createAppointmentByUnAuthenticateUser,
    // getAppointmentByTrackingId
}