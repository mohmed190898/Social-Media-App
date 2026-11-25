import { Request } from "express"

export const getISsuer =(req:Request)=>{
    return `${req.protocol}://${req.host}`
}