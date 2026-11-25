import { Types } from "mongoose";
import { IAttachment } from "./attachment.interface";

export interface IComment {
    content: string;
    createdBy: Types.ObjectId;
    postId: Types.ObjectId;
    attachments?: IAttachment[];
    likes?: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}