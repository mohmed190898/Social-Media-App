import mongoose, { mongo, UpdateQuery } from 'mongoose';
import { PostRepository } from './../../common/repository/post.repository';
import { createPostDto } from './dto/post.dto';
import { BadException, NotFoundException, UnAuthorizedException } from '../../common/exception';
import { IPost } from '../../common/interface';

export class PostService {
    private readonly postRepository: PostRepository
    constructor() {
        this.postRepository = new PostRepository();
    }
    async createNewPost(data: createPostDto, userId: mongoose.Types.ObjectId) {
        return await this.postRepository.createOne({
            data: {
                ...data,
                createdBy: userId
            }
        })
    }
    async getAllPosts(userId: mongoose.Types.ObjectId) {

        const posts = await this.postRepository.find({
            filter: { createdBy: userId }
        })
        return posts;
    }

    async getPostById(postId: string, userId: mongoose.Types.ObjectId) {
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            throw new BadException("Invalid Post ID");
        }
        const post = await this.postRepository.findOne({
            filter: {
                createdBy: userId,
                _id: new mongoose.Types.ObjectId(postId)
            }
        })
        console.log({ userId, postId })
        console.log({ post })
        if (!post) {
            throw new UnAuthorizedException("post not found or you aren't authorized to do this request")
        }
        return post;
    }
    async deletePostById(postId: string, userId: mongoose.Types.ObjectId) {
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            throw new BadException("Invalid Post ID");
        }
        const post = await this.postRepository.findOneAndDelete({
            filter: {
                createdBy: userId,
                _id: new mongoose.Types.ObjectId(postId)
            }
        })
        console.log(`delted post ${post}`)
        if (!post) {
            throw new NotFoundException("Post not found")
        }
        return post;
    }
    async updatePost(updateData: UpdateQuery<IPost>, postId: string, userId: mongoose.Types.ObjectId) {
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            throw new BadException("Invalid Post ID");
        }
        const post = await this.postRepository.findOneAndUpdate({
            filter: {
                createdBy: userId,
                _id: new mongoose.Types.ObjectId(postId)
            },
            update: {
                $set: updateData
            }
        })
        if (!post) {
            throw new NotFoundException("Post not found")
        }
        return post;
    }
}
export const postService = new PostService();


/*
Implement the following endpoints:
•	Create Post: Authenticated users can create a new post.
•	Get All Posts: Retrieve all posts created by the logged-in user.
•	Get Single Post: a specific post by Retrieve its ID.
•	Update Post: Only the post owner can update their post.
•	Delete Post: Only the post owner can delete their post.

*/