import { NextFunction, Request, Response } from "express";
import ApiError from "../../errors/apiError";
import { JwtHelper } from "../../helpers/jwtHelper";
import config from "../../config";
import { Secret } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: any; // Adjust 'any' to a more specific type if needed
        }
    }
}
   
export const auth = (...rules: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        console.log(token);
        if (!token) {
            throw new ApiError(404, "Token is not Found !!")
        }
        let verifiedUser;
        try {
            verifiedUser = await JwtHelper.verifyToken(token, config.jwt.secret as Secret);
            
        } catch (error) {
            throw new ApiError(403, "User is not Found !!")
        }
          req.user = verifiedUser;
          console.log(req.user);

        if (rules.length && !rules.includes(verifiedUser.role)) {
            throw new ApiError(403, "You are not Authorised !!")
        }
        next();
    } catch (error) {
        next(error)
    }
}