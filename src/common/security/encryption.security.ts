
import crypto from "node:crypto"
import { ENC_KEY, IV_LENGTH } from "../../config.js"

export const encryption = async (plaintext: string): Promise<string> => {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, iv)
    let encryptData = cipher.update(plaintext, "utf-8", "hex")
    encryptData += cipher.final("hex")
    return `${iv.toString("hex")}::${encryptData}`
}

export const decryption = async (ciphertext: string): Promise<string> => {
    const [iv, encryptData] = ciphertext.split("::") as [string | Buffer, string]
    const iv_vector = Buffer.from(iv as string, "hex")

    const decipherVector = crypto.createDecipheriv("aes-256-cbc", ENC_KEY, iv_vector)
    let plaintext = decipherVector.update(encryptData, "hex", "utf-8")

    plaintext += decipherVector.final("utf-8")
    return plaintext;
}
// npm i jsonwebtoken