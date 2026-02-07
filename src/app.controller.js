import express from "express";
import { checkConncetionDB } from "./DB/connectionDB.js";
import { userRouter } from "./modules/users/user.controller.js";
import { noteRouter } from "./modules/notes/note.controller.js";



const app = express(); 
const port = 3000 ; 


const bootstrap = () => { 
    checkConncetionDB(); 

    app.use(express.json());
    app.use("/users",userRouter);
    app.use("/notes",noteRouter);

    

    app.get("/", (req,res)=>{
    res.status(200).send("Let's start our Ass8 ");
    });

    app.use("{/*demo}",(req,res)=>{
        res.status(404).send(`This page ${res.originalUrl} Not found`);
    });

    app.listen(port,()=>{
        console.log(`Server is running on ${port}`);
    });
};



export default bootstrap ; 