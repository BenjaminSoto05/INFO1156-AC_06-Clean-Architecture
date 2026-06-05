import { CreatePostDto } from "@/posts/posts.dtos"
import { Post, RawFeedPost } from "@/domain/entities/post.entity"

export abstract class PostRepository {
    abstract create(data: CreatePostDto): Promise<Post>
    abstract findAll(): Promise<Post[]>
    abstract findById(id: string): Promise<Post | null>
    abstract findFeedItems(categoryId?: string): Promise<RawFeedPost[]>
}

