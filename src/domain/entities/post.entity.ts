export type Post = {
    id: string
    title: string
    description: string
    imageUrl: string
    categoryId?: string | null
    createdAt: Date
    updatedAt: Date
}

export type FeedPost = Post & {
    category: string | null
    likesCount: number
    commentsCount: number
    relevanceScore: number
}

export type RawFeedPost = Post & {
    category: string | null
    likes: Array<{ weight: number }>
    comments: Array<{ id: string }>
}
