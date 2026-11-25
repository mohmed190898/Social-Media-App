import multer from "multer"
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { fileTypeFromBuffer } from 'file-type'
import { BadException } from "../../exception"
import { Request } from "express"
import { StorageApproachEnum } from "../../enum"
import { tmpdir } from "node:os"
export const fileValidation = {
    image: ['image/jpeg', 'image/png', 'image/gif'],
    files: ['applictaion/pdf', 'applictaion/json']
}
export const localFileUpload = ({ maxSize = 5, storageApproach = StorageApproachEnum.MEMORY }: { maxSize?: number, storageApproach: StorageApproachEnum }) => {
    const storage = storageApproach == StorageApproachEnum.MEMORY ? multer.memoryStorage() : multer.diskStorage({
        destination(req, file, callback) {
            callback(null, tmpdir())
        }, filename(req, file, callback) {
            callback(null, randomUUID() + file.originalname)
        }
    })
    return multer({ storage, limits: { fileSize: maxSize * 1024 * 1024 } })
}

export const processFile = async ({ customPath = "general", file, validation }:
    { customPath?: string, file: Express.Multer.File, validation: string[] }) => {
    if (file.path) {
        file.buffer = await readFile(file.path);
    }
    const result = await fileTypeFromBuffer(file.buffer)
    if (!result || !validation.includes(result.mime)) {
        await unlink(file.path);
        throw new BadException("Invalid File Format")
    } else {
        await mkdir(resolve(`./assets/${customPath}`), { recursive: true })
        const uniqeFilePath = `assets/${customPath}/${randomUUID()}.${result.ext}`
        await writeFile(resolve(`./${uniqeFilePath}`), file.buffer)
        file.path = uniqeFilePath
        return file
    }
}

export const processFiles = async ({ customPath = "general", files, validation }:
    { customPath?: string, files: Express.Multer.File[], validation: string[] }) => {
    const assets = []
    for (const file of files) {
        const uploadFile = await processFile({ customPath, file, validation })
        assets.push(uploadFile)
    }
    return assets
}

export const processFields = async ({ customPath = "general", fields, validation }:
    { customPath?: string, fields: Record<string, Express.Multer.File[]>, validation: string[] }) => {
    const assets = []
    for (const field of Object.keys(fields)) {
        const files = await processFiles({ files: fields[field] as Express.Multer.File[], validation, customPath })
        assets.push({ field, files })

    }
    return assets
}
export const processMulterUpload = async ({ req, customPath = "general", isRequired = true, validation = [] }: {
    req: Request, customPath?: string, isRequired?: boolean, validation: string[]
}) => {
    if (
        isRequired &&
        (
            !req.file
            &&
            !(Array.isArray(req.files) && req.files?.length)
            &&
            !(typeof req.files == "object" && Object.keys(req.files))
        )
    ) {
        throw new BadException("File is required")
    }
    if (req.file) {
        await processFile({ customPath, file: req.file, validation })
    }
    else if (Array.isArray(req.files)) {
        await processFiles({ customPath, files: req.files, validation })
    }
    else if (typeof req.files == "object" && Object.keys(req.files ?? {})?.length) {
        await processFields({ fields: req.files as Record<string, Express.Multer.File[]>, customPath, validation })
    }
}




































// export const processFile = ({ validation = [] }) => {
//     const filePath = resolve(`./ ${ req.file.path }`)
//     const readFileBuffer = await readFile(filePath);
//     const fileType = await fileTypeFromBuffer(readFileBuffer)
//     if (!fileType || !validation.includes(fileType.mimeType)) {
//         await unlink(filePath)
//         next(new Error("Invalid Format ", cause: { status: 400 }))
//     }
//     next();
// }