import { PrismaClient, Package, TimeSlot, User } from "@prisma/client";
import {Request, Response} from 'express'
import { generateOTP, sendOtp } from "./otpUtil";
import { otpMap, transporter } from ".";
import { signToken } from "./jwtUtil";
const prisma = new PrismaClient();

export async function getPackages(req:Request,res:Response){
    try{
        const packages:Package[] = await prisma.package.findMany({});
        res.status(200).json(packages);
    }catch(error){
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function getPackageById(req:Request,res:Response){
    try{
        const packageId = req.params.packageId;
        const pkg:Package | null = await prisma.package.findUnique({
            where: {
                id: packageId
            }
        });
        if(!pkg){
            res.status(200).json("Cannot Find package");
            return;
        }
        res.status(200).json(pkg);
    }catch(error){
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function getTimeSlots(req:Request,res:Response){
    try{
        const timeSlots:TimeSlot[] = await prisma.timeSlot.findMany({});
        res.status(200).json(timeSlots);
    }catch(error){
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function handleLoginRequest(req:Request,res:Response){
    try{
        const body = req.body;
        let user:User | null = await prisma.user.findUnique({
            where:{
                id:body.userId
            }
        })

        if(!user){
            user = await prisma.user.create({
                data:req.body
            })
        }

        const otp = generateOTP();
        otpMap.set(user.userId,otp);

        try{
            await sendOtp(user.userId,user.idType,otp);
            res.status(200).json({firstLogin:true});
        }catch(error){
            res.status(500).json({ error: 'Internal Server Error' });
        }
        
    }catch(error){
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function login(req:Request,res:Response){
    try{
        const body = req.body;
        if(!body || !body.userId || !body.otp){
            res.status(400).send("Invalid payload");
            return;
        }
    
        const sentOTP = otpMap.get(body.userId);
    
        if(!sentOTP){
            res.status(400).send("OTP Expired");
            return;
        }
    
        if(sentOTP === body.otp) {
            otpMap.delete(body.userId);
            const token = signToken({"userId":body.userId});

            res.cookie("token",token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
            res.send({message:"login successful"});
        }else{
            res.status(400).send("error invalid otp");
            return;
        }
        
    }catch(error){
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}