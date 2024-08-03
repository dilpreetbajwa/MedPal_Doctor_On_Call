import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const createToken = (payload: {}, secret: Secret, expireTime: string) => {
    console.log(payload)
    return jwt.sign(payload, secret, {
        expiresIn: expireTime
    })
}

const verifyToken = (token: string, secret: Secret): JwtPayload => {
    return jwt.verify(token, secret) as JwtPayload
}

export const JwtHelper = {
    verifyToken,
    createToken
}