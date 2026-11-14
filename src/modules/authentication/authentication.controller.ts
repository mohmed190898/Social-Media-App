import { type NextFunction, type Request, type Response, Router } from "express";
const router = Router({ strict: true, caseSensitive: true });
import authService from "./authentication.service"
import { responseFormatter } from "../../middleware/response.middleware";
import { IResponse, IUser } from "../../common/interface";
import * as validators from "./authentication.validation"
import { validation } from "../../middleware/validation.middleware";
router.post("/signup",
    validation(validators.signupSchema)
    , responseFormatter(
        async (req: Request, res: Response, next: NextFunction): Promise<IResponse<IUser>> => {
            const data = await authService.signup(req.validate.body);
            return { status: 201, data }
        }
    ))
router.patch("/confirm-email", validation(validators.confirmEmail),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            await authService.confirmEmail(req.validate.body)

        }
    ))
router.patch("/resend-confirm-email", validation(validators.resendConfirmEmail),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            await authService.resendConfirmEmail(req.validate.body)
        }
    ))


export default router