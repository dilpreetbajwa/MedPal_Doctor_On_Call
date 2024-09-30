import httpStatus from "http-status";
import ApiError from "../../../errors/apiError";
import Doctor from "../doctor/doctor.model";
import ScheduleDay, { IScheduleDay } from "../../models/scheduledday.model";
import DoctorTimeSlot, { IDoctorTimeSlot } from "./doctorTimeSlot.model";
import moment from "moment";

const createTimeSlot = async (user: any, payload: any): Promise<any | null> => {
  const { userId } = user;
  console.log("createTimeSlot", userId);
  // Check if docter exist
  const isDoctor = await Doctor.findOne({
    _id: userId,
  });
  if (!isDoctor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor Account is not found !!");
  }

  const isAlreadyExist = await DoctorTimeSlot.findOne({
    doctorId: isDoctor.id,
    day: payload.day,
  });
  if (isAlreadyExist) {
    throw new ApiError(
      404,
      "Time Slot Already Exist Please update or try another day"
    );
  }

  // First, create ScheduleDay documents
  const scheduleDays = await ScheduleDay.insertMany(
    payload.timeSlot.map((slot: any) => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
    }))
  );

  // Extract the IDs of the created ScheduleDay documents
  const timeSlotIds = scheduleDays.map((day) => day._id);

  // Then, create the DoctorTimeSlot document
  const createTimeSlot = await DoctorTimeSlot.create({
    day: payload.day,
    doctorId: isDoctor._id,
    maximumPatient: payload?.maximumPatient,
    weekDay: payload?.weekDay,
    timeSlot: timeSlotIds,
  });

  return createTimeSlot;
};

const deleteTimeSlot = async (id: string): Promise<any | null> => {
  // // changed delete to deleteOne
  // console.log("DOctortimeslot.serivce-> deleteTimeSlot-> running");
  // const result = await DoctorTimeSlot.deleteOne({
  //   where: {
  //     id: id,
  //   },
  // });
  // return result;
};

const getTimeSlot = async (id: string): Promise<any | null> => {
  const result = await DoctorTimeSlot.findOne({
    _id: id,
  });
  return result;
};

const getMyTimeSlot = async (
  user: { userId: string },
  filter: { day?: string }
): Promise<any[] | null> => {
  console.log("Controller.getMyTimeSlot", user, filter.day);
  const { userId } = user;

  // Find the doctor by userId
  const isDoctor = await Doctor.findById(userId);
  if (!isDoctor) {
    console.log("getMyTimeSlot -> isDoctor doctor not found", isDoctor);
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor Account is not found !!");
  }

  // Create query condition
  const queryCondition: any = { doctorId: isDoctor._id };
  if (filter.day) {
    queryCondition.day = filter.day;
  }

  // Fetch DoctorTimeSlot documents with the specified conditions
  const result = await DoctorTimeSlot.find(queryCondition)
    .populate("timeSlot") // Populate the timeSlot field
    .populate("doctorId", "firstName lastName"); // Populate the doctorId field with specific fields

  return result;
};

