import { Inject, Injectable } from "@nestjs/common"
import {
    IPostRepository,
    PostWithRelations,
} from "@/domain/repositories/post.repository"
import { CreatePostDto } from "@/posts/posts.dtos"
import { ModerationService } from "@/moderation/moderation.service"

@Injectable()
export class PostsService {
    constructor(
        @Inject("POST_REPOSITORY")
        private readonly postsRepository: IPostRepository,
        private readonly moderationService: ModerationService,
    ) {}

    async create(data: CreatePostDto) {
        const text = `${data.title} ${data.description}`
        await this.moderationService.assertApprovedForPost(text)

        return await this.postsRepository.create(data)
    }

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
