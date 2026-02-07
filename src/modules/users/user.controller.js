import { Router } from "express"; 
import { deleteUser, getUser, login, signup, updateUser } from "./user.service.js";
import { auth } from "../middlewares/token.js";


export const userRouter = Router (); 

userRouter.post("/signup",signup);
userRouter.post("/login",login);
userRouter.patch("/",auth, updateUser);
userRouter.delete("/", auth, deleteUser);
userRouter.get("/", auth, getUser);



