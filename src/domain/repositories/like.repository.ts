export type CreateLikeData = {
    postId: string
    reactionType: string
    weight: number
    source: string
}

export type LikeEntity = {
    id: string
    postId: string
    reactionType: string
    weight: number
    source: string
    createdAt: Date
}

export abstract class LikeRepository {
    abstract create(data: CreateLikeData): Promise<LikeEntity>
}
