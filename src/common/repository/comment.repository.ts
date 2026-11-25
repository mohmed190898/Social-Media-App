import { CommentModel } from "../../DB/model";
import { IComment } from "../interface";
import { DatabaseRepository } from "./base.repository";

export class CommentRepository extends DatabaseRepository<IComment> {
    constructor() {
        super(CommentModel)
    }
}