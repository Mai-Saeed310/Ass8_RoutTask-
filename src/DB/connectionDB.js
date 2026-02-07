import mongoose from 'mongoose';



export const checkConncetionDB = async () => {
  try {

    await mongoose.connect("mongodb://localhost:27017/myAss8");
    console.log("Connection has been established successfully.");


  } catch (error) {
    console.error("Unable to connect to the server:", error);
  }
};


