import mongoose, { DeleteResult, FlattenMaps, QueryOptions, UpdateOneModel, UpdateWithAggregationPipeline, UpdateWriteOpResult } from "mongoose";
import { PopulateOptions } from "mongoose";
import { ProjectionType } from "mongoose";
import { AnyKeys, Model, CreateOptions, HydratedDocument, QueryFilter, MongooseUpdateQueryOptions } from "mongoose";
import { IPaginate } from "../interface";
import { UpdateQuery } from "mongoose";

export abstract class DatabaseRepository<TRawDocType> {
    constructor(protected model: Model<TRawDocType>) { }
    // Create
    async create({ data }: { data: AnyKeys<TRawDocType>; }): Promise<HydratedDocument<TRawDocType>>;
    async create({ data, options }: { data: AnyKeys<TRawDocType>[]; options?: CreateOptions }): Promise<HydratedDocument<TRawDocType>[]>;
    async create({ data, options }:
        { data: AnyKeys<TRawDocType> | AnyKeys<TRawDocType>[]; options?: CreateOptions }):
        Promise<HydratedDocument<TRawDocType> | HydratedDocument<TRawDocType>[]> {
        return await this.model.create(data as any, options)
    };
    async createOne({ data, options = {} }:
        {
            data: AnyKeys<TRawDocType>;
            options?: CreateOptions
        }): Promise<HydratedDocument<TRawDocType>> {
        const [doc] = await this.create({ data: [data], options })
        return doc as HydratedDocument<TRawDocType>
    }
    // Finders

    async findOne({
        filter,
        projection,
        options
    }: {
        filter: QueryFilter<TRawDocType>,
        projection?: ProjectionType<TRawDocType> | null | undefined,
        options?: QueryOptions<TRawDocType> & { lean?: false } | null | undefined
    }): Promise<HydratedDocument<TRawDocType> | undefined | null>

    async findOne({
        filter,
        projection,
        options
    }: {
        filter: QueryFilter<TRawDocType>,
        projection?: ProjectionType<TRawDocType> | null | undefined,
        options?: QueryOptions<TRawDocType> & { lean: true } | null | undefined
    }): Promise<FlattenMaps<TRawDocType> | undefined | null>

    async findOne({
        filter = {},
        projection,
        options
    }: {
        filter: QueryFilter<TRawDocType>,
        projection?: ProjectionType<TRawDocType> | null | undefined,
        options?: QueryOptions<TRawDocType> & { lean?: boolean } | null | undefined
    }): Promise<HydratedDocument<TRawDocType> | FlattenMaps<TRawDocType> | undefined | null> {
        const doc = this.model.findOne(filter, projection)
        if (options?.populate) {
            doc.populate(options.populate as PopulateOptions[])
        }
        if (options?.lean) {
            doc.lean(options.lean)
        }
        return await doc.exec();
    }

    // FIND BY ID

    async findById({
        id,
        projection,
        options
    }: {
        id: mongoose.Types.ObjectId,
        projection?: ProjectionType<TRawDocType> | null | undefined,
        options?: QueryOptions<TRawDocType> & { lean?: false } | null | undefined
    }): Promise<HydratedDocument<TRawDocType> | undefined | null>

    async findById({
        id,
        projection,
        options
    }: {
        id: mongoose.Types.ObjectId,
        projection?: ProjectionType<TRawDocType> | null | undefined,
        options?: QueryOptions<TRawDocType> & { lean: true } | null | undefined
    }): Promise<FlattenMaps<TRawDocType> | undefined | null>

    async findById({
        id,
        projection,
        options
    }: {
        id: mongoose.Types.ObjectId,
        projection?: ProjectionType<TRawDocType> | null | undefined,
        options?: QueryOptions<TRawDocType> & { lean?: boolean } | null | undefined
    }): Promise<HydratedDocument<TRawDocType> | FlattenMaps<TRawDocType> | undefined | null> {
        const doc = this.model.findById(id, projection)
        if (options?.populate) {
            doc.populate(options.populate as PopulateOptions[])
        }
        if (options?.lean) {
            doc.lean(options.lean)
        }
        return await doc.exec();
    }

