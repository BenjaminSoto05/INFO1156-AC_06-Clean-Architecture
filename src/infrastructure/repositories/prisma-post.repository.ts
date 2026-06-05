import { Injectable } from "@nestjs/common"

import {
    IPostRepository,
    PostRecord,
    PostWithRelations,
} from "@/domain/repositories/post.repository"
import { CreatePostDto } from "@/posts/posts.dtos"
import { Post, RawFeedPost } from "@/domain/entities/post.entity"
import { PostRepository } from "@/domain/repositories/post.repository"

@Injectable()
export class PrismaPostRepository implements IPostRepository {
    constructor(private readonly prisma: PrismaService) {}

    create(data: CreatePostDto): Promise<PostRecord> {
        return this.prisma.post.create({ data })
    }

    findAll(): Promise<PostRecord[]> {
        return this.prisma.post.findMany({
            orderBy: { createdAt: "desc" },
        })
    }

    findById(id: string): Promise<PostRecord | null> {
        return this.prisma.post.findUnique({ where: { id } })
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
            category: post.category?.name ?? null,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            likes: post.likes.map((like) => ({ weight: like.weight })),
            comments: post.comments.map((comment) => ({ id: comment.id })),
        }))
    }

    private toDomain(post: PrismaPost): Post {
        return {
            id: post.id,
            title: post.title,
            description: post.description,
            imageUrl: post.imageUrl,
            categoryId: post.categoryId ?? null,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        }
    }
}

