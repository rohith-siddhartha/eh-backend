import {Request, Response} from 'express';
import { getPackageById, getPackages, getTimeSlots, handleLoginRequest, login } from './handlerService';
import { env } from 'process';
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const ExpiryMap = require("expiry-map");

const server = express();
server.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));
server.use(bodyParser.json());


// OTP Memory
export const otpMap = new ExpiryMap(120000, []);




export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rohith.dev.test@gmail.com',
      pass: process.env.MAILPASS
    }
  });

// movie API
server.get('/packages',(req:Request,res:Response)=>{
    getPackages(req,res);
})

server.get('/package/:packageId',(req:Request,res:Response)=>{
    getPackageById(req,res);
})

server.get('/timeslots',(req:Request,res:Response)=>{
    getTimeSlots(req,res);
})

server.post('/loginrequest',(req:Request,res:Response)=>{
    handleLoginRequest(req,res);
})

server.post('/login',(req:Request,res:Response)=>{
    login(req,res);
})


server.listen(process.env.PORT,()=>{
    console.log("server started");
});