export type CreatePostData = {
    title: string
    description: string
    imageUrl: string
    categoryId?: string
}

export type PostEntity = {
    id: string
    title: string
    description: string
    imageUrl: string
    categoryId: string | null
    createdAt: Date
    updatedAt: Date
}

export abstract class PostRepository {
    abstract create(data: CreatePostData): Promise<PostEntity>
    abstract findById(id: string): Promise<PostEntity | null>
}
