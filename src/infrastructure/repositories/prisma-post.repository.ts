import { Injectable } from "@nestjs/common"
import {
    CreatePostData,
    PostEntity,
    PostRepository,
} from "@/domain/repositories/post.repository"
import { RawFeedPost } from "@/domain/entities/post.entity"
import { PrismaService } from "@/shared/prisma.service"

@Injectable()
export class PrismaPostRepository extends PostRepository {
    constructor(private readonly prisma: PrismaService) {
        super()
    }

    async create(data: CreatePostData): Promise<PostEntity> {
        return this.prisma.post.create({ data })
    }

    async findById(id: string): Promise<PostEntity | null> {
        return this.prisma.post.findUnique({ where: { id } })
    }

    async findAll(): Promise<PostEntity[]> {
        return this.prisma.post.findMany({
            orderBy: { createdAt: "desc" },
        })
    }

    async findFeedItems(categoryId?: string): Promise<RawFeedPost[]> {
        const posts = await this.prisma.post.findMany({
            where: categoryId ? { categoryId } : undefined,
            include: { comments: true, likes: true, category: true },
        })

        return posts.map((post) => ({
            id: post.id,
            title: post.title,
            description: post.description,
            imageUrl: post.imageUrl,
            categoryId: post.categoryId,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            category: post.category?.name ?? null,
            likes: post.likes.map((l) => ({ weight: l.weight })),
            comments: post.comments.map((c) => ({ id: c.id })),
        }))
    }
}
