export type QuoteImageBucketKey = `user-${number}_quote-${number}_${number}`
export type FileBucketKey = `user-${number}_filename-${string}_${number}`
export type BucketKey = QuoteImageBucketKey | FileBucketKey
