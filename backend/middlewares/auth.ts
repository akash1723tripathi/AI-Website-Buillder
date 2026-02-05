import { Request, Response } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const protect = async(req:Request,res:Response)=>{
      try {
            const session = await auth.api.getSession({
                  headers:fromNodeHeaders(req.headers)
            })

            if(!session || !session?.user){
                  return res.status(401).json({message:"Unauthorized"})
            }

            req.UserId = session.user.id;
            // next();

      } catch (error:any) { 
            console.log(error);
            res.status(401).json({message: error.code || error.message })
      }
}