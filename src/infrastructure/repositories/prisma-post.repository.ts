import { Injectable } from "@nestjs/common"
import type { Post as PrismaPost } from "@prisma/client"
import { PrismaService } from "@/shared/prisma.service"
import { CreatePostDto } from "@/posts/posts.dtos"
import { Post, RawFeedPost } from "@/domain/entities/post.entity"
import { PostRepository } from "@/domain/repositories/post.repository"

@Injectable()
export class PrismaPostRepository implements PostRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreatePostDto): Promise<Post> {
        const post = await this.prisma.post.create({ data })
        return this.toDomain(post)
    }

    async findAll(): Promise<Post[]> {
        const posts = await this.prisma.post.findMany({
            orderBy: { createdAt: "desc" },
        })

        return posts.map((post) => this.toDomain(post))
    }

    async findById(id: string): Promise<Post | null> {
        const post = await this.prisma.post.findUnique({
            where: { id },
        })

        return post ? this.toDomain(post) : null
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

