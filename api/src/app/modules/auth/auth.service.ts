import bcrypt from "bcrypt";
// import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/apiError";
import httpStatus from "http-status";
import { JwtHelper } from "../../../helpers/jwtHelper";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import moment from "moment";
import { EmailtTransporter } from "../../../helpers/emailTransporter";
const { v4: uuidv4 } = require("uuid");
import * as path from "path";
import Doctor from "../doctor/doctor.model";
import Patient from "../patient/patient.model";
import AuthUser from "../auth/auth.model";
import ForgotPassword from "../../models/forgotpassword.model";
import admin from "../../../helpers/firebase";

type ILginResponse = {
  accessToken?: string;
  user: {};
};

const loginUser = async (user: any): Promise<ILginResponse> => {
  const { email, password } = user;
  console.log(email);
  const isUserExist = await AuthUser.findOne({
    email: user.email,
  });
  console.log(isUserExist?.password);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User is not Exist !");
  }
  // check Verified doctor or not
  if (isUserExist.role === "doctor") {
    const getDoctorInfo = await Doctor.findOne({
      email: isUserExist.email,
    });
    if (getDoctorInfo && getDoctorInfo?.verified === false) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Please Verify Your Email First !"
      );
    }
  }
  const isPasswordMatched = await bcrypt.compare(
    user.password,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.NOT_FOUND, "Password is not Matched !");
  }
  const { role, userId } = isUserExist;

  const accessToken = JwtHelper.createToken(
    { role, userId },
    config.jwt.secret as Secret,
    config.jwt.JWT_EXPIRES_IN as string
  );
  console.log(accessToken);
  return { accessToken, user: { role, userId } };
};

const VerificationUser = async (user: any): Promise<ILginResponse> => {
  const { email: IEmail, password } = user;
  const isUserExist = await AuthUser.findOne({
    where: { email: IEmail },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User is not Exist !");
  }
  // const isPasswordMatched = await bcrypt.compare(password, isUserExist.password);

  // if (!isPasswordMatched) {
  //     throw new ApiError(httpStatus.NOT_FOUND, "Password is not Matched !");
  // }
  const { role, userId } = isUserExist;
  const accessToken = JwtHelper.createToken(
    { role, userId },
    config.jwt.secret as Secret,
    config.jwt.JWT_EXPIRES_IN as string
  );
  return { accessToken, user: { role, userId } };
};

const socialLogin = async (
  idToken: string,
  currentAuthType: string
): Promise<ILginResponse> => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Social login function: decodedToken -> ", decodedToken);
    const { name, email, uid } = decodedToken;

    let existingUser = await AuthUser.findOne({ email });

    if (existingUser) {
      console.log("USers exist in the database", existingUser);
      const { role, userId, authType } = existingUser;

      if (role === "doctor") {
        const getDoctorInfo = await Doctor.findOne({
          email: email,
        });
        if (getDoctorInfo && getDoctorInfo?.verified === false) {
          throw new ApiError(
            httpStatus.NOT_FOUND,
            "Please Verify Your Email First !"
          );
        }
      } else {
        const getPatientInfo = await Patient.findOne({
          email: email,
        });

        if (!getPatientInfo) {
          throw new ApiError(
            httpStatus.NOT_FOUND,
            "patient doesnt not Exist !"
          );
        }
      }

      if (authType != currentAuthType) {
        existingUser.authType = currentAuthType;
        await existingUser.save();
      }

      const accessToken = JwtHelper.createToken(
        { role, userId },
        config.jwt.secret as Secret,
        config.jwt.JWT_EXPIRES_IN as string
      );

      return { accessToken, user: { role, userId } };
    } else {
      //  redirect to a page to ask whether the user is patient or doctor
      //  create authUSser
      //  create patient or doctor
      //  return jwt token

      //  user doesnt exist
      return { user: {} };
      // throw new ApiError(httpStatus.NOT_FOUND, "User is not Exist !");
    }
  } catch (error) {
    console.error(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error logging in user"
    );
  }
  //   1.  verify token
  //   2.   get user data from token
  //   name , email,
  //   3.  check if user exists in db
  // in doctor and patient table
  //   4. if user exists, return user data
  //   5. if user does not exist, create user in db and return user data
  // redirect to a page or pop up to a page and then automatically closes where i will ask user whether you want to be a doctor or patient and then i will create users in db
  //   6. return user data
  //   7. catch error and return error message
  //   //    to avoid error. I have to remove it
  /* 
  {
  user: {
    name: 'ANITH CHERIAN JOY',
    picture: 'https://lh3.googleusercontent.com/a/ACg8ocIQ6ldq00sPiKZAAjVSMEC8437lvB6YgvXAdcxQcQkAAydRQ3nt=s96-c',
    iss: 'https://securetoken.google.com/fir-project-e47ae',
    aud: 'fir-project-e47ae',
    auth_time: 1731026135,
    user_id: 'SlWLoUDDYeh1SS6KXIByDEHtL743',
    sub: 'SlWLoUDDYeh1SS6KXIByDEHtL743',
    iat: 1731026135,
    exp: 1731029735,
    email: 'anithjoy1@gmail.com',
    email_verified: true,
    firebase: { identities: [Object], sign_in_provider: 'google.com' },
    uid: 'SlWLoUDDYeh1SS6KXIByDEHtL743'
  }
  }
  */
};

//  create new social login
const createSocialLogin = async (body: any): Promise<ILginResponse> => {
  console.log("auth.service body -> ", body);
  const token = body.token;
  const role = body.role;
  const authType = body.authType;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { name, email, uid } = decodedToken;
    let userId = null;

    let existingUser = await AuthUser.findOne({ email });

    if (existingUser) {
      throw new ApiError(httpStatus.NOT_FOUND, "User is already Existing !");
    } else {
      const names = name.trim().split(" ");
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(" ") || "";
      if (role === "doctor") {
        const doctor = await Doctor.create({
          firstName: firstName,
          lastName: lastName,
          email: email,
        });

        userId = doctor.id;
        await AuthUser.create({
          email: doctor.email,
          password: "firebaseUser",
          role: "doctor",
          userId: doctor.id,
          authType: authType,
        });
      } else {
        const patient = await Patient.create({
          firstName: firstName,
          lastName: lastName,
          email: email,
        });
        userId = patient.id;
        await AuthUser.create({
          email: patient.email,
          password: "firebaseUser",
          role: "patient",
          userId: patient.id,
          authType: authType,
        });
      }

      //  redirect to a page to ask whether the user is patient or doctor
      //  create authUSser
      //  create patient or doctor
      //  return jwt token

      const accessToken = JwtHelper.createToken(
        { role, userId },
        config.jwt.secret as Secret,
        config.jwt.JWT_EXPIRES_IN as string
      );

      return { accessToken, user: { role, userId } };
    }
  } catch (error) {
    console.error(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error logging in user"
    );
  }
};

const changePassword = async (payload: any): Promise<{ message: string }> => {
  const { id, newPassword } = payload;

  // Check if the user exists
  const user = await AuthUser.findOne({ userId: id });
  console.log(user);

  if (!user) {
    return { message: "User not found" };
  }

  // Update the user's password
  try {
    user.password = bcrypt.hashSync(newPassword, 12); // Ensure you hash the password before saving; // Ensure you hash the password before saving
    await user.save();

    return { message: "Password changed successfully" };
  } catch (error) {
    console.error(error);
    return { message: "Error changing password" };
  }
};

const resetPassword = async (payload: any): Promise<{ message: string }> => {
  const { email } = payload;
  const isUserExist = await AuthUser.findOne({ email: email });
  // if (!isUserExist) {
  //     throw new ApiError(httpStatus.NOT_FOUND, "User is not Exist !");
  // }
  // const clientUrl = `${config.clientUrl}/reset-password/`
  // const uniqueString = uuidv4() + isUserExist.id;
  // const uniqueStringHashed = await bcrypt.hashSync(uniqueString, 12);
  // const encodedUniqueStringHashed = uniqueStringHashed.replace(/\//g, '-');

  // const resetLink = clientUrl + isUserExist.id + '/' + encodedUniqueStringHashed;
  // const currentTime = moment();
  // const expiresTime = moment(currentTime).add(4, 'hours');

  // await prisma.$transaction(async (tx) => {
  //     //Check if the forgotPassword record exists before attempting reset
  //     const existingForgotPassword = await tx.forgotPassword.findUnique({
  //         where: { id: isUserExist.id }
  //     });
  //     if (existingForgotPassword) {
  //         await tx.forgotPassword.delete({
  //             where: { id: isUserExist.id }
  //         })
  //     }

  //     const forgotPassword = await tx.forgotPassword.create({
  //         data: {
  //             userId: isUserExist.id,
  //             expiresAt: expiresTime.toDate(),
  //             uniqueString: resetLink
  //         }
  //     });

  //     if (forgotPassword) {
  //         const pathName = path.join(__dirname, '../../../../template/resetPassword.html')
  //         const obj = {
  //             link: resetLink
  //         };
  //         const subject = "Request to Reset Password";
  //         const toMail = isUserExist.email;
  //         try {
  //             await EmailtTransporter({ pathName, replacementObj: obj, toMail, subject })
  //         } catch (error) {
  //             console.log("Error reset password email", error);
  //             throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Unable to send reset email!")
  //         }
  //     }
  //     return forgotPassword;
  // });

  return {
    message: "Password Reset Successfully !!",
  };
};

const PassworResetConfirm = async (payload: any): Promise<any> => {
  const { userId, uniqueString, password } = payload;

  // await prisma.$transaction(async (tx) => {
  //     const isUserExist = await tx.auth.findUnique({
  //         where: { id: userId }
  //     });

  //     if (!isUserExist) { throw new ApiError(httpStatus.NOT_FOUND, "User is not Exist !") };
  //     const resetLink = `${config.clientUrl}/reset-password/${isUserExist.id}/${uniqueString}`
  //     const getForgotRequest = await tx.forgotPassword.findFirst({
  //         where: {
  //             userId: userId as string,
  //             uniqueString: resetLink
  //         }
  //     })
  //     if (!getForgotRequest) { throw new ApiError(httpStatus.NOT_FOUND, "Forgot Request was not found or Invalid !") };

  //     const expiresAt = moment(getForgotRequest.expiresAt);
  //     const currentTime = moment();
  //     if (expiresAt.isBefore(currentTime)) {
  //         throw new ApiError(httpStatus.NOT_FOUND, "Forgot Request has been expired !")
  //     } else {
  //         await tx.auth.update({
  //             where: {
  //                 id: userId
  //             },
  //             data: {
  //                 password: password && await bcrypt.hashSync(password, 12)
  //             }
  //         });
  //         await ForgotPassword.delete({
  //             where: {
  //                 id: getForgotRequest.id
  //             }
  //         })
  //     }
  // });
  return {
    message: "Password Changed Successfully !!",
  };
};

export const AuthService = {
  loginUser,
  VerificationUser,
  socialLogin,
  createSocialLogin,
  resetPassword,
  PassworResetConfirm,
  changePassword,
};
