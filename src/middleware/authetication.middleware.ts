import { NextFunction, Request, Response } from 'express';
import { RoleEnum, TokenTypeEnum } from '../common/enum';
import { tokenService } from '../common/service/token.service';
import { BadException, ForbiedenException, UnAuthorizedException } from '../common/exception';


export const bearerAuth = async ({ req, tokenType = TokenTypeEnum.ACCESS }: {
    req: Request, tokenType: TokenTypeEnum
}) => {
    const [key, credential] = req.headers["authorization"]?.split(" ") || []

    const { user, payload } = await tokenService.decodeToken({ token: credential as string, tokenType: tokenType })
    req.user = user;
    req.payload = payload
}

export const authentication = (tokenType = TokenTypeEnum.ACCESS) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { authorization } = req.headers;
        if (!authorization) throw new UnAuthorizedException("Unauthorized Account")

        const [prefix, token] = (authorization.split(" ")) as [string, string]

        switch (prefix) {
            case "Bearer":
                await bearerAuth({ req, tokenType })
                break;
            case "Basic":
                const [email, password] = Buffer.from(token, 'base64').toString()?.split(":") as [string, string]
                req.user = await tokenService.basicAuth({ email, password })
                break;
            default:
                throw new BadException("Invalid authentication approach ")
        }
        const { user, payload } = await tokenService.decodeToken({ token, tokenType });
        req.user = user
        req.payload = payload
        next()
    }
}

// export const authorization = (accessRole:RoleEnum)=>{
//     return async (req:Request,res:Response,next:NextFunction)=>{
//         if(req.user.role<accessRole){
//             throw new ForbiedenException("Not Allowed")
//         }
//         next()
//     }
// }