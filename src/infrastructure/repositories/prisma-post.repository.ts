import { Injectable } from "@nestjs/common"

import {
    IPostRepository,
    PostRecord,
    PostWithRelations,
} from "@/domain/repositories/post.repository"
import { CreatePostDto } from "@/posts/posts.dtos"
import { PrismaService } from "@/shared/prisma.service"

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

    findManyWithRelations(categoryId?: string): Promise<PostWithRelations[]> {
        return this.prisma.post.findMany({
            where: categoryId ? { categoryId } : undefined,
            include: { comments: true, likes: true, category: true },
        })
    }
}
