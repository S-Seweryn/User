import { Injectable } from '@nestjs/common'
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'node:crypto'
import { getConfig } from 'lib/config'
import { Image } from './types'

@Injectable()
export class ImageService {
    private readonly s3Client: S3Client
    private readonly bucketName: string
    private readonly expiresIn: number

    constructor() {
        const { bucketName, region, expiresIn } = getConfig().awsS3Config

        this.s3Client = new S3Client({ region })
        this.bucketName = bucketName
        this.expiresIn = expiresIn
    }

    async uploadImage(imageBase64: string) {
        const imageBuff = Buffer.from(imageBase64, 'base64')
        const imageKey = randomUUID()

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: imageKey,
                ContentType: 'image',
                ContentEncoding: 'base64',
                Body: imageBuff
            })
        )

        return imageKey
    }

    deleteImage(imageKey: string, bucketName: string) {
        return this.s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: imageKey }))
    }

    async prepareImage<T extends Image>(product: T) {
        const { imageKey, ...rest } = product
        const imageUrl = await this.getUrl(imageKey, this.bucketName)

        return {
            ...rest,
            imageUrl
        }
    }

    private getUrl(imageKey: string, bucketName: string) {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: imageKey
        })

        return getSignedUrl(this.s3Client, command, { expiresIn: this.expiresIn })
    }
}