    // FIND

    async find({
        filter,
        options,
    }: {
        filter?: QueryFilter<TRawDocType>,
        projection?: ProjectionType<TRawDocType> | null | undefined,
        options?: QueryOptions<TRawDocType>
    }): Promise<HydratedDocument<TRawDocType>[]> {
        const doc = this.model.find(filter);
        if (options?.populate) {
            doc.populate(options.populate as PopulateOptions[]);
        }
        if (options?.sort) {
            doc.sort(options.sort);
        }
        if (options?.skip) {
            doc.skip(options.skip);
        }

        if (options?.limit) {
            doc.limit(options.limit);
        }

        if (options?.lean) {
            doc.lean(options.lean);
        }
        return await doc.exec();
    }

    async paginate({
        filter,
        options,
        page = 1,
        limit = 5
    }: {
        filter: QueryFilter<TRawDocType>,
        projection?: ProjectionType<TRawDocType> | null | undefined,
        options?: QueryOptions<TRawDocType> & { lean?: false } | null | undefined,
        page: number,
        limit: number,

    }): Promise<IPaginate<HydratedDocument<TRawDocType>>> {
        const skip = (page - 1) * limit
        const count = await this.countDocument({ filter })
        const pages = Math.ceil(count / limit)
        const docs = await this.find({
            filter,
            options: {
                ...options,
                skip,
                limit
            }
        })
        return { count, pages, currentPgae: page, limit, docs };
    }

    async countDocument({
        filter,
    }: {
        filter?: QueryFilter<TRawDocType>,
    }): Promise<number> {
        return await this.model.countDocuments(filter);
    }
    // UPDATE
    // async update({}:{}):Return Type{}
    async updateOne(
        {
            filter, update, options
        }: {
            filter: QueryFilter<TRawDocType>,
            update: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline,
            options?: MongooseUpdateQueryOptions<TRawDocType> | null
        }
    ): Promise<UpdateWriteOpResult> {
        return await this.model.updateOne(filter, update, options)
    }
    async updateMany(
        {
            filter, update, options
        }: {
            filter: QueryFilter<TRawDocType>,
            update: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline,
            options?: MongooseUpdateQueryOptions<TRawDocType> | null
        }
    ): Promise<UpdateWriteOpResult> {
        return await this.model.updateMany(filter, update, options)
    }
    async findOneAndUpdate(
        {
            filter, update, options
        }: {
            filter?: QueryFilter<TRawDocType>,
            update?: UpdateQuery<TRawDocType>,
            options?: QueryOptions<TRawDocType> | null
        }
    ): Promise<HydratedDocument<TRawDocType> | null> {
        return await this.model.findOneAndUpdate(filter, update, {
            returnDocument: 'after',
            ...options
        })
    }
    async findByIdAndUpdate(
        {
            id, update, options
        }: {
            id: mongoose.Types.ObjectId,
            update?: UpdateQuery<TRawDocType>,
            options?: QueryOptions<TRawDocType> | null
        }
    ): Promise<HydratedDocument<TRawDocType> | null> {
        return await this.model.findByIdAndUpdate(id, update, {
            returnDocument: 'after',
            ...options
        })
    }

    // DELETE
    async deleteOne(
        {
            filter
        }: {
            filter: QueryFilter<TRawDocType>
        }
    ): Promise<DeleteResult> {
        return await this.model.deleteOne(filter)
    }

    async deleteMany(
        {
            filter
        }: {
            filter: QueryFilter<TRawDocType>
        }
    ): Promise<DeleteResult> {
        return await this.model.deleteMany(filter)
    }
    async findOneAndDelete(
        {
            filter
        }: {
            filter?: QueryFilter<TRawDocType>
        }
    ): Promise<HydratedDocument<TRawDocType> | null> {
        return await this.model.findOneAndUpdate(filter)
    }
    async findByIdAndDelete(
        {
            id
        }: {
            id: mongoose.Types.ObjectId
        }
    ): Promise<HydratedDocument<TRawDocType> | null> {
        return await this.model.findByIdAndDelete(id)
    }
}

