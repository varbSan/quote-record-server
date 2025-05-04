export interface ImageArtifact {
  base64: string
  seed: number
  finishReason: string
}

export interface GenerationResponse {
  artifacts: Array<ImageArtifact>
}
