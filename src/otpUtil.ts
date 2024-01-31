import { userIdType } from "@prisma/client";
import { transporter } from ".";

export function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function sendOtp(userId:String, idType:userIdType, otp:String) {

    try{
        if(idType===userIdType.EMAIL){
            await sendOTPToEmail(userId,otp);
        }else if(idType===userIdType.MOBILE){
            // sendOTPToMobile(userId,otp);
            throw new Error("Couldn't send OTP");
        }
    }catch(error){
        throw new Error("Couldn't send OTP");
    }

}

async function sendOTPToEmail(userId:String, otp:String){
    var mailOptions = {
        from: 'rohith.dev.test@gmail.com',
        to: userId,
        subject: 'Eldo Health | OTP for login',
        text: `PLease use this ${otp} to login to your Eldo Health account`
      };

    await transporter.sendMail(mailOptions, function(error:any, info:any){
        if (error) {
            throw new Error("Couldn't send OTP");
        }
      });
}