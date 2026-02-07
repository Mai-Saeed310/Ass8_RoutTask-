import mongoose from "mongoose";
import { note } from "../../models/notes.model.js";



export const createNote = async (req, res) => {
  try {

    const userId = req.userId; 
    const { title, content } = req.body;

   const newNote  = await note.create({
      title,
      content,
      userId
    });
     res.status(201).json({
      message: "note created successfully",
      newNote 
    });

      } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updateNote = async (req, res) => {
  try {
    const userId = req.userId; 
    const {noteId} = req.params; 
    const { title, content } = req.body;

    // check note exists
    const noteExist = await note.findById(noteId);
    if (!noteExist) {
      return res.status(404).json({ message: "note not found" });
    }
     // check ownership
    if (noteExist.userId.toString() !== userId) {
      return res.status(403).json({ message: "you are not the owner" });
    }
    // update note
    const updatedNote = await note.findByIdAndUpdate(
      noteId,
      { title, content },
      { new: true }
    );

    res.status(200).json({message: "note updated successfully",note: updatedNote});


    } catch (error) {
    res.status(500).json({ error: error.message , stack: error.stack});
  }
}

export const replaceNote = async (req, res) => {
  try {
    const userId = req.userId; 
    const {noteId} = req.params; 
    const { title, content } = req.body;
   // check note exists
    const noteExist = await note.findById(noteId);
    if (!noteExist) {
      return res.status(404).json({ message: "note not found" });
    }
     // check ownership
    if (noteExist.userId.toString() !== userId) {
      return res.status(403).json({ message: "you are not the owner" });
    }
    // we need to replace the entire note 
    if (!title || !content) {
      return res.status(400).json({message: "title and content are required"});
    }
  // replace note
    const replacedNote = await note.findOneAndReplace(
      { _id: noteId },
      {
        title,
        content,
        userId
      },
      { new: true }
    );

    res.status(200).json({
      message: "note replaced successfully", note: replacedNote});

    } catch (error) {
    res.status(500).json({ error: error.message , stack: error.stack});
  }
}

export const updateTitle = async (req, res) => {
  try {
    const userId = req.userId; 
    const { title } = req.body;
  
    const result = await note.updateMany({userId},{title});
  
   // check note exists
    if (result.modifiedCount === 0 ) {
      return res.status(404).json({ message: "note not found" });
    }

      res.status(200).json({
      message: "all notes updated ",
      modifiedCount: result.modifiedCount
    });  

  } catch (error) {
    res.status(500).json({ error: error.message , stack: error.stack});
  }
}

export const deleteNote = async (req, res) => {
  try {
       const userId = req.userId; 
       const {noteId} = req.params; 
      // check note exists
      const noteExist = await note.findById(noteId);
      if (!noteExist) {
        return res.status(404).json({ message: "note not found" });
      }
      // check ownership
      if (noteExist.userId.toString() !== userId) {
        return res.status(403).json({ message: "you are not the owner" });
      }
      // delete note
      const deletedNote = await note.findByIdAndDelete(noteId);

      res.status(200).json({
        message: "note deleted successfully",
        note: deletedNote
      });

  } catch (error) {
    res.status(500).json({ error: error.message , stack: error.stack});
  }
}

export const paginateSort = async (req, res) => {
  try {
      const { page , limit  } = req.query;
      const userId = req.userId; 

      // validation
      if (!page || !limit) {
      return res.status(400).json({
        message: "page and limit are required"
      });
     }
      if (page < 1 || limit < 1) {
      return res.status(400).json({
        message: "page and limit must be greater than 0"
      });
    }
    const notes = await note.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // if use does not have note or the page does not contain any note 
    if (notes.length === 0) {
      return res.status(404).json({
        message: "no notes found"
      });
    }

    res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      count: notes.length,
      notes
    });

  } catch (error) {
    res.status(500).json({ error: error.message , stack: error.stack});
  }
}

export const getNotById = async (req, res) => {
  try {
 
       const userId = req.userId; 
       const {noteId} = req.params; 
      // check note exists
      const noteExist = await note.findById(noteId);
      if (!noteExist) {
        return res.status(404).json({ message: "note not found" });
      }
      // check ownership
      if (noteExist.userId.toString() !== userId) {
        return res.status(403).json({ message: "you are not the owner" });
      }
    res.status(200).json({
      note: noteExist
    });
  } catch (error) {
    res.status(500).json({ error: error.message , stack: error.stack});
  }
}

export const getNotBycontent = async (req, res) => {
  try {
        const userId = req.userId; 
        const {content} = req.query; 

      if (!content) {
      return res.status(400).json({ message: "content query is required" });
      }
       const noteExist = await note.findOne({ userId, content });

    if (!noteExist) {
          return res.status(404).json({ message: "note not found" });
        }

     res.status(200).json({note: noteExist});

  } catch (error) {
    res.status(500).json({ error: error.message , stack: error.stack});
  }
}

export const getNoteWithUser = async (req, res) => {
  try {
     
const userId = req.userId;

    const notes = await note.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } }, 
      {
        $lookup: {
          from: "users",             
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },         
      {
        $project: {
          title: 1,
          userId: 1,
          createdAt: 1,
          "user.email": 1             
        }
      }
    ]);

    if (!notes || notes.length === 0) {
      return res.status(404).json({ message: "no notes found" });
    }

    res.status(200).json({
      notes
    }); 


  } catch (error) {
    res.status(500).json({ error: error.message , stack: error.stack});
  }
}

export const getAggregate = async (req, res) => {
  try {
    const userId = req.userId;             
    const { title } = req.query;

    // build query object
    const query = { userId };
    if (title) {
       // search by title, case-insensitive
      query.title = { $regex: title, $options: "i" };
    }

    // get user notes
    const notes = await note.find(query)
      .select("-_id title content createdAt updatedAt")
      .populate({ path: "userId", select: "name email" });

    if (!notes || notes.length === 0) {
      return res.status(404).json({ message: "no notes found" });
    }

    res.status(200).json({
      notes
    });

  } catch (error) {
    res.status(500).json({ error: error.message , stack: error.stack});
  }
};

export const deleteAllNote = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await note.deleteMany({ userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "no notes found to delete" });
    }

    res.status(200).json({
      message: "all notes deleted successfully",
      deletedCount: result.deletedCount
    });

  } catch (error) {
    res.status(500).json({ error: error.message , stack: error.stack});
  }
};