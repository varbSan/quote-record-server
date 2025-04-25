import { CORSRule, PutBucketCorsCommand, S3Client } from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config'
import { Command, CommandRunner } from 'nest-commander'

@Command({
  name: 'bucket:set-cors',
  description: 'Set CORS on the object storage bucket',
})
export class SetCorsBucketCommand extends CommandRunner {
  constructor(
    private readonly configService: ConfigService
  ) { super() }

  async run(): Promise<void> {
    const client = new S3Client({
      region: 'eu-central-1',
      endpoint: 'https://nbg1.your-objectstorage.com',
      credentials: {
        accessKeyId: this.configService.get<string>('BUCKET_ACCESS_KEY')!,
        secretAccessKey: this.configService.get<string>('BUCKET_SECRET_KEY')!,
      },
      forcePathStyle: true,
    })

    const corsRules: CORSRule[] = [
      {
        AllowedHeaders: ['*'],
        AllowedMethods: ['PUT', 'GET', 'POST'],
        AllowedOrigins: [this.configService.get<string>('CLIENT_URL')!],
        ExposeHeaders: [],
        MaxAgeSeconds: 3000,
      },
    ]

    try {
      await client.send(new PutBucketCorsCommand({
        Bucket: this.configService.get<string>('BUCKET_NAME')!,
        CORSConfiguration: { CORSRules: corsRules },
      }))
      // eslint-disable-next-line no-console
      console.log(`✅ Bucket CORS has been set for ${this.configService.get<string>('BUCKET_NAME')}!`)
    }
    catch (err) {
      // eslint-disable-next-line ts/no-unsafe-argument
      throw new Error(err)
    }
  }
}
