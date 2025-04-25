import * as process from 'node:process'
import {
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'

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

  async getPresignedUrl(filename: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: filename,
      ContentType: contentType,
    })

    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 })
    return url
  }

  // Helper method to parse the markdown content
  parseMarkdownFile(content: string): string[] {
    // Split the content by double line breaks (\n{2,}), which signifies a new quote
    const quotes = content.split(/\n{2,}/).map(quote => quote.trim())

    // Filter out empty quotes if any exist
    return quotes.filter(quote => quote.length > 0)
  }
}
