import express from 'express';
import { globalErrorHandeling } from './middleware/error.middleware';
import { ORIGINS, PORT } from './config';
import { bootstrap } from './DB/connection.db';
import { sendEmail } from './common/utilis/email';
import { EmailSubjectEnum } from './common/enum';
import cors from "cors";
import { userController } from './modules/user';
import { postController } from './modules/post';
import { commentController } from './modules/comment';
import { authenticationController } from './modules/authentication';

var corsOptions = {
    origin: function (origin: string, callback: Function) {
        if (!ORIGINS.includes(origin)) {
            callback(new Error("Unathourized origin", { cause: { status: 401 } }), origin)
        } else {
            callback(null, ORIGINS)
        }
    }
}
const app = express();
app.use(cors(), express.json());
app.use("/assets", express.static("./assets"))

bootstrap(app, PORT);
app.all('/', async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction): Promise<express.Response> => {
    return res.status(200).json({ message: "done" })
})
app.use("/auth", authenticationController)
app.use("/user", userController)
app.use("/post", postController)
app.use("/comment", commentController)


app.use(globalErrorHandeling)