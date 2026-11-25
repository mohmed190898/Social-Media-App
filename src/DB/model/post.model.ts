import mongoose from "mongoose";
import { IPost } from "../../common/interface";
const postSchema = new mongoose.Schema<IPost>({
    content: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50000,
    },
    attachments: [String],
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    autoIndex: true,
})

export const PostModel = mongoose.models.post || mongoose.model<IPost>("post", postSchema)