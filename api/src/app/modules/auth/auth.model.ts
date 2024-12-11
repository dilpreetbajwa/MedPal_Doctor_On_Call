import { Schema, model } from "mongoose";
import { IAuth } from "./auth.interface";

const authSchema = new Schema(
  {
    userId: { type: String },
    email: { type: String },
    role: { type: String }, // add enum [0,1]
    password: { type: String },
    authType: { type: String, required: false }, // add enum  [0,1,2]
  },
  { timestamps: true }
);

// creating the model
const AuthUser = model<IAuth>("AuthUser", authSchema);

export default AuthUser;
