import { User } from "@prisma/client";

var jwt = require('jsonwebtoken');

export function signToken(user:any){
    return jwt.sign(user, 'secret', { expiresIn: 60 * 60 * 60 });
}

export function verifyToken(token:any){
    try{
        return jwt.verify(token, 'secret');
    }catch(error){
        throw new Error("jwt invalid");
    }
}