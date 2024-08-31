import httpStatus from "http-status";
import ApiError from "../../../errors/apiError";
import Doctor from "../doctor/doctor.model";
import ScheduleDay ,{ IScheduleDay } from "../../models/scheduledday.model";
import DoctorTimeSlot, { IDoctorTimeSlot } from "./doctorTimeSlot.model";
import moment from "moment";

const createTimeSlot = async (user: any, payload: any): Promise<any | null> => {
    const { userId } = user;

    // Check if docter exist
    const isDoctor = await Doctor.findOne({
            _id: userId  
    })
    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!')
    }

        const isAlreadyExist = await DoctorTimeSlot.findOne({
                doctorId: isDoctor.id,
                day: payload.day
        })
        if(isAlreadyExist){
            throw new ApiError(404, 'Time Slot Already Exist Please update or try another day')
        }

        // First, create ScheduleDay documents
        const scheduleDays = await ScheduleDay.insertMany(
            payload.timeSlot.map((slot: any) => ({
              startTime: slot.startTime,
              endTime: slot.endTime
            }))
          );

          // Extract the IDs of the created ScheduleDay documents
          const timeSlotIds = scheduleDays.map(day => day._id);

           // Then, create the DoctorTimeSlot document
            const createTimeSlot = await DoctorTimeSlot.create({
         
                day: payload.day,
                doctorId: isDoctor._id,
                maximumPatient: payload?.maximumPatient,
                weekDay: payload?.weekDay,
                timeSlot:timeSlotIds
        });

        return createTimeSlot;   
}

const deleteTimeSlot = async (id: string): Promise<any | null> => {
    // const result = await DoctorTimeSlot.delete({
    //     where: {
    //         id: id
    //     }
    // })
    // return result;
}

const getTimeSlot = async (id: string): Promise<any | null> => {
    const result = await DoctorTimeSlot.findOne({
            _id: id
    })
    return result;
}

const getMyTimeSlot = async (user: { userId: string }, filter: { day?: string }): Promise<any[] | null> => {
    const { userId } = user;

    // Find the doctor by userId
    const isDoctor = await Doctor.findById(userId);
    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!');
    }

    // Create query condition
    const queryCondition: any = { doctorId: isDoctor._id };
    if (filter.day) {
        queryCondition.day = filter.day;
    }

    // Fetch DoctorTimeSlot documents with the specified conditions
    const result = await DoctorTimeSlot.find(queryCondition)
        .populate('timeSlot') // Populate the timeSlot field
        .populate('doctorId', 'firstName lastName'); // Populate the doctorId field with specific fields

    return result;
};

const getAllTimeSlot = async (): Promise<any[] | null> => {
    const result = await DoctorTimeSlot.find({
        include: {
            timeSlot: true,
            doctor: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    })
    return result;

//     const timeSlots: IDoctorTimeSlot[] = await DoctorTimeSlot.find({})
//     .populate({
//         path: 'timeSlot',
//         model: 'ScheduleDay', // Populate the timeSlot field with ScheduleDay documents
//         select: 'startTime endTime' // Select fields from ScheduleDay
//     })
//     .exec();
// return timeSlots;
}
// const updateTimeSlot = async (user: any, id: string, payload: any): Promise<{ message: string }> => {
    // const { userId } = user;
    // const isDoctor = await Doctor.findOne({
    //         id: userId
    // })
    // if (!isDoctor) {
    //     throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!')
    // }
    // const { timeSlot, create } = payload;

    // if (create && create.length > 0) {
    //     const doctorTimeSlot = await DoctorTimeSlot.findOne({
    //             day: create[0].day
    //     })
    //     if (!doctorTimeSlot) {
    //         throw new ApiError(httpStatus.NOT_FOUND, 'Time Slot is not found !!')
    //     }
    //     await Promise.all(create.map(async (item: ScheduleDay) => {
    //         try {
    //             await prisma.scheduleDay.create({
    //                     startTime: item.startTime,
    //                     endTime: item.endTime,
    //                     doctorTimeSlotId: doctorTimeSlot?.id
    //             })
    //         } catch (error) {
    //             throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Failed to create')
    //         }
    //     }))
    // }

    // if (timeSlot && timeSlot.length > 0) {
    //     await Promise.all(timeSlot.map(async (item: ScheduleDay) => {
    //         const { doctorTimeSlotId, ...others } = item;
    //         try {
    //             await prisma.scheduleDay.updateMany({
    //                 where: { id: others.id },
    //                 data: {
    //                     startTime: others.startTime,
    //                     endTime: others.endTime
    //                 }
    //             })
    //         } catch (error) {
    //             throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Failed to Update')
    //         }
    //     }))
    // }
    // return {
    //     message: 'Successfully Updated'
    // }
// }
const getAppointmentTimeOfEachDoctor = async ( doctorId: string, filter: any): Promise<any[]> => {
    try {
        // Fetch the doctor's time slots
        const doctorTimeSlots = await DoctorTimeSlot.find({ doctorId })
            .populate({
                path: 'timeSlot',
                model: 'ScheduleDay', // Populate the timeSlot field with ScheduleDay documents
                select: 'startTime endTime' // Select fields from ScheduleDay
            })
            .exec();

        // Map and extract the necessary data
        const allSlots = doctorTimeSlots.map((item) => {
            const { day, timeSlot } = item;
            return { day, timeSlot };
        });

        // Function to generate time slots
        const generateTimeSlot = (timeSlots: any[]): any[] => {
            const selectedTime: any[] = [];
            timeSlots.forEach((item) => {
                const interval = 30; // Interval in minutes
                const newTimeSlots: any[] = [];
                const day: string = item?.day;

                item?.timeSlot.forEach((slot: IScheduleDay) => {
                    const { startTime, endTime } = slot;
                    const startDate = moment(startTime, 'hh:mm a');
                    const endDate = moment(endTime, 'hh:mm a');

                    while (startDate < endDate) {
                        const selectableTime = {
                            id: newTimeSlots.length + 1,
                            time: startDate.format('hh:mm a')
                        };
                        newTimeSlots.push({ day: day, slot: selectableTime });
                        startDate.add(interval, 'minutes');
                    }
                });

                if (filter.day) {
                    const newTime = newTimeSlots.filter((item) => item.day === filter.day);
                    selectedTime.push(newTime);
                } else {
                    selectedTime.push(newTimeSlots);
                }
            });
            return selectedTime.flat();
        };

        // Generate and return the time slots
        const result = generateTimeSlot(allSlots);
        return result;
    } catch (error) {
        console.error('Error fetching appointment time slots for doctor:', error);
        return [];
    }
};


export const TimeSlotService = {
    // updateTimeSlot,
    getAllTimeSlot,
    getTimeSlot,
    createTimeSlot,
    deleteTimeSlot,
    getMyTimeSlot,
    getAppointmentTimeOfEachDoctor
}