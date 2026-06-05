import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/shared/prisma.service"

@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.postsRepository.findAll()
    }

    findById(id: string) {
        return this.postsRepository.findById(id)
    }

    async getFeedPosts(categoryId?: string) {
        const posts = await this.postsRepository.findManyWithRelations(categoryId)

        return posts.map((post: PostWithRelations) => ({
            id: post.id,
            title: post.title,
            description: post.description,
            imageUrl: post.imageUrl,
            categoryId: post.categoryId,
            category: post.category?.name ?? null,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            likesCount: post.likes.reduce((sum, l) => sum + l.weight, 0),
            commentsCount: post.comments.length,
            relevanceScore: 0,
        }))
    }
}