const getAllTimeSlot = async (): Promise<any[] | null> => {
  const result = await DoctorTimeSlot.find({
    include: {
      timeSlot: true,
      doctor: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  return result;

  //     const timeSlots: IDoctorTimeSlot[] = await DoctorTimeSlot.find({})
  //     .populate({
  //         path: 'timeSlot',
  //         model: 'ScheduleDay', // Populate the timeSlot field with ScheduleDay documents
  //         select: 'startTime endTime' // Select fields from ScheduleDay
  //     })
  //     .exec();
  // return timeSlots;
};

const updateTimeSlot = async (
  user: any,
  id: string,
  payload: any
  // ): Promise<any> => {
): Promise<{ message: string }> => {
  console.log("doctorTimeSlot.service.ts - updateTimeSlot", user, id, payload);

  //  validate input parameters - check user exist, id exist
  //  user - doctor
  const userId = user.userId;
  const isDoctor = await Doctor.findById(userId);
  if (!isDoctor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor Account is not found !!");
  }
  // id - doctorTimeSlots
  // find doctortimeslot by id
  const doctorTimeSlot = await DoctorTimeSlot.findById(id);
  if (!doctorTimeSlot) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Doctor Time Slot is not found !!"
    );
  }
  //  check if doctorTimeSlot belongs to user
  if (doctorTimeSlot.doctorId != userId) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Doctor Time Slot does not belong to you !!"
    );
  }

  //  operation for those timeSLot which is removed while updating
  const timeSlotIdsFromPayload = payload.timeSlot.map((slot: any) => slot._id);
  const timeSlotIdsFromDB = doctorTimeSlot.timeSlot.map(
    (slot: any) => slot._id
  );

  const timeSlotIdsToDelete = timeSlotIdsFromDB.filter(
    (slot: any) => !timeSlotIdsFromPayload.includes(slot)
  );

  for (const slotId of timeSlotIdsToDelete) {
    await ScheduleDay.findByIdAndDelete(slotId);

    await DoctorTimeSlot.findByIdAndUpdate(id, {
      $pull: { timeSlot: slotId },
    });
  }
  // travel through timeSlot(key) ids and check each startTime and endTime equal with payload
  const timeSlot = payload.timeSlot;
  for (const slot of timeSlot) {
    console.log("for looping through timeSlot", slot);
    let scheduledDay;
    try {
      scheduledDay = await ScheduleDay.findById(slot._id);
    } catch (error) {
      // console.log("Error of try-catch", error);
    }
    console.log("scheduledDay ->", typeof scheduledDay);
    if (scheduledDay == null) {
      console.log("scheduledDay is of object type");
      //  do some operations infuture based on how delete works
      //  create schedule day documents
      const createdDay = await ScheduleDay.create({
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
      console.log("createdDay", createdDay);
      await DoctorTimeSlot.findByIdAndUpdate(id, {
        $push: { timeSlot: createdDay._id },
      });

      // throw new ApiError(httpStatus.NOT_FOUND, "Schedule Day is not found !!");
    } else if (
      scheduledDay.startTime != slot.startTime ||
      scheduledDay.endTime != slot.endTime
    ) {
      await ScheduleDay.findByIdAndUpdate(slot._id, {
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
    }
  }

  // After deleting time slots, check if there are any time slots left
  const updatedDoctorTimeSlot = await DoctorTimeSlot.findById(id);
  if (updatedDoctorTimeSlot && updatedDoctorTimeSlot.timeSlot.length === 0) {
    // If no time slots left, delete the entire DoctorTimeSlot document
    await DoctorTimeSlot.findByIdAndDelete(id);
    // return { message: "Doctor Time Slot deleted because no time slots remain." };
  }
  return {
    message: "Successfully Updated",
  };
};

const getAppointmentTimeOfEachDoctor = async (
  doctorId: string,
  filter: any
): Promise<any[]> => {
  try {
    // Fetch the doctor's time slots
    const doctorTimeSlots = await DoctorTimeSlot.find({ doctorId })
      .populate({
        path: "timeSlot",
        model: "ScheduleDay", // Populate the timeSlot field with ScheduleDay documents
        select: "startTime endTime", // Select fields from ScheduleDay
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
          const startDate = moment(startTime, "hh:mm a");
          const endDate = moment(endTime, "hh:mm a");

          while (startDate < endDate) {
            const selectableTime = {
              id: newTimeSlots.length + 1,
              time: startDate.format("hh:mm a"),
            };
            newTimeSlots.push({ day: day, slot: selectableTime });
            startDate.add(interval, "minutes");
          }
        });

        if (filter.day) {
          const newTime = newTimeSlots.filter(
            (item) => item.day === filter.day
          );
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
    console.error("Error fetching appointment time slots for doctor:", error);
    return [];
  }
};

export const TimeSlotService = {
  updateTimeSlot,
  getAllTimeSlot,
  getTimeSlot,
  createTimeSlot,
  deleteTimeSlot,
  getMyTimeSlot,
  getAppointmentTimeOfEachDoctor,
};
