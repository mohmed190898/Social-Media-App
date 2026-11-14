import { AnyKeys, CreateOptions, HydratedDocument } from "mongoose";
import { UserModel } from "../../DB/model";
import { IUser } from "../interface";
import { DatabaseRepository } from "./base.repository";

export class UserRepository extends DatabaseRepository<IUser> {
    constructor() {
        super(UserModel)
    }
    // async create({ data, options }:
    //     {
    //         data: AnyKeys<TRawDocument>;
    //         options?: CreateOptions
    //     }): Promise<HydratedDocument<TRawDocument>> {
    //     return await this.model.create(data);
    // }

}