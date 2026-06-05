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
}

export interface ICommentRepository {
    findManyByPostId(postId: string): Promise<CommentRecord[]>
    createForPost(postId: string, data: CreateCommentDto): Promise<CommentRecord>
}
