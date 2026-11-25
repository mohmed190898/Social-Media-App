import { NextFunction, Request, Response, Router } from "express";
import { authentication, responseFormatter, uploadMiddleWare } from "../../middleware";
import { StorageApproachEnum, TokenTypeEnum } from "../../common/enum";
import { userService } from "./user.service";
import { getISsuer } from "../../common/utilis";
import { fileValidation, localFileUpload } from "../../common/utilis/multer";
const router = Router({ caseSensitive: true, strict: true });

router.get("/", authentication(), responseFormatter(
    async (req: Request, res: Response, next: NextFunction) => {
        return { data: req.user }
    }
))
router.post("/rotate-token", authentication(TokenTypeEnum.REFRESH),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction) => {
            const data = await userService.rotateToken(req.payload, req.user, getISsuer(req))
            return data
        }
    ))
router.post("/logout", authentication(),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction) => {
            const data = await userService.logout(req.payload, req.user, req.body)
            return data
        }
    ))
router.patch("/profile-image",
    authentication(),
    uploadMiddleWare({
        multerMiddleWare: localFileUpload({storageApproach:StorageApproachEnum.DISK}).single("attachment"),
        validation: fileValidation.image,
        customPath: "User",
    }),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction) => {
            return { data: req.file }
        }
    )
)

export default router