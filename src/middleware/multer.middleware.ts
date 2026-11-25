import { NextFunction, Request, RequestHandler, Response } from "express"
import { BadException } from "../common/exception"
import { processMulterUpload } from "../common/utilis/multer"

export const uploadMiddleWare = ({
    multerMiddleWare,
    isRequired = true, customPath = "general", validation = []
}: {
    multerMiddleWare: RequestHandler, isRequired?: boolean, customPath: string, validation: string[]
}) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        multerMiddleWare(req, res, async (error) => {
            if (error) {
                next(new Error(error.message, { cause: { status: 400 } }))
                return
            }
            if (isRequired
                && (
                    !req.file &&
                    !(Array.isArray(req.files) && req.files.length) &&
                    !(typeof req.files == "object" && Object.keys(req.files)?.length)
                )) {
                next(new BadException(`file is required`))
                return;
            }
            try {
                await processMulterUpload({ isRequired, customPath, validation, req })
                next()
            } catch (error) {
                throw error
            }
        })
    }
}