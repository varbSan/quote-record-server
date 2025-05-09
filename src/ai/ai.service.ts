import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import fetch from 'node-fetch'
import { Ollama } from 'ollama'
import { StorageService } from 'storage/storage.service'
import { User } from 'user/user.entity'
import { GenerationResponse } from './types'

@Injectable()
export class AiService {
  constructor(
    private readonly configService: ConfigService,
    private readonly storageService: StorageService,
  ) {
    this.ollama = new Ollama({ host: this.configService.get<string>('OLLAMA_SERVER_URL') })
  }

  private ollama: Ollama

  async createQuoteImagePrompt(quoteText: string): Promise<string> {
    const systemPrompt = `
      You are a creative assistant generating prompts for an AI image generation model (Stable Diffusion by Stability.ai).
      
      Instructions:
      1. Create an inspiring, imaginative image generation prompt based on the quote below.
      2. The prompt must help the AI visualize the quote. Use rich, visual metaphors or scenes inspired by the quote.
      3. All elements in the prompt must connect meaningfully to the quote's themes or imagery.
      4. Avoid unnecessary stylistic or descriptive filler—optimize for how AI interprets visual cues.
      5. Output must be a single prompt (300–500 characters) with no intro, outro, or explanation. Just the text prompt itself. Nothing more.
      
      Quote:
      ---
      ${quoteText}
      ---
    `
    try {
      const response = await this.ollama.chat({
        model: 'gemma3:1b',
        messages: [{ role: 'system', content: systemPrompt }],
      })

      return response.message?.content?.trim() || ''
    }
    catch (error) {
      console.error('Error generating image prompt:', error)
      throw new Error('❗ Failed to generate image prompt. ❗')
    }
  }

  async createQuoteImage(dto: {
    user: User
    quoteId: number
    prompt: string
    contentType: string
  }): Promise<string> {
    const engineId = 'stable-diffusion-xl-1024-v1-0'
    const apiHost = this.configService.get<string>('API_HOST') ?? 'https://api.stability.ai'
    const apiKey = this.configService.get<string>('STABILITY_API_KEY')

    if (!apiKey)
      throw new Error('Missing Stability API key.')

    const response = await fetch(
      `${apiHost}/v1/generation/${engineId}/text-to-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: dto.prompt,
            },
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 30,
          samples: 1,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Non-200 response: ${await response.text()}`)
    }

    const responseJSON = (await response.json()) as GenerationResponse

    const uploadPromises = responseJSON.artifacts.map((image, index) => {
      return this.storageService.uploadImage({
        bucketKey: `user-${dto.user.id}_quote-${dto.quoteId}_${index}`,
        image,
        contentType: 'image/png',
      })
    })

    // TODO: make stability.ai return only 1 artifact so we have just 1 image url from the get go. (might be solved in newer models)
    const imageUrls = await Promise.all(uploadPromises)
    return imageUrls[0]
  }
}
