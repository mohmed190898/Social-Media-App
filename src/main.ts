import express from 'express';
import { authenticationController } from './modules/authentication/index';
import { globalErrorHandeling } from './middleware/error.middleware';
import { PORT } from './config';
import { bootstrap } from './DB/connection.db';
import { sendEmail } from './common/utilis/email';
import { EmailSubjectEnum } from './common/enum';
const app = express();
app.use(express.json());
bootstrap(app,PORT);
app.all('/', async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction): Promise<express.Response> => {
    return res.status(200).json({ message: "done" })
})
app.use("/auth",authenticationController)


app.use(globalErrorHandeling)