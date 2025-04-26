import * as process from 'node:process'
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'
import { User } from 'user/user.entity'

@Injectable()
export class UploadService {
  private readonly s3 = new S3Client({
    region: 'eu-central',
    endpoint: process.env.BUCKET_ENDPOINT,
    credentials: {
      accessKeyId: process.env.BUCKET_ACCESS_KEY!,
      secretAccessKey: process.env.BUCKET_SECRET_KEY!,
    },
    forcePathStyle: true,
  })

  async getPresignedUrl(user: User, filename: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: `${user.id}-${filename}`,
      ContentType: contentType,
    })

    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 })
    return url
  }

  async getFileContent(user: User, filename: string): Promise<string | undefined> {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: `${user.id}-${filename}`,
    })

    const response = await this.s3.send(command)

    return response.Body?.transformToString()
  }

  // Helper method to parse the markdown content
  parseMarkdownFile(content: string): string[] {
    // Split the content by double line breaks (\n{2,}), which signifies a new quote
    const quotes = content.split(/\n{2,}/).map(quote => quote.trim())

    // Filter out empty quotes if any exist
    return quotes.filter(quote => quote.length > 0)
  }
}
