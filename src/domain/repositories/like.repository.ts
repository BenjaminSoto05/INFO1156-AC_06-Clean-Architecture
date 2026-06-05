import { AddLikeDto } from "@/posts/posts.dtos"

export type LikeRecord = {
    id: string
    postId: string
    reactionType: string
    weight: number
    source: string
    createdAt: Date
}

export interface ILikeRepository {
    createForPost(postId: string, data: AddLikeDto & { weight: number }): Promise<LikeRecord>
}
