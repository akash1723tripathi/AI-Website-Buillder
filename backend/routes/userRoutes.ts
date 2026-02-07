import express from "express";
import { createUserProjects, getUserCredits, getUserProject, getUserProjects, purchaseCredits, togglePublish } from "../controllers/UserController.js";
import { protect } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.get('/credits',protect,getUserCredits)
userRouter.post('/project',protect,createUserProjects)
userRouter.get('/project/:projectId',protect,getUserProject)
userRouter.get('/projects',protect,getUserProjects)
userRouter.get('/publish-toggle/:projectId',protect,togglePublish)
userRouter.post('/purchase-credits',protect,purchaseCredits)

export default userRouter;