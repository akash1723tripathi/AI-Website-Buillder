import { Request, Response, NextFunction } from "express"; // ✅ Add NextFunction
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

// ✅ Add next parameter with NextFunction type
export const protect = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const session = await auth.api.getSession({
                  headers: fromNodeHeaders(req.headers)
            })

            if (!session || !session?.user) {
                  return res.status(401).json({ message: "Unauthorized" })
            }

            req.UserId = session.user.id;
            next(); // ✅ Now this will work

      } catch (error: any) {
            console.log(error);
            res.status(401).json({ message: error.code || error.message })
      }
}