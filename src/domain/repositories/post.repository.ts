import { CreatePostDto } from "@/posts/posts.dtos"

export type PostRecord = {
    id: string
    title: string
    description: string
    imageUrl: string
    categoryId: string | null
    createdAt: Date
    updatedAt: Date
}

export type PostWithRelations = PostRecord & {
    category?: { name: string } | null
    comments: unknown[]
    likes: Array<{ weight: number }>
}

export interface IPostRepository {
    create(data: CreatePostDto): Promise<PostRecord>
    findAll(): Promise<PostRecord[]>
    findById(id: string): Promise<PostRecord | null>
    findManyWithRelations(categoryId?: string): Promise<PostWithRelations[]>
}
