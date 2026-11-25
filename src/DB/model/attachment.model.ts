import mongoose from "mongoose";
import { IAttachment } from "../../common/interface/attachment.interface";

export const attachmentSchema = new mongoose.Schema<IAttachment>({
    url: {
        type: String,
        required: true
    },
    public_id: String,
    fileType: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    }
}, { _id: false });