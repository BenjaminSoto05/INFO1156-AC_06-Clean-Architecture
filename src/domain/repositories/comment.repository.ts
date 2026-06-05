export type CreateCommentData = {
    postId: string
    content: string
    source: string
}

export type CommentEntity = {
    id: string
    postId: string
    content: string
    source: string
    createdAt: Date
    updatedAt: Date
}

export abstract class CommentRepository {
    abstract create(data: CreateCommentData): Promise<CommentEntity>
    abstract findByPostId(postId: string): Promise<CommentEntity[]>
}
