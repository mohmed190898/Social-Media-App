import mongoose from "mongoose";

export interface IPost {
    content: string,
    attachments?: string[],
    createdBy:mongoose.Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date,
}