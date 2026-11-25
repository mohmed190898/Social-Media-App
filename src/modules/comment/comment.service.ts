import mongoose, { mongo, UpdateQuery } from 'mongoose';
import { BadException, NotFoundException, UnAuthorizedException } from '../../common/exception';
import { CommentRepository, PostRepository } from '../../common/repository';
import { createCommentDto } from './dto/comment.dto';
import { IComment } from '../../common/interface';

export class CommentService {
    private readonly commentRepository: CommentRepository
    private readonly postRepository: PostRepository
    constructor() {
        this.commentRepository = new CommentRepository();
        this.postRepository = new PostRepository();
    }
    async createNewComment(postId: string, data: createCommentDto, userId: mongoose.Types.ObjectId) {
        const postExist = await this.postRepository.findById({
            id: new mongoose.Types.ObjectId(postId)
        })
        if (!postExist) {
            throw new NotFoundException("Post not found");
        }
        if(!data.content?.trim() && !data.attachments?.length){
            throw new BadException("Comment must contain content or attachments")
        }
        return await this.commentRepository.createOne({
            data: {
                ...data,
                createdBy: userId,
                postId: new mongoose.Types.ObjectId(postId) 
            }
        })
    }
    async getAllComments(userId: mongoose.Types.ObjectId) {

        const comments = await this.commentRepository.find({
            filter: { createdBy: userId }
        })
        return comments;
    }

    async getCommentById(commentId: string, userId: mongoose.Types.ObjectId) {
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            throw new BadException("Invalid comment ID");
        }
        const comment = await this.commentRepository.findOne({
            filter: {
                createdBy: userId,
                _id: new mongoose.Types.ObjectId(commentId)
            }
        })
        console.log({ userId, commentId })
        console.log({ comment })
        if (!comment) {
            throw new UnAuthorizedException("comment not found or you aren't authorized to do this request")
        }
        return comment;
    }
    async deleteCommentById(commentId: string, userId: mongoose.Types.ObjectId) {
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            throw new BadException("Invalid comment ID");
        }
        const comment = await this.commentRepository.findOneAndDelete({
            filter: {
                createdBy: userId,
                _id: new mongoose.Types.ObjectId(commentId)
            }
        })
        console.log(`delted comment ${comment}`)
        if (!comment) {
            throw new NotFoundException("comment not found")
        }
        return comment;
    }
    async updateComment(updateData: UpdateQuery<IComment>, commentId: string, userId: mongoose.Types.ObjectId) {
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            throw new BadException("Invalid comment ID");
        }
        const comment = await this.commentRepository.findOneAndUpdate({
            filter: {
                createdBy: userId,
                _id: new mongoose.Types.ObjectId(commentId)
            },
            update: {
                $set: updateData
            }
        })
        if (!comment) {
            throw new NotFoundException("comment not found")
        }
        return comment;
    }
}
export const commentService = new CommentService();


/*
Implement the following endpoints:
•	Create comment: Authenticated users can create a new comment.
•	Get All comments: Retrieve all comments created by the logged-in user.
•	Get Single comment: a specific comment by Retrieve its ID.
•	Update comment: Only the comment owner can update their comment.
•	Delete comment: Only the comment owner can delete their comment.

*/