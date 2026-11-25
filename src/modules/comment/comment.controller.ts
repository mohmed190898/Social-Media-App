import { commentService } from './comment.service';
import { NextFunction, Request, Response, Router } from "express";
import { authentication, responseFormatter } from "../../middleware";

const router = Router();


router.post("/create-new-comment/:postId", authentication(), responseFormatter(
    async (req: Request, res: Response, next: NextFunction) => {
        const { postId } = req.params;
        if (typeof postId !== "string") {
            throw new Error("Invalid comment Id")
        }
        const data = await commentService.createNewComment(postId, req.body, req.user._id);
        return { data };
    }
))
router.get("/get-all-comments", authentication(),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction) => {
            const data = await commentService.getAllComments(req.user._id);
            return { data };
        }
    ))
router.get("/get-comment-ById/:commentId", authentication(),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction) => {
            const { commentId } = req.params;
            if (typeof commentId !== "string") {
                throw new Error("Invalid comment Id")
            }
            const data = await commentService.getCommentById(commentId, req.user._id);
            return { data };
        }
    ))
router.delete("/delete-comment-ById/:commentId", authentication(),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction) => {
            const { commentId } = req.params;
            if (typeof commentId !== "string") {
                throw new Error("Invalid comment Id")
            }
            const data = await commentService.deleteCommentById(commentId, req.user._id);
            return { data };
        }
    ))
router.patch("/update-comment-ById/:commentId", authentication(),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction) => {
            const { commentId } = req.params;
            if (typeof commentId !== "string") {
                throw new Error("Invalid comment Id")
            }
            const data = await commentService.updateComment(req.body, commentId, req.user._id);
            return { data };
        }
    ))


export default router