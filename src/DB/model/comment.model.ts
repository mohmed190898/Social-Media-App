import mongoose from "mongoose";
import { IComment } from "../../common/interface/comment.interface";
import { attachmentSchema } from "./attachment.model";
const commentSchema = new mongoose.Schema<IComment>({
    content: {
        type: String,
        minLength: 2,
        maxLength: 50000,
    },
    attachments: {
        type: [attachmentSchema],
        default: []
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: mongoose.Types.ObjectId,
        ref: "Post",
        required: true
    }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    autoIndex: true,
})

export const CommentModel = mongoose.models.comment || mongoose.model<IComment>("comment", commentSchema)