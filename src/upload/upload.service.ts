import * as buffer from 'node:buffer'
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ImageArtifact } from 'ai/types'
import { User } from 'user/user.entity'
import { BucketKey, FileBucketKey, QuoteImageBucketKey } from './types'

@Injectable()
export class UploadService {
  private readonly s3: S3Client

  constructor(
    private readonly configService: ConfigService
  ) {
    this.s3 = new S3Client({
      region: 'eu-central',
      endpoint: this.configService.get<string>('BUCKET_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get<string>('BUCKET_ACCESS_KEY')!,
        secretAccessKey: this.configService.get<string>('BUCKET_SECRET_KEY')!,
      },
      forcePathStyle: true,
    })
  }

  async generatePresignedUrlUpload(bucketKey: BucketKey, contentType: string, expiresIn = 3600) {
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('BUCKET_NAME')!,
      Key: bucketKey,
      ContentType: contentType,
    })

    try {
      const signedUrl = await getSignedUrl(this.s3, command, { expiresIn })

      return signedUrl
    }
    catch (err) {
      console.error(err)
      throw new Error('❗ Getting signed url for put command did not work ❗')
    }
  }

  async generatePresignedUrlDownload(bucketKey: string, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.configService.get<string>('BUCKET_NAME')!,
      Key: bucketKey,
    })

    try {
      const signedUrl = await getSignedUrl(this.s3, command, { expiresIn })

      return signedUrl
    }
    catch (err) {
      console.error(err)
      throw new Error('❗ Getting signed url for get command did not work ❗')
    }
  }

  async getFileContent(user: User, fileName: string, index = 0): Promise<string | undefined> {
    const bucketKey: FileBucketKey = `user-${user.id}_filename-${encodeURIComponent(fileName)}_${index}`
    const command = new GetObjectCommand({
      Bucket: this.configService.get<string>('BUCKET_NAME')!,
      Key: bucketKey,
    })

    const response = await this.s3.send(command)

    return response.Body?.transformToString()
  }

  async uploadImage(dto: {
    image: ImageArtifact
    bucketKey: QuoteImageBucketKey
    contentType: string
  }) {
    try {
      const uploadUrl = await this.generatePresignedUrlUpload(dto.bucketKey, dto.contentType)
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': dto.contentType,
        },
        body: buffer.Buffer.from(dto.image.base64, 'base64'),
      })

      return this.generatePresignedUrlDownload(dto.bucketKey)
    }
    catch (err) {
      console.error(err)
      throw new Error('❗ Image upload did not work ❗')
    }
  }

  // Helper method to parse the markdown content
  parseMarkdownFile(content: string): string[] {
    // Split the content by double line breaks (\n{2,}), which signifies a new quote
    const quotes = content.split(/\n{2,}/).map(quote => quote.trim())

    // Filter out empty quotes if any exist
    return quotes.filter(quote => quote.length > 0)
  }
}
