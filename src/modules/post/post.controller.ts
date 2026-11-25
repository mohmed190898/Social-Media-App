import { postService } from './post.service';
import { NextFunction, Request, Response, Router } from "express";
import { authentication, responseFormatter } from "../../middleware";

const router = Router();


router.post("/create-new-post", authentication(), responseFormatter(
    async (req: Request, res: Response, next: NextFunction) => {
        const data = await postService.createNewPost(req.body, req.user._id);
        return { data };
    }
))
router.get("/get-all-posts", authentication(),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction) => {
            const data = await postService.getAllPosts(req.user._id);
            return { data };
        }
    ))
router.get("/get-post-ById/:postId", authentication(),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction) => {
            const { postId } = req.params;
            if (typeof postId !== "string") {
                throw new Error("Invalid post Id")
            }
            const data = await postService.getPostById(postId, req.user._id);
            return { data };
        }
    ))
router.delete("/delete-post-ById/:postId", authentication(),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction) => {
            const { postId } = req.params;
            if (typeof postId !== "string") {
                throw new Error("Invalid post Id")
            }
            const data = await postService.deletePostById(postId, req.user._id);
            return { data };
        }
    ))
router.patch("/update-post-ById/:postId", authentication(),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction) => {
            const { postId } = req.params;
            if (typeof postId !== "string") {
                throw new Error("Invalid post Id")
            }
            const data = await postService.updatePost(req.body,postId, req.user._id);
            return { data };
        }
    ))

// Implement the following endpoints:
// •	Create Post: Authenticated users can create a new post.
// •	Get All Posts: Retrieve all posts created by the logged-in user.
// •	Get Single Post: a specific post by Retrieve its ID.
// •	Update Post: Only the post owner can update their post.
// •	Delete Post: Only the post owner can delete their post.


export default router