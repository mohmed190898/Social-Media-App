import express from "express"
import { UserModel } from './model/user.model';
import mongoose from "mongoose";
import { DB_URI } from "../config.js";

export const bootstrap = async (app:express.Application, port:number) => {
    try {
        await mongoose.connect(DB_URI, { serverSelectionTimeoutMS: 30000 })
        await UserModel.syncIndexes();
        console.log(`DB Connected Successfully ..✔👍`);
        // await connectRedis()

        app.listen(port, () => console.log(`Running on port ${port}`))
    } catch (error) {
        console.log(error);
        console.log(`Failed To connect To DB ✖✖`);
    }
}