import { Router } from "express"; 
import { auth } from "../middlewares/token.js";
import { createNote, deleteAllNote, deleteNote, getAggregate, getNotBycontent, getNotById, getNoteWithUser, 
paginateSort, replaceNote, updateNote, updateTitle } from "./note.service.js";


export const noteRouter = Router (); 

noteRouter.post("/",auth,createNote);
noteRouter.patch("/all",auth,updateTitle);
noteRouter.patch("/:noteId",auth,updateNote);
noteRouter.put("/replace/:noteId",auth,replaceNote);
noteRouter.delete("/:noteId",auth,deleteNote);
noteRouter.get("/paginate-sort",auth,paginateSort);
noteRouter.get("/note-by-content",auth,getNotBycontent);
noteRouter.get("/note-with-user", auth, getNoteWithUser);
noteRouter.get("/aggregate", auth, getAggregate);
noteRouter.delete("/", auth, deleteAllNote);
noteRouter.get("/:noteId",auth,getNotById);
